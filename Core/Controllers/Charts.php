<?php

    require_once './../Models/Database.php';
    require_once './../Models/Utilities.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Trends.php';

    $TrendsDAO = new Trends($DirectoryLog);
    
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : 'ChannelsAverageTime';
    switch ($Option){
        case 'ChannelsViewTime':
            $From      = !empty($_POST['From']) ? $_POST['From'] : '';
            $Parameter = !empty($_POST['Parameter']) ? $_POST['Parameter'] : '';
            $OrderBy   = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : '';
            $Limit   = !empty($_POST['Limit']) ? $_POST['Limit'] : '';
            $List = $TrendsDAO->getChannelsTime($From, $Parameter, $OrderBy, $Limit);
           

            $ArrayChannelList = array();

            foreach ($List as $Trend):
                    $Seconds = intval($Trend['segundos']);
                    $Hours = $Seconds/3600;
                    $HoursText = conversor_segundos($Seconds);
                    $ColorBar = SetColor($Seconds);
                    array_push($ArrayChannelList, array('NME' => $Trend['nombre_canal'], 
                    'HRS'=>$Hours, 
                    'CLR'=>$ColorBar,
                    'HRSTXT'=>$HoursText));
            endforeach;

            echo json_encode($ArrayChannelList);
        break;
        
        case 'ChannelsAverageTime':
            $From      = !empty($_POST['From']) ? $_POST['From'] : 'Beginning';
            $Parameter = !empty($_POST['Parameter']) ? $_POST['Parameter'] : '';
            $OrderBy   = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : 'nombre_canal ASC';

            $List = $TrendsDAO->getChannelsAverageTime($From, $Parameter, $OrderBy, $Limit);

            $ArrayChannelList = array();

            foreach ($List as $Trend):
                    $Seconds = intval($Trend['segundos']);
                    $Hours = $Seconds/3600;
                    $HoursText = conversor_segundos($Seconds);
                    $ColorBar = SetColor($Seconds);
                    $Count = $Trend['cantidad'];
                    
                    $AverageTime = $Seconds / $Count;
                    $Avg = conversor_segundos($AverageTime);
                    $HourAVG = $Avg/3600;
                    // echo $Trend['nombre_canal'].' - '.$Hours.' - '.$ColorBar.' - '.$HoursText.' - '.$Count.' ------ '.$Avg.'<br>';
                    
                    array_push($ArrayChannelList, array('NME'=>$Trend['nombre_canal'], 
                    'HRS'=>$AverageTime,
                    'HRSTXT'=>$Avg, 
                    'CNT'=>$Count));
            endforeach;

            echo json_encode($ArrayChannelList);
        break;
        case 'FirstRegisters':
            $List= $TrendsDAO->getFirstRegisters();
            $ArrayChannelList = array();
            foreach ($List as $Trend):
                array_push($ArrayChannelList, array('firstDate' => $Trend['fecha_inicio']));
            endforeach;
            echo json_encode($ArrayChannelList);
            break;
        case 'LocationsViewTime':
            $From      = !empty($_POST['From']) ? $_POST['From'] : 'Beginning';
            $Parameter = !empty($_POST['Parameter']) ? $_POST['Parameter'] : '';
            $OrderBy   = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : 'nombre_canal ASC';
            $Limit     = !empty($_POST['Limit']) ? $_POST['Limit'] : '';
            $List= $TrendsDAO->getLocationTime($From, $Parameter, $OrderBy, $Limit);
            $ArrayChannelList = array();
            foreach ($List as $Trend):
                $Seconds = intval($Trend['segundos']);
                $Hours = $Seconds/3600;
                $HoursText = conversor_segundos($Seconds);
                array_push($ArrayChannelList, array('CL' => $Trend['codigo_locacion'],
                'HRS' => $Hours,
                'HRSTXT' => $HoursText
               ));
            endforeach;
            echo json_encode($ArrayChannelList);
            break;
            case 'ChannelsTime':
                $From      = !empty($_POST['From']) ? $_POST['From'] : '';
                $Parameter = !empty($_POST['Parameter']) ? $_POST['Parameter'] : '';
                $OrderBy   = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : '';
                $Limit   = !empty($_POST['Limit']) ? $_POST['Limit'] : '';
                $List = $TrendsDAO->getChannelsTime($From, $Parameter, $OrderBy, $Limit);
    
                $ArrayChannelList = array();
    
                foreach ($List as $Trend):
                        $Seconds = intval($Trend['segundos']);
                        $Hours = $Seconds/3600;
                        $HoursText = conversor_segundos($Seconds);
                        $ColorBar = SetColor($Seconds);
                        array_push($ArrayChannelList, array(
                        'NME' => $Trend['nombre_canal'], 
                        'HRS'=>$Hours));
                endforeach;
    
                echo json_encode($ArrayChannelList);
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
    


