<?php
/* Creado por: Tania Maldonado
 * Fecha: Enero 2020
 * Tipo: Controlador
 * FALTA HACER DINAMICO EL SCRIPT
 */

date_default_timezone_set('America/Mazatlan');

require_once '../Models/Database.php';
require_once '../DataAccess/Channels.php';

/*
 * Para crea un dia de programacion es necesario descargar AYER y HOY.
 */
$CurrentController = 'GetWebEpgController';

$ChannelsData     = new Channels('system', $CurrentController);
$Channels         = $ChannelsData->getGatoStationsList();

$TvPassport       = 'https://www.gatotv.com/canal/';

$Today            = date('Y-m-d');
$Yesterday        = date('Y-m-d',(strtotime ( '-1 day' , strtotime ( $Today) ) ));
$BeforeYesterday  = date('Y-m-d',(strtotime ( '-2 day' , strtotime ( $Today) ) ));

$TodayPlus1        = date('Y-m-d',(strtotime ( '1 day' , strtotime ( $Today) ) ));
$TodayPlus2        = date('Y-m-d',(strtotime ( '2 day' , strtotime ( $Today) ) ));
$TodayPlus3        = date('Y-m-d',(strtotime ( '3 day' , strtotime ( $Today) ) ));
$TodayPlus4        = date('Y-m-d',(strtotime ( '4 day' , strtotime ( $Today) ) ));
$TodayPlus5        = date('Y-m-d',(strtotime ( '5 day' , strtotime ( $Today) ) ));
$TodayPlus6        = date('Y-m-d',(strtotime ( '6 day' , strtotime ( $Today) ) ));
$TodayPlus7        = date('Y-m-d',(strtotime ( '7 day' , strtotime ( $Today) ) ));
$TodayPlus8        = date('Y-m-d',(strtotime ( '8 day' , strtotime ( $Today) ) ));
$TodayPlus9        = date('Y-m-d',(strtotime ( '9 day' , strtotime ( $Today) ) ));
$TodayPlus10       = date('Y-m-d',(strtotime ( '10 day' , strtotime ( $Today) ) ));
$TodayPlus11       = date('Y-m-d',(strtotime ( '11 day' , strtotime ( $Today) ) ));
$TodayPlus12       = date('Y-m-d',(strtotime ( '12 day' , strtotime ( $Today) ) ));

