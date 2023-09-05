<?php 
/* *****************************************************************************
 * OBJETIVO:
 * PARAMETROS RECIBIDOS:
 * CREADO POR:
 * FECHA:
 * ****************************************************************************/
date_default_timezone_set("America/Mazatlan");
class Database {

// Variables globales para su posterior uso

    public  $con = false;
    public  $result = array();
    private $consulta = "";
    private $numResults = "";
    private $acceptedOnQuery = array("NULL","NOW()");
    
    public  $DirectoryLog = '/var/www/html/logs/database.txt';

// Funcion para conectar la base de datos

    public function connect(){
        //Corrobora si no hay una conexion
        if(!$this->con){

            $CamDir = getcwd();
            chdir ('/var/www/config');
            $config = parse_ini_file("configBBTV.ini");
            chdir($CamDir);

            $this->conexion = new mysqli($config["host"],$config["username"],$config["password"],$config["dbname"]);

            if($this->conexion->connect_errno > 0) {
                array_push($this->result,$this->conexion->connect_error);
                return false;
            }
                else {
                    $this->con = true;
                    mysqli_set_charset($this->conexion, 'utf8');
                    return true;
                }
        }
            else{
                return true;
            }
    }

// Funcion para desconectar de la base de datos
    public function disconnect(){
        // Corrobora que haya una conexion
        if($this->con){
            // Si encuentra una conexion, trata de cerrarla
            if($this->conexion->close()){
                // Se ha cerrado la conexion exitosamente
                $this->con = false;
                return true;
            }
                else {
                    // No ha conexion para cerrar
                    return false; 
                }
        }
    }

// SQL
    public function sql($sql){
        $query = $this->conexion->query($sql);
        $this->consulta = $sql;

            if($query){
                    $this->numResults = $query->num_rows;

                    for($i = 0; $i < $this->numResults; $i++){
                        $r = $query->fetch_array();
                        $key = array_keys($r);

                        for($x = 0; $x < count($key); $x++){
                            if(!is_int($key[$x])){
                                if($query->num_rows >= 1){
                                    $this->result[$i][$key[$x]] = $r[$key[$x]];
                                }
                                    else{
                                        $this->result = null;
                                    }
                            }
                        }
                    }
                return true; //La consulta fue exitosa
            }
                else{
                    array_push($this->result,'database error');
                    $this->setLog('sql');
                        
                    return false;
                }
    }
    
