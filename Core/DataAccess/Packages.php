<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Packages extends Database {
    
    private $PackageList;
    private $PackageListById;
    private $PackagesId;
    private $PackageListById2;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Packages';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getPackageList() {
        $this->Function = 'getPackageList';
        
        $this->connect();
        $this->select("paquete_canal","paquete_canal.id_paquete_canal, canales.id_canal, canales.posicion, canales.audio, canales.programa, paquete_canal.id_paquete, paquete_canal.id_modulo, canales.numero_canal, canales.src, canales.puerto, canales.id_calidad, estaciones.nombre_canal, estaciones.id_estacion, estaciones.numero_estacion, estaciones.nombre_estacion, estaciones.indicativo, estaciones.logo","canales ON paquete_canal.id_canal = canales.id_canal",
                                          "estaciones ON canales.id_estacion = estaciones.id_estacion");
        $this->PackageList = $this->getResult();
        $this->disconnect();

        return $this->PackageList;
    }
    
    function setPackageList($Package) {
        $this->PackageList = $Package;
    }

    function getPackageListById($PackageId) {
        $this->Function = 'getPackageListById';
        $this->connect();
        $this->select("paquete_canal","paquete_canal.id_paquete_canal, canales.id_canal, canales.posicion, canales.audio, canales.programa, paquete_canal.id_paquete, paquete_canal.id_modulo, canales.numero_canal, canales.src, canales.puerto, canales.id_calidad, estaciones.nombre_canal, estaciones.id_estacion, estaciones.numero_estacion, estaciones.nombre_estacion, estaciones.indicativo, estaciones.logo",
                                      "canales ON paquete_canal.id_canal = canales.id_canal",
                                      "estaciones ON canales.id_estacion = estaciones.id_estacion",
                                      "",
                                      "","id_paquete = '$PackageId'  AND canal_activo = '1' ","","","canales.numero_canal ASC");
        $this->PackageListById = $this->getResult();

        $this->disconnect();

        return $this->PackageListById;
    }
    
    function getModulesPackageListById($PackageId) {
        $this->Function = 'getModulesPackageListById';
        
        $this->connect();
        $this->select("paquete_canal","*",
                                      "modulos ON paquete_canal.id_modulo = modulos.id_modulo",
                                      "",
                                      "",
                                      "","id_paquete = '$PackageId'  ","","","");
        $this->PackageListById = $this->getResult();

        $this->disconnect();

        return $this->PackageListById;
    }
    
    function getPackageByName($PackageName) {
        $this->Function = 'getPackageByName';
        
        $this->connect();
        $this->select("paquete_canal","*","cat_paquete ON paquete_canal.id_paquete = cat_paquete.id_paquete",
                                        "",
                                        "","","nombre_paquete = '$PackageName'");
        $this->PackageListById = $this->getResult();
        $this->disconnect();

        return $this->PackageListById;
    }
    
    function getPackagesId(){
        $this->Function = 'getPackagesId';
        
        $this->connect();
        $this->select("cat_paquete");
        $this->PackagesId = $this->getResult();
        $this->disconnect();

        return $this->PackagesId;
    }

    function InsertPackage($NewPackage){
        $this->function = 'InsertPackage';
        $this->connect();
        $this->insert("cat_paquete", $NewPackage);
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function InsertChannelInPackage($NewChannel){
        $this->function = 'InsertChannelInPackage';
        $this->connect();
        $this->insert("paquete_canal", $NewChannel);
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function getAllChannelList() {
        $this->Function = 'getAllChannelList';
        $this->connect();
        $this->select("canales", "*", "estaciones ON canales.id_estacion = estaciones.id_estacion", "", "", "","");
        $this->PackageList = $this->getResult();
        $this->disconnect();

        return $this->PackageList;
    }

    function deleteChannelInPackage($ChannelID, $PackageID){
        $this->function = 'deleteChannelInPackage';
        $this->connect();
        $this->delete("paquete_canal", "id_canal = '$ChannelID' AND id_paquete= '$PackageID'");
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function updatePackage($PackageId, $PackageInfo){
        $this->Function = 'updatePackage';
        $this->connect();
        $this->update("cat_paquete", $PackageInfo, "id_paquete = '$PackageId'" );
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function updateParameter($infoPackage){
        $this->Function = 'updateParameter';
        $this->connect();
        $this->update("parametros", $infoPackage, "id_parametro = '18'" );
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }
    function UpdateChannel($ChannelId, $infoChannel){
        $this->Function = 'UpdateChannel';
        $this->connect();
        $this->update("canales", $infoChannel, "id_canal = '$ChannelId'" );
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }
    function UpdateChannelNumber($ChannelId, $infoChannel, $PackageID){
        $this->Function = 'UpdateChannelNumber';
        $this->connect();
        $this->update("paquete_canal", $infoChannel, "id_canal = '$ChannelId' AND id_paquete ='$PackageID'" );
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function UpdateChannelName($infoChannel, $StationID){
        $this->Function = 'UpdateChannelName';
        $this->connect();
        $this->update("estaciones", $infoChannel, "id_estacion = '$StationID'" );
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function getPackageListById2($PackageId) {
        $this->Function = 'getPackageListById2';
        $this->connect();
        $this->select("paquete_canal","paquete_canal.id_paquete_canal, canales.id_canal, canales.posicion, canales.audio, canales.programa, paquete_canal.id_paquete, paquete_canal.id_modulo, canales.numero_canal, canales.src, canales.puerto, canales.id_calidad, estaciones.nombre_canal, estaciones.id_estacion, estaciones.numero_estacion, estaciones.nombre_estacion, estaciones.indicativo, paquete_canal.canal_activo",
                                      "canales ON paquete_canal.id_canal = canales.id_canal",
                                      "estaciones ON canales.id_estacion = estaciones.id_estacion",
                                      "",
                                      "","id_paquete = '$PackageId'","","","canales.numero_canal ASC");
        $this->PackageListById2 = $this->getResult();

        $this->disconnect();

        return $this->PackageListById2;
    }
    function deletePackageID($PackageID){
        $this->function = 'deletePackageID';
        $this->connect();
        $this->delete("cat_paquete", "id_paquete = '$PackageID'");
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }

    function updateParameterReboot($infoPackage){
        $this->Function = 'updateParameter';
        $this->connect();
        $this->update("parametros", $infoPackage, "nombre_parametro = 'LastReboot'" );
        $this->PackagesId = $this->getResult();
        $this->disconnect();
        return $this->PackagesId;
    }


}