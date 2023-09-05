<?php
/* Creado por: Tania Maldonado
 * Fecha: Enero 2020
 * Tipo: Controlador
 */

    date_default_timezone_set('America/Mazatlan');
    
    require_once '../Models/Utilities.php';
    require_once '../Models/Database.php';
    require_once '../DataAccess/Channels.php';
    
/* Para crea un dia de programacion es necesario descargar AYER y HOY. */

    $CurrentController = 'EpgWebDataController';
    
    $Utilities    = new Utilities();
    $ChannelsData = new Channels('system', $CurrentController);
    
    $Channels   = $ChannelsData->getChannelsList();
    
    $Today      = date('Y-m-d');
    $Yesterday  = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $Today) ) ));
    
    $Symbols    = array('>', '<', '/', '=', '"', '-');
    
    $RemoveAmYesterday = true;
    $RemoveAmToday     = false;
    
    $Programacion = array();
    
    $EpgFolder = 'http://10.110.0.111/EpgChannels/';
    
    foreach ($Channels as $Channel):
        $StationName = $Channel['numero_estacion'];
        $ChannelName = preg_replace('/\s+/', '', $Channel['nombre_canal']);
        
        /* AYER */

        $UrlYesterday = $EpgFolder.$ChannelName.'/'.$Yesterday.'.txt';

        $GetTxtYesterday1 = $Utilities->GetDataFromUrl($UrlYesterday);
        $GetTxtYesterday  = str_replace('"', '', $GetTxtYesterday1);

        $DataYesterday2 = htmlspecialchars($GetTxtYesterday);
        $DataYesterday1 = str_replace('>', '', $DataYesterday2);
        $DataYesterday  = str_replace('<', '', $DataYesterday1);

        $SlicesYesterday = explode('list-group-itemdata', $DataYesterday);

        foreach($SlicesYesterday as $SliceYesterday):  
            $SliceYesterday = str_replace('"', '', $SliceYesterday);

            $TitleA       = '';
            $DurationA    = $Utilities->getBetween($SliceYesterday, 'data-duration', 'data-showID');
            $TimeA        = $Utilities->getBetween($SliceYesterday, 'time class=', 'time');
            $Title1       = $Utilities->getBetween($SliceYesterday, 'data-showName', 'Showdata');
            $Title2       = $Utilities->getBetween($SliceYesterday, 'data-showName', 'data-episodeTitle');
            $DescriptionA = $Utilities->getBetween($SliceYesterday, 'data-description', 'data-league');
            $RatingA      = $Utilities->getBetween($SliceYesterday, 'data-rating', 'data-captioned');
            $StarsA       = $Utilities->getBetween($SliceYesterday, 'starRating', 'data-description');
            $EpisodeA     = $Utilities->getBetween($SliceYesterday, 'episodeTitle', 'data-episodeNumber');

            if (strpos($Title1, 'episodeTitle') !== false) {
                $TitleA = $Title2;
            } else {
                $TitleA = $Title1;
            }

            $Title       = str_replace($Symbols, '', $TitleA);
            $Duration    = str_replace($Symbols, '', $DurationA);
            $Time        = substr($TimeA, 4, -5);
            $Description = str_replace($Symbols, '', $DescriptionA);
            $Rating      = str_replace($Symbols, '', $RatingA);
            $Stars       = str_replace($Symbols, '', $StarsA);
            $Episode     = str_replace($Symbols, '', $EpisodeA);

            $ID = substr($Time, -2); 

            if($RemoveAmYesterday == true && $ID == 'AM'){
                //echo '::FALSE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
            } else if($ID == 'PM'){
                //echo '::FALSE 2 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $RemoveAmYesterday = false;
            } if($RemoveAmYesterday == false && $ID == 'AM'){
                //echo '::TRUE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $StartTime = str_pad(Time12to24($Time),5,'0',STR_PAD_LEFT);
                $FinalTime = date('H:i',strtotime($Duration.' minutes',strtotime($StartTime)));
                array_push($Programacion, array('STTN' => $StationName, //STATION
                                                'DBKY' => '', //DATABASEKEY
                                                'RCRD' => false, //RECORDING
                                                'SRIE' => false, //SERIE
                                                'TTLE' => ReplaceXtrainChar($Title), //TITLE
                                                'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                                                'DRTN' => (intval($Duration) / 60), //DURATION
                                                'MNTS' => $Duration, //DURACION MINUTES
                                                'DATE' => str_replace($Today), //DATE (EPOCH) 
                                                'STRH' => $StartTime, // START HOUR
                                                'FNLH' => $FinalTime, // FINAL HOUR
                                                'STRE' => '', //START HOUR EPOCH
                                                'FNLE' => '', //FINAL HOUR EPOCH
                                                'TVRT' => $Rating, //TV RATING
                                                'STRS' => $Stars, //STARS
                                                'EPSD' => ReplaceXtrainChar($Episode) //EPISODE
                                                ));     
            }
        endforeach;

    /* HOY */

        $UrlToday = $EpgFolder.$ChannelName.'/'.$Today.'.txt';

        $GetTxtToday1 = $Utilities->GetDataFromUrl($UrlToday);
        $GetTxtToday  = str_replace('"', '', $GetTxtToday1);

        $DataToday2 = htmlspecialchars($GetTxtToday);
        $DataToday1 = str_replace('>', '', $DataToday2);
        $DataToday  = str_replace('<', '', $DataToday1);

        $SlicesToday = explode('list-group-itemdata', $DataToday);

        foreach($SlicesToday as $SliceToday):  
            $SliceToday = str_replace('"', '', $SliceToday);

            $TitleA       = '';
            $DurationA    = $Utilities->getBetween($SliceToday, 'data-duration', 'data-showID');
            $TimeA        = $Utilities->getBetween($SliceToday, 'time class=', 'time');
            $Title1       = $Utilities->getBetween($SliceToday, 'data-showName', 'Showdata');
            $Title2       = $Utilities->getBetween($SliceToday, 'data-showName', 'data-episodeTitle');
            $DescriptionA = $Utilities->getBetween($SliceToday, 'data-description', 'data-league');
            $RatingA      = $Utilities->getBetween($SliceToday, 'data-rating', 'data-captioned');
            $StarsA       = $Utilities->getBetween($SliceToday, 'starRating', 'data-description');
            $EpisodeA     = $Utilities->getBetween($SliceToday, 'episodeTitle', 'data-episodeNumber');

            if (strpos($Title1, 'episodeTitle') !== false) {
                $TitleA = $Title2;
            } else {
                $TitleA = $Title1;
            }

            $Title       = str_replace($Symbols, '', $TitleA);
            $Duration    = str_replace($Symbols, '', $DurationA);
            $Time        = substr($TimeA, 4, -5);
            $Description = str_replace($Symbols, '', $DescriptionA);
            $Rating      = str_replace($Symbols, '', $RatingA);
            $Stars       = str_replace($Symbols, '', $StarsA);
            $Episode     = str_replace($Symbols, '', $EpisodeA);

            $ID = substr($Time, -2); 

            if($RemoveAmToday == true && $ID == 'AM'){
                //echo '::FALSE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
            } else if($ID == 'PM'){
                //echo '::FALSE 2 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $RemoveAmToday = true;

                $StartTime = str_pad(Time12to24($Time),5,'0',STR_PAD_LEFT);
                $FinalTime = date('H:i',strtotime($Duration.' minutes',strtotime($StartTime)));
                array_push($Programacion, array('STTN' => $StationName, //STATION
                                                'DBKY' => '', //DATABASEKEY
                                                'RCRD' => false, //RECORDING
                                                'SRIE' => false, //SERIE
                                                'TTLE' => ReplaceXtrainChar($Title), //TITLE
                                                'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                                                'DRTN' => (intval($Duration) / 60), //DURATION
                                                'MNTS' => $Duration, //DURACION MINUTES
                                                'DATE' => str_replace($Today), //DATE (EPOCH) 
                                                'STRH' => $StartTime, // START HOUR
                                                'FNLH' => $FinalTime, // FINAL HOUR
                                                'STRE' => '', //START HOUR EPOCH
                                                'FNLE' => '', //FINAL HOUR EPOCH
                                                'TVRT' => $Rating, //TV RATING
                                                'STRS' => $Stars, //STARS
                                                'EPSD' => ReplaceXtrainChar($Episode) //EPISODE
                                                )); 
            } if($RemoveAmToday == false && $ID == 'AM'){
                //echo '::TRUE 1 :: '.$Time . ' - '.$Title.' - '.$Duration . '<br>';
                $StartTime = str_pad(Time12to24($Time),5,'0',STR_PAD_LEFT);
                $FinalTime = date('H:i',strtotime($Duration.' minutes',strtotime($StartTime)));
                array_push($Programacion, array('STTN' => $StationName, //STATION
                                                'DBKY' => '', //DATABASEKEY
                                                'RCRD' => false, //RECORDING
                                                'SRIE' => false, //SERIE
                                                'TTLE' => ReplaceXtrainChar($Title), //TITLE
                                                'DSCR' => ReplaceXtrainChar($Description), //DESCRIPTION
                                                'DRTN' => (intval($Duration) / 60), //DURATION
                                                'MNTS' => $Duration, //DURACION MINUTES
                                                'DATE' => str_replace($Today), //DATE (EPOCH) 
                                                'STRH' => $StartTime, // START HOUR
                                                'FNLH' => $FinalTime, // FINAL HOUR
                                                'STRE' => '', //START HOUR EPOCH
                                                'FNLE' => '', //FINAL HOUR EPOCH
                                                'TVRT' => $Rating, //TV RATING
                                                'STRS' => $Stars, //STARS
                                                'EPSD' => ReplaceXtrainChar($Episode) //EPISODE
                                                )); 
            }
        endforeach;

    endforeach;
    
    
    foreach ($Programacion as $Programs):
        foreach ($Programs as $row):
            print_r($row); echo '<br>';
        endforeach;
    endforeach;
     
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
        $hours = intval($hours) + 12;
    } else {
        $hours = intval($hours);
    }
    return $hours.':'.$minutes;
}

