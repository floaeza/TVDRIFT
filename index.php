<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Modulo
 */

    $CurrentModule = 'IndexController';

    require_once 'Core/Models/Database.php';
    require_once 'Core/Models/Templates.php';
    require_once 'Core/DataAccess/Config.php';
    $ConfigData  = new Config('system',$CurrentModule);
    $Client = $ConfigData->getConfigByName('Identifier').'/';
    $Servero = $ConfigData->getConfigByName('ServerIp');

    require_once 'Core/Models/Libraries.php';

    // Opcion a mostrar en pantalla
    $Option = !empty($_GET['Option']) ? $_GET['Option'] : 'CHECK';

    // Carga clases
    $ContentData = new Templates($Libraries['LayoutsPhpPath'].'Initial/Index.tpl');   


    // Asigna el texto a mostrar de acuerdo a la opcion en la que se encuentra
    if($Option == 'LOAD'){
        $Step = 'Loading configuration';
    }
    else if($Option == 'REGISTER') {
        $Step = 'Saving device';
    }
    else if($Option == 'LICENSE') {
        $Step = 'Verifyng license, contact your property manager';
    }
    else {
        $Step = 'Checking device';
    }

    // Asigna la opcion y paso en ejecucion para mostrarlo en pantalla
    $ContentData->set('Option', $Option);
    $ContentData->set('Step', $Step);
    
    // Asigna carpetas y archivos a utilizar
    $ContentData->set('GeneralStyles', $Libraries['GeneralStyle']);
    $ContentData->set('Jquery', $Libraries['Jquery']);
    
    // Librerias LG
    $ContentData->set('Hcap', $Libraries['Hcap']);
    $ContentData->set('Time', $Libraries['Time']);
    
    // Asigna los controladores a usar
    $ContentData->set('Index', $Libraries['Index']);

    $ContentData->set('IndexLogo', $Libraries['LogosPath'].$ConfigData->getConfigByName('IndexLogo'));
    

    // Imprime en HTML todo lo asignado
    echo $ContentData->output();
