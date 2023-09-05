<?php
/* 
 * usuario es bbinco 
 * psw Bb1nco*2019 
 * bd es calltelbd
 * tabla  public.”t_TestOpera”. 
 * host es webci-2.caboinformatica.com 
 */
echo "PRUEBA OPERA<BR>";
    $host        = "host = webci-2.caboinformatica.com";
    $port        = "port = 5432";
    $dbname      = "dbname = calltelbd";
    $credentials = "user = bbinco password=Bb1nco*2019";

    $db = pg_connect("$host $port $dbname $credentials");
    
    if(!$db) {
       echo "Error : Unable to open database\n";
    } else {
       echo "Opened database successfully\n";
    }