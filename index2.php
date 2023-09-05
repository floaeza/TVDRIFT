<?php

$CurrentController = 'ModulesController';
require_once 'Core/Models/Database.php';
require_once 'Core/DataAccess/Config.php';
require_once 'Core/DataAccess/Modules.php';
$MacAddress = '';
$ConfigData   = new Config($MacAddress, $CurrentController);
$ModulesData = new Modules($MacAddress, $CurrentController);
$ModulesInfo = $ModulesData->getModulesByProject('1');
            
$ModulesList = array();

// foreach ($ModulesInfo as $Row):
//     if($Row['nombre_modulo'] === 'Menu'){
//         array_push($ModulesList,  array('Id' => $Row['id_modulo'],
//                                         'Name' => $Row['descripcion_modulo'],
//                                         'Url' => $Row['url_modulo'],
//                                         'Image' => $Row['nombre_icono'],
//                                         'Description' => ''));
//     }
// endforeach;
foreach ($ModulesInfo as $Row):
    if($Row['nombre_modulo'] !== 'Menu'){
        array_push($ModulesList,  array('Id' => $Row['id_modulo'],
                                        'Name' => $Row['nombre_modulo'],
                                        'Url' => $Row['url_modulo'],
                                        'Image' => $Row['nombre_icono'],
                                        'Description' => $Row['descripcion_modulo']));
    }
endforeach;

    echo "
<style> 
    body{
        margin:0%;
    }
</style>
    ";
    
    echo "<iframe id='Menu' src='index.php' height='100%' width='100%' frameborder=0 marginwidth=0 marginheight=0 onload='this.contentWindow.focus()'></iframe>";
    
    // foreach ($ModulesList as $Row):
    //     echo "<iframe id='".$Row['Name']."' src='' height='0%' width='0%' frameborder=0 marginwidth=0 marginheight=0></iframe>";
    // endforeach;
    
    //echo "<iframe id='tv_frame' src='' height='80%' width='80%' frameborder=0 marginwidth=0 marginheight=0 onload='this.contentWindow.focus()'></iframe>";
    
    //echo "<frameset>";
    //echo "<frame name='main' src='index.php'>";
    //echo "</frameset>";

?>