<?php
/* Creado por: Tania Maldonado
 * Fecha: Mayo 2020
 * Tipo: DAO
 */

class DiskInfo extends Database {
    
    private $DiskInfoList;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'DiskInfo';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getPvrInfo($LocationId,$MacAddress) {
        $this->Function = 'getPvrInfo';
        
        $this->connect();
        $this->select("pvr_info", "*", 
                      "", "", "", "", 
                      "mac_address = '".$MacAddress."'");
        $this->DiskInfoList = $this->getResult();
        
        if(empty($this->DiskInfoList)){
            $this->select("pvr_info", "*", 
                      "", "", "", "", 
                      "id_locacion = '".$LocationId."'");
            $this->DiskInfoList = $this->getResult();
        }
        
        $this->disconnect();

        return $this->DiskInfoList;
    }
    function getPvrInfoInfomir($LocationId,$MacAddress) {
        $this->Function = 'getPvrInfoInfomir';
        
        $this->connect();
        $this->select("pvr_info", "*", 
                      "", "", "", "", 
                      "mac_address = '".$MacAddress."'");
        $this->DiskInfoList = $this->getResult();
        
        if(empty($this->DiskInfoList)){
            $this->select("pvr_info", "*", 
                      "dispositivos ON pvr_info.mac_address = dispositivos.mac_address", "", "", "", 
                      "id_locacion = '".$LocationId."' AND marca = 'Infomir'");
            $this->DiskInfoList = $this->getResult();
        }
        
        $this->disconnect();

        return $this->DiskInfoList;
    }
    
    function checkPvrInfo($MacAddress) {
        $this->Function = 'checkPvrInfo';
        
        $this->connect();
        $this->select("pvr_info", "*", 
                      "", "", "", "", 
                      "mac_address = '".$MacAddress."'");
        $this->DiskInfoList = $this->getResult();
        
        $this->disconnect();

        return $this->DiskInfoList;
    }

    function getRtspActive($MacAddress) {
        $this->Function = 'getRtspActive';

        $this->connect();
        $this->select("pvr_info", "rtsp_conexiones",
            "", "", "", "",
            "mac_address = '".$MacAddress."'");

        $result = $this->getResult();
        foreach($result as $row):
            $this->DiskInfoList = $row['rtsp_conexiones'];
        endforeach;

        $this->disconnect();

        return $this->DiskInfoList;
    }

    function setPvrInfo($InfoDevice) {
        $this->Function = 'setPvrInfo';
        
        $this->connect();
        $this->insert("pvr_info", $InfoDevice);
        $this->DiskInfoList = $this->getResult();
        
        
        $this->disconnect();

        return $this->DiskInfoList;
    } 
    
    function updatePvrInfo($InfoUpdate, $MacAddress) {
        $this->Function = 'setPvrInfo';
        
        $this->connect();
        $this->update("pvr_info", $InfoUpdate, "mac_address = '$MacAddress'");
        $this->DiskInfoList = $this->getResult();
        $this->disconnect();

        return $this->DiskInfoList;
    } 
    
    
}