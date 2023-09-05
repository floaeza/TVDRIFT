<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

    require_once '../Models/Database.php';
    require_once '../Models/Libraries.php';
    require_once '../DataAccess/Config.php';
    require_once '../DataAccess/Stations.php';
    
    $CurrentController = 'StationsController';

    $StationsData  = new Stations('system', $CurrentController);
    
    $StationsTribune = array();
    
    //$Option = 'INSERT';
    $Option = 'UPDATE';
    
    // Valida si la ubicacion puede ser utilizada
    if (is_readable($Libraries['EpgFilesPath'])) {
        // s t a t r e c
        $StationsText = fopen($Libraries['EpgFilesPath'] . 'statrec.txt', 'r')
                or exit('No se puede abrir el archivo statrec.txt');
        while (!feof($StationsText)) {
            $Station = explode('|', fgets($StationsText));
            
                $Station[1] = substr($Station[1], 0, strrpos($Station[1], ' '));
                
                if (strpos($Station[4], 'Affiliate') !== false) {
                    $Station[4] = str_replace('Affiliate', '', $Station[4]);
                    $Station[4] = preg_replace('/\s+/', '', $Station[4]);
                    $Station[4] = strtoupper($Station[4]);
                } else {
                    $Station[4] = '';
                }

                array_push($StationsTribune, array(
                    $Station[0], // tf_station_num
                    $Station[1], // tf_station_time_zone
                    $Station[2], // tf_station_name
                    $Station[3], // tf_station_call_sign
                    $Station[4]  // tf_station_affil
                ));
        }fclose($StationsText);
    } 

    $StationsDatabase = $StationsData->getStationsList();
    
    if($Option == 'INSERT'){
        foreach ($StationsTribune as $StationTribune):
            // INSERT
            $StationArray =  array ('numero_estacion' => $StationTribune[0],
                                    'zona_horaria'    => $StationTribune[1],
                                    'nombre_estacion' => $StationTribune[2],
                                    'nombre_canal'    => $StationTribune[3],
                                    'afiliacion'      => $StationTribune[4],
                                    'indicativo'      => $StationTribune[3],
                                    'logo'            => $StationTribune[3]);

            $StationsData->setStation($StationArray);

        endforeach;
    } else if($Option == 'UPDATE'){
        foreach ($StationsDatabase as $StationDatabase):
            foreach ($StationsTribune as $StationTribune):

                if($StationDatabase['numero_estacion'] === $StationTribune[0]){

                    // UPDATE 
                    $StationId    = $StationDatabase['id_estacion'];
                    $StationArray =  array ('zona_horaria'    => $StationTribune[1],
                                            'nombre_estacion' => $StationTribune[2],
                                            'nombre_canal'    => $StationTribune[3],
                                            'afiliacion'      => $StationTribune[4],
                                            'logo'            => $StationTribune[3].'.png');

                    $StationsData->updateStation($StationId, $StationArray);
                }
            endforeach;
        endforeach;
    }