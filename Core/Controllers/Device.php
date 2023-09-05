<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Devices.php';
    require_once './../DataAccess/Locations.php';
    require_once './../DataAccess/Modules.php';
    require_once './../DataAccess/DiskInfo.php';
    
    $CurrentController = 'DeviceController';
    
    if(!empty($_POST['MacAddress'])){
        $MacAddress     = $_POST['MacAddress'];
    } else if(!empty($_GET['MacAddress'])){
        $MacAddress     = $_GET['MacAddress'];
    } else{
        $MacAddress = '00:00:00:00:00:00';
    }
    
    $ConfigData   = new Config($MacAddress, $CurrentController);
    $DevicesData  = new Devices($MacAddress, $CurrentController);
    $LocationData = new Locations($MacAddress, $CurrentController);
    $ModulesData  = new Modules($MacAddress, $CurrentController);
    $DiskData     = new DiskInfo($MacAddress, $CurrentController);

    // Obtiene la informacion del dispositivo por su mac address
    $Device = $DevicesData->getDevice($MacAddress);
    
    foreach ($Device as $DeviceInfo):
        $DeviceId       = $DeviceInfo['id_dispositivo'];
        $Debug          = $DeviceInfo['debug'];
        $DeviceRecorder = $DeviceInfo['grabador'];
        $DeviceVendor   = $DeviceInfo['marca'];
        $Reboot         = ($DeviceInfo['reiniciar'] === '1') ? true : false;
    endforeach;
    
    // Obtiene el id locacion del dispositivo por su ID
    $Location = $DevicesData->getDeviceLocation($DeviceId);

    foreach ($Location as $LocationInfo):
        $LocationId = $LocationInfo['id_locacion'];
    endforeach;
    
    // Obtiene la informacion de la locacion por su ID  
    $LocationInfo = $LocationData->getLocationById($LocationId);

    foreach($LocationInfo as $LocationRow):
        $LocationCode  = $LocationRow['codigo_locacion'];
    
        $ActiveEpg = ($LocationRow['epg'] === '1') ? true : false;
        $ActiveMenu = ($LocationRow['menu'] === '1') ? true : false;
        $ActiveMessages = ($LocationRow['mensajes'] === '1') ? true : false;
        
        $ServicesArray = array('ActiveEpg'      => $ActiveEpg,
                               'ActiveMenu'     => $ActiveMenu,
                               'ActiveMessages' => $ActiveMessages,
                               'Reboot'         => $Reboot,
                               'ProjectId'      => $LocationRow['id_proyecto'],
                               'PackageId'      => $LocationRow['id_paquete']);
    endforeach;

    $MenuId= $ModulesData->getMenuByProject($LocationRow['id_proyecto']);

    $DeviceType = '';
    $RecorderDeviceByLocation = '';
    
    $RecorderIdentifier = $ConfigData->getConfigByName('RecorderIdentifier');

    // Valida si el dispositivo tiene disco duro para almacenar las grabacion, 1 = HDD Y | 0 = HDD N
    if($DeviceRecorder === $RecorderIdentifier){
        if($LocationCode == 'DEFAULT'){
            // Es un dispositivo grabador con HDD
            $DeviceType = 'PVR_ONLY';
        } else {
            // Carga sus funciones de grabador y agrega funcionalidad de WholeHomePvr
            $DeviceType = 'WHP_HDDY';
        }

        $Rtsp =  array('rtsp_conexiones' => '0');

        $DiskData->updatePvrInfo($Rtsp, $MacAddress);

    } else {
        // Valida si esta asignado en la locacion por defecto
        if($LocationCode == 'DEFAULT'){
            // Esta en la locacion por defecto y no agrega funcionalidad de WholeWhomePvr
            $DeviceType = 'NONE';
        } else {
            // Obtenemos si hay dispositivo grabador en su locacion
            if($DeviceVendor == 'Infomir'){
                $RecorderDeviceByLocation = $DevicesData->getDeviceRecorderInfomir($LocationId);
                
                if(empty($RecorderDeviceByLocation)){
                    // No es un dispositivo grabador y no hay grabador en su locacion
                    $DeviceType = 'NONE';
                } else {
                    // Hay dispositivo grabador, carga funciones para grabar y WholeHomePvr
                    $DeviceType = 'WHP_HDDN';
                }
            }else{
                $RecorderDeviceByLocation = $DevicesData->getDeviceRecorder($LocationId);

                if(empty($RecorderDeviceByLocation)){
                    // No es un dispositivo grabador y no hay grabador en su locacion
                    $DeviceType = 'NONE';
                } else {
                    // Hay dispositivo grabador, carga funciones para grabar y WholeHomePvr
                    $DeviceType = 'WHP_HDDN';
                } 
            }
            
        }
    }
    
    $EffectiveDate = $ConfigData->getConfigByName('EffectiveDate');

    $Today = date('Y-m-d');
            
    $EffectiveTime = strtotime($EffectiveDate);
    $CurrentTime = strtotime($Today);

    if($CurrentTime > $EffectiveTime){
        $Licensing = false;
    } else {
        $Licensing = true;
    }
    
    $OffsetZone = $ConfigData->getConfigByName('OffsetZone');

    if (file_exists('./Epg/epg_'.date('Ymd').'_'.$LocationRow['id_paquete'].'.json')) {
        $LastModificationTime = date('H', filemtime('./Epg/epg_' . date('Ymd') . '_' . $LocationRow['id_paquete'] . '.json'));
    } else {
        $LastModificationTime = '';
    }

    $EventString = !empty($_POST['EventString']) ? $_POST['EventString'] : '';
    $EventHdmi = !empty($_POST['EventHdmi']) ? $_POST['EventHdmi'] : 0;
    $EventNetman = !empty($_POST['EventNetman']) ? $_POST['EventNetman'] : '';
    $CurrentDateStb = !empty($_POST['CurrentDateStb']) ? $_POST['CurrentDateStb'] : '0000-00-00 00:00:00';

    $Client = $ConfigData->getConfigByName('Identifier');

    $DeviceSettings = array('Licensing' => $Licensing, 
                            'Services' => $ServicesArray,
                            'Debug' => $Debug,
                            'Client' => $Client,
                            'Type' => $DeviceType,
                            'OffsetZone' => $OffsetZone,
                            'LocationId' => $LocationId,
                            'DeviceId' => $DeviceId,
                            'MenuId' => $MenuId['id_modulo'],
                            'MacAddressPvr' => $RecorderDeviceByLocation,
                            'EpgModificationTime' => $LastModificationTime);

    $DeviceUpdate =  array (
                            'ultima_ejecucion' => $CurrentDateStb,
                            'mensaje_evento'   => $EventString,
                            'netman'           => $EventNetman,
                            'hdmi'             => $EventHdmi,
                            // 'reiniciar'        => '0'
    );

    $UpdateDevice = $DevicesData->updateDevice($DeviceId, $DeviceUpdate);

    echo json_encode($DeviceSettings);