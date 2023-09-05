<?php
/* Creado por: Tania Maldonado
 * Fecha: Agosto 2020
 * Tipo: Controlador
 */

putenv('PATH=/bin:/usr/local/bin');

    require_once './../Models/Database.php';
    require_once './../DataAccess/Devices.php';
    
    
    $DeviceData = new Devices('system', 'Power');
    $Devices = $DeviceData->GetDeviceList();
    
    
    $status = '';
    
    function pingAddress($ip) {
        $pingresult = exec("ping -c 3 $ip", $outcome, $status);
        if (0 == $status) {
            $status = "POWER_ON";
        } else {
            $status = "POWER_OFF";
        }
        
        return $status;
    }

    foreach ($Devices as $Device): 
    
        if($Device['ip'] !== '0.0.0.0'){
            
            $DeviceId = intval($Device['id_dispositivo']);
            
            echo $Device['mac_address']. PHP_EOL;
            
            $Status = pingAddress($Device['ip']);
            
            echo $Status. PHP_EOL;
                    
            $DeviceUpdate = array('mensaje_evento' => $Status,'hdmi'=>'0');

            if($Status === "POWER_OFF"){
                $DeviceData->updateDevice($DeviceId, $DeviceUpdate);
            }
        }
    endforeach;