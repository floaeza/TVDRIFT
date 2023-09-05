<?php
/* Creado por: Tania Maldonado
 * Fecha: Julio 2020
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../Models/Utilities.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/VideoOnDemand.php';
    
    $CurrentController = 'VideoOnDemandController';

    $Option         = !empty($_POST['Option']) ? $_POST['Option'] : 'GetFilters'; 
    $MacAddress     = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : ''; 
    $OrderBy        = !empty($_POST['OrderBy']) ? $_POST['OrderBy'] : 'year'; 
    $Order          = !empty($_POST['Order']) ? $_POST['Order'] : 'ASC'; 
    $Where          = !empty($_POST['Where']) ? $_POST['Where'] : ''; 
    $Like           = !empty($_POST['Like']) ? $_POST['Like'] : ''; 
    

    
    $VideoOnDemand  = new VideoOnDemand($MacAddress, $CurrentController);
    $Utilities      = new Utilities();
    
    $Response = '';
    $FirstElement = 0;
    switch ($Option){
        case 'GetMoviesList':

            $Result = $VideoOnDemand->getMoviesList($OrderBy,$Order,$Where,$Like);
            
            $Movies = array();
            
            $Cast = array();
            
            foreach ($Result as $Row):
   
                $Genders = $VideoOnDemand->getGendersByMovie($Row['id_pelicula']);
            
                $Casting = $VideoOnDemand->getCastingByMovie($Row['id_pelicula']);
                
                foreach ($Casting as $CastRow):
                    array_push($Cast, $CastRow['Name']. ' '.$CastRow['LastName']);
                endforeach;
                
                
                $Director = $VideoOnDemand->getDirectorByMovie($Row['id_pelicula']);

            
                array_push($Movies, array('TTLE' => $Row['nombre_pelicula'],
                                          'DSCR' => $Row['descripcion_pelicula'],
                                          'PSTR' => $Row['nombre_poster'],
                                          'FILE' => $Row['archivo_pelicula'],
                                          'FLDR' => $Row['folder_pelicula'].'/',
                                          'YEAR' => $Row['year'],
                                          'RTNG' => $Row['clasificacion'],
                                          'MNTS' => $Row['duracion_minutos'],
                                          'DRTN' => $Row['duracion_pelicula'],
                                          'SCOR' => $Row['calificacion'],
                                          'GNDR' => $Genders,
                                          'CAST' => $Cast,
                                          'DRTR' => 'Director: '.$Director[0]['Name'].' '.$Director[0]['LastName'],
                                          ));
                
                $Cast = array();
            endforeach;
            
            $Response = $Movies;

        break;
        
        case 'GetYearsList':
            $Response = $VideoOnDemand->GetYearsList();
        break;
        
        case 'GetGendersList':
            $Response = $VideoOnDemand->GetGendersList();
        break;
    }
    
    echo json_encode($Response);