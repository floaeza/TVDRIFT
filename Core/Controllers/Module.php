<?php
/* Creado por: Tania Maldonado
 * Fecha: Abril 2019
 * Tipo: Controlador
 */

    require_once './../Models/Database.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/Modules.php';
    require_once './../DataAccess/Locations.php';
    
    $CurrentController = 'ModulesController';
    
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : 'getModuleTV';
    $MacAddress = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
    $ProjectId = !empty($_POST['ProjectId']) ? $_POST['ProjectId'] : '';
    
    $ModuleName = !empty($_POST['ModuleName']) ? $_POST['ModuleName'] : '';
    $ModuleUrl = !empty($_POST['ModuleUrl']) ? $_POST['ModuleUrl'] : 'tv.php';
    
    $ConfigData   = new Config($MacAddress, $CurrentController);
    $ModulesData = new Modules($MacAddress, $CurrentController);
    $LocationsData = new Locations($MacAddress, $CurrentController);

    switch ($Option){
        case 'GetModules':
            
            $ModulesInfo = $ModulesData->getModulesByProject($ProjectId);
            
            $ModulesList = array();
            
            foreach ($ModulesInfo as $Row):
                if($Row['nombre_modulo'] === 'Menu'){
                    array_push($ModulesList,  array('Id' => $Row['id_modulo'],
                                                    'Name' => $Row['descripcion_modulo'],
                                                    'Url' => $Row['url_modulo'],
                                                    'Image' => $Row['nombre_icono'],
                                                    'Description' => ''));
                }
            endforeach;
            
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
        case 'getModuleTV':
            
            $Response = $ModulesData->getModuleTV($ModuleUrl);

            $Result = array('Option' => $Option,
            'ModuleUrl' => $Response[0]['url_modulo'],
            'ModuleId' => $Response[0]['id_modulo'],
            'ModuleName' => $Response[0]['nombre_modulo']);
            
            break;
        case 'GetAllMembers':
            $ModulesInfo = $LocationsData->getMembers();
            $Result = $ModulesInfo;
        break;

        case 'GetMenuInfo':
            $Result = $ModulesData->getMenuByProject('1');
        break;
    }
    
    echo json_encode($Result);
    
    
    