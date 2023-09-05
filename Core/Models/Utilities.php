<?php

/* * ****************************************************************************
 * OBJETIVO: Permite validar si un usuario puede iniciar sesion
 * PARAMETROS RECIBIDOS: Correo y contrasena del usuario
 * CREADO POR: Tania Maldonado
 * FECHA: Marzo 2017
 * *************************************************************************** */

class Utilities {
    /* Obtiene los datos de un URL */

    //Ejemplo:
    //$url = "http://172.22.22.10/:8080";
    //$returned_content = get_data($url);

    private $DataFromUrl;
    private $ExtracUnit;
    private $ParseData;
    private $CatalogData;
    private $HourToSeconds;
    private $TotalRaws;

    public function GetDataFromUrl($url) {
        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $this->DataFromUrl = curl_exec($ch);
        curl_close($ch);
        return $this->DataFromUrl;
    }

    public function CleanString($string) {
        //$string = str_replace(' ', ' ', $string); // Replaces all spaces with hyphens.

        return preg_replace('/[^A-Za-z0-9\-]/', ' ', $string); // Removes special chars.
    }

    function RemoteFileExists($url) {
        $ch = curl_init($url);

        //Establecer un tiempo de espera
        curl_setopt( $ch, CURLOPT_TIMEOUT, 1 );
        curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 1 );

        //establecer NOBODY en true para hacer una solicitud tipo HEAD
        curl_setopt( $ch, CURLOPT_NOBODY, true );
        //Permitir seguir redireccionamientos
        curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
        //recibir la respuesta como string, no output
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

        $data = curl_exec( $ch );

        //Obtener el código de respuesta
        $httpcode = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
        //cerrar conexión
        curl_close($ch);

