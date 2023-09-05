<?php

$GetJson    = !empty($_POST['GetJson']) ? $_POST['GetJson'] : false;


$Libraries  = array();
$JsonLibraries = array();




if($GetJson == true){
    require_once 'Database.php';
    require_once '../DataAccess/Config.php';
    $ConfigData  = new Config('system','Libraries');
    $Client = $ConfigData->getConfigByName('Identifier').'/';
    $EpgLogo = $ConfigData->getConfigByName('EpgLogo');
    $JsonLibraries['EpgLogo'] = '/BBINCO/TV/Media/Logos/'.$Client.$EpgLogo;
}

$ServerIp = !empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '';
    
    if(empty($ServerIp)){
        $ServerIp = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : '';
    }

$JsonLibraries['ServerRoot']        = 'http://'.$ServerIp.'/';
$JsonLibraries['ServerSource']      = 'http://'.$ServerIp.'/BBINCO/TV/';
$JsonLibraries['MediaSource']       = 'http://'.$ServerIp.'/BBINCO/';
$JsonLibraries['MultimediaSource']  = 'http://'.$ServerIp.'/Multimedia/';
$JsonLibraries['MoviesSource']      = 'http://'.$ServerIp.'/vod/mvs/';
$JsonLibraries['SeriesSource']      = 'http://'.$ServerIp.'/vod/srs/';

$ServerSource = 'http://'.$ServerIp.'/BBINCO/TV/';


/* Views */
$Libraries['LayoutsPhpPath']    = 'Views/Layouts/';
$Libraries['LayoutsPath']       = $ServerSource.'Views/Layouts/';
$Libraries['LibrariesPath']     = $ServerSource.'Views/Libraries/';
$Libraries['StylesPath']        = $ServerSource.'Views/Styles/';
$Libraries['VendorsPath']       = $ServerSource.'Views/Vendors/';
$Libraries['ScriptsPath']       = $ServerSource.'Views/Scripts/';

//$Libraries['LayoutsPath']       = './Views/Layouts/';
//$Libraries['LayoutsPhpPath']    = 'Views/Layouts/';
//$Libraries['LibrariesPath']     = './Views/Libraries/';
//$Libraries['StylesPath']        = './Views/Styles/';
//$Libraries['VendorsPath']       = './Views/Vendors/';
//$Libraries['ScriptsPath']       = './Views/Scripts/';

$Libraries['TvScripts']    = $Libraries['LayoutsPath'].'Tv/Scripts/';
$Libraries['TvStyles']     = $Libraries['LayoutsPath'].'Tv/Styles/';
$Libraries['TvTemplates']  = $Libraries['LayoutsPhpPath'].'Tv/Templates/';

$Libraries['MenuScripts']    = $Libraries['LayoutsPath'].'Menu/Scripts/';
$Libraries['MenuStyles']     = $Libraries['LayoutsPath'].'Menu/Styles/';
$Libraries['MenuTemplates']  = $Libraries['LayoutsPhpPath'].'Menu/Templates/';

$Libraries['ContentScripts']    = $Libraries['LayoutsPath'].'Contents/Scripts/';
$Libraries['ContentStyles']     = $Libraries['LayoutsPath'].'Contents/Styles/';
$Libraries['ContentTemplates']  = $Libraries['LayoutsPhpPath'].'Contents/Templates/';

/* Core */
$Libraries['ModelsPath']        = 'Core/Models/';
$Libraries['ControllersPath']   = 'Core/Controllers/';

/* Epg */
$Libraries['EpgFilesPath']      = '/var/www/html/mnt/nv/epg/';
/**/
$Libraries['EpgDaysPath']       = $Libraries['ControllersPath'].'Epg/'.$Client;
$JsonLibraries['EpgDaysPath']   = $Libraries['ControllersPath'].'Epg/'.$Client;
/* Imagenes */
    $Libraries['LogosPath']         = '../Media/Logos/'.$Client;
    $Libraries['LogoPath']          = $JsonLibraries['MediaSource'].'Media/Logos/'.$Client;
    $Libraries['ChannelsPath']      = '../Media/Channels/'.$Client;
    $JsonLibraries['ChannelsPath']  = $JsonLibraries['MediaSource'].'Media/Channels/'.$Client;
    $JsonLibraries['MenuPath']      = $JsonLibraries['MediaSource'].'Media/Menu/'.$Client;
    
