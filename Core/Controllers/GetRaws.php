<?php

//PUERTOS DISPONIBLES EN EL DVR
//8079
//8080

require_once '../Models/Utilities.php';


    $UtilitiesModel = new Utilities();

    $SourceRaw = !empty($_POST['SourceRaw']) ? $_POST['SourceRaw'] : '';

    $Result = $UtilitiesModel->GetDataFromUrl($SourceRaw.'?da');

        $InfoArray = explode('href', $Result);

        $RawList = array();

foreach ($InfoArray as $Row=>$RawRow):
    $Raw = explode('/raw/', $RawRow);
    $R = $UtilitiesModel->getBetween($RawRow, '.','>');
    $RawId =  $UtilitiesModel->Clean($R);

    if(strlen($RawId) > 1){
        array_push($RawList,$SourceRaw.'raw.'.$RawId);
    }
    endforeach;

    echo json_encode($RawList);



