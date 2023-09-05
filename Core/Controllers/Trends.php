<?php 
/* *****************************************************************************
 * OBJETIVO: 
 * PARAMETROS RECIBIDOS: 
 * CREADO Junio 2018
 * ****************************************************************************/
    session_start();
    require '../Models/Config.php';
    require '../Models/Log.php';
    require '../../General/Languages/es.php';
    require '../DAO/TrendsDAO.php';
    
    $TrendsDAO = new Trends($DirectoryLog);
    
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : 'ChannelsAverageTime';
    
    switch ($Option){
        case 'ChannelsViewTime':
            $From      = !empty($_POST['From']) ? $_POST['From'] : '';
            $Parameter = !empty($_POST['Parameter']) ? $_POST['Parameter'] : '';
            $OrderBy   = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : '';

            $List = $TrendsDAO->getChannelsTime($From, $Parameter, $OrderBy);

            $ArrayChannelList = array();

            foreach ($List as $Trend):
                    $Seconds = intval($Trend['segundos']);
                    $Hours = $Seconds/3600;
                    $HoursText = conversor_segundos($Seconds);
                    $ColorBar = SetColor($Seconds);
                    array_push($ArrayChannelList, array($Trend['nombre_canal'], $Hours, $ColorBar ,$HoursText));
            endforeach;

            echo json_encode($ArrayChannelList);
        break;
        
        case 'ChannelsAverageTime':
            $From      = !empty($_POST['From']) ? $_POST['From'] : 'Beginning';
            $Parameter = !empty($_POST['Parameter']) ? $_POST['Parameter'] : '';
            $OrderBy   = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : 'nombre_canal ASC';

            $List = $TrendsDAO->getChannelsAverageTime($From, $Parameter, $OrderBy);

            $ArrayChannelList = array();

            foreach ($List as $Trend):
                    $Seconds = intval($Trend['segundos']);
                    $Hours = $Seconds/3600;
                    $HoursText = conversor_segundos($Seconds);
                    $ColorBar = SetColor($Seconds);
                    $Count = $Trend['cantidad'];
                    
                    $AverageTime = $Seconds / $Count;
                    $Avg = conversor_segundos($AverageTime);
                    echo $Trend['nombre_canal'].' - '.$Hours.' - '.$ColorBar.' - '.$HoursText.' - '.$Count.' ------ '.$Avg.'<br>';
                    
                    array_push($ArrayChannelList, array($Trend['nombre_canal'], $Hours, $ColorBar ,$HoursText, $Count));
            endforeach;

            //echo json_encode($ArrayChannelList);
        break;
    }
    
    
/*******************************************************************************
 * Funciones generales
 ******************************************************************************/
    
     function SetColor($Segundos){
        $OneHour = 3600;
        $TenHours = 36000;
        $FifteenHours = 54000;
        $TwentyHours = 72000;
        $ThirtyHours = 108000;

        if($Segundos < $OneHour){
            $Color = '#71c7ec';
        } 
        else if($Segundos >= $OneHour && $Segundos <= $TenHours){
            $Color = '#1ebbd7';
        } 
        else if ($Segundos >= $TenHours && $Segundos <= $FifteenHours){
            $Color = '#189ad3';
        }
        else if ($Segundos >= $TwentyHours && $Segundos <= $ThirtyHours){
            $Color = '#107dac';
        }
        else if ($Segundos >= $ThirtyHours){
            $Color = '#005073';
        }
        else {
            $Color = '#71c7ec';
        } 
        
        return $Color;
    }

    function conversor_segundos($seg_ini) {
        $horas = floor($seg_ini/3600);
        $minutos = floor(($seg_ini-($horas*3600))/60);
        $segundos = $seg_ini-($horas*3600)-($minutos*60);
        return $horas.' h '.$minutos.' m '.$segundos.' s';
    }
    