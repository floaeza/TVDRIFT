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
    
    $ArrayDeviceInfo = array();
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : 'GetControllByMac';
    $MacAddress = !empty($_POST['mac_address']) ? $_POST['mac_address'] : '00:1a:79:6c:cc:3e';
    $IDGuest = !empty($_POST['IDGuest']) ? $_POST['IDGuest'] : '';
    $guest = !empty($_POST['guest']) ? $_POST['guest'] : '';
    $orden = !empty($_POST['orden']) ? $_POST['orden'] : '';
    $status = !empty($_POST['status']) ? $_POST['status'] : '';


    
    $ConfigData   = new Config($MacAddress, $CurrentController);
    $DevicesData  = new Devices('system', $CurrentController);
    $LocationData = new Locations($MacAddress, $CurrentController);
    $ModulesData  = new Modules($MacAddress, $CurrentController);
    $DiskData     = new DiskInfo($MacAddress, $CurrentController);

    switch ($Option) {
        case 'GetDeviceByMac':
            $Device = $DevicesData->getDevice($MacAddress);
            foreach ($Device as $DeviceInfo):
                array_push($ArrayDeviceInfo, array('MAC' => $DeviceInfo['mac_address'],
                'IP' => $DeviceInfo['ip'],
                'MARK' => $DeviceInfo['marca'],
                'MDL' => $DeviceInfo['modelo'],
                'SWV' => $DeviceInfo['version_software'],
                'LEC' => $DeviceInfo['ultima_ejecucion'],
                'CON' => $DeviceInfo['control_remoto']
                ));
            endforeach;
            echo json_encode($ArrayDeviceInfo);
            break;

        case 'GetControllByMac':
            $Device = $DevicesData->getControl($MacAddress);
            foreach ($Device as $DeviceInfo):
                    array_push($ArrayDeviceInfo, array('IDGUEST' => $DeviceInfo['IDGuest'],
                    'GUEST' => $DeviceInfo['guest'],
                    'MAC' => $DeviceInfo['mac_address'],
                    'ORDEN' => $DeviceInfo['orden'],
                    'STATUS' => $DeviceInfo['status']
                ));
            endforeach;
            echo json_encode($ArrayDeviceInfo);
            break;
        
        case 'GetAllControl':
            $Device = $DevicesData->GetControlList();
            foreach ($Device as $DeviceInfo):
                array_push($ArrayDeviceInfo, array('IDGuest' => $DeviceInfo['IDGuest'],
                'guest' => $DeviceInfo['guest'],
                'MAC' => $DeviceInfo['mac_address'],
                'orden' => $DeviceInfo['orden'],
                ));
            endforeach;
            echo json_encode($ArrayDeviceInfo);
            break;
        
        case 'InsertControl':
            $NewDevice = array('IDGuest' => $IDGuest,
            'guest'                      => $guest,
            'mac_address'                => $MacAddress,
            'orden'                      => $orden,
            'status'                      => $status
            );
           $DevicesData->setControl($NewDevice);
           echo json_encode($NewDevice);
            break;
        case 'UpdateControlByMac':
            $NewDevice = array('status'  => 'executed');
           $DevicesData->updateControl($MacAddress, $NewDevice);
           echo json_encode($NewDevice);
            break;
        case 'DeleteControlbyMac':
            $DevicesData->deleteControl($MacAddress);
            echo json_encode($MacAddress);
            break;
    }

   