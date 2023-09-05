<?php
/* Creado por: Fabian Loaeza
 * Fecha: Mayo 2021
 * Tipo: Controlador
 */

    date_default_timezone_set('America/Mazatlan');
    
    require_once '../Models/Database.php';
    require_once '../Models/Libraries.php';
    require_once '../DataAccess/Config.php';
    require_once '../DataAccess/Packages.php';
    require_once '../DataAccess/Channels.php';
    

    $CurrentController = 'EpgFilesController';
    
    $PackagesData = new Packages('system', $CurrentController);
    $ConfigData  = new Config('system', $CurrentController);
    $ChannelsData = new Channels('system', $CurrentController);
    
    $ArrayEPGInfo = array();
    $Option = !empty($_POST['Option']) ? $_POST['Option'] : 'GetChannelsInfo';
    $PackageID = !empty($_POST['PackageID']) ? $_POST['PackageID'] : '6';
    $Station = !empty($_POST['Station']) ? $_POST['Station'] : 'GATO';  

         switch ($Option){
            case 'GetPackages':    
            $PackagesId = $PackagesData->getPackagesId();
                foreach ($PackagesId as $Package):
                    $id_paquete = $Package['id_paquete'];
                    array_push($ArrayEPGInfo, array('IDP' => $Package['id_paquete']));
                endforeach;    
                echo json_encode($ArrayEPGInfo);
            break;
            case 'GetGuideDays':
                $GuideDays = $ConfigData->getConfigByName('GuideDays');
                array_push($ArrayEPGInfo, array('GDY' => $GuideDays));
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetOffsetZone':
                $GuideDays = $ConfigData->getConfigByName('OffsetZone');
                array_push($ArrayEPGInfo, array('OZN' => $GuideDays, 'GATOTIME'));
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetGatoTime':
                $GuideDays = $ConfigData->getConfigByName('GatoTime');
                array_push($ArrayEPGInfo, array('Time' => $GuideDays));
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetLastPackage':
                $GuideDays = $ConfigData->getConfigByName('LastPackage');
                array_push($ArrayEPGInfo, array('Pack' => $GuideDays));
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetIdentifier':
                $GuideDays = $ConfigData->getConfigByName('Identifier');
                array_push($ArrayEPGInfo, array('IDF' => $GuideDays));
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetVersion':
                $GuideDays = $ConfigData->getConfigByName('Version');
                array_push($ArrayEPGInfo, array('VER' => $GuideDays));
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetChannelsInfoBypackage':
                $PreChannalesArray  = $PackagesData->getPackageListById($PackageID);
                foreach ($PreChannalesArray as $PreChannelRow):
                    array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                    'ADIO' => $PreChannelRow['audio'],
                    'PRGM' => $PreChannelRow['programa'],
                    'SRCE' => $PreChannelRow['src'],
                    'QLTY' => $PreChannelRow['id_calidad'],
                    'PORT' => $PreChannelRow['puerto'],
                    'CHNL' => $PreChannelRow['numero_canal'],
                    'STTN' => $PreChannelRow['numero_estacion'],
                    'NAME' => $PreChannelRow['nombre_estacion'],
                    'INDC' => $PreChannelRow['indicativo'],
                    'LOGO' => $PreChannelRow['logo'],
                    'NACH' => $PreChannelRow['nombre_canal'],
                    'IDCH' => $PreChannelRow['id_canal'],
                    'IDSTTN' => $PreChannelRow['id_estacion']
                    ));
                endforeach;
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetModulesBypackage':
                $PreChannalesArray  = $PackagesData->getModulesPackageListById($PackageID);
                foreach ($PreChannalesArray as $PreChannelRow):
                    array_push($ArrayEPGInfo, array('PSCN' => '0',
                    'ADIO' => '0',
                    'PRGM' => null,
                    'SRCE' => $PreChannelRow['url_modulo'],
                    'QLTY' => 'HD',
                    'PORT' => $PreChannelRow['id_modulo'],
                    'CHNL' => $PreChannelRow['numero_canal'],
                    'STTN' => 'CONTENT',
                    'NAME' => $PreChannelRow['nombre_modulo'],
                    'INDC' => $PreChannelRow['descripcion_modulo'],
                    'LOGO' => $PreChannelRow['nombre_icono']                         
                    ));
                endforeach;
                echo json_encode($ArrayEPGInfo);
                break;
            case 'GetChannelsInfoByStation':
                $ChannelsGatoByPackage   = $ChannelsData->getGatoStationsList();
                $ChannelsPassByPackage   = $ChannelsData->getPassStationsList();            
                switch ($Station) {
                    case 'GATO':
                        $cont = 0;
                        foreach ($ChannelsGatoByPackage as $PreChannelRow):
                            array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                            'ADIO' => $PreChannelRow['audio'],
                            'PRGM' => $PreChannelRow['programa'],
                            'SRCE' => $PreChannelRow['src'],
                            'QLTY' => $PreChannelRow['id_calidad'],
                            'PORT' => $PreChannelRow['puerto'],
                            'CHNL' => $PreChannelRow['numero_canal'],
                            'STTN' => $PreChannelRow['numero_estacion'],
                            'NAME' => $PreChannelRow['nombre_estacion'],
                            'INDC' => $PreChannelRow['indicativo'],
                            'LOGO' => $PreChannelRow['logo']
                            ));
                        endforeach;
                        echo json_encode($ArrayEPGInfo);
                        break;
                    case 'PASS':
                        foreach ($ChannelsPassByPackage as $PreChannelRow):
                            array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                            'ADIO' => $PreChannelRow['audio'],
                            'PRGM' => $PreChannelRow['programa'],
                            'SRCE' => $PreChannelRow['src'],
                            'QLTY' => $PreChannelRow['id_calidad'],
                            'PORT' => $PreChannelRow['puerto'],
                            'CHNL' => $PreChannelRow['numero_canal'],
                            'STTN' => $PreChannelRow['numero_estacion'],
                            'NAME' => $PreChannelRow['nombre_estacion'],
                            'INDC' => $PreChannelRow['indicativo'],
                            'LOGO' => $PreChannelRow['logo']
                            ));
                        endforeach;
                        echo json_encode($ArrayEPGInfo);
                        break;
                }
                break;
            case 'GetChannelsInfoTri':
                $ChannelsTribByPackage   = $ChannelsData->getTribStationsList();        
                foreach ($ChannelsTribByPackage as $PreChannelRow):
                    array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                    'ADIO' => $PreChannelRow['audio'],
                    'PRGM' => $PreChannelRow['programa'],
                    'SRCE' => $PreChannelRow['src'],
                    'QLTY' => $PreChannelRow['id_calidad'],
                    'PORT' => $PreChannelRow['puerto'],
                    'CHNL' => $PreChannelRow['numero_canal'],
                    'STTN' => $PreChannelRow['numero_estacion'],
                    'NAME' => $PreChannelRow['nombre_estacion'],
                    'INDC' => $PreChannelRow['indicativo'],
                    'LOGO' => $PreChannelRow['logo'],
                    'NACH' => $PreChannelRow['nombre_canal']
                    ));
                    endforeach;
                echo json_encode($ArrayEPGInfo);
                break;
                break;
            case 'GetChannelsInfoByStationAndPackage':
                $ChannelsGatoByPackage   = $ChannelsData->getGatoChannelsList($PackageID);
                $ChannelsPassByPackage   = $ChannelsData->getPassChannelsList($PackageID);            
                switch ($Station) {
                    case 'GATO':
                        $cont = 0;
                        foreach ($ChannelsGatoByPackage as $PreChannelRow):
                            array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                            'ADIO' => $PreChannelRow['audio'],
                            'PRGM' => $PreChannelRow['programa'],
                            'SRCE' => $PreChannelRow['src'],
                            'QLTY' => $PreChannelRow['id_calidad'],
                            'PORT' => $PreChannelRow['puerto'],
                            'CHNL' => $PreChannelRow['numero_canal'],
                            'STTN' => $PreChannelRow['numero_estacion'],
                            'NAME' => $PreChannelRow['nombre_estacion'],
                            'INDC' => $PreChannelRow['indicativo'],
                            'LOGO' => $PreChannelRow['logo']
                            ));
                        endforeach;
                        echo json_encode($ArrayEPGInfo);
                        break;
                    case 'PASS':
                        foreach ($ChannelsPassByPackage as $PreChannelRow):
                            array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                            'ADIO' => $PreChannelRow['audio'],
                            'PRGM' => $PreChannelRow['programa'],
                            'SRCE' => $PreChannelRow['src'],
                            'QLTY' => $PreChannelRow['id_calidad'],
                            'PORT' => $PreChannelRow['puerto'],
                            'CHNL' => $PreChannelRow['numero_canal'],
                            'STTN' => $PreChannelRow['numero_estacion'],
                            'NAME' => $PreChannelRow['nombre_estacion'],
                            'INDC' => $PreChannelRow['indicativo'],
                            'LOGO' => $PreChannelRow['logo']
                            ));
                        endforeach;
                        echo json_encode($ArrayEPGInfo);
                        break;
                }
                break;
                case 'GetChannelsInfo':
                $ChannelsInfo  = $PackagesData->getPackageList();
                foreach ($ChannelsInfo as $PreChannelRow):
                    array_push($ArrayEPGInfo, array('SRCE' => $PreChannelRow['src'],
                    'QLTY' => $PreChannelRow['id_calidad'],
                    'PORT' => $PreChannelRow['puerto'],
                    'STTN' => $PreChannelRow['numero_estacion'],
                    'NAME' => $PreChannelRow['nombre_estacion'],
                    'INDC' => $PreChannelRow['indicativo'],
                    'LOGO' => $PreChannelRow['logo'],
                    'IDPK' => $PreChannelRow['id_paquete'],
                    'IDCH' => $PreChannelRow['id_canal'],
                    'CHNL' => $PreChannelRow['numero_canal'],
                    ));
                endforeach;
                echo json_encode($ArrayEPGInfo);
                    break;
                case 'GetAllChannels':
                    $ChannelsInfo = $PackagesData->getAllChannelList();
                    foreach ($ChannelsInfo as $PreChannelRow):
                        array_push($ArrayEPGInfo, array('SRCE' => $PreChannelRow['src'],
                        'QLTY' => $PreChannelRow['id_calidad'],
                        'PORT' => $PreChannelRow['puerto'],
                        'STTN' => $PreChannelRow['numero_estacion'],
                        'NAME' => $PreChannelRow['nombre_estacion'],
                        'INDC' => $PreChannelRow['indicativo'],
                        'LOGO' => $PreChannelRow['logo'],
                        'IDCH' => $PreChannelRow['id_canal'],
                        'CHNL' => $PreChannelRow['numero_canal'],
                        ));
                    endforeach;
                    echo json_encode($ArrayEPGInfo);
                    break;
                case 'GetChannelsInfoBypackage2':
                    $PreChannalesArray  = $PackagesData->getPackageListById2($PackageID);
                    foreach ($PreChannalesArray as $PreChannelRow):
                        array_push($ArrayEPGInfo, array('PSCN' => $PreChannelRow['posicion'],
                        'ADIO' => $PreChannelRow['audio'],
                        'PRGM' => $PreChannelRow['programa'],
                        'SRCE' => $PreChannelRow['src'],
                        'QLTY' => $PreChannelRow['id_calidad'],
                        'PORT' => $PreChannelRow['puerto'],
                        'CHNL' => $PreChannelRow['numero_canal'],
                        'STTN' => $PreChannelRow['id_estacion'],
                        'NAME' => $PreChannelRow['nombre_estacion'],
                        'INDC' => $PreChannelRow['indicativo'],
                        'STAT' => $PreChannelRow['canal_activo'],
                        'NACH' => $PreChannelRow['nombre_canal'],
                        'IDCH' => $PreChannelRow['id_canal'],
                        ));
                    endforeach;
                    echo json_encode($ArrayEPGInfo);
                    break;
                case 'GetLastReboot':
                    $GuideDays = $ConfigData->getConfigByName('LastReboot');
                    array_push($ArrayEPGInfo, array('LastReboot' => $GuideDays));
                    echo json_encode($ArrayEPGInfo);
                    break;
        }

         