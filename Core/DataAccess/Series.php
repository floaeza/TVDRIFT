<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: DAO
 */

class Series extends Database {
    
    private $SeriesList;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Series';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getSerieByLocation($LocationId, $Title) {
        $this->Function = 'getSerieByLocation';
        
        $this->connect();
        $this->select("pvr_series", "*", "", "", "", "", 
                      "id_locacion = '".$LocationId."' AND titulo_serie = '".$Title."'");
        $Result = $this->getResult();
        
        foreach($Result as $row):
            $this->SeriesList = $row;
        endforeach;
        
        $this->disconnect();

        return $this->SeriesList;
    }
    
    function setSerie($NewSerie) {
        $this->Function = 'setSerie';
        
        $this->connect();
        $this->insert("pvr_series", $NewSerie);
        $Result = $this->getResult();
        
        foreach($Result as $row):
            $this->SeriesList = $row;
        endforeach;
        
        $this->disconnect();

        return $this->SeriesList;
    }
    
    function deleteSerie($SerieId) {
        $this->Function = 'deleteSerie';
        
        $this->connect();
        $this->delete('pvr_series', "id_serie = '" .$SerieId."'");
        $this->SeriesList = $this->getResult();
        
        $this->disconnect();

        return $this->SeriesList;
    }
    
    function getSeries($LocationId) {
        $this->Function = 'getSeries';
        
        $this->connect();
        $this->select("pvr_series", "*", 
                      "", "", "", "", 
                      "id_locacion = '".$LocationId."' AND id_operacion = '1' ");
        $this->ProgramsList = $this->getResult();

        $this->disconnect();

        return $this->ProgramsList;
    } 

}