    public function sql1($sql){
        $query = $this->conexion->query($sql);
        if($query){
                 
                    $this->result =  $query;
                    $this->numResults = $query->num_rows;
                    return true; //La consulta fue exitosa
            }
                else{
                    array_push($this->result,'database error');
                    $this->setLog('sql');
                        
                    return false;
                }
    }

// Funcion para SELECT la base de datos
    public function select($tabla, $rows = '*', $join = null, $join2 = null, $join3 = null, $join4 = null, $where = null, $like = null, $groupby = null, $order = null, $limit = null, $offset = null){

        $q = 'SELECT '.$rows.' FROM '.$tabla;

        if($join != null){
            $q .= ' JOIN '.$join;
        }
        if($join2 != null){
            $q .= ' JOIN '.$join2;
        }
        if($join3 != null){
            $q .= ' JOIN '.$join3;
        }
        if($join4 != null){
            $q .= ' JOIN '.$join4;
        }
        if($where != null){
            $q .= ' WHERE '.$where;
        }
        if($like != null){
            $q .= ' LIKE '.$like;
        }
        if($groupby != null){
            $q .= ' GROUP BY '.$groupby;
        }
        if($order != null){
            $q .= ' ORDER BY '.$order;
        }
        if($limit != null){
            $q .= ' LIMIT '.$limit;
        }
        if($offset != null){
            $q .= ' OFFSET '.$offset;
        }
        $this->consulta = $q;

        // Checa si existe la tabla
        if($this->tablaExiste($tabla)){
            $query = $this->conexion->query($q);
		if($query){
                        $this->numResults = $query->num_rows;

                        for($i = 0; $i < $this->numResults; $i++){
                            $r = $query->fetch_array();
                            $key = array_keys($r);

                            for($x = 0; $x < count($key); $x++){

                                if(!is_int($key[$x])){
                                    if($query->num_rows >= 1){
                                        $this->result[$i][$key[$x]] = $r[$key[$x]];
                                    }
                                        else{
                                            $this->result[$i][$key[$x]] = null;
                                        }
                                }
                            }
                        }
                        array_push($this->result);
                    return true; //La consulta fue exitosa
		}
                    else{
                        array_push($this->result,'database error');
                        $this->setLog('select');
                        return false;
                    }
      	}
            else{
                return false; //No existe la tabla
            }
    }
    
// Funcion para SELECT con 6 JOINS la base de datos
    public function selectj($tabla, $rows = '*', $join = null, $join2 = null, $join3 = null, $join4 = null, $join5 = null, $join6 = null,$where = null, $like = null, $groupby = null, $order = null, $limit = null, $offset = null){

        $q = 'SELECT '.$rows.' FROM '.$tabla;

        if($join != null){
            $q .= ' JOIN '.$join;
        }
        if($join2 != null){
            $q .= ' JOIN '.$join2;
        }
        if($join3 != null){
            $q .= ' JOIN '.$join3;
        }
        if($join4 != null){
            $q .= ' JOIN '.$join4;
        }
        if($join5 != null){
            $q .= ' JOIN '.$join5;
        }
        if($join6 != null){
            $q .= ' JOIN '.$join6;
        }
        if($where != null){
            $q .= ' WHERE '.$where;
        }
        if($like != null){
            $q .= ' LIKE '.$like;
        }
        if($groupby != null){
            $q .= ' GROUP BY '.$groupby;
        }
        if($order != null){
            $q .= ' ORDER BY '.$order;
        }
        if($limit != null){
            $q .= ' LIMIT '.$limit;
        }
        if($offset != null){
            $q .= ' OFFSET '.$offset;
        }
        $this->consulta = $q;

        // Checa si existe la tabla
        if($this->tablaExiste($tabla)){
            $query = $this->conexion->query($q);
		if($query){
                        $this->numResults = $query->num_rows;

                        for($i = 0; $i < $this->numResults; $i++){
                            $r = $query->fetch_array();
                            $key = array_keys($r);

                            for($x = 0; $x < count($key); $x++){

                                if(!is_int($key[$x])){
                                    if($query->num_rows >= 1){
                                        $this->result[$i][$key[$x]] = $r[$key[$x]];
                                    }
                                        else{
                                            $this->result[$i][$key[$x]] = null;
                                        }
                                }
                            }
                        }
                    return true; //La consulta fue exitosa
		}
                    else{
                        array_push($this->result,'database error');
                        $this->setLog('selectj');
                        
                        return false;
                    }
      	}
            else{
                return false; //No existe la tabla
            }
    }