/* Temas */
     $Libraries['ThemesPath']      = $Libraries['StylesPath'].'Themes/';
    
    /* CSS*/
    $Libraries['GeneralStyle']     = $Libraries['StylesPath'].'General.css';
    $Libraries['FontAwesome']      = $Libraries['StylesPath'].'FontAwesome/css/all.css';

    /* Librerias Javascript */
    $Libraries['JqueryMin']         = $Libraries['LibrariesPath'].'jquery-1.12.3.min.js';
    $Libraries['Jquery']            = $Libraries['LibrariesPath'].'jquery-3.2.0.js';
    $Libraries['Skycons']           = $Libraries['LibrariesPath'].'skycons.min.js';
    $Libraries['Moment']            = $Libraries['LibrariesPath'].'moment.min.js';
    $Libraries['Hcap']              = $Libraries['LibrariesPath'].'hcap.js';
    
    /* Javascripts generales */
    $Libraries['General']           = $Libraries['ScriptsPath'].'General.js';
    $Libraries['RemoteControl']     = $Libraries['ScriptsPath'].'Control.js';
    $Libraries['Commands']          = $Libraries['ScriptsPath'].$Client.'Commands.js';
    $Libraries['Settings']          = $Libraries['ScriptsPath'].'Settings.js';
    $Libraries['Tv']                = $Libraries['ScriptsPath'].'Tv.js';
    $Libraries['TimeScript']        = $Libraries['ScriptsPath'].'Time.js';
    $Libraries['ClockScript']       = $Libraries['ScriptsPath'].'Clock.js';


    $Libraries['AppControl']     = $Libraries['ScriptsPath'].'AppControl.js';
    
    /* Javascripts por marca */
    $Libraries['Keys']              = '/Keys.js';
    $Libraries['Player']            = '/Player.js';
    
    /**/
    $Libraries['Recorder']          = 'Recorder';
    $Libraries['Events']            = '/HandleEvents.js';
    $Libraries['Void']              = $Libraries['VendorsPath'].'Void.js';
    
    /* Models */
    $Libraries['Time']              = $Libraries['ModelsPath'].'Time.php';

    /* Controladores*/
    $Libraries['Index']             = $Libraries['ControllersPath'].'Index.php';

    /* Imprime JSON en caso de ser consultado desde AJAX */
    if($GetJson == true){
        echo json_encode($JsonLibraries);
    }


