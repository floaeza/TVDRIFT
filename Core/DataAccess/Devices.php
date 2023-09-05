<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Devices extends Database {

    private $Device;
    private $DeviceLocation;
    private $DeviceRecorder;
    private $DeviceList;

    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Devices';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getDevice($MacAddress){
        $this->Function = 'getDevice';

        $this->connect();
        $this->select("dispositivos", "*", "", "", "", "", "mac_address = '".$MacAddress."'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }
    function getControl($MacAddress){
        $this->Function = 'getControl';

        $this->connect();
        $this->select("remote_control", "*", "", "", "", "", "mac_address = '".$MacAddress."'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function getVendor($MacAddress){
        $this->Function = 'getVendor';

        $this->connect();
        $this->select("dispositivos", "marca", "", "", "", "", "mac_address = '".$MacAddress."'");
        $result = $this->getResult();
        foreach($result as $row):
            $this->Device = $row['marca'];
        endforeach;
        $this->disconnect();

        return $this->Device;
    }

    function getIp($MacAddress){
        $this->Function = 'getIp';

        $this->connect();
        $this->select("dispositivos", "ip", "", "", "", "", "mac_address = '".$MacAddress."'");
        $result = $this->getResult();
        foreach($result as $row):
            $this->Device = $row['marca'];
        endforeach;
        $this->disconnect();

        return $this->Device;
    }

    function getAllOfDevice($MacAddress) {
        $this->Function = 'getAllOfDevice';

        $this->connect();
        $this->select("dispositivos", "miembros.id_miembro,locaciones.id_locacion",
                      "dispositivo_locacion ON dispositivos.id_dispositivo = dispositivo_locacion.id_dispositivo",
                      "locaciones ON dispositivo_locacion.id_locacion = locaciones.id_locacion",
                      "miembros ON locaciones.codigo_miembro = miembros.codigo_miembro",
                      "", "dispositivos.mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function getIdDevice($MacAddress) {
        $this->Function = 'getIdDevice';

        $this->connect();
        $this->select("dispositivos", "id_dispositivo", "", "", "", "", "mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function setDevice($NewDevice) {
        $this->Function = 'setDevice';

        $this->connect();
        $this->insert("dispositivos", $NewDevice);
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function setControl($NewDevice) {
        $this->Function = 'setControl';

        $this->connect();
        $this->insert("remote_control", $NewDevice);
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }
    function deleteControl($MacAddress){
        $this->Function = 'deleteControl';
        $this->connect();
        $this->delete("remote_control", "mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();
    }
    function updateDevice($DeviceId, $DeviceUpdate){
        $this->Function = 'updateDevice';

        $this->connect();
        $this->update("dispositivos", $DeviceUpdate, "id_dispositivo = '$DeviceId'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function updateControl($MacAddress, $ControlInfo){
        $this->Function = 'updateControl';
        $this->connect();
        $this->update("remote_control", $ControlInfo, "mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function updateGetDevice($DeviceId, $DeviceUpdate,$MacAddress){
        $this->Function = 'updateGetDevice';

        $this->connect();
        $this->update("dispositivos", "", "id_dispositivo = '$DeviceId'");
        $Updated = $this->getResult();
        $this->select("dispositivos", "reiniciar", "", "", "", "", "mac_address = '".$MacAddress."'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function getDeviceLocation($DeviceId) {
        $this->Function = 'getDeviceLocation';

        $this->connect();
        $this->select("dispositivo_locacion", "*", "", "", "", "", "id_dispositivo = '$DeviceId'");
        $this->DeviceLocation = $this->getResult();
        $this->disconnect();

        return $this->DeviceLocation;
    }

    function getDeviceLocationByMacAddress($MacAddress) {
        $this->Function = 'getDeviceLocationByMacAddress';

        $this->connect();
        $this->select("dispositivo_locacion", "*", "locaciones ON dispositivo_locacion.id_locacion = locaciones.id_locacion",
                                                   "dispositivos ON dispositivo_locacion.id_dispositivo = dispositivos.id_dispositivo",
                                                   "", "", "mac_address = '$MacAddress'");
        $Result = $this->getResult();
        foreach ($Result as $Row):
            $this->DeviceLocation = $Row['id_locacion'];
        endforeach;
        $this->disconnect();

        return $this->DeviceLocation;
    }

    function setDeviceLocation($DeviceLocation) {
        $this->Function = 'setDeviceLocation';

        $this->connect();
        $this->insert("dispositivo_locacion", $DeviceLocation);
        $this->DeviceLocation = $this->getResult();
        $this->disconnect();

        return $this->DeviceLocation;
    }

    function getDeviceRecorder($LocationId) {
        $this->Function = 'getDeviceRecorder';

        $this->connect();
        $this->select("dispositivo_locacion", "*",
                      "dispositivos ON dispositivo_locacion.id_dispositivo = dispositivos.id_dispositivo",
                      "", "", "", "id_locacion = '$LocationId' AND grabador = 1");
        $Result = $this->getResult();
        $this->DeviceRecorder = array();

        foreach ($Result as $Row):
            array_push($this->DeviceRecorder, $Row['mac_address']);

        endforeach;


        $this->disconnect();

        return $this->DeviceRecorder;
    }
    function getDeviceRecorderInfomir($LocationId) {
        $this->Function = 'getDeviceRecorderInfomir';

        $this->connect();
        $this->select("dispositivo_locacion", "*",
                      "dispositivos ON dispositivo_locacion.id_dispositivo = dispositivos.id_dispositivo",
                      "", "", "", "`id_locacion` = '$LocationId' AND `dispositivos.marca` = 'Infomir' AND `dispositivos.grabador` = '1'");
        $Result = $this->getResult();
        $this->DeviceRecorder = array();

        foreach ($Result as $Row):
            array_push($this->DeviceRecorder, $Row['mac_address']);

        endforeach;


        $this->disconnect();

        return $this->DeviceRecorder;
    }

    function setDeviceRecorder($DeviceRecorder) {
        $this->DeviceRecorder = $DeviceRecorder;
    }

    function GetDeviceList(){
        $this->Function = 'GetDeviceList';

        $this->connect();
        $this->select("dispositivos");
        $this->DeviceList = $this->getResult();
        $this->disconnect();

        return $this->DeviceList;
    }
    function GetControlList(){
        $this->Function = 'GetControlList';

        $this->connect();
        $this->select("remote_control");
        $this->DeviceList = $this->getResult();
        $this->disconnect();

        return $this->DeviceList;
    }

    function GetActiveDeviceList(){
        $this->Function = 'GetActiveDeviceList';

        $this->connect();
        $this->select("dispositivos","*","","","","","activo = 1");
        $Result = $this->getResult();
        $this->DeviceList = count($Result);
        $this->disconnect();

        return $this->DeviceList;
    }

    function getDeviceInfo($MacAddress) {
        $this->Function = 'getDeviceInfo';

        $this->connect();
        $this->selectj("dispositivo_locacion", "*", "locaciones ON dispositivo_locacion.id_locacion = locaciones.id_locacion",
                                                   "dispositivos ON dispositivo_locacion.id_dispositivo = dispositivos.id_dispositivo",
                                                   "modulos ON locaciones.id_modulo = modulos.id_modulo",
                                                   "",
                                                   "", "","mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }

    function getOperatingDevices (){
        $this->Function = 'getOperatingDevices';

        $this->connect();
        $this->select("dispositivos", "*","","","","","activo ='1'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return count($this->Device);
    }

    function getModel($MacAddress){
        $this->Function = 'getModel';

        $this->connect();
        $this->select("dispositivos","modelo","","","","","mac_address = '$MacAddress'");
        $result = $this->getResult();
        $this->disconnect();
        foreach ($result as $row):
            $this->Device = $row['modelo'];
        endforeach;

        return $this->Device;
    }

    function getStatus($MacAddress){
        $this->Function = 'getStatus';

        $this->connect();
        $this->select("dispositivos","activo","","","","","mac_address = '$MacAddress'");
        $result = $this->getResult();
        $this->disconnect();
        foreach ($result as $row):
            if($row['activo'] === '1'){
                $this->Device = true;
            } else {
                $this->Device = false;
            }
        endforeach;

        return $this->Device;
    }

    function getTvTheme($MacAddress) {
        $this->Function = 'getTvTheme';

        $this->connect();
        $this->selectj("dispositivos", "*", "cat_tema ON dispositivos.id_tema = cat_tema.id_tema",
                                                "",
                                                "",
                                                "",
                                                "",
                                                "", "mac_address = '$MacAddress'");
        $Result = $this->getResult();

        foreach ($Result as $Row):
            $this->Device = $Row['url_tema'];
        endforeach;

        $this->disconnect();

        return $this->Device;
    }


    function getDevicesByStatus($Status){
        $this->Function = 'getStatus';

        $this->connect();
        $this->select("dispositivos","mensaje_evento","","","","","mensaje_evento = '$Status'");
        $this->Device = $this->getResult();

        return count($this->Device);
    }

    function getDevicesHdmi($Status){
        $this->Function = 'getHdmi';

        $this->connect();
        $this->select("dispositivos","hdmi","","","","","hdmi = '$Status'");
        $this->Device = $this->getResult();

        return count($this->Device);
    }

    function GetDeviceLocationList(){
        $this->Function = 'GetDeviceLocationList';

        $this->connect();
        $this->select("dispositivo_locacion","*","dispositivos ON dispositivo_locacion.id_dispositivo = dispositivos.id_dispositivo",
        "locaciones ON dispositivo_locacion.id_locacion = locaciones.id_locacion");
        $this->DeviceList = $this->getResult();
        $this->disconnect();

        return $this->DeviceList;
    }

    function GetLocationList(){
        $this->Function = 'GetLocationList';

        $this->connect();
        $this->select("locaciones","codigo_locacion");
        $this->DeviceList = $this->getResult();
        $this->disconnect();

        return $this->DeviceList;
    }

    function deleteDeviceInLocation($DeviceId){
        $this->Function = 'deleteDeviceInLocation';
        $this->connect();
        $this->delete("dispositivo_locacion", "id_dispositivo = '$DeviceId'");
        $this->Device = $this->getResult();
        $this->disconnect();
    }

    function getRemoteControl($MacAddress){
        $this->Function = 'getRemoteControl';
        $this->connect();
        $this->select("dispositivos","dispositivos.control_remoto","","","","","mac_address = '$MacAddress'");
        $result = $this->getResult();
        return $result;
    }
    function getKillProcess($MacAddress){
        $this->Function = 'getKillProcess';
        $this->connect();
        $this->select("dispositivos","dispositivos.kill_process, dispositivos.ultimo_modulo, dispositivos.ultimo_canal, dispositivos.channel_pos","","","","","mac_address = '$MacAddress'");
        $result = $this->getResult();
        return $result;
    }
    function updateDeviceModule($MacAddress, $DeviceUpdate){
        $this->Function = 'updateDeviceModule';

        $this->connect();
        $this->update("dispositivos", $DeviceUpdate, "mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }
    function GetDeviceAminos(){
        $this->Function = 'GetDeviceAminos';

        $this->connect();
        $this->select("dispositivos","dispositivos.ip, dispositivos.mac_address","","","","","marca = 'Amino' AND modelo = 'A50'");
        $this->DeviceList = $this->getResult();
        $this->disconnect();

        return $this->DeviceList;
    }

    function GetDeviceByReboot(){
        $this->Function = 'GetDeviceByReboot';
        $this->connect();
        $this->select("dispositivos","dispositivos.modelo, dispositivos.marca, dispositivos.ip, dispositivos.mac_address, dispositivos.id_dispositivo","","","","","reiniciar = '1'");
        $this->DeviceList = $this->getResult();
        $this->disconnect();
        return $this->DeviceList;
    }
    function updateDeviceToReboot($DeviceId, $DeviceInfo){
        $this->Function = 'updateDeviceModule';

        $this->connect();
        $this->update("dispositivos", $DeviceInfo, "id_dispositivo = '$DeviceId'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }
    function updateDeviceReboot($MacAddress, $DeviceUpdate){
        $this->Function = 'updateDeviceModule';

        $this->connect();
        $this->update("dispositivos", $DeviceUpdate, "mac_address = '$MacAddress'");
        $this->Device = $this->getResult();
        $this->disconnect();

        return $this->Device;
    }
    function GetDeviceByNoReboot(){
        $this->Function = 'GetDeviceByNoReboot';
        $this->connect();
        $this->select("dispositivos","dispositivos.modelo, dispositivos.marca, dispositivos.ip, dispositivos.mac_address, dispositivos.id_dispositivo","","","","","reiniciar = '477'");
        $this->DeviceList = $this->getResult();
        $this->disconnect();
        return $this->DeviceList;
    }
}