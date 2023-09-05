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
require_once '../Models/Utilities.php';
require_once '../DataAccess/Config.php';
require_once '../DataAccess/Packages.php';
require_once '../DataAccess/Channels.php';

$CurrentController = 'EpgDataController';

$Utilities    = new Utilities('system', $CurrentController);
$PackageData  = new Packages('system', $CurrentController);
$ConfigData   = new Config('system', $CurrentController);
$ChannelsData = new Channels('system', $CurrentController);

    $CurrentDate = date('Ymd');
    $PackageId   = '1';
//$CurrentDate  = stripslashes($argv[1]);
//$PackageId    = $argv[2];
$PlusDate     = strtotime('+1 day', strtotime($CurrentDate));
$TomorrowDate = date('Ymd',$PlusDate);

$PreChannalesArray  = $PackageData->getPackageListById($PackageId);

$ChannelsLength     = count($PreChannalesArray);
$PreChannalesArrayA = array();

$Channels   = $ChannelsData->getGatoChannelsList($PackageId);
$Today      = date('Y-m-d');
$Yesterday  = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $Today) ) ));
$Symbols    = array('>', '<', '/', '=', '"', '-','&');
$Symbols2    = array('>', '<', '/', '=', '"', '-');
$RemoveAmYesterday = true;
$RemoveAmToday     = false;
$RemoveFirst = true;

/* PONER MANUALMENTE LA IP, YA QUE AL EJECUTAR PHP DESDE LA TERMINAL NO OBTIENE LA IP */
//$ServerIp = 'localhost';
$ServerIp = '172.22.22.10/';

$EpgFolder = 'http://'.$ServerIp.'/EpgChannels/';

foreach ($PreChannalesArray as $PreChannelRow):

    $Calidad = ($PreChannelRow['id_calidad'] === '1') ? 'HD' : '';

    $PreChannelRow['SRCE'] = $PreChannelRow['src'];
    unset($PreChannelRow['src']);

    $PreChannelRow['QLTY'] = $Calidad;
    unset($PreChannelRow['calidad']);

    $PreChannelRow['PORT'] = $PreChannelRow['puerto'];
    unset($PreChannelRow['puerto']);

    $PreChannelRow['CHNL'] = $PreChannelRow['numero_canal'];
    unset($PreChannelRow['numero_canal']);

    $PreChannelRow['STTN'] = $PreChannelRow['numero_estacion'];
    unset($PreChannelRow['numero_estacion']);

    $PreChannelRow['NAME'] = $PreChannelRow['nombre_canal'];
    unset($PreChannelRow['nombre_estacion']);

    $PreChannelRow['INDC'] = $PreChannelRow['indicativo'];
    unset($PreChannelRow['indicativo']);

    $PreChannelRow['LOGO'] = $PreChannelRow['logo'];
    unset($PreChannelRow['logo']);

    unset($PreChannelRow['id_paquete_canal']);
    unset($PreChannelRow['id_modulo']);
    unset($PreChannelRow['id_calidad']);
    unset($PreChannelRow['nombre_canal']);
    unset($PreChannelRow['id_canal']);
    unset($PreChannelRow['id_paquete']);
    unset($PreChannelRow['id_estacion']);
    unset($PreChannelRow['repetir_contenido']);
    array_push($PreChannalesArrayA, $PreChannelRow);
endforeach;

$PreChannalesArrayM  = $PackageData->getModulesPackageListById($PackageId);

$AddChannelsLength     = count($PreChannalesArrayM);

$ChannelsLength = $ChannelsLength + $AddChannelsLength;