        //Aceptar solo respuesta 200 (Ok), 301 (redirección permanente) o 302 (redirección temporal)
        $accepted_response = array( 200, 301, 302 );
        if( in_array( $httpcode, $accepted_response ) ) {
            return true;
        } else {
            return false;
        }
    }

    public function ExtractUnit($string, $start, $end) {
        $pos = stripos($string, $start);
        $str = substr($string, $pos);
        $str_two = substr($str, strlen($start));
        $second_pos = stripos($str_two, $end);
        $str_three = substr($str_two, 0, $second_pos);
        $this->ExtracUnit = trim($str_three); // remove whitespaces
        return $this->ExtracUnit;
    }

    public function getBetween($content, $start, $end) {
        $r = explode($start, $content);
        if (isset($r[1])) {
            $r = explode($end, $r[1]);
            return $r[0];
        } else {
            return '';
        }
    }

    public function ReplaceStrings($String) {
        $Search = array('[root@AMINET]#', 'exit', '', '[0m', '[0;0m', '[1;36m', 'ls');
        $Replace = array('', '', '', '', '', '', '');

        $ReplacedString = str_replace($Search, $Replace, $String);

        return $ReplacedString;
    }

    public function ParseData($dataUrl) {

        /* Elimina las etiquetas html */
        $removedtags = strip_tags($dataUrl);

        /* Busca y reemplaza/elimina las palabras que vienen con el contenido */
        $search = array('Index of /', 'Name', 'Size', 'Modified', 'Parent directory', '[DIRECTORY]', 'th', '{text-align:', 'left;}', '-');
        $replace = array('', '', '', '', '', '', '', '', '', '');

        $replacedstring = str_replace($search, $replace, $removedtags);

        /* Busca la ultima posicion de Trash, para posteriormente eliminar el resto del texto */
        $lastTrash = strrpos($replacedstring, "MvLayer/"); // OR /Trash

        /* Elimina el texto posterior a la posicion de Trash */
        $substring = substr($replacedstring, 0, $lastTrash);

        /* Reemplaza los espacios con / */
        $replacedspace = str_ireplace(" ", "/", $substring);

        /* Elimina las dobles // que se generan al reemplazar los espacios en blanco */
        $replacedoubleslash = str_replace('//', "", $replacedspace);

        /* Reemplaza los espacios dobles por / */
        $listassets = preg_replace('!\s+!', '/', $replacedoubleslash);

        /* Genera un arrar apartir del string final */
        $ArrayAsset = explode('/', $listassets);

        /* Elimina el primer y ultimo array */
        $newArray = array_slice($ArrayAsset, 1, -1);

        /* Separa la lista de array de 3 en 3 */
        $this->ParseData = array_chunk($newArray, 3);

        return $this->ParseData;
    }

    public function ParseVad($DataUrl, $AssetZeros) {

        /* Elimina las etiquetas html */
        $removedtags = strip_tags($DataUrl);

        /* Busca y reemplaza/elimina las palabras que vienen con el contenido */
        $search = array('Index of /', '/meta/', 'Size', 'Modified', 'Parent directory', '[DIRECTORY]', 'th', '{text-align:', 'left;}', '-', $AssetZeros);
        $replace = array('', '', '', '', '', '', '', '', '', '', '');

        $this->ParseData = str_replace($search, $replace, $removedtags);

//        /* Busca la ultima posicion de Trash, para posteriormente eliminar el resto del texto */
//        $lastTrash = strrpos($replacedstring, "MvLayer/"); // OR /Trash
//
//        /* Elimina el texto posterior a la posicion de Trash */
//        $substring = substr($replacedstring, 0, $lastTrash);
//
//        /* Reemplaza los espacios con / */
//        $replacedspace = str_ireplace(" ", "/", $substring);
//
//        /* Elimina las dobles // que se generan al reemplazar los espacios en blanco */
//        $replacedoubleslash = str_replace('//', "", $replacedspace);
//
//        /* Reemplaza los espacios dobles por / */
//        $listassets = preg_replace('!\s+!', '/', $replacedoubleslash);
//
//        /* Genera un arrar apartir del string final */
//        $ArrayAsset = explode('/', $listassets);
//
//        /* Elimina el primer y ultimo array */
//        $newArray = array_slice($ArrayAsset, 1, -1);
//
//        /* Separa la lista de array de 3 en 3 */
//        $this->ParseData = array_chunk($newArray, 3);

        return $this->ParseData;
    }

    public function ParseSchedules($url) {

        $html = file_get_contents($url);
        $count = preg_match_all('/<a href="([^"]+)">[^<]*<\/a>/i', $html, $files);
        $urlsarray = array();
        for ($i = 0; $i < $count; ++$i) {
            array_push($urlsarray, $files[1][$i]);
        }

        unset($urlsarray[0], $urlsarray[1], $urlsarray[2], $urlsarray[3]);

        return $urlsarray;
    }

    public function ParseDataRaws($RawArray, $AssetZerosId) {

        /* Elimina las etiquetas html */
        $removedtags = strip_tags($RawArray);
        /* Busca y reemplaza/elimina las palabras que vienen con el contenido */

        $search = array('Index of /', $AssetZerosId . '/raw/', 'Name', 'Size', 'Modified', 'Parent directory', '[DIRECTORY]', 'th', '{text-align:', 'left;}', '-');
        $replace = array('', '', '', '', '', '', '', '', '', '', '', '');

        $replacedstring = str_replace($search, $replace, $removedtags);

        $explodearray = explode("raw.", $replacedstring);
        unset($explodearray[0]);
        unset($explodearray[1]);

        $CleanArray = array_values($explodearray);

        //$ChunkedArray = array_chunk($CleanArray, 10);

        $TotalRaws = count($CleanArray);

        $this->TotalRaws = $TotalRaws;
        return $this->TotalRaws;
    }

    public function CatalogData($name_extract) {
        $name_pos_src = strpos($name_extract, ":");
        $name_port = substr($name_extract, $name_pos_src);
        $this->CatalogData = substr($name_port, "5");

        return $this->CatalogData;
    }

    public function HourToSeconds($duracion) {
        /* Separacion de la variable DURACION para despueps convertir las horas y los minutos a segundos */
        $duracion_hora = substr($duracion, 0, 2);
        $duracion_min = substr($duracion, -2, 2);
        $this->HourToSeconds = $duracion_hora * 3600 + $duracion_min * 60;

        return $this->HourToSeconds;
    }

    function SubstractHours($hora_inicial, $hora_fin) {
        $horai = substr($hora_inicial, 0, 2);
        $mini = substr($hora_inicial, -2, 2);

        $horaf = substr($hora_fin, 0, 2);
        $minf = substr($hora_fin, -2, 2);

        $ini = (($horai * 60) * 60) + ($mini * 60);

        $fin = (($horaf * 60) * 60) + ($minf * 60);

        $dif =  $fin - $ini ;

        $difh = floor($dif / 3600);
        $difm = floor(($dif - ($difh * 3600)) / 60);

        return date("H:i", mktime($difh, $difm));
    }

    function SubstractHour($hora_inicial) {
        $horai = substr($hora_inicial, 0, 2);
        $mini = substr($hora_inicial, -2, 2);

        $ini = (($horai * 60) * 60) + ($mini * 60);


        $dif =  $ini - 3600;

        $difh = floor($dif / 3600);
        $difm = floor(($dif - ($difh * 3600)) / 60);

        return date("H:i", mktime($difh, $difm));
    }

    function SumHours($hora_inicial, $hora_fin) {

        $horai = substr($hora_inicial, 0, 2);

        $mini = substr($hora_inicial, -2, 2);

        $horaf = substr($hora_fin, 0, 2);

        $minf = substr($hora_fin, -2, 2);


        $ini = ((($horai * 60) * 60) + ($mini * 60));

        $fin = ((($horaf * 60) * 60) + ($minf * 60));

        $dif = $fin + $ini;

        $difh = floor($dif / 3600);

        $difm = floor(($dif - ($difh * 3600)) / 60);


        return date("Hi", mktime($difh, $difm));
    }

    /*     * ********************************************************************************
     * CAMBIAR CLASE A ORIENTADO A OBJETOS PARA PODER HEREDAR FUNCIONES Y EVITAR CODIGO
     * Miercoles 15 de Marzo 2017
     * ******************************************************************************** */

    function duracion($duracionT, $hora_inicio, $offset, $fecha) {
        date_default_timezone_set("America/Mazatlan");
        $hoy = date('Ymd');

        if ($fecha == $hoy && $hora_inicio < $offset) {
            $horai = substr($hora_inicio, 0, 2);
            $mini = substr($hora_inicio, -2, 2);
            $horaf = substr($offset, 0, 2);
            $minf = substr($offset, -2, 2);
            $ini = ((($horai * 60) * 60) + ($mini * 60));
            $fin = ((($horaf * 60) * 60) + ($minf * 60));
            $dif = $fin - $ini;
            $difh = floor($dif / 3600);
            $difm = floor(($dif - ($difh * 3600)) / 60);
            $diferenciaB = date("Hi", mktime($difh, $difm));

            $horaiA = substr($diferenciaB, 0, 2);
            $miniA = substr($diferenciaB, -2, 2);
            $horafA = substr($duracionT, 0, 2);
            $minfA = substr($duracionT, -2, 2);
            $iniA = ((($horaiA * 60) * 60) + ($miniA * 60));
            $finA = ((($horafA * 60) * 60) + ($minfA * 60));
            $difA = $finA - $iniA;
            $difhA = floor($difA / 3600);
            $difmA = floor(($difA - ($difhA * 3600)) / 60);
            $duracion = date("Hi", mktime($difhA, $difmA));
        } else {
            $duracion = $duracionT;
        }
        $duracionHoras = substr($duracion, 0, 2);
        $duracionHora = ltrim($duracionHoras, '0');
        $duracionMinutos = substr($duracion, -2, 2);
        $durRed = ($duracionMinutos / 60);
        $sinZeroP = ltrim($durRed, '0');
        $duracionMin = substr($sinZeroP, 0, 4);
        return($duracionHora . $duracionMin);
    }


    function GetDuration($duracion){
        $duracionHoras = substr($duracion, 0, 2);
        $duracionHora = ltrim($duracionHoras, '0');
        $duracionMinutos = substr($duracion, -2, 2);
        $durRed = ($duracionMinutos / 60);
        $sinZeroP = ltrim($durRed, '0');
        $duracionMin = substr($sinZeroP, 0, 4);
        return($duracionHora . $duracionMin);
    }

    function MinutesDuration($DurationFormat){
        $Hours = substr($DurationFormat, 0, 2);
        $Minutes = substr($DurationFormat, -2, 2);

        $HourToMin = $Hours * 60;

        $MinutesDuration = $HourToMin + $Minutes;

        return $MinutesDuration;
    }
    function utf8ize($d) {
        if (is_array($d)) {
            foreach ($d as $k => $v) {
                $d[$k] = utf8ize($v);
            }
        } else if (is_string($d)) {
            return utf8_encode($d);
        }
        return $d;
    }

    function HoraZonaInicio($hora_tribune, $offset_zona, $fecha, $fecha2) {
        date_default_timezone_set("America/Mazatlan");
        //$hoy = date('Ymd');
        $hoy = $fecha2;

        if ($fecha !== $hoy) {
            $horai = substr($hora_tribune, 0, 2);
            $min = substr($hora_tribune, -2, 2);
            $ini = (($horai * 60) * 60);
            $fin = ((($offset_zona) * 60) * 60);
            $dif = $ini + $fin;
            $difh = floor($dif / 3600);
            if ($difh == 00) {
                $hora = 24;
            } else {
                $hora = date("H", mktime($difh));
            }

            return ($hora . ":" . $min);
        } else {
            $horai = substr($hora_tribune, 0, 2);
            $min = substr($hora_tribune, -2, 2);
            $ini = (($horai * 60) * 60);
            $fin = ((($offset_zona) * 60) * 60);
            $dif = $ini + $fin;
            $difh = floor($dif / 3600);
            $hora = date("H", mktime($difh));

            if ($hora > 17) {
                return ("00:00");
            } else {
                return ($hora . ":" . $min);
            }
        }
    }

    function HoraZonaFinal($hora_tribune, $offset_zona) {
        $horai = substr($hora_tribune, 0, 2);
        $min = substr($hora_tribune, -2, 2);
        $ini = (($horai * 60) * 60);
        $fin = ((($offset_zona) * 60) * 60);
        $dif = $ini + $fin;
        $difh = floor($dif / 3600);
        $hora = date("H", mktime($difh));
        return ($hora . ":" . $min);
    }

    function HoraMin($hora) {
        $inicioValores = explode(":", $hora);
        $inicioMinutos = $inicioValores[0] * 60 + $inicioValores[1];
        return $inicioMinutos;
    }

    function GetFreePercentage($Total, $Number) {
        $TotalPercentage = $Number * 100;
        $Percentage = $TotalPercentage / $Total;

        $RoundPercentage = round($Percentage);
        return $RoundPercentage;
    }

    function GetUsedPercentage($Total, $Number) {
        $NumberUsed = $Total - $Number;
        $TotalPercentage = $NumberUsed * 100;
        $Percentage = $TotalPercentage / $Total;

        $RoundPercentage = number_format($Percentage, 2);
        return $RoundPercentage;
    }

    function ConversorSegundos($tiempo_en_segundos) {
        $horas = floor($tiempo_en_segundos / 3600);
        $minutos = floor(($tiempo_en_segundos - ($horas * 3600)) / 60);
        //$segundos = $tiempo_en_segundos - ($horas * 3600) - ($minutos * 60);
        //str_pad($minutos,2,".",STR_PAD_LEFT);
        return $horas . ':' . str_pad($minutos, 2, "0", STR_PAD_LEFT);
    }

    function Clean($string) {
        return preg_replace('/[^A-Za-z0-9\-]/', ' ', $string); // Removes special chars.
    }

    function CompararHoras($Hora1, $Hora2){
        $HH1 = substr($Hora1, 0, 2);
        $MM1 = substr($Hora1, -2);

        $HH2 = substr($Hora2, 0, 2);
        $MM2 = substr($Hora2, -2);

        if($HH1 < $HH2 || ($HH1 == $HH2 && $MM1 < $MM2)){
            $Comparador = 'menor';
        }
        else if($HH1 > $HH2 || ($HH1 == $HH2 && $MM1 > $MM2)){
            $Comparador = 'mayor';
        }
        else {
            $Comparador = 'igual';
        }
        return $Comparador;
    }

    function MultidimensionalUnique($src){
        $output = array_map("unserialize",
            array_unique(array_map("serialize", $src)));
        return $output;
    }

    function GetDurationHours($hora_inicial, $hora_fin) {

        $horai = substr($hora_inicial, 0, 2);

        $mini = substr($hora_inicial, -2, 2);

        $horaf = substr($hora_fin, 0, 2);

        $minf = substr($hora_fin, -2, 2);


        $ini = ((($horai * 60) * 60) + ($mini * 60));

        $fin = ((($horaf * 60) * 60) + ($minf * 60));

        $dif = $fin - $ini;

        $difh = abs($dif) / 3600;

        $dur = $difh * 60;

        return $dur;

    }
}