<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: DAO
 */

class Statistics extends Database {

    private $StatisticsChannels;
    private $StatisticsModules;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Statistics';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function setStatisticChannel($StatisticsArray) {
        $this->Function = 'setStatisticChannel';
        
        $this->connect();
        $this->insert("estadisticas_canal",$StatisticsArray);
        $this->StatisticsChannels = $this->getResult();
        $this->disconnect();

        return $this->StatisticsChannels;
    }

    function setStatisticModule($StatisticsArray) {
        $this->Function = 'get';

        $this->connect();
        $this->insert("estadisticas_modulo",$StatisticsArray);
        $this->StatisticsModules = $this->getResult();
        //echo $this->getSql();
        $this->disconnect();

        return $this->StatisticsModules;
    }

    function setStatisticMovie($StatisticsArray) {
        $this->Function = 'get';

        $this->connect();
        $this->insert("estadisticas_pelicula",$StatisticsArray);
        $this->StatisticsModules = $this->getResult();
        //echo $this->getSql();
        $this->disconnect();

        return $this->StatisticsModules;
    }

}