//$GetJson    = !empty($_POST['GetJson']) ? $_POST['GetJson'] : false;
//
//
//$Libraries  = array();
//$JsonLibraries = array();
//
//if($GetJson == true){
//
//    require_once 'Database.php';
//    require_once '../DataAccess/Config.php';
//    $ConfigData  = new Config('system','Libraries');
//    $Client = $ConfigData->getConfigByName('Identifier').'/';
//    $EpgLogo = $ConfigData->getConfigByName('EpgLogo');
//
//    $JsonLibraries['EpgLogo'] = '/BBINCO/TV/Media/Logos/'.$Client.$EpgLogo;
//}
//
//$ServerIp = !empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '';
//
//if(empty($ServerIp)){
//    $ServerIp = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : '';
//}
//
//$JsonLibraries['ServerSource']      = 'http://'.$ServerIp.'/BBINCO/TV/';
//$JsonLibraries['MultimediaSource']  = 'http://'.$ServerIp.'/Multimedia/';
//$JsonLibraries['MoviesSource']      = 'http://'.$ServerIp.'/vod/mvs/';
//$JsonLibraries['SeriesSource']      = 'http://'.$ServerIp.'/vod/srs/';
//
///* Views */
//$Libraries['LayoutsPath']       = './Views/Layouts/';
//$Libraries['LayoutsPhpPath']    = 'Views/Layouts/';
//$Libraries['LibrariesPath']     = './Views/Libraries/';
//$Libraries['StylesPath']        = './Views/Styles/';
//$Libraries['VendorsPath']       = './Views/Vendors/';
//$Libraries['ScriptsPath']       = './Views/Scripts/';
//
//$Libraries['TvScripts']    = $Libraries['LayoutsPath'].'Tv/Scripts/';
//$Libraries['TvStyles']     = $Libraries['LayoutsPath'].'Tv/Styles/';
//$Libraries['TvTemplates']  = $Libraries['LayoutsPhpPath'].'Tv/Templates/';
//
//$Libraries['MenuScripts']    = $Libraries['LayoutsPath'].'Menu/Scripts/';
//$Libraries['MenuStyles']     = $Libraries['LayoutsPath'].'Menu/Styles/';
//$Libraries['MenuTemplates']  = $Libraries['LayoutsPhpPath'].'Menu/Templates/';
//
//$Libraries['ContentScripts']    = $Libraries['LayoutsPath'].'Contents/Scripts/';
//$Libraries['ContentStyles']     = $Libraries['LayoutsPath'].'Contents/Styles/';
//$Libraries['ContentTemplates']  = $Libraries['LayoutsPhpPath'].'Contents/Templates/';
//
///* Core */
//$Libraries['ModelsPath']        = 'Core/Models/';
//$Libraries['ControllersPath']   = 'Core/Controllers/';
//
///* Epg */
//$Libraries['EpgFilesPath']      = '/var/www/html/mnt/nv/epg/';
///**/
//$Libraries['EpgDaysPath']       = $Libraries['ControllersPath'].'Epg/'.$Client;
//$JsonLibraries['EpgDaysPath']   = $Libraries['ControllersPath'].'Epg/'.$Client;
///* Imagenes */
//$Libraries['LogosPath']         = './Media/Logos/'.$Client;
//$Libraries['ChannelsPath']      = './Media/Channels/'.$Client;
//$JsonLibraries['ChannelsPath']  = './Media/Channels/'.$Client;
//$JsonLibraries['MenuPath']      = './Media/Menu/'.$Client;
//
///* Temas */
//$Libraries['ThemesPath']      = $Libraries['StylesPath'].'Themes/';
//
///* CSS*/
//$Libraries['GeneralStyle']     = $Libraries['StylesPath'].'General.css';
//$Libraries['FontAwesome']      = $Libraries['StylesPath'].'FontAwesome/css/all.css';
//
///* Librerias Javascript */
//$Libraries['JqueryMin']         = $Libraries['LibrariesPath'].'jquery-1.12.3.min.js';
//$Libraries['Jquery']            = $Libraries['LibrariesPath'].'jquery-3.2.0.js';
//$Libraries['Skycons']           = $Libraries['LibrariesPath'].'skycons.min.js';
//$Libraries['Moment']            = $Libraries['LibrariesPath'].'moment.min.js';
//$Libraries['Hcap']              = $Libraries['LibrariesPath'].'hcap.js';
//
///* Javascripts generales */
//$Libraries['General']           = $Libraries['ScriptsPath'].'General.js';
//$Libraries['RemoteControl']     = $Libraries['ScriptsPath'].'Control.js';
//$Libraries['Commands']          = $Libraries['ScriptsPath'].$Client.'Commands.js';
//$Libraries['Settings']          = $Libraries['ScriptsPath'].'Settings.js';
//$Libraries['Tv']                = $Libraries['ScriptsPath'].'Tv.js';
//$Libraries['TimeScript']        = $Libraries['ScriptsPath'].'Time.js';
//
///* Javascripts por marca */
//$Libraries['Keys']              = '/Keys.js';
//$Libraries['Player']            = '/Player.js';
//
///**/
//$Libraries['Recorder']          = 'Recorder';
//$Libraries['Events']            = '/HandleEvents.js';
//$Libraries['Void']              = $Libraries['VendorsPath'].'Void.js';
//
///* Models */
//$Libraries['Time']              = $Libraries['ModelsPath'].'Time.php';
//
///* Controladores*/
//$Libraries['Index']             = $Libraries['ControllersPath'].'Index.php';
//
///* Imprime JSON en caso de ser consultado desde AJAX */
//if($GetJson == true){
//    echo json_encode($JsonLibraries);
//}
