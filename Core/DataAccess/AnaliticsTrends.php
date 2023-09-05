<?php

require_once('../Models/Database.php');

class AnaliticsTrends extends Database{

    private $timeOfViewChannelByYear;
    private $timeOfViewLocationByYear;

    public function __construct($DirectoryLog) {
        $this->Directory = $DirectoryLog;
    }
    function getLocationsAVGTimeByDate($startDate, $endDate){
        try{
            $this->connect();
            $this->select("estadisticas_canal","codigo_locacion as Locacion,
            AVG(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as promedio_segundos,
            AVG(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as promedio_minutos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as promedio_horas",
                          "locaciones ON locaciones.id_locacion = estadisticas_canal.id_locacion",
                          "","","",
                          "BETWEEN
                          '$startDate' AND '$endDate'","","estadisticas_canal.id_locacion
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewLocationByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewLocationByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getAVGOfViewLocationsByMonth($Year, $Month){
        try{
            $this->connect();
            $this->select("estadisticas_canal","codigo_locacion as Locacion,
            AVG(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as promedio_segundos,
            AVG(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as promedio_minutos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as promedio_horas",
                          "locaciones ON locaciones.id_locacion = estadisticas_canal.id_locacion",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year AND MONTH(fecha_inicio) = $Month","","estadisticas_canal.id_locacion
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewLocationByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewLocationByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getAVGOfViewLocationsByYear($Year){
        try{
            $this->connect();
            $this->select("estadisticas_canal","codigo_locacion as Locacion,
            AVG(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as promedio_segundos,
            AVG(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as promedio_minutos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as promedio_horas",
                          "locaciones ON locaciones.id_locacion = estadisticas_canal.id_locacion",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year","","estadisticas_canal.id_locacion
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewLocationByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewLocationByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getAVGOfViewChannelsByDate($startDate, $endDate){
        try{
            $this->connect();
            $this->select("estadisticas_canal","nombre_canal as Canal,
            AVG(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as promedio_segundos,
            AVG(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as promedio_minutos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as promedio_horas",
                          "",
                          "","","",
                          "DATE(fecha_inicio) BETWEEN
                          '$startDate' AND '$endDate'","","nombre_canal
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewChannelByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewChannelByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getAVGOfViewChannelsByMonth($Month, $Year){
        try{
            $this->connect();
            $this->select("estadisticas_canal","nombre_canal as Canal,
            AVG(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as promedio_segundos,
            AVG(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as promedio_minutos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as promedio_horas",
                          "",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year AND MONTH(fecha_inicio) = $Month","","nombre_canal
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewChannelByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewChannelByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getAVGOfViewChannelsByYear($Year){
        try{
            $this->connect();
            $this->select("estadisticas_canal","nombre_canal as Canal,
            AVG(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as promedio_segundos,
            AVG(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as promedio_minutos,
            AVG(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as promedio_horas",
                          "",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year","","nombre_canal
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewChannelByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewChannelByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getTimeOfViewLocationsByDate($startDate, $endDate){
        try{
            $this->connect();
            $this->select("estadisticas_canal","codigo_locacion as Locacion,
            SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos,
            SUM(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as minutos,
            SUM(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as horas",
                          "locaciones ON locaciones.id_locacion = estadisticas_canal.id_locacion",
                          "","","",
                          "DATE(fecha_inicio) BETWEEN '$startDate' AND '$endDate'","","estadisticas_canal.id_locacion
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewLocationByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewLocationByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getTimeOfViewLocationsByMonth($Year, $Month){
        try{
            $this->connect();
            $this->select("estadisticas_canal","codigo_locacion as Locacion,
            SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos,
            SUM(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as minutos,
            SUM(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as horas",
                          "locaciones ON locaciones.id_locacion = estadisticas_canal.id_locacion",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year AND MONTH(fecha_inicio) = $Month","","estadisticas_canal.id_locacion
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewLocationByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewLocationByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getTimeOfViewLocationsByYear($Year){
        try{
            $this->connect();
            $this->select("estadisticas_canal","codigo_locacion as Locacion,
            SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos,
            SUM(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as minutos,
            SUM(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as horas",
                          "locaciones ON locaciones.id_locacion = estadisticas_canal.id_locacion",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year","","estadisticas_canal.id_locacion
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewLocationByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewLocationByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    function getTimeOfViewChannelsByDate($startDate, $endDate){
        try{
            $this->connect();
            $this->select("estadisticas_canal","nombre_canal as Canal,
            SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos,
            SUM(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as minutos,
            SUM(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as horas",
                          "",
                          "","","",
                          "DATE(fecha_inicio) BETWEEN
                          '$startDate' AND '$endDate'","","nombre_canal
                           HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                           AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewChannelByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewChannelByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    /* Obtiene el tiempo total de vista de todos los canales por mes y año */
    function getTimeOfViewChannelsByMonth($Month, $Year){
        try{
            $this->connect();
            $this->select("estadisticas_canal","nombre_canal as Canal,
            SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos,
            SUM(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as minutos,
            SUM(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as horas",
                          "",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year AND MONTH(fecha_inicio) = $Month","","nombre_canal
                           HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                           AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewChannelByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewChannelByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }
    /* Obtiene el tiempo total de vista de todos los canales */
    function getTimeOfViewChannelsByYear($Year){
        try{
            $this->connect();
            $this->select("estadisticas_canal","nombre_canal as Canal,
            SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos,
            SUM(TIMESTAMPDIFF(MINUTE, fecha_inicio, fecha_fin)) as minutos,
            SUM(TIMESTAMPDIFF(HOUR, fecha_inicio, fecha_fin)) as horas",
                          "",
                          "","","",
                          "YEAR(fecha_inicio)  = $Year","","nombre_canal
                          HAVING SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) < 18000
                          AND	  SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) > 180");
            
            $this->timeOfViewChannelByYear = $this->getResult();
            $this->disconnect();
            return $this->timeOfViewChannelByYear;

        } catch(Exception $e){
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    
    }

    

}