foreach ($PreChannalesArrayM as $PreChannelRow):

    $PreChannelRow['SRCE'] = $PreChannelRow['url_modulo'];
    unset($PreChannelRow['url_modulo']);

    $PreChannelRow['QLTY'] = 'HD';


    $PreChannelRow['PORT'] = $PreChannelRow['id_modulo'];
    unset($PreChannelRow['id_modulo']);


    $PreChannelRow['CHNL'] = $PreChannelRow['numero_canal'];
    unset($PreChannelRow['numero_canal']);

    $PreChannelRow['STTN'] = 'CONTENT';


    $PreChannelRow['NAME'] = $PreChannelRow['descripcion_modulo'];
    unset($PreChannelRow['descripcion_modulo']);


    $PreChannelRow['INDC'] = $PreChannelRow['nombre_modulo'];
    unset($PreChannelRow['nombre_modulo']);

    $PreChannelRow['LOGO'] = $PreChannelRow['nombre_icono'];
    unset($PreChannelRow['nombre_icono']);

    unset($PreChannelRow['id_paquete_canal']);
    unset($PreChannelRow['id_canal']);
    unset($PreChannelRow['id_paquete']);
    unset($PreChannelRow['canal_activo']);
    unset($PreChannelRow['modulo_principal']);
    unset($PreChannelRow['modulo_canal']);
    unset($PreChannelRow['repetir_contenido']);
    unset($PreChannelRow['padre_modulo']);
    unset($PreChannelRow['id_proyecto']);
    unset($PreChannelRow['id_template']);

    array_push($PreChannalesArrayA, $PreChannelRow);
endforeach;

// Wednesday 20th of February 2019
$FormatDate =  date('l, F j, Y', strtotime($CurrentDate));

$PreChannalesArrayB = array();
foreach($PreChannalesArrayA as $PreChannelRowB):
    $PreChannelRowB = array_push_assoc($PreChannelRowB, 'DTNU', $CurrentDate);
    array_push($PreChannalesArrayB, $PreChannelRowB);
endforeach;

$arrayCanales = array();
foreach($PreChannalesArrayB as $Channel):
    $Channel = array_push_assoc($Channel, 'DATE', $FormatDate);
    array_push($arrayCanales, $Channel);
endforeach;

$ExtraHour  = $ConfigData->getConfigByName('ExtraHour');
$StartEnd   = $ConfigData->getConfigByName('StartEnd');
$OffsetZone = $ConfigData->getConfigByName('OffsetZone');

$arraySchedule = array();
$Programacion = array();

$ProgramsLength = 0;
$Index = 0;

//print_r($Channels);

//echo count($Channels). PHP_EOL;

foreach ($Channels as $Channel):
    $StationName = $Channel['numero_estacion'];
    $ChannelName = preg_replace('/\s+/', '', $Channel['nombre_canal']);

    $UrlToday = $EpgFolder.$ChannelName.'/'.$Today.'.txt';

    $GetTxtToday1 = $Utilities->GetDataFromUrl($UrlToday);

    $GetTxtToday  = str_replace('"', '', $GetTxtToday1);

    $Table = explode('<h2>Horarios de Programación</h2>',$GetTxtToday);

    $DataToday = htmlspecialchars($Table[1]);

    //print_r($DataToday);ECHO "<BR>";echo '############################################';ECHO "<BR>";
    $SlicesToday = explode('tbl_EPG_row', $DataToday);
    //print_r($SlicesToday);ECHO "<BR>";echo '********************************************';ECHO "<BR>";


    foreach($SlicesToday as $SliceToday):
//        echo '**************************************************************';ECHO "<BR>";
//        print_r($SliceToday);ECHO "<BR>";
//        echo '**************************************************************';ECHO "<BR>";ECHO "<BR>";
        $SubSlice = explode('div class=', $SliceToday);
