<?php

require_once('../Models/Database.php');

class Trends extends Database{

    private $ChannelsTimeList;
    private $MostViewedChannel;
    private $LastMemberActive;
    private $FirstRegisters;
    private $LocationsTimeList;
    public function __construct($DirectoryLog) {
        $this->Directory = $DirectoryLog;
    }
    
    /* Obtiene el tiempo total de vista de todos los canales */
    function getChannelsTime($From, $Parameter, $OrderBy, $Limit){ 
        $FromTime = '';
        
        if($From == 'Beginning') {
            $FromTime = '';
        }
        else if($From == 'Day') {
            $FromTime = "AND date_format(fecha_inicio, '%d-%m-%Y') = '$Parameter'";
        }
        else if($From == 'Month') {
            $FromTime = "AND date_format(fecha_inicio, '%m-%Y') = '$Parameter'";
        }
        
        try {          
            $this->connect();
            $this->select("estadisticas_canal","SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos, SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) as horas, nombre_canal",
                          "",
                          "","","",
                          "TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin) < 25200 $FromTime","","nombre_canal","$OrderBy",$Limit);
            
            $this->ChannelsTimeList = $this->getResult();
            $this->disconnect();
            return $this->ChannelsTimeList;
        } catch (Exception $e) {
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }

    function getFirstRegisters(){
        try {          
            $this->connect();
            $this->select("estadisticas_canal", "fecha_inicio", "", "", "", "", ""."","","","id_estadistica_canal ASC","1");
            $this->FirstRegisters = $this->getResult();
            $this->disconnect();
            return $this->FirstRegisters;
        } catch (Exception $e) {
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }

    }
    
    /* Obtiene el tiempo promedio de vista de los canales */
    function getChannelsAverageTime($From, $Parameter, $OrderBy){
        
        $FromTime = '';
        
        if($From == 'Beginning') {
            $FromTime = '';
        }
        else if($From == 'Day') {
            $FromTime = "AND date_format(fecha_inicio, '%d-%m-%Y') = '$Parameter'";
        }
        else if($From == 'Month') {
            $FromTime = "AND date_format(fecha_inicio, '%m-%Y') = '$Parameter'";
        }
        
        try {          
            $this->connect();
            $this->select("estadisticas_canal","SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos, SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) as horas, COUNT(nombre_canal) as cantidad, nombre_canal",
                          "",
                          "","","",
                          "TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin) < 25200 $FromTime","","nombre_canal","$OrderBy","");
            
            $this->ChannelsTimeList = $this->getResult();
            $this->disconnect();
            return $this->ChannelsTimeList;
        } catch (Exception $e) {
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }
    }

    function getLocationTime($From, $Parameter, $OrderBy, $Limit){
        $FromTime = '';

        if($From == 'Beginning') {
            $FromTime = '';
        }
        else if($From == 'Day') {
            $FromTime = "AND date_format(fecha_inicio, '%d-%m-%Y') = '$Parameter'";
        }
        else if($From == 'Month') {
            $FromTime = " date_format(fecha_inicio, '%m-%Y') = '$Parameter'";
        }

        try {          
            $this->connect();
            $this->select("estadisticas_canal", 
            "SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin)) as segundos, SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, fecha_inicio, fecha_fin))) as horas, codigo_locacion",
            "locaciones ON estadisticas_canal.id_locacion = locaciones.id_locacion",
            "","","",
            $FromTime,
            "",
            "estadisticas_canal.id_locacion",
            $OrderBy, $Limit);
            
            $this->LocationsTimeList = $this->getResult();
            $this->disconnect();
            return $this->LocationsTimeList;
        } catch (Exception $e) {
            $MessageExeption =  chr(13).chr(10).'Date: '.date("l jS \of F Y h:i:s A").' | Exception: ' . $e->getMessage() . '| ErrorCode ' . $e->getCode() . ' | ErrorFile: ' . $e->getFile() . ' | ErrorLine: ' . $e->getLine();
            error_log($MessageExeption, 3, $this->DirectoryLog);
        }

        

    }



}