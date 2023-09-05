<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

    require_once '../Models/Utilities.php';
    require_once '../Models/Database.php';
    require_once '../DataAccess/Config.php';
    
    $CurrentController = 'WeatherController';

    $ConfigData  = new Config('system', $CurrentController);
    $UtilitiesModel = new Utilities();
    
    $CentralServer = $ConfigData->getConfigByName('CentralServer');

/*==============================================================================
 *                        CARGA PARAMETROS DEL DISPOSITIVO
 *==============================================================================*/
    
    
    $WeatherSource = $CentralServer.'Weather/MVC.txt';
    
    $WeatherInfo= $UtilitiesModel->GetDataFromUrl($WeatherSource);
    //$WeatherInfo= '{"latitude":22.928263,"longitude":-109.819273,"timezone":"America/Mazatlan","currently":{"time":1577485801,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":73.74,"apparentTemperature":73.73,"dewPoint":59.95,"humidity":0.62,"pressure":1013.4,"windSpeed":9.2,"windGust":10.82,"windBearing":258,"cloudCover":0.18,"uvIndex":2,"visibility":10,"ozone":287},"offset":-7}';
   
    $Summary = $UtilitiesModel->getBetween($WeatherInfo, '"summary":"', '",');
    $Icon = $UtilitiesModel->getBetween($WeatherInfo, '"icon":"', '",');
    $Temperature = $UtilitiesModel->getBetween($WeatherInfo, '"temperature":', ',"apparent');
    
    if(empty($Summary)){
        $Summary = 'Clear';
        $Icon = 'clear-day';
        $Temperature = '73.74';
    }
    
    echo json_encode(array('Summary' => $Summary, 'Icon' => $Icon, 'Temperature' => $Temperature));