function ReplaceXtrainChar($Str){
    $EncodedString = json_encode(utf8ize($Str),  JSON_FORCE_OBJECT | JSON_PRETTY_PRINT);
    //Caracteres a reemplazar y el caracter que lo sustituye
    $CharToReplace = array('"', '""', "''", "/", "¨", "´", "``", "\\");
    $CharToSet     = array('',  '',   "'",  "",  "",  "",  "'",  "/");
    $ReplacedString = str_replace($CharToReplace, $CharToSet ,$EncodedString);
    //Codigos a reemplazar y el caracter que lo sustituye
    //                       á         é        í           ó       ú           ü       ñ
    $ReplacedCodes  = array("/u00a0", "/u0082", "/u00a1", "/u00a2", "/u00a3", "/u0081", "/u00a4", "/u00ad", "/u00b5", "/u0090", "/u00b5", 
    "/u00b5", "/u00e9", "/u0088", "/u0085", "/u0083", "/u00a8","/u0089","/u008a","/u0094", "/u008c","/u0092","/u0084","/u0086");
    //Caracteres especiales comentados para futuras referencias
    $ReplaceChar    = array("a"     ,"e"      ,"i"      ,"o"      ,"u"      ,"u"      ,"n"      , "¡"     , "a"/*�?*/, "e"/*É*/, "i"/*�?*/,
    "o"/*Ó*/,"u"/*Ú*/, "e"/*ê*/,  "a"/*à*/, "a"/*à*/, "¿",     "e",     "e"/*è*/,  "o",   "i"/*î*/, "AE"/*Æ*/,"a"/*ä*/,"a"/*å*/);
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