/* Consulta solo los canales activos y con estaciones PASS */
foreach ($Channels as $Channel):
    $StationName = $Channel['nombre_estacion'];
    $ChannelName = preg_replace('/\s+/', '', $Channel['nombre_canal']);

    $UrlToday     = $TvPassport.$StationName.$Today;
    $UrlYesterday = $TvPassport.$StationName.$Yesterday;
    $Folder  = '/var/www/html/EpgChannels/'.$ChannelName.'/';
    $OldFile = $Folder.$BeforeYesterday.'.txt';

    if (file_exists($OldFile)) {
        unlink($OldFile);
    } else {
        echo 'No hay archivo para eliminar<br>';
    }

    if (!is_readable($Folder)) {
        $CommandFolder = 'cd /var/www/html/EpgChannels/ && mkdir '.$ChannelName;
        $Mkdir = shell_exec($CommandFolder);
        print_r($Mkdir);
        echo '<br>';
    }

    $CommandToday = 'wget --no-check-certificate '.$UrlToday. ' -O '.$Folder.$Today.'.txt';
    echo $CommandToday; echo '<br>';
    $DownloadFileToday = shell_exec($CommandToday);
    print_r($DownloadFileToday);

    $CommandYesterday = 'wget --no-check-certificate '.$UrlYesterday. ' -O '.$Folder.$Yesterday.'.txt';
    echo $CommandYesterday; echo '<br>';
    $DownloadFileYesterday = shell_exec($CommandYesterday);
    print_r($DownloadFileYesterday);


    $UrlTodayPlus1 = $TvPassport.$StationName.$TodayPlus1;
    $CommandTodayPlus1 = 'wget --no-check-certificate '.$UrlTodayPlus1. ' -O '.$Folder.$TodayPlus1.'.txt';
    echo $CommandTodayPlus1; echo '<br>';
    $DownloadFileTodayPlus1 = shell_exec($CommandTodayPlus1);
    print_r($DownloadFileTodayPlus1);

    $UrlTodayPlus2 = $TvPassport.$StationName.$TodayPlus2;
    $CommandTodayPlus2 = 'wget --no-check-certificate '.$UrlTodayPlus2. ' -O '.$Folder.$TodayPlus2.'.txt';
    echo $CommandTodayPlus2; echo '<br>';
    $DownloadFileTodayPlus2 = shell_exec($CommandTodayPlus2);
    print_r($DownloadFileTodayPlus2);

    $UrlTodayPlus3 = $TvPassport.$StationName.$TodayPlus3;
    $CommandTodayPlus3 = 'wget --no-check-certificate '.$UrlTodayPlus3. ' -O '.$Folder.$TodayPlus3.'.txt';
    echo $CommandTodayPlus3; echo '<br>';
    $DownloadFileTodayPlus3 = shell_exec($CommandTodayPlus3);
    print_r($DownloadFileTodayPlus3);

    $UrlTodayPlus4 = $TvPassport.$StationName.$TodayPlus4;
    $CommandTodayPlus4 = 'wget --no-check-certificate '.$UrlTodayPlus4. ' -O '.$Folder.$TodayPlus4.'.txt';
    echo $CommandTodayPlus4; echo '<br>';
    $DownloadFileTodayPlus4 = shell_exec($CommandTodayPlus4);
    print_r($DownloadFileTodayPlus4);

    $UrlTodayPlus5 = $TvPassport.$StationName.$TodayPlus5;
    $CommandTodayPlus5 = 'wget --no-check-certificate '.$UrlTodayPlus5. ' -O '.$Folder.$TodayPlus5.'.txt';
    echo $CommandTodayPlus5; echo '<br>';
    $DownloadFileTodayPlus5 = shell_exec($CommandTodayPlus5);
    print_r($DownloadFileTodayPlus5);

    $UrlTodayPlus6 = $TvPassport.$StationName.$TodayPlus6;
    $CommandTodayPlus6 = 'wget --no-check-certificate '.$UrlTodayPlus6. ' -O '.$Folder.$TodayPlus6.'.txt';
    echo $CommandTodayPlus6; echo '<br>';
    $DownloadFileTodayPlus6 = shell_exec($CommandTodayPlus6);
    print_r($DownloadFileTodayPlus6);

    $UrlTodayPlus7 = $TvPassport.$StationName.$TodayPlus7;
    $CommandTodayPlus7 = 'wget --no-check-certificate '.$UrlTodayPlus7. ' -O '.$Folder.$TodayPlus7.'.txt';
    echo $CommandTodayPlus7; echo '<br>';
    $DownloadFileTodayPlus7 = shell_exec($CommandTodayPlus7);
    print_r($DownloadFileTodayPlus7);

    $UrlTodayPlus8 = $TvPassport.$StationName.$TodayPlus8;
    $CommandTodayPlus8 = 'wget --no-check-certificate '.$UrlTodayPlus8. ' -O '.$Folder.$TodayPlus8.'.txt';
    echo $CommandTodayPlus8; echo '<br>';
    $DownloadFileTodayPlus8 = shell_exec($CommandTodayPlus8);
    print_r($DownloadFileTodayPlus8);

    $UrlTodayPlus9 = $TvPassport.$StationName.$TodayPlus9;
    $CommandTodayPlus9 = 'wget --no-check-certificate '.$UrlTodayPlus9. ' -O '.$Folder.$TodayPlus9.'.txt';
    echo $CommandTodayPlus9; echo '<br>';
    $DownloadFileTodayPlus9 = shell_exec($CommandTodayPlus9);
    print_r($DownloadFileTodayPlus9);

    $UrlTodayPlus10 = $TvPassport.$StationName.$TodayPlus10;
    $CommandTodayPlus10 = 'wget --no-check-certificate '.$UrlTodayPlus10. ' -O '.$Folder.$TodayPlus10.'.txt';
    echo $CommandTodayPlus10; echo '<br>';
    $DownloadFileTodayPlus10 = shell_exec($CommandTodayPlus10);
    print_r($DownloadFileTodayPlus10);

    $UrlTodayPlus11 = $TvPassport.$StationName.$TodayPlus11;
    $CommandTodayPlus11 = 'wget --no-check-certificate '.$UrlTodayPlus11. ' -O '.$Folder.$TodayPlus11.'.txt';
    echo $CommandTodayPlus11; echo '<br>';
    $DownloadFileTodayPlus11 = shell_exec($CommandTodayPlus11);
    print_r($DownloadFileTodayPlus11);

    $UrlTodayPlus12 = $TvPassport.$StationName.$TodayPlus12;
    $CommandTodayPlus12 = 'wget --no-check-certificate '.$UrlTodayPlus12. ' -O '.$Folder.$TodayPlus12.'.txt';
    echo $CommandTodayPlus12; echo '<br>';
    $DownloadFileTodayPlus12 = shell_exec($CommandTodayPlus12);
    print_r($DownloadFileTodayPlus12);
endforeach;