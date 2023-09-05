<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Modulo para tv
 */
    // Mac address y modulo para funcionamiento y debug
    $MacAddress     = !empty($_GET['MacAddress']) ? $_GET['MacAddress'] : '';
    $CurrentModule  = !empty($_GET['CurrentModule']) ? $_GET['CurrentModule'] : '';
    $ModuleId       = !empty($_GET['ModuleId']) ? $_GET['ModuleId'] : '';

    require_once 'Core/Models/Database.php';
    require_once 'Core/Models/Templates.php';
    require_once 'Core/DataAccess/Config.php';
    require_once 'Core/DataAccess/Devices.php';
    require_once 'Core/DataAccess/Modules.php';

    $ConfigData  = new Config('system',$CurrentModule);
    $Client = $ConfigData->getConfigByName('Identifier').'/';

    require_once 'Core/Models/Libraries.php';

    // Carga clases
    $DeviceData  = new Devices($MacAddress,$CurrentModule);
    $ModulesData  = new Modules($MacAddress,$CurrentModule);
    
    // Valida la vigencia del sistema
    $EffectiveDate = $ConfigData->getConfigByName('EffectiveDate');
    $Today = date('Y-m-d');
            
    $EffectiveTime = strtotime($EffectiveDate);
    $CurrentTime = strtotime($Today);
    
    // Obtiene el estatus para validar el funcionamiento del dispositivo
    $Status = $DeviceData->getStatus($MacAddress);
    
    // Compara la vigencia para cargar el template adecuado 
    if($CurrentTime > $EffectiveTime || $Status === false){
        $Step = 'Verifyng license, contact your property manager';
        
        $ContentData = new Templates($Libraries['LayoutsPhpPath'].'Initial/License.tpl');   
        $ContentData->set('Step', $Step);
        $ContentData->set('GeneralStyles', $Libraries['GeneralStyle']);
        $ContentData->set('Jquery', $Libraries['Jquery']);
        $ContentData->set('IndexLogo', $Libraries['LogosPath'].$ConfigData->getConfigByName('IndexLogo'));

        // Imprime en HTML todo lo asignado
        echo $ContentData->output();
    } else {

        // Obtiene el template y el vendor para modificar el modulo a su conveniencia
       
        $ModuleInfo = $ModulesData->getModuleTemplate($ModuleId);
        
        
        // Carga las librerias javascript de acuerdo al vendor
        $Vendor = $DeviceData->getVendor($MacAddress);
        $VendorFolder = $Libraries['VendorsPath'].$Vendor;
        
        
        // Obtiene el tema asignado a la television
        $TvTheme = $DeviceData->getTvTheme($MacAddress);

        /** CABECERA **/
        $Header = new Templates($Libraries['LayoutsPhpPath'].'Header.tpl'); 

            // Asigna carpetas y archivos a utilizar
            $Header->set('GeneralStyles', $Libraries['GeneralStyle']);
            $Header->set('Jquery', $Libraries['Jquery']);
            $Header->set('Moment', $Libraries['Moment']);
            $Header->set('FontAwesome', $Libraries['FontAwesome']);

            // Libreria LG
            $Header->set('Hcap', $Libraries['Hcap']);

            // Librerias javascript generales
            $Header->set('General', $Libraries['General']);
            $Header->set('Skycons', $Libraries['Skycons']);
            $Header->set('Commands', $Libraries['Commands']);
            $Header->set('RemoteControl', $Libraries['RemoteControl']);

            $Header->set('AppControl', $Libraries['AppControl']);

            // Librerias javascript por marca
            $Header->set('Keys', $VendorFolder.$Libraries['Keys']);

            // Libreria y estilo del tema asignado al dispositivo
            $Header->set('LayoutStyle', $Libraries['TvStyles'].$ModuleInfo['opcion_template'].'.css' );
            $Header->set('ThemeStyle', $Libraries['ThemesPath'].$ModuleInfo['opcion_template'].'/'.$TvTheme);

            // Aigna variable general del modulo
            $Header->set('CurrentModule', $CurrentModule);
            $Header->set('ModuleId', $ModuleId);
            $Header->set('IndexLogo', $Libraries['LogosPath'].$ConfigData->getConfigByName('IndexLogo'));

        // Imprime en HTML todo lo asignado en la cabecera
        echo $Header->output();

        /** CONTENIDO **/
        $TvContent = new Templates($Libraries['TvTemplates'].$ModuleInfo['opcion_template'].'.tpl'); 

        // Imprime en HTML todo el contenido del template seleccionado
        echo $TvContent->output();   

        /** PIE DE PAGINA **/
      //  if($Vendor === 'Kamai'){
           // $Footer = new Templates($Libraries['LayoutsPhpPath'].'SpecialFooter.tpl');
       // } else {
            $Footer = new Templates($Libraries['LayoutsPhpPath'].'Footer.tpl');
       // }


            // Librerias javascript generales
            $Footer->set('TvScript', $Libraries['Tv']);
            $Footer->set('Time', $Libraries['TimeScript']);
            $Footer->set('Settings', $Libraries['Settings']);
            
            // Libreria para maniputal el template asignado
            $Footer->set('LayoutScript', $Libraries['TvScripts'].$ModuleInfo['opcion_template'].'.js' );
            $Footer->set('LayoutRecorderScript', $Libraries['TvScripts'].$ModuleInfo['opcion_template'].$Libraries['Recorder'].'.js' );

            // Librerias javascript por marca
            $Footer->set('Player', $VendorFolder.$Libraries['Player']);
            $Footer->set('EventsScript', $VendorFolder.$Libraries['Events']);

        // Imprime en HTML todo lo asignado en el pie de pagina
        echo $Footer->output();

        $ConfigData = null;
        $DeviceData = null;
        $ModulesData = null;
        $ContentData = null;
        $Header = null;
        $TvContent = null;
        $Footer = null;
    }