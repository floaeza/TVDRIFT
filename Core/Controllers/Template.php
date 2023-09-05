<?php
/* Creado por: Alberto Chavez
 * Fecha: Mayo 2020
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Templates.php';
    
    $CurrentController = 'ModulesController';
    
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : '';
    $Option2 = !empty($_POST['Option2']) ? $_POST['Option2'] : '';
    $ModuleId = !empty($_POST['ModuleId']) ? $_POST['ModuleId'] : '';
    $ModuleName = !empty($_POST['ModuleName']) ? $_POST['ModuleName'] : '';
    $MacAddress = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
    $ProjectId = !empty($_POST['ProjectId']) ? $_POST['ProjectId'] : '';
    
    $ConfigData   = new Config($MacAddress, $CurrentController);
    $TemplatesData = new Templates($MacAddress, $CurrentController);
    
    switch ($Option){
        case 'getDetailTemplate':
            $Result = $TemplatesData->getDetailTemplate($Option2);            
        break;
    
        case 'getMultimediaFolder':
            $list = array();
            $ImagesList='';
            $id = 0;
            $filehandle = opendir('/var/www/html/Multimedia/'.preg_replace("/\s+/", '', $ModuleName).'/');
            while ($file = readdir($filehandle)) {
                if ($file != "." && $file != "..") {
                    $list[$file] = $file;
                }
            } 
            closedir($filehandle); // Fin lectura archivos
            natcasesort($list);
            $Result = array();
            foreach ($list as $fileName) {
                array_push($Result, $fileName);

            }   
        break;

        case 'getDigitalChannel':
            $list = array();
            $ImagesList='';
            $id = 0;
            $filehandle = opendir('/var/www/html/Multimedia/'.$ModuleName.'/');
            while ($file = readdir($filehandle)) {
                if ($file != "." && $file != "..") {
                    $list[$file] = $file;
                }
            }
            closedir($filehandle); // Fin lectura archivos
            natcasesort($list);

            $Result = array();

            foreach ($list as $fileName){
                $Ext = explode('.', $fileName);

                if($Ext[1] === 'm3u8'){
                    array_push($Result, $fileName);
                }
            }
        break;

        case 'getMultimediaFolderCH':

            $CurrentCH = !empty($_POST['CurrentCH']) ? $_POST['CurrentCH'] : '';

            date_default_timezone_set("America/Mazatlan");
            $Hour = date("H");
            $Day  = date("l");

            switch($Day){
                case 'Monday'      : $Day = 'Lunes';        break;
                case 'Tuesday'     : $Day = 'Martes';       break;
                case 'Wednesday'   : $Day = 'Miercoles';    break;
                case 'Thursday'    : $Day = 'Jueves';       break;
                case 'Friday'      : $Day = 'Viernes';      break;
                case 'Saturday'    : $Day = 'Sabado';       break;
                case 'Sunday'      : $Day = 'Domingo';      break;
            }

            $list = array();
            $ImagesList='';
            $id = 0;
            $filehandle = opendir('/var/www/html/MULTIMEDIA_MVC/Templates/'.$CurrentCH.'/'.$Day.'/');
            while ($file = readdir($filehandle)) {
                if ($file != "." && $file != "..") {
                    $list[$file] = $file;
                }
            }
            closedir($filehandle); // Fin lectura archivos
            natcasesort($list);

            $Result = array();
            foreach ($list as $fileName) {
                array_push($Result, $fileName);

            }

            break;


        case 'getMultimediaFolderV1':
            date_default_timezone_set("America/Mazatlan");
            $Hour = date("H");
            $Day  = date("l");

            switch($Day){
                case 'Monday'      : $Day = 'Lunes';        break;
                case 'Tuesday'     : $Day = 'Martes';       break;
                case 'Wednesday'   : $Day = 'Miercoles';    break;
                case 'Thursday'    : $Day = 'Jueves';       break;
                case 'Friday'      : $Day = 'Viernes';      break;
                case 'Saturday'    : $Day = 'Sabado';       break;
                case 'Sunday'      : $Day = 'Domingo';      break;
            }

            $list = array();
            $ImagesList='';
            $id = 0;
            $filehandle = opendir('/var/www/html/MULTIMEDIA_MVC/Templates/CH7/'.$Day.'/');
            while ($file = readdir($filehandle)) {
                if ($file != "." && $file != "..") {
                    $list[$file] = $file;
                }
            }
            closedir($filehandle); // Fin lectura archivos
            natcasesort($list);

            $Result = array();
            foreach ($list as $fileName) {
                array_push($Result, $fileName);

            }

            break;
    }
    
    echo json_encode($Result);
    
