<?php
/* Creado por: Tania Maldonado
 * Fecha: Octubre 2019
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Devices.php';
    require_once './../DataAccess/Locations.php'; 
    
    $CurrentController = 'IndexController';

    $Option     = !empty($_POST['Option']) ? $_POST['Option'] : '';
    $MacAddress = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
    $IpAddress  = !empty($_POST['IpAddress']) ? $_POST['IpAddress'] : '';
    $Firmware   = !empty($_POST['Firmware']) ? $_POST['Firmware'] : '';
    $Model      = !empty($_POST['Model']) ? $_POST['Model'] : '';
    $Hdd        = !empty($_POST['Hdd']) ? $_POST['Hdd'] : '';
    $Vendor     = !empty($_POST['Vendor']) ? $_POST['Vendor'] : '';

    $DevicesData = new Devices($MacAddress, $CurrentController);
    $ConfigData  = new Config($MacAddress, $CurrentController);

    $FirstElement = 0;
    
    switch ($Option){
        case 'CHECK':
            $CurrentDevices = $DevicesData->getOperatingDevices();
            $AvailableDevices = $ConfigData->getConfigByName('AvailableDevices');
            $LicenseStatus = $ConfigData->getConfigByName('LicenseStatus');
            $EffectiveDate = $ConfigData->getConfigByName('EffectiveDate');
            $Today = date('Y-m-d');
            
            $EffectiveTime = strtotime($EffectiveDate);
            $CurrentTime = strtotime($Today);

            if($CurrentTime > $EffectiveTime){
                $Option = 'LICENSE';
            } else {
                $Device = $DevicesData->getDevice($MacAddress);

                if(empty($Device)){
                    if($CurrentDevices < $AvailableDevices) {
                        $Option = 'REGISTER';
                    } else {
                        $Option = 'LICENSE';
                    }
                } else {
                    $Option = 'LOAD';
                } 
            }

            $Response = array('Option' => $Option,'Mac' => $MacAddress);
                
            echo json_encode($Response);
        break;

        case 'REGISTER':
            $LocationId = !empty($_POST['LocationId']) ? $_POST['LocationId'] : '';

            $LocationsData = new Locations($MacAddress, $CurrentController);
            
            if($Hdd == 'Y'){
                $HddValue = 1;
            } else {
                $HddValue = 0;
            }


            if($LocationId === '') {
                $LocationIdArray = $LocationsData->getLocationIdByName($ConfigData->getConfigByName('LocationCode'));
                $LocationId = $LocationIdArray[$FirstElement]['id_locacion'];
            }

            // Guardamos en un array la informacion obtenida del dispositivo
            $NewDevice = array('mac_address'                => $MacAddress,
                               'ip'                         => $IpAddress,
                               'version_software'           => $Firmware,
                               'modelo'                     => $Model,
                               'marca'                      => $Vendor,
                               'fecha_activacion'           => date('Y-m-d'),
                               'ultima_ejecucion'           => date('Y-m-d'),
                               'grabador'                   => $HddValue);

            //Registramos dispositivo
           
            $New = $DevicesData->setDevice($NewDevice);

            // Obtenemos el identificador del dispositivo registrado
            $DeviceId = $New[$FirstElement];

            //Lo guardanmos en la locacion por defecto
            $DeviceLocationData = array('id_dispositivo' => $DeviceId, 'id_locacion' => $LocationId);
            
            $NewDeviceLocation = $DevicesData->setDeviceLocation($DeviceLocationData);

            if(is_numeric($New[$FirstElement])){
                $Option = 'LOAD';
            }  else {
                $Option = 'CHECK';
            }
            
            $Response = array('Option' => $Option);

            echo json_encode($Response);
        break;

        case 'LOAD':
            $Device   = $DevicesData->getDevice($MacAddress);
            $DeviceId = $Device[$FirstElement]['id_dispositivo'];
            $Status   =($Device[$FirstElement]['activo'] === '1') ? true : false;
            
            if($Status === true){
                $DeviceUpdate =  array ('ip'                 => $IpAddress,
                                        'version_software'   => $Firmware,
                                        'modelo'             => $Model,
                                        'grabador'           => ($Hdd==='Y'?1:0));

                $UpdateDevice = $DevicesData->updateDevice($DeviceId, $DeviceUpdate);

                $LocationDevice = $DevicesData->getDeviceInfo($MacAddress);

                $Option = 'RELOAD';

                $Response = array('Option' => $Option,
                                  'ModuleUrl' => $LocationDevice[$FirstElement]['url_modulo'],
                                  'ModuleId' => $LocationDevice[$FirstElement]['id_modulo'],
                                  'ModuleName' => $LocationDevice[$FirstElement]['nombre_modulo']);

            } else {
                $DeviceUpdate =  array ('ip'                 => $IpAddress,
                                        'version_software'   => $Firmware,
                                        'modelo'             => $Model,
                                        'grabador'           => ($Hdd==='Y'?1:0));

                $UpdateDevice = $DevicesData->updateDevice($DeviceId, $DeviceUpdate);
                
                $Option = 'LICENSE';

                $Response = array('Option' => $Option);
            }
            
            echo json_encode($Response);
        break;

        case 'TVLOAD':
            $LocationDevice = $DevicesData->getDeviceInfo($MacAddress);

            $Response = array('Option' => $Option,
                'ModuleUrl' => $LocationDevice[$FirstElement]['url_modulo'],
                'ModuleId' => $LocationDevice[$FirstElement]['id_modulo'],
                'ModuleName' => $LocationDevice[$FirstElement]['nombre_modulo']);

            echo json_encode($Response);
            break;
        case 'LOADMODULO':
            $LocationDevice = $DevicesData->getDeviceInfo($MacAddress);

            $Response = array('Option' => $Option,
                'ModuleUrl' => $LocationDevice[$FirstElement]['url_modulo'],
                'ModuleId' => $LocationDevice[$FirstElement]['id_modulo'],
                'ModuleName' => $LocationDevice[$FirstElement]['nombre_modulo']);

            echo json_encode($Response);
            break;
        case 'LICENSE':
            $Response = array('Option' => $Option);
                
            echo json_encode($Response);
        break;

        case 'LOCATIONS':
            $LocationsData = new Locations($MacAddress, $CurrentController);
            $Response = $LocationsData->getLocations();

            echo json_encode($Response);
        break;
    }