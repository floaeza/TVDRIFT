<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Locations extends Database {
    
    private $LocationById;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Locations';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';

        $this->connect();
    }
    
    function getLocationById($LocationId) {
        $this->Function = 'getLocationById';
        
        //$this->connect();
        $this->select("locaciones","*","",
                                         "miembros ON locaciones.codigo_miembro = miembros.codigo_miembro",
                                         "",""
                                         ,"id_locacion = '$LocationId'");
        $this->LocationById = $this->getResult();
        $this->disconnect();

        return $this->LocationById;
    }

    function getLocationIdByName($LocationCode) {
        $this->Function = 'getLocationIdByName';

        //$this->connect();
        $this->select("locaciones","*","","","","","codigo_locacion = '$LocationCode'");
        $this->LocationById = $this->getResult();
        $this->disconnect();

        return $this->LocationById;
    }

    function setLocationById($LocationById) {
        $this->LocationById = $LocationById;
    }

    function getLocationServices($LocationId) {
        $this->Function = 'getLocationServices';

        //$this->connect();
        $this->select("locaciones","*","",
                                         "miembros ON locaciones.codigo_miembro = miembro.codigo_miembro",
                                         "",""
                                         ,"id_locacion = '$LocationId'");
        $this->LocationById = $this->getResult();
        $this->disconnect();

        return $this->LocationById;
    }

    function getLocations(){
        $this->Function = 'getLocations';
        //$this->connect();
        $this->select("locaciones");
        $this->Locations = $this->getResult();
        $this->disconnect();
        return $this->Locations;
    }
    function getMembers(){
        $this->Function = 'getMembers';
        //$this->connect();
        $this->select("miembros");
        $this->Locations = $this->getResult();
        $this->disconnect();
        return $this->Locations;
    }
    function updateLocation($LocationId, $infoLocation){
        $this->Function = 'updateLocation';
        //$this->connect();
        $this->update("locaciones", $infoLocation, "id_locacion = '$LocationId'" );
        $this->Locations = $this->getResult();
        $this->disconnect();
        return $this->Locations;
    }

    function InsertLocation($NewLocation){
        $this->function = 'InsertLocation';
        //$this->connect();
        $this->insert("locaciones", $NewLocation);
        $this->Locations = $this->getResult();
        $this->disconnect();
        return $this->Locations;
    }

    function UpdateDevice_Location($dispositivoId, $infoLocation){
        $this->Function = 'UpdateDevice_Location';
        //$this->connect();
        $this->update("dispositivo_locacion", $infoLocation, "id_dispositivo = '$dispositivoId'" );
        $this->Locations = $this->getResult();
        $this->disconnect();
        return $this->Locations;
    }
}
