<?php
/*******************************************************************************
 * Objetivo: Obtiene la hora del servidor para actualizar la hora de las 
 * televisiones LG
 *******************************************************************************/
date_default_timezone_set("America/Mazatlan");
$Today = array('Year' => date("Y"),'Month' => ltrim(date("m"),0), 'Day' => ltrim(date("d"),0), 'Hours' => ltrim(date("H"),0), 'Minutes' => ltrim(date("i"),0), 'Seconds' => ltrim(date("s"),0));
echo json_encode($Today);