<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: Controlador
 */

    $Logs  = array();

    $Logs[0]   = '';
    $Logs[1]   = 'Error al cargar el archivo json (Servicios EPG activo)';

    $LogNumber = !empty($_POST['LogNumber']) ? $_POST['LogNumber'] : '';
    $MacAddress = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
    $CurrentModule = !empty($_POST['CurrentModule']) ? $_POST['CurrentModule'] : '';
    
    $Row = PHP_EOL . date("l jS \of F Y h:i:s A"). ' = ' . $MacAddress . ' ~ '.$CurrentModule. ' - '.$Logs[intval($LogNumber)].'|';
    
    $LogFile = '/var/www/html/logs/iptv.txt';
    
    if(!file_put_contents($LogFile, $Row, FILE_APPEND)){
        echo json_encode('FAIL LOG: '.$Row);
    } else {
        echo json_encode('SAVED LOG: '.$Row);
    }