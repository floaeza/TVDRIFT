<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: DAO
 */

class Modules extends Database {
    
    private $Modules;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Modules';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }
    
    function getModuleTemplate($ModuleId) {
            $this->Function = 'getModuleById';
            
            $this->connect();
            $this->select("modulos","*","cat_template ON modulos.id_template = cat_template.id_template",
                                           "",
                                           "","" ,
                                            "id_modulo = '$ModuleId'");
            $Result = $this->getResult();
            
            foreach ($Result as $Row):
                $this->Modules =  $Row;
            endforeach;
            
            $this->disconnect();
            return $this->Modules;
    }
    
    function getMenuByProject($ProjectId){
        $this->Function = 'getMenuByProject';
            
            $this->connect();
            $this->select("modulos","id_modulo","",
                                           "",
                                           "","" ,
                                           "id_proyecto = '$ProjectId' AND nombre_modulo ='Menu' ");
            $Result = $this->getResult();
            
            foreach ($Result as $Row):
                $this->Modules =  $Row;
            endforeach;
            
            $this->disconnect();
            return $this->Modules;
    }
    
    function getModulesByProject($ProjectId){
        $this->Function = 'getModulesByProject';
            
            $this->connect();
            $this->select("modulos","*","",
                                           "",
                                           "","" ,
                                           "id_proyecto = '$ProjectId' AND modulo_canal = '0' ");
            $this->Modules = $this->getResult();
            
            $this->disconnect();
            return $this->Modules;
    }

    function getModuleTV($ModuleUrl){
        $this->Function = 'getModuleTV';
            
            $this->connect();
            $this->select("modulos","*","",
                                           "",
                                           "","" ,
                                           "url_modulo = '$ModuleUrl'");
            $this->Modules = $this->getResult();
            
            $this->disconnect();
            return $this->Modules;
    }
}
