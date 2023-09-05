<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Statistics.php';


    $CurrentController = 'StatisticsController';

    $Option          = !empty($_POST['Option']) ? $_POST['Option'] : '';
    $MacAddress      = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
    $LocationId      = !empty($_POST['LocationId']) ? $_POST['LocationId'] : '';
    $StartTime       = !empty($_POST['StartTime']) ? $_POST['StartTime'] : '';
    $EndTime         = !empty($_POST['EndTime']) ? $_POST['EndTime'] : '';
    
    $StatisticsData  = new Statistics($MacAddress, $CurrentController);
    
    switch ($Option){
        case 'Channels':
            $ChannelName     = !empty($_POST['ChannelName']) ? $_POST['ChannelName'] : '';
            $StationNumber   = !empty($_POST['StationNumber']) ? $_POST['StationNumber'] : '';
    
            $StatisticsArray = array('id_locacion'     => $LocationId,
                                     'mac_address'     => $MacAddress,
                                     'nombre_canal'    => $ChannelName,
                                     'numero_estacion' => $StationNumber,
                                     'fecha_inicio'    => $StartTime,
                                     'fecha_fin'       => $EndTime);
            
            $NewStatistics = $StatisticsData->setStatisticChannel($StatisticsArray);
        break;
    
        case 'Modules':
            $CurrentModule   = !empty($_POST['CurrentModule']) ? $_POST['CurrentModule'] : '';
    
            $StatisticsArray = array('id_locacion'     => $LocationId,
                                     'mac_address'     => $MacAddress,
                                     'nombre_modulo'   => $CurrentModule,
                                     'fecha_inicio'    => $StartTime,
                                     'fecha_fin'       => $EndTime);
            
            $NewStatistics = $StatisticsData->setStatisticModule($StatisticsArray);
        break;

        case 'Movies':
            $CurrentMovie   = !empty($_POST['CurrentMovie']) ? $_POST['CurrentMovie'] : '';

            $StatisticsArray = array('id_locacion'     => $LocationId,
                'mac_address'     => $MacAddress,
                'nombre_pelicula'   => $CurrentMovie,
                'fecha_inicio'    => $StartTime,
                'fecha_fin'       => $EndTime);

            $NewStatistics = $StatisticsData->setStatisticMovie($StatisticsArray);
            break;
    }
    
    
//echo json_encode($NewStatistics);