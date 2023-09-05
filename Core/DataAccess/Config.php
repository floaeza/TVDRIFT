<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Config extends Database {

    private $Config;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Config';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getConfig() {
        $this->Function = 'getConfig';
        
        $this->connect();
        $this->select('parametros');
        //$this->Config = $this->getResult();
        $this->Config = $this->getSql();
        $this->disconnect();
        
        return $this->Config;
    }
    
    function getConfigByName($Name) {
        $this->Function = 'getConfigByName';
        
        $this->connect();
        $this->select('parametros','*','','','','',"nombre_parametro = '$Name'");
        $Result = $this->getResult();
        foreach ($Result as $Row):
            $this->Config = $Row['valor_parametro'];
        endforeach;
        $this->disconnect();
        
        return $this->Config;

    }
    
    function SetLicensingParameters($Parameter, $Value){
        $this->Function = 'SetLicensingParameters';
        
        $this->connect();
        $this->update("parametros",$Value, "nombre_parametro = '$Parameter'");
        $this->Config = $this->getResult();
        $this->disconnect();
        
        return $this->Config;
    }
    
}
