<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2021
 * Tipo: Controlador
 */

require_once './../Models/Database.php';
require_once './../DataAccess/Config.php';
require_once './../DataAccess/Devices.php';
require_once './../DataAccess/Packages.php';

    $CurrentController = 'DeviceDashboard';

    $Option            = !empty($_POST['Option']) ? $_POST['Option'] : 'DeviceList';
    $MacAddress        = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '00:02:02:6c:64:1e';
    $DeviceArray       = !empty($_POST['DeviceArray']) ? $_POST['DeviceArray'] : '';
    $RebootStatus      = !empty($_POST['RebootStatus']) ? $_POST['RebootStatus'] : '0';


$DevicesData   = new Devices('System', $CurrentController);
$PackagesData = new Packages('system', $CurrentController);

$Response = '';
//$Option = 'RebootDevices';
switch ($Option){
    case 'GetDevicesByStatus':
        $Status = array();

        // DEVICES ON
            $OffDevices = $DevicesData->getDevicesByStatus('POWER_ON');
            $DevicesCount = $DevicesData->getOperatingDevices();

        // DEVICES OFF
            $DevicesCountOff = $DevicesData->getDevicesByStatus('POWER_OFF');

        // HDMI CONNECTED
            $HdmiConnected = $DevicesData->getDevicesHdmi('1');

        // HDMI CONNECTED
            $HdmiDisconnected = $DevicesData->getDevicesHdmi('0') - 1;

            array_push($Status,[
                'DevicesOn' => $DevicesCount-$OffDevices,
                'HdmiDisconnected' => $HdmiDisconnected,
                'DevicesOff' => $DevicesCountOff,
                'HdmiConnected' => $HdmiConnected,
                'UpdatedTime'=>date('M j, h:i A')
            ]);

        $Response = $Status;
        break;

        case 'DeviceList':

            $DeviceListResult = $DevicesData->GetDeviceLocationList();

            $DeviceList = array();
            $DeviceInfoList = array();
            foreach ($DeviceListResult as $Row):
                if($Row['mac_address'] !== '00:00:00:00:00:00') {
                    array_push($DeviceList, $Row['id_dispositivo']);
                    array_push($DeviceList, $Row['codigo_locacion']);
                    array_push($DeviceList, $Row['mac_address']);
                    array_push($DeviceList, $Row['ubicacion_dispositivo']);
                    array_push($DeviceList, $Row['modelo']);
                    array_push($DeviceList, $Row['ultimo_canal']);

                    if ($Row['mensaje_evento'] === 'POWER_OFF') {
                        array_push($DeviceList, $Row['ultima_ejecucion']);
                        array_push($DeviceList, '');
                        array_push($DeviceList, '<i class="material-icons StatusOff">power_off</i>');
                        array_push($DeviceList, '<i class="material-icons StatusOff">tv_off</i>');
                    } else {
                        array_push($DeviceList, $Row['ultima_ejecucion']);
                        array_push($DeviceList, $Row['mensaje_evento']);
                        array_push($DeviceList, '<i class="material-icons StatusOn">power</i>');

                        if ($Row['hdmi'] === '0') {
                            array_push($DeviceList, '<i class="material-icons StatusOff">tv_off</i>');
                        } else {
                            array_push($DeviceList, '<i class="material-icons StatusOn">tv</i>');
                        }
                    }

                    array_push($DeviceInfoList, $Row['ip']);
                    array_push($DeviceInfoList, $Row['version_software']);
                    array_push($DeviceInfoList, $Row['fecha_activacion']);
                    array_push($DeviceInfoList, $Row['marca']);
                    
                }
            endforeach;

            $Response = array('DeviceList'=>array_chunk($DeviceList, 10), 'DeviceInfoList'=>array_chunk($DeviceInfoList, 3));
           
        break;

        case 'UpdateRebootDevice':
            $DataDevices  = json_decode($DeviceArray);
            $DevicesUpdateData = array('reiniciar'=>1);
            foreach ($DataDevices as $DataDevice):    
                $DeviceID = $DataDevice->id_dispositivo; 
                $DevicesData->updateDevice($DeviceID, $DevicesUpdateData);
            endforeach;
        break;
        case 'GetRemoteControl':
            $Response = $DevicesData->getRemoteControl($MacAddress);
            break;
        case 'GetKillProcess':
            $Response = $DevicesData->getKillProcess($MacAddress);
            break;
        case 'SetKillProcess':
            $Kill = !empty($_POST['Kill']) ? $_POST['Kill'] : 0;
            
            $DevicesUpdateData = array('kill_process'=>$Kill);

            $Response = $DevicesData->updateDeviceModule($MacAddress, $DevicesUpdateData);
            break;
        case 'updateDataModules':

            $LastModule = !empty($_POST['LastModule']) ? $_POST['LastModule'] : 2;
            
            $DevicesUpdateData = array('ultimo_modulo'=>$LastModule);

            $Response = $DevicesData->updateDeviceModule($MacAddress, $DevicesUpdateData);
            break;
        case 'updateDataChannels':
            $LastChannel = !empty($_POST['LastChannel']) ? $_POST['LastChannel'] : '';
            $ChannelPos = !empty($_POST['ChannelPos']) ? $_POST['ChannelPos'] : 0;
            $DevicesUpdateData = array('ultimo_canal'=>$LastChannel,'channel_pos' => $ChannelPos);
            $Response = $DevicesData->updateDeviceModule($MacAddress, $DevicesUpdateData);
            break;
        case 'AllDevices':
            $DeviceListResult = $DevicesData->GetDeviceLocationList();
            $Response = $DeviceListResult; 
            break;

        case 'GetAminos':
            $DeviceListResult = $DevicesData->GetDeviceAminos();
            $Response = $DeviceListResult; 
            break;
        case 'GetAminosToReboot':
            $DeviceListResult = $DevicesData->GetDeviceByReboot();
            $Response = $DeviceListResult; 
            break;
        case 'RebootDevices':
            $DataDevices  = json_decode($DeviceArray);
            $DevicesUpdateData = array('reiniciar'=>1);
            foreach ($DataDevices as $DataDevice):    
                $DeviceID = $DataDevice->id_dispositivo; 
                $DevicesData->updateDevice($DeviceID, $DevicesUpdateData);
            endforeach;
            $NewPackage = array(
                'valor_parametro' => $RebootStatus,   
                ); 
            $PackagesData->updateParameterReboot($NewPackage);
             //$resultado = shell_exec('cd /var/www/html/BBINCO/TV/Core/Controllers && python3 DebugTr.py');  
            // $command = escapeshellcmd('/var/www/html/BBINCO/TV/Core/Controllers/RebootTelnet.py');
            // $output = shell_exec($command);
            // $Result = $output;
            // $Response = $Result;

            // $gestor = popen('cd /var/www/html/BBINCO/TV/Core/Controllers && python3 RebootTelnet.py', 'r');
            // $leer = fread($gestor, 2096);
            // $Response = $leer;
            // pclose($gestor);
            $command = escapeshellcmd('sudo /usr/bin/python3 RebootTelnet.py');
            $output = shell_exec($command);
            $Response = $output;
            break;
        case 'UpdateParameter':
            $NewPackage = array(
                'valor_parametro' => $RebootStatus,   
                ); 
            $PackagesData->updateParameterReboot($NewPackage);
            break;
        case 'updateDeviceReboot':

            $Reboot = !empty($_POST['Reboot']) ? $_POST['Reboot'] : 0;
            
            $DevicesUpdateData = array('reiniciar'=>$Reboot);

            $Response = $DevicesData->updateDeviceReboot($MacAddress, $DevicesUpdateData);
            break;
        case 'GetAminosNoReboot':
            $DeviceListResult = $DevicesData->GetDeviceByNoReboot();
            $Response = $DeviceListResult; 
            break;
}

//
echo json_encode($Response);
