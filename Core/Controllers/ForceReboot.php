<?php
/* Creado por: Tania Maldonado
 * Fecha: Agosto 2020
 * Tipo: Controlador
 */

putenv('PATH=/bin:/usr/local/bin');

    require_once './../Models/Database.php';
    require_once './../DataAccess/Devices.php';
    
    
    $DeviceData = new Devices('system', 'ForceReboot');
    $Devices = $DeviceData->GetDeviceList();
    
    $CurrentTime = (strtotime(date('Y-m-d H:i:s')) - 900);
    
    /* Infomir acceso */
    $username = 'root';
    $password = '930920';
    $InfomirCommand  = 'reboot';
    
    /* Amino */
    $AminoCommand = 'REBOOT';

    foreach ($Devices as $Device):
        
    
        if($Device['ip'] !== '0.0.0.0'){
            
            $DeviceId = intval($Device['id_dispositivo']);
            
            if(empty($Device['ip'])){

                $DeviceUpdate = array('mensaje_evento' => 'OUTDATED');
            } else {

                if(strtotime($Device['ultima_ejecucion']) < $CurrentTime){

                    //echo '*************************************************************'. PHP_EOL;
                    //echo $Device['id_dispositivo']  . ' ~ '.$Device['ip']. ' ~ '.$Device['marca'].' ~ '.$Device['ultima_ejecucion']. PHP_EOL;
                    
                    $DeviceUpdate = array('mensaje_evento' => 'OUTDATED');
                    
                    if($Device['marca'] === 'Amino'){
                        $output = shell_exec("cd /usr/local/bin/ && export STBPASS=stbrckey && export STBKEY=keys/amino/STBrc-KEY.private && ./STBremoteconf ".$Device['ip']." ".$AminoCommand);
                    } else if($Device['marca'] === 'Infomir'){

                        $connection = ssh2_connect($Device['ip'], 22);
                        ssh2_auth_password($connection, $username, $password);
                        $stream = ssh2_exec($connection, $InfomirCommand);
                        stream_set_blocking($stream, true);
                        $output = stream_get_contents($stream);

                    } else if($Device['marca'] === 'Kamai'){
                        $DeviceUpdate = array('mensaje_evento' => 'OUTDATED', 'reiniciar' => '1');
                    }
                    
                    echo "<pre>{$output}</pre>". PHP_EOL; 
                    //echo '*************************************************************'. PHP_EOL;
                    //echo 'UPDATE! '.$Device['id_dispositivo']  . ' ~ '.$Device['ip'].' ~ '.$Device['ultima_ejecucion']. '<br>';echo '<br>';
                } else {
                    
                    $DeviceUpdate = array('mensaje_evento' => 'UPDATED');
                    //echo 'OK      '.$Device['id_dispositivo']  . ' ~ '.$Device['ip'].' ~ '.$Device['ultima_ejecucion'].'<br>';echo '<br>';
                }
            }
            
            $DeviceData->updateDevice($DeviceId, $DeviceUpdate);
        }
    endforeach;

////$salida1 = shell_exec("cd /usr/local/bin/ && export STBPASS=stbrckey && export STBKEY=keys/amino/STBrc-KEY.private && ./STBremoteconf 10.33.10.139 REBOOT"); echo "<pre>$salida1</pre>";
//    
//
//    echo $ip = '10.30.12.153';
//
//$server   = "10.30.12.153"; // server IP/hostname of the SSH server
//
//// Establish a connection to the SSH Server. Port is the second param.
//$connection = ssh2_connect($server, 22);
//
//// Authenticate with the SSH server
//ssh2_auth_password($connection, $username, $password);
//
//// Execute a command on the connected server and capture the response
//$stream = ssh2_exec($connection, $command);
//
//// Sets blocking mode on the stream
//stream_set_blocking($stream, true);
//
//// Get the response of the executed command in a human readable form
//$output = stream_get_contents($stream);
//
//// echo output
//echo "<pre>{$output}</pre>"; 