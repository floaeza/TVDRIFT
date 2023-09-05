<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Modulo para tv
 */
// Mac address y modulo para funcionamiento y debug
$MacAddress     = !empty($_POST['MacAddress']) ? $_POST['MacAddress'] : '';
$CurrentModule  = !empty($_POST['CurrentModule']) ? $_POST['CurrentModule'] : '';
$ModuleId       = !empty($_POST['ModuleId']) ? $_POST['ModuleId'] : '';

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

$ScriptsHeader = array();
$ScriptFooter = array();
$StylesHeader = array();
$Variables = array();
$License= array();

// Compara la vigencia para cargar el template adecuado
if($CurrentTime > $EffectiveTime || $Status === false){
    $Text = 'Verifyng license, contact your property manager';
    array_push($License, array('State' => false, 'Info' => $Text));

} else {
    $Text = 'License active';
    array_push($License, array('State' => true, 'Info' => $Text));
    // Obtiene el template y el vendor para modificar el modulo a su conveniencia

    $ModuleInfo = $ModulesData->getModuleTemplate($ModuleId);

    // Carga las librerias javascript de acuerdo al vendor
    $Vendor = $DeviceData->getVendor($MacAddress);
    $VendorFolder = $Libraries['VendorsPath'].$Vendor;

    /* STYLES HEADER */
    array_push($StylesHeader, $Libraries['GeneralStyle']);
    array_push($StylesHeader, $Libraries['FontAwesome']);

    /* SCRIPTS HEADER */

    array_push($ScriptsHeader, $Libraries['Moment']);
    array_push($ScriptsHeader, $Libraries['General']);
    array_push($ScriptsHeader, $Libraries['Skycons']);
    array_push($ScriptsHeader, $Libraries['Commands']);
    array_push($ScriptsHeader, $Libraries['RemoteControl']);
    //array_push($ScriptsHeader, $Libraries['AppControl']);
    array_push($ScriptsHeader, $VendorFolder.$Libraries['Keys']);

    /* STYLES HEADER > Tema > Template */
    array_push($StylesHeader, $Libraries['ContentStyles'].$ModuleInfo['opcion_template'].'.css');

    array_push($Variables, array('IndexLogo'=>$Libraries['LogoPath'].$ConfigData->getConfigByName('EpgLogo'),
        'Template' =>$Libraries['ContentTemplates'].$ModuleInfo['opcion_template'].'.tpl'
    ));

    /* SCRIPT FOOTER*/
    array_push($ScriptFooter, $Libraries['Settings']);

    array_push($ScriptFooter, $VendorFolder.$Libraries['Events']);

    array_push($ScriptFooter, $VendorFolder.$Libraries['Player']);

    array_push($ScriptFooter, $Libraries['ContentScripts'].$ModuleInfo['opcion_template'].'.js');

    array_push($ScriptFooter, $Libraries['TimeScript']);

}

$response = array('License'=>$License,
    'ScriptsHeader'=>$ScriptsHeader,
    'ScriptsFooter'=>$ScriptFooter,
    'Styles'=>$StylesHeader,
    'Variables'=>$Variables);

echo json_encode($response);
