<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2019
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Modules.php';
    
    $CurrentController = 'ModulesController';
    
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : '';
    $MacAddress = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
    $ProjectId = !empty($_POST['ProjectId']) ? $_POST['ProjectId'] : '1';
    
    $ConfigData   = new Config($MacAddress, $CurrentController);
    $ModulesData = new Modules($MacAddress, $CurrentController);
    
    $Option = 'GetModules';
    $ProjectId = '1';
    switch ($Option){
        case 'GetModules':
            
            $ModulesInfo = $ModulesData->getModulesByProject($ProjectId);
            
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
            
            $Result = $ModulesList;
        break;
    }
    
    echo json_encode($Result);
    
    
    