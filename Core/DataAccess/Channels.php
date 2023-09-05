<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Channels extends Database
{

    private $ChannelsList;

    public function __construct($MacAddress, $CurrentModule)
    {
        $this->ClassFile = 'Channels';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getPassChannelsList($PackageId)
    {
        $this->Function = 'getPassChannelsList';

        $this->connect();
        $this->select("paquete_canal", "*", "canales ON paquete_canal.id_canal = canales.id_canal",
            "estaciones ON canales.id_estacion = estaciones.id_estacion",
            "", "",
            "numero_estacion LIKE '%PASS%' AND id_paquete='$PackageId'");
        $this->ChannelsList = $this->getResult();
        $this->disconnect();

        return $this->ChannelsList;
    }

    function getPassStationsList()
    {
        $this->Function = 'getPassStationsList';

        $this->connect();
        $this->select("canales", "*", "estaciones ON canales.id_estacion = estaciones.id_estacion", "", "", "",
            "numero_estacion LIKE '%PASS%'");
        $this->ChannelsList = $this->getResult();
        $this->disconnect();

        return $this->ChannelsList;
    }


    function getGatoChannelsList($PackageId)
    {
        $this->Function = 'getPassChannelsList';

        $this->connect();
        $this->select("paquete_canal", "*", "canales ON paquete_canal.id_canal = canales.id_canal",
            "estaciones ON canales.id_estacion = estaciones.id_estacion",
            "", "",
            "numero_estacion LIKE '%GATO%' AND id_paquete='$PackageId'");
        $this->ChannelsList = $this->getResult();
        $this->disconnect();

        return $this->ChannelsList;
    }

    function getGatoStationsList()
    {
        $this->Function = 'getGatoStationsList';

        $this->connect();
        $this->select("canales", "*", "estaciones ON canales.id_estacion = estaciones.id_estacion", "", "", "",
            "numero_estacion LIKE '%GATO%'");
        $this->ChannelsList = $this->getResult();
        $this->disconnect();

        return $this->ChannelsList;
    }

    function getTribStationsList()
    {
        $this->Function = 'getTribStationsList';

        $this->connect();
        $this->select("canales", "*", "estaciones ON canales.id_estacion = estaciones.id_estacion", "", "", "",
            "numero_estacion NOT LIKE '%GATO%' AND numero_estacion NOT LIKE '%PASS%' AND numero_estacion NOT LIKE '%VIDEO%' AND numero_estacion NOT LIKE '%AUDIO%' AND numero_estacion NOT LIKE '%LOCAL%'");
        $this->ChannelsList = $this->getResult();
        $this->disconnect();

        return $this->ChannelsList;
    }

}