//        echo '________________________________________________________________________________________________';ECHO "<BR>";ECHO "<BR>";
//        print_r($SubSlice);ECHO "<BR>";

        $StartTimeA = $Utilities->getBetween($SubSlice[1], 'datetime=', '>');
        $EndTimeA = $Utilities->getBetween($SubSlice[2], 'datetime=', '>');

        $TitleA = $Utilities->getBetween($SubSlice[4], 'span', '/span');
        $TitleB  = str_replace($Symbols2, '', $TitleA);
        $TitleB2  = str_replace('í', 'i', $TitleB);
        $TitleC   = substr($TitleB2, 0, -4);

        $DescA = $Utilities->getBetween($SubSlice[4], '/div', '/div');
        $DescB   = substr($DescA, 0, -4);

        $StartTime = substr($StartTimeA,0,5);
        $FinalTime = substr($EndTimeA,0,5);
        $Title = substr($TitleC, 4);
        $Description = substr($DescB, 4);

        $Duration = $Utilities->GetDurationHours($StartTime, $FinalTime);

        $NewStartTime = $Utilities->SubstractHour($StartTime);
        $NewFinalTime = $Utilities->SubstractHour($FinalTime);

        if($Title && $RemoveFirst === true){
            $Hour = substr($NewStartTime, 0, 2);

            if($Hour !== '23'){
                $RemoveFirst = false;
            }
        }

//        print_r($Duration);ECHO "<BR>";
//        print_r($NewStartTime);ECHO "<BR>";
//        print_r($NewFinalTime);ECHO "<BR>";
//        print_r(ReplaceXtrainChar($Title));ECHO "<BR>";
//        print_r(ReplaceXtrainChar($Description));ECHO "<BR>";
//        print_r($RemoveFirst);ECHO "<BR>";
//        print_r($StationName);ECHO "<BR>";
//        print_r((intval($Duration) / 60));ECHO "<BR>";

        if($Title && $RemoveFirst === false){
            array_push($Programacion, array('STTN' => $StationName, //STATION
                'DBKY' => '', //DATABASEKEY
                'TTLE' => ReplaceXtrainChar($Title), //TITLE
                'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                'DRTN' => (intval($Duration) / 60), //DURATION
                'MNTS' => $Duration, //DURACION MINUTES
                'DATE' => '', //DATE (EPOCH)
                'STRH' => $NewStartTime, // START HOUR
                'FNLH' => $NewFinalTime, // FINAL HOUR
                'TVRT' => '', //TV RATING
                'STRS' => '', //STARS
                'EPSD' => '' //EPISODE
            ));
        }
//        ECHO "<BR>";ECHO "<BR>";echo '________________________________________________________________________________________________';ECHO "<BR>";ECHO "<BR>";
    endforeach;

endforeach;

// print_r($Programacion);

foreach ($Programacion as $clave => $fila):
    $horaIni[$clave] = $fila['STRH'];
endforeach;

array_multisort($horaIni, SORT_ASC, $Programacion);

for ($j = 0; $j < count($arrayCanales); $j++) {
    $arrayCanales[$j]['PROGRAMS'] = array();
    //if (!is_numeric($arrayCanales[$j]['STTN'])) {
    if($arrayCanales[$j]['STTN'] == 'AUDIO' || $arrayCanales[$j]['STTN'] == 'VIDEO' || $arrayCanales[$j]['STTN'] == 'CONTENT') {
        array_push($arrayCanales[$j]['PROGRAMS'],
            array('STTN' => $arrayCanales[$j]['STTN'],
                'DBKY' => '',
                'TTLE' => $arrayCanales[$j]['NAME'],
                'DSCR' => '',
                'DRTN' => '24',
                'MNTS' => '',
                'DATE' => $CurrentDate,
                'STRH' => '00:00',
                'FNLH' => '24:00',
                'TVRT' => '',
                'STRS' => '',
                'EPSD'=> ''
            ));
        $ProgramsLength++;
    } else {
        //echo '::::count($Programacion): '.count($Programacion).' ::::::<BR>';

        for ($i = 0; $i < count($Programacion); $i++) {
            $AddProgram = true;

            if ($arrayCanales[$j]['STTN']  == $Programacion[$i]['STTN']) {

                //echo $arrayCanales[$j]['STTN']  .' == '. $Programacion[$i]['STTN'].' <br>';
                array_push($arrayCanales[$j]['PROGRAMS'], $Programacion[$i]);
                $ProgramsLength++;
            }
        }
        if($ProgramsLength === 0){
            array_push($arrayCanales[$j]['PROGRAMS'],
                array('STTN' => $arrayCanales[$j]['STTN'],
                    'DBKY' => '',
                    'TTLE' =>  $arrayCanales[$j]['NAME'],
                    'DSCR' => '',
                    'DRTN' => '24',
                    'MNTS' => '',
                    'DATE' => $CurrentDate,
                    'STRH' => '00:00',
                    'FNLH' => '24:00',
                    'TVRT' => '',
                    'STRS' => '',
                    'EPSD' => ''
                )
            );
            $ProgramsLength++;
        }
    }
    $arrayCanales[$j]['P_Length'] = $ProgramsLength;
    $ProgramsLength = 0;
}
$arrayCanales['C_Length'] = $ChannelsLength;

