<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Devices.php';
    
    $CurrentController = 'LicensingController';

    $ConfigData  = new Config('system', $CurrentController);
    $DevicesData = new Devices('system', $CurrentController);
    
    $Identifier = $ConfigData->getConfigByName('Identifier');
    $CentralServer = $ConfigData->getConfigByName('CentralServer');
    
    $ActiveDevices = $DevicesData->GetActiveDeviceList();
    
    $LicensingServer = $CentralServer .'Licensing/index.php?Client='.$Identifier.'&Devices='.$ActiveDevices;

    echo $LicensingServer. PHP_EOL;

    $DataServer = file_get_contents($LicensingServer);
    
    $License = json_decode($DataServer, true);
    
    
    foreach ($License as $Row):
        $Row;
    endforeach;
    
    $ServerIp = !empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '';
    
    if(empty($ServerIp)){
        $ServerIp = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : '';
    }

    echo $ServerIp. PHP_EOL;

    if(!empty($ServerIp)){
        $NewValue = array('valor_parametro'=> $ServerIp);
        $SetServerIp = $ConfigData->SetLicensingParameters('ServerIp',$NewValue);
    }
    
    foreach ($Row as $Key => $Value):
        $NewValue = array('valor_parametro'=> $Value);
        $SetLicense = $ConfigData->SetLicensingParameters($Key,$NewValue);
    endforeach;