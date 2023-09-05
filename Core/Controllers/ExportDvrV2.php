<?php
/* Creado por: Tania Maldonado
 * Fecha: Enero 2020
 * Tipo: Controlador
 * @@@@@@@@@@@@@@@@@@@ IMPORTANTE @@@@@@@@@@@@@@@@@@@
 * Actualizar la ubicacion del dispositivo antes de cambiarlo de lugar
 *
 */

// DELETE FROM `pvr_programas` WHERE `pvr_programas`.`mac_address_pvr` = ""



// streamerctl listassets > /PVR/PVRRecordsInfo.txt && amimongoose -p 404

// SELECT * FROM `pvr_programas` WHERE mac_address_pvr = "00:02:02:44:4b:6b"

require_once '../Models/Utilities.php';
require_once '../Models/Database.php';
require_once '../DataAccess/Devices.php';
require_once '../DataAccess/Programs.php';

$UtilitiesModel = new Utilities();
$DevicesData    = new Devices('system', 'ExportDvr');
$ProgramsData   = new Programs('system', 'ExportDvr');
$FirstElement   = 0;


$MacAddress  = '00:02:02:6b:d1:a8';


//echo  $MacAddress. PHP_EOL;

$Device   = $DevicesData->getDevice($MacAddress);
$Location = $DevicesData->getDeviceLocation($Device[$FirstElement]['id_dispositivo']);

$Ip = $Device[$FirstElement]['ip'];
//echo  $Ip. PHP_EOL;
$Id = $Location[$FirstElement]['id_locacion'];

//8079
//8080

$RecordsInfo = 'http://'.$Ip.':404/PVRRecordsInfo.txt';
$PathRecordings = 'http://'.$Ip.':404';

echo $RecordsInfo . '<br>';

//echo $RecordsInfo. PHP_EOL;

$Result = $UtilitiesModel->GetDataFromUrl($RecordsInfo);


$RecordInfoArray = explode(': src', $Result);

$ArrayRecordsList = array();

foreach ($RecordInfoArray as $Row=>$RecordRow):
    echo "<br>";echo "<br>";print_r($RecordRow); echo "<br>";echo "<br>";
    $EpochRecordDate = intval($UtilitiesModel->getBetween($RecordRow, 'start=', ' metadata'));

    $RecordDate = date('l jS \of F Y h:i:s A', $EpochRecordDate);

    $AssetZerosId = $UtilitiesModel->getBetween($RecordRow, "assetname='", "'");

    $Duration = $UtilitiesModel->getBetween($RecordRow, 'duration=', ' reclength');

    // title='Amino-PLT' url=
    $RecordPLT = $UtilitiesModel->getBetween($RecordRow, "title='", "' url=");
    if($RecordPLT !== 'Amino-PLT'){


        $AssetId = ltrim($AssetZerosId, "0");
        $AssetDate = date('Ymd', $EpochRecordDate);

        $StartTime= "01:00";
        $dateinsec=strtotime($StartTime);
        $newdate=$dateinsec+$Duration;
        $EndTime = date('H:i',$newdate);

//                echo $RecordName; echo '<br>';
//
//                echo strlen($RecordName);
//                echo '<br>';
        $ProgramInfo = array('id_locacion'          => $Id,
            'id_operacion'          => '4',
            'id_asset'              => $AssetId,
            'mac_address_pvr'       => $MacAddress,
            'databasekey'           => '',
            'titulo_programa'       => $RecordPLT,
            'descripcion_programa'  => '',
            'fecha_programa'        => $AssetDate,
            'hora_inicio'           => $StartTime,
            'hora_final'            => $EndTime,
            'utc_inicio'            => '0',
            'utc_final'             => '0',
            'url_canal'             => 'igmp://');

        $Response = ' ';

        $AddProgram = $ProgramsData->setProgram($ProgramInfo);

        if(intval($AddProgram) >= 1){
            $Response = ' === Program added';
        } else {
            $Response = ' === There was a problem, try again later';
        }

        echo $Row. $Response;echo '<br>';
        print_r($ProgramInfo); echo '<br>';
        echo '____________________________________________________________________________________________________________________________________________________________________________'.'<br>';

    }
endforeach;