foreach ($arrayCanales as $clave => $fila) {
    $chan[$clave] = $fila['CHNL'];
}
array_multisort($chan, SORT_ASC, $arrayCanales);

$EpgData = json_encode(utf8ize($arrayCanales), JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);

$NameDay = 'epg_'.$CurrentDate.'_'.$PackageId.'.json';

if (file_put_contents('Epg/'.$NameDay, $EpgData)) {
    chmod('Epg/'.$NameDay, 0775);
    echo ".::: Archivo JSON con la programacion del dia $CurrentDate del paquete $PackageId se ha creado correctamente". PHP_EOL;
} else {
    echo ".::: Error al crear archivo JSON". PHP_EOL;
}

//else {
//    //echo "No pueden ser procesados los archivos de tribune y se hara un archivo con informacion estatica de los canales en la BD".chr(13).chr(10);
//
//    $arraySchedule = array();
//    $Programacion= array();
//    $Index = 0;
//
//    for ($j = 0; $j < count($arrayCanales); $j++) {
//        $arrayCanales[$j]['PROGRAMS'] = array();
//            array_push($arrayCanales[$j]['PROGRAMS'],
//                  array('estacion' => $arrayCanales[$j]['numero_estacion'],
//                        'database_key' => "",
//                        'grabacion'=>false,
//                        'serie'=>false,
//                        'titulo' => $arrayCanales[$j]['nombre_estacion'],
//                        'descripcion' => "",
//                        'duracion' => "24",
//                        'duracion_minutos' => 'Guide not available',
//                        'fecha'    => $fecha,
//                        'hora_inicio' => "00:00",
//                        'hora_final' => "24:00",
//                        'hora_inicio_epoch' => '',
//                        'hora_final_epoch' => '',
//                        'tv_rating' => '',
//                        'estrellas_rating' => '',
//                        'mpaa_rating' => '',
//                        'numero_episodio'=> '',
//                        'titulo_episodio'=> '',
//                        'advertencias' =>
//                        array('advertencia_uno' => "",
//                            'advertencia_dos' => "",
//                            'advertencia_tres' => "",
//                            'advertencia_cuatro' => "",
//                            'advertencia_cinco' => "",
//                            'advertencia_seis' => "")
//                    ));
//            $lenght_p++;
//
//        $arrayCanales[$j]['lenght_p'] = $lenght_p;
//        $lenght_p = 0;
//    }
//    $arrayCanales['lenght_c']   = $lenght_c;
//
//
//    foreach ($arrayCanales as $clave => $fila) {
//        $chan[$clave] = $fila['numero_canal'];
//    }
//    array_multisort($chan, SORT_ASC, $arrayCanales);
//
//    $data_EPG = json_encode(utf8ize($arrayCanales), JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);
//
//    // "epg_".$fechaAyer."_".$Package[id_paquete].".json"
//
//    //echo $nombreEpg = "epg_general_".(string) $id_paquete.".json";
//    //if (file_put_contents("../Modules/EPG/epg_general_".$nombreEpg.".json", $data_EPG)) {
//
//    $nombreEpg = "_".$PackageId."_";
//    if (file_put_contents("../Modules/EPG/epg_general".$nombreEpg.".json", $data_EPG)) {
//        chmod("../Modules/EPG/epg_general".$nombreEpg.".json", 0775);
//        echo "Archivo JSON con la programacion general se ha creado correctamente".chr(13).chr(10);
//    } else {
//        echo "Error al crear archivo JSON sin tribune".chr(13).chr(10);
//    }
//
// }

