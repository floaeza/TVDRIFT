<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: Controlador
 */

require_once './../Models/Database.php';
require_once './../Models/Utilities.php';
require_once './../DataAccess/Config.php';
require_once './../DataAccess/Devices.php';
require_once './../DataAccess/DiskInfo.php';

$CurrentController = 'TestController';
//$MacAddress = '';

$LocationId     = !empty($_POST['LocationId']) ? $_POST['LocationId'] : '3';
$MacAddress     = !empty($_POST['Mac']) ? $_POST['Mac'] : '';

$DevicesData = new Devices($MacAddress, $CurrentController);
$Disk = new DiskInfo($MacAddress, $CurrentController);

//$Response = $DevicesData->getDeviceRecorderInfomir($LocationId);
$Response = $Disk->getPvrInfoInfomir($LocationId,$MacAddress);
echo json_encode($Response);
