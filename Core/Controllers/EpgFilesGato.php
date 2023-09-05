<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

// Calcula tiempo de ejecucion
// $time_start = microtime(true);

date_default_timezone_set('America/Mazatlan');

require_once '../Models/Database.php';
require_once '../Models/Libraries.php';
require_once '../DataAccess/Config.php';
require_once '../DataAccess/Packages.php';

$CurrentController = 'EpgFilesController';

$PackagesData = new Packages('system', $CurrentController);
$ConfigData  = new Config('system', $CurrentController);

$GuideDays = $ConfigData->getConfigByName('GuideDays');

$PackagesId = $PackagesData->getPackagesId();

// Valida si existe el directorio con los archivos EPG
//    if (is_readable($Libraries['EpgFilesPath'])) {
foreach ($PackagesId as $Package):
    $id_paquete = $Package['id_paquete'];
    $fechas = SetNextDays($GuideDays);
    $fechaAyer =  date('Ymd', strtotime(' -1 day'));
    $archivo = "EpgDataGato.php";
    for($dia = 0; $dia < count($fechas); $dia++){
        //$fechas[$dia].chr(13).chr(10);
        $opcion = "$fechas[$dia]";
        $cmd = "/usr/bin/php -f {$archivo} {$opcion} {$id_paquete}";
        echo exec($cmd). PHP_EOL;
    }
    $archivo_ayer = "Epg/epg_".$fechaAyer."_".$Package['id_paquete'].".json";
    if (file_exists($archivo_ayer)) {
        unlink($archivo_ayer);
    } else {
        echo "No hay archivo para eliminar". PHP_EOL;
    }
endforeach;
//    } else {
//        foreach ($PackagesId as $Package):
//            $id_paquete = $Package['id_paquete'];
//                $fechas = array(date('Ymd'));
//                $archivo = "EpgData.php";
//                for($dia = 0; $dia < count($fechas); $dia++){
//                   //$fechas[$dia].chr(13).chr(10);
//                   $opcion = "$fechas[$dia]";
//                   $cmd = "/usr/bin/php -f {$archivo} {$opcion} {$id_paquete}";
//                   echo exec($cmd). PHP_EOL;
//                }
//                $archivo_ayer = "Epg/epg_general_".$Package['id_paquete'].".json";
//                if (file_exists($archivo_ayer)) {
//                    unlink($archivo_ayer);
//                } else {
//                    echo "No hay archivo para eliminar". PHP_EOL;
//                }
//        endforeach;
//    }

function SetNextDays($FutureDays){
    $Dates = [];
    array_push($Dates, date('Ymd'));
    for ($DatesIndex = 1; $DatesIndex <= $FutureDays ; $DatesIndex ++) {
        array_push($Dates, date('Ymd', strtotime(' +'.$DatesIndex.' day')));
    }
    return $Dates;
}
//$time_end = microtime(true);
//$execution_time = ($time_end - $time_start);
//$hours = (int)($execution_time/60/60);
//$minutes = (int)($execution_time/60)-$hours*60;
//$seconds = (int)$execution_time-$hours*60*60-$minutes*60;
//echo '<br><b>Tiempo total de ejecucion </b> Minutos: '.$minutes. ' Segundos: '.$seconds. '<br>';