function ReplaceXtrainChar($Str){
    $EncodedString = json_encode(utf8ize($Str),  JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);
    //Caracteres a reemplazar y el caracter que lo sustituye
    $CharToReplace = array('"', '""', "''", "/", "¨", "´", "``", "\\","\"");
    $CharToSet     = array('',  '',   "'",  "",  "",  "",  "'",  "/"," ");
    $ReplacedString = str_replace($CharToReplace, $CharToSet ,$EncodedString);
    //Codigos a reemplazar y el caracter que lo sustituye
    //                       á         é        í           ó       ú           ü       ñ
    $ReplacedCodes  = array("/u00a0", "/u0082", "/u00a1", "/u00a2", "/u00a3", "/u0081", "/u00a4", "/u00ad", "/u00b5", "/u0090",
        "/u00b5", "/u00b5", "/u00e9", "/u0088", "/u0085", "/u0083", "/u00a8","/u0089","/u008a","/u0094",
        "/u008c","/u0092","/u0084","/u0086","/u00e2/u0080/u0099","/u00e2/u0080/u0098","/u00a9","/u00f8F",
        "gt;","lt;","/u00c3i","/u00c3","/n","/u00c2i","/u00ba","e/u00b3","/u00c2/u00bf","/u00b1","e/u00bc",
        "/u00c2a","u00c2","u00a1","&amp;","e\u00c2\u00a1","/r","/u00e2/u0080/u0093");
    //Caracteres especiales comentados para futuras referencias
    $ReplaceChar    = array("a", "e", "i", "o", "u", "u", "n", "¡", "a", "e",
        "i","o","u", "e", "a", "a", "¿", "e", "e", "o",
        "i", "AE", "a", "a", "'", "", "", "%",
        "", "", "a", "e", "", "", "u", "o", "", "n", "u",
        " ", "", "i", "&", "i", " ", "");
    $ReplacedString = str_replace($ReplacedCodes, $ReplaceChar ,$ReplacedString);
    $nEnd = $ReplacedString;
    return $nEnd;
}

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string($d)) {
        return utf8_encode($d);
    }
    return $d;
}

/* associative array push */
function array_push_assoc($array, $key, $value){
    $array[$key] = $value;
    return $array;
}

function Time12to24($time12h){
    $time     = explode(' ', $time12h);
    $modifier = $time[1];
    $times    = explode(':', $time[0]);
    $hours    = $times[0];
    $minutes  = $times[1];

    if ($hours == '12') {
        $hours = '00';
    }

    if ($modifier === 'PM') {

        $hours = intval($hours);
        if($hours !== 12){
            $hours = $hours + 12;
        }
    } else {
        $hours = intval($hours);
    }
    return $hours.':'.$minutes;
}

//$time_end = microtime(true);

//$execution_time = ($time_end - $time_start);

//$hours = (int)($execution_time/60/60);
//$minutes = (int)($execution_time/60)-$hours*60;
//$seconds = (int)$execution_time-$hours*60*60-$minutes*60;
//echo '<b>Tiempo de ejecucion </b> Minutos: '.$minutes. ' Segundos: '.$seconds. '<br>';