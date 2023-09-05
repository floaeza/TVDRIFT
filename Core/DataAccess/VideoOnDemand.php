<?php
/* Creado por: Tania Maldonado
 * Fecha: Julio 2020
 * Tipo: DAO
 */

class VideoOnDemand extends Database {
    
    private $VideoOnDemandList;
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'VideoOnDemand';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }

    function getMoviesList($OrderBy, $Order, $Where, $Like) {
        $this->Function = 'getMoviesList';
        
        $this->connect();
        
        if(empty($Where)){
            $this->select("vod_peliculas", "*","","","","","","","","$OrderBy $Order");
        } else {
            $this->select("vod_peliculas", "*","","","","","$Where"," '$Like' ","","$OrderBy $Order");
        }
        
        
        $this->VideoOnDemandList = $this->getResult();

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    
    function getGendersByMovie($MovieId) {
        $this->Function = 'getGendersByMovie';
        
        $this->connect();
        $this->select("vod_pelicula_genero", "genero", 
                      "vod_generos ON vod_pelicula_genero.id_genero = vod_generos.id_genero", 
                      "","","",
                      "id_pelicula = '".$MovieId."' "
                );

        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,$Row['genero']);
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    
    function getCastingByMovie($MovieId) {
        $this->Function = 'getCastingByMovie';
        
        $this->connect();
        $this->select("vod_pelicula_cast", "*", 
                      "vod_casting ON vod_pelicula_cast.id_cast = vod_casting.id_cast", 
                      "","","",
                      "id_pelicula = '".$MovieId."' ","","",""
                );
        
        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,array('Name' => $Row['nombre_cast'],'LastName' => $Row['apellido_cast']));
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    
    function getDirectorByMovie($MovieId) {
        $this->Function = 'getDirectorByMovie';
        
        $this->connect();
        $this->select("vod_pelicula_director", "*", 
                      "vod_directores ON vod_pelicula_director.id_director = vod_directores.id_director", 
                      "","","",
                      "id_pelicula = '".$MovieId."' "
                );
        
        $Result = $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,array('Name' => $Row['nombre_director'],'LastName' => $Row['apellido_director']));
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
    
    function GetYearsList(){
        $this->Function = 'getYearsList';
        
        $this->connect();
        $this->select("vod_peliculas", "year");
        
        $Result = $this->getResult();
        
        $PreResult = array();

        foreach ($Result as $Row):
            array_push($PreResult,intval($Row['year']));
        endforeach;
        
        $this->disconnect();
        
        $ArrayResult = array_unique($PreResult);

        $this->VideoOnDemandList = array(); 
        foreach ($ArrayResult as $Row):
            array_push($this->VideoOnDemandList,$Row);
        endforeach;
        
        sort($this->VideoOnDemandList);
        
        return $this->VideoOnDemandList;
    }
    
    function GetGendersList(){
        $this->Function = 'getGendersList';
        
        $this->connect();
        
        $this->select("vod_generos", "genero");
        
        $Result= $this->getResult();
        
        $this->VideoOnDemandList = array();
        foreach ($Result as $Row):
            array_push($this->VideoOnDemandList,$Row['genero']);
        endforeach;

        $this->disconnect();

        return $this->VideoOnDemandList;
    }
}