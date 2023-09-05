<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

require_once './../Models/Database.php';
require_once './../DataAccess/Config.php';

    $ConfigData = new Config('', 'SamsungController');
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : '';
    $Response = '';

    switch ($Option){
        case 'GetServer':
            $ServerIp = $ConfigData->getConfigByName('ServerIp');
            $Response = array('ServerIp' => $ServerIp);
        break;
    }

echo json_encode($Response);