        // Funcion para SELECT DISTINCT la base de datos
public function selectd($tabla, $rows = '*', $join = null, $join2 = null, $join3 = null, $join4 = null, $where = null, $like = null, $groupby = null, $order = null, $limit = null, $offset = null){
	    $q = 'SELECT DISTINCT '.$rows.' FROM '.$tabla;

	    if($join != null){
            $q .= ' JOIN '.$join;
        }
        if($join2 != null){
            $q .= ' JOIN '.$join2;
        }
        if($join3 != null){
            $q .= ' JOIN '.$join3;
        }
        if($join4 != null){
            $q .= ' JOIN '.$join4;
        }
        if($where != null){
            $q .= ' WHERE '.$where;
        }
        if($like != null){
            $q .= ' LIKE '.$like;
        }
        if($groupby != null){
            $q .= ' GROUP BY '.$groupby;
        }
        if($order != null){
            $q .= ' ORDER BY '.$order;
        }
        if($limit != null){
            $q .= ' LIMIT '.$limit;
        }
        if($offset != null){
            $q .= ' OFFSET '.$offset;
        }

        $this->consulta = $q;

        // Checa si existe la tabla
        if($this->tablaExiste($tabla)){
            $query = $this->conexion->query($q);
		if($query){
                        $this->numResults = $query->num_rows;

                        for($i = 0; $i < $this->numResults; $i++){
                            $r = $query->fetch_array();
                            $key = array_keys($r);

                            for($x = 0; $x < count($key); $x++){

                                if(!is_int($key[$x])){
                                    if($query->num_rows >= 1){
                                        $this->result[$i][$key[$x]] = $r[$key[$x]];
                                    }
                                        else{
                                            $this->result[$i][$key[$x]] = null;
                                        }
                                }
                            }
                        }
                    return true; //La consulta fue exitosa
		}
                    else{
                        array_push($this->result,'database error');
                        $this->setLog('selectd');
                        
                        return false;
                    }
      	}
            else{
                return false; //No existe la tabla
            }
}

public function selectFromOtherSelect($tabla, $rows = '*', $select1, $select2, $comunID){
    $q = 'SELECT'.$rows.' FROM '.$select1.' t1 '.' INNER JOIN '.$select2.' t2 '.' ON '.'t1.'.$comunID.' = '.'t2.'.$comunID;
    $this->consulta = $q;
    // Checa si existe la tabla
    if($this->tablaExiste($tabla)){
        $query = $this->conexion->query($q);
    if($query){
                    $this->numResults = $query->num_rows;

                    for($i = 0; $i < $this->numResults; $i++){
                        $r = $query->fetch_array();
                        $key = array_keys($r);

                        for($x = 0; $x < count($key); $x++){

                            if(!is_int($key[$x])){
                                if($query->num_rows >= 1){
                                    $this->result[$i][$key[$x]] = $r[$key[$x]];
                                }
                                    else{
                                        $this->result[$i][$key[$x]] = null;
                                    }
                            }
                        }
                    }
                return true; //La consulta fue exitosa
    }
                else{
                    array_push($this->result,'database error');
                    $this->setLog('selectd');
                    
                    return false;
                }
      }
        else{
            return false; //No existe la tabla
        }
}

//Funcion para insertar datos a la tabla
    public function insert($tabla,$parametro=array()){
    	//Confirma que exista la  tabla
    	if($this->tablaExiste($tabla)){
            $sql='INSERT INTO `'.$tabla.'` (`'.implode('`, `',array_keys($parametro)).'`) VALUES ("' .implode('", "', $parametro) . '")';
            $this->consulta = $sql;

            if($ins = $this->conexion->query($sql)){
            	array_push($this->result,$this->conexion->insert_id);
                return true; // Los datos fueron insertados correctamente
            }
                else{
                    array_push($this->result,'database error');
                    $this->setLog('insert');

                    return false;
                }
        }
            else{ return false; // No existe la tabla
            }
    }


//Funcion para eliminar  filas
    public function delete($tabla,$where = null){

    	if($this->tablaExiste($tabla)){
            if($where !== null){
                $delete = 'DELETE FROM '.$tabla.' WHERE '.$where;
            }
            //else{
                //$delete = 'DROP TABLE '.$tabla;
            //}

                if($del = $this->conexion->query($delete)){
                    array_push($this->result,$this->conexion->affected_rows);
                    $this->consulta = $delete;
                    return true;

                    // Se ejecuto correctamente
                }
                    else{
                        array_push($this->result,'database error');
                        $this->setLog('delete');
                        
                        return false; // Error al ejecutar
                    }
        }
            else{
                return false; // No existe la tabla
            }
    }

// Funcion para actualizar una tabla
    public function update($tabla,$parametro=array(),$where){
    	if($this->tablaExiste($tabla)){
            $args=array();
            foreach($parametro as $field=>$value){
                // Separa la columna
                $args[]=$field.'="'.$value.'"';
            }

            $sql='UPDATE '.$tabla.' SET '.implode(',',$args).' WHERE '.$where;

            $this->consulta = $sql;
                if($query = $this->conexion->query($sql)){
                    array_push($this->result,$this->conexion->affected_rows);
                    return true; // La actualizacion fue exitosa
                }

                else{
                    array_push($this->result,'database error');
                    $this->setLog('update');
                        
                    return false; // Fallo al actualizar
                }
        }
            else{return false; }
    }



// Funcion para checar si la tabla existe y usarla en las consultas
    private function tablaExiste($tabla){
        $CamDir = getcwd();
        chdir ('/var/www/config');
        $config = parse_ini_file("configBBTV.ini");
        chdir($CamDir);

        $tablasbd = $this->conexion->query('SHOW TABLES FROM '.$config["dbname"].' LIKE "'.$tabla.'"');

        if($tablasbd){
            if($tablasbd->num_rows == 1){
                return true; //Si existe la tabla

            }
                else{
                    array_push($this->result,$tabla." does not exist in this database");
                    
                    $this->setLog('tabla');
                    return false; // No existe

                }
        }
    }

// Funcion para mostrar los resultados
    public function getResult(){
        $val = $this->result;
        $this->result = array();
        return $val;

    }

//Regresa SQL para debug
    public function getSql(){
        $val = $this->consulta;
        $this->consulta = array();
        return $val;

    }

//Muestra el numero de filas
    public function numRows(){
        $val = $this->numResults;
        $this->numResults = array();
        return $val;

    }
    //
    public function escapeString($data){
        return $this->conexion->real_escape_string($data);

    }
    
    public function setLog($operation){
        // $Row = PHP_EOL . date("l jS \of F Y h:i:s A"). ' = ' . $this->Device . ' ~ '.$this->ClassFile. ' - '.$this->Function.' & '.$operation.' * '.$this->Module.' # '.$this->conexion->error.' |';
        // file_put_contents($this->DirectoryLog, $Row, FILE_APPEND);
    }
}