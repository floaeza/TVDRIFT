<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Stations extends Database {
    
    private $StationsList;
    private $ChannelsName;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Stations';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getStationsList() {
        $this->Function = 'getStationsList';
        
        $this->connect();
        $this->select("estaciones");
        $this->StationsList = $this->getResult();
        $this->disconnect();

        return $this->StationsList;
    }
    
    function updateStation($StationId, $Station) {
        $this->Function = 'updateStation';
        
        $this->connect();
        $this->update("estaciones", $Station, "id_estacion = '$StationId'");
        $this->StationsList = $this->getResult();
        $this->disconnect();

        return $this->StationsList;
    }
    
    function setStation($Station) {
        $this->Function = 'setStation';
        
        $this->connect();
        $this->insert("estaciones", $Station);
        $this->StationsList = $this->getResult();
        $this->disconnect();

        return $this->StationsList;
    }

}