<?php
    require_once './../Models/Database.php';
    require_once './../Models/Utilities.php';
    require_once './../DataAccess/Config.php';
    require_once './../DataAccess/AnaliticsTrends.php';

     $Option        = !empty($_POST['Option']) ? $_POST['Option'] : 'getLocationsTimeByDate';
     $Year          = !empty($_POST['Year']) ? $_POST['Year'] : '2021';
     $Month         = !empty($_POST['Month']) ? $_POST['Month'] : '3';
     $startDate     = !empty($_POST['startDate']) ? $_POST['startDate'] : '2020-01-01';
     $endDate       = !empty($_POST['endDate']) ? $_POST['endDate'] : '2021-10-01';



    $AnaliticsTrends = new AnaliticsTrends($DirectoryLog);

switch ($Option) {
    //ChannelsTime
    case 'getChannelsTimeByYear':
        $ArrayChannelList = array();
        $ChannelTime = $AnaliticsTrends->getTimeOfViewChannelsByYear($Year);
        foreach ($ChannelTime as $Channel) {
            array_push($ArrayChannelList, array(
                'CHNAME' => $Channel['Canal'],
                'THRS' => $Channel['horas'],
                'TMTS' => $Channel['minutos'],
                'TSCD' => $Channel['segundos']
            ));
        }
        echo json_encode($ArrayChannelList);
        break;
    case 'getChannelsTimeByYear_Month':
        $ArrayChannelList = array();
        $ChannelTime = $AnaliticsTrends->getTimeOfViewChannelsByMonth($Month, $Year);
        foreach ($ChannelTime as $Channel) {
            array_push($ArrayChannelList, array(
                'CHNAME' => $Channel['Canal'],
                'THRS' => $Channel['horas'],
                'TMTS' => $Channel['minutos'],
                'TSCD' => $Channel['segundos']
            ));
        }
        echo json_encode($ArrayChannelList);
        break;
    case 'getChannelsTimeByDate':
        $ArrayChannelList = array();
        $ChannelTime = $AnaliticsTrends->getTimeOfViewChannelsByDate($startDate, $endDate);
        foreach ($ChannelTime as $Channel) {
            array_push($ArrayChannelList, array(
                'CHNAME' => $Channel['Canal'],
                'THRS' => $Channel['horas'],
                'TMTS' => $Channel['minutos'],
                'TSCD' => $Channel['segundos']
            ));
        }
        echo json_encode($ArrayChannelList);
        break;
    //ChannelsAVG
    case 'getChannelsAVGTimeByYear':
        $ArrayChannelList = array();
        $ChannelTime = $AnaliticsTrends->getAVGOfViewChannelsByYear($Year);
        foreach ($ChannelTime as $Channel) {
            array_push($ArrayChannelList, array(
                'CHNAME' => $Channel['Canal'],
                'AVGHRS' => $Channel['promedio_horas'],
                'AVGMTS' => $Channel['promedio_minutos'],
                'AVGSCD' => $Channel['promedio_segundos']
            ));
        }
        echo json_encode($ArrayChannelList);
        break;
    case 'getChannelsAVGTimeByYear_Month':
        $ArrayChannelList = array();
        $ChannelTime = $AnaliticsTrends->getAVGOfViewChannelsByMonth($Month, $Year);
        foreach ($ChannelTime as $Channel) {
            array_push($ArrayChannelList, array(
                'CHNAME' => $Channel['Canal'],
                'AVGHRS' => $Channel['promedio_horas'],
                'AVGMTS' => $Channel['promedio_minutos'],
                'AVGSCD' => $Channel['promedio_segundos']
            ));
        }
        echo json_encode($ArrayChannelList);
        break;
    case 'getChannelsAVGTimeByDate':
        $ArrayChannelList = array();
        $ChannelTime = $AnaliticsTrends->getAVGOfViewChannelsByDate($startDate, $endDate);
        foreach ($ChannelTime as $Channel) {
            array_push($ArrayChannelList, array(
                'CHNAME' => $Channel['Canal'],
                'AVGHRS' => $Channel['promedio_horas'],
                'AVGMTS' => $Channel['promedio_minutos'],
                'AVGSCD' => $Channel['promedio_segundos']
            ));
        }
        echo json_encode($ArrayChannelList);
        break;
    //LocationsTIME
    case 'getLocationsTimeByYear':
        $ArrayLocationList = array();
        $LocationTime = $AnaliticsTrends->getTimeOfViewLocationsByYear($Year);
        foreach ($LocationTime as $Location) {
            array_push($ArrayLocationList, array(
                'LTNAME' => $Location['Canal'],
                'THRS' => $Location['horas'],
                'TMTS' => $Location['minutos'],
                'TSCD' => $Location['segundos']
            ));
        }
        echo json_encode($ArrayLocationList);
        break;
    case 'getLocationsTimeByYear_Month':
        $ArrayLocationList = array();
        $LocationTime = $AnaliticsTrends->getTimeOfViewLocationsByMonth($Year, $Month);
        foreach ($LocationTime as $Location) {
            array_push($ArrayLocationList, array(
                'LTNAME' => $Location['Canal'],
                'THRS' => $Location['horas'],
                'TMTS' => $Location['minutos'],
                'TSCD' => $Location['segundos']
            ));
        }
        echo json_encode($ArrayLocationList);
        break;
    case 'getLocationsTimeByDate':
        $ArrayLocationList = array();
        $LocationTime = $AnaliticsTrends->getTimeOfViewLocationsByDate($startDate, $endDate);
        foreach ($LocationTime as $Location) {
            array_push($ArrayLocationList, array(
                'LTNAME' => $Location['Canal'],
                'THRS' => $Location['horas'],
                'TMTS' => $Location['minutos'],
                'TSCD' => $Location['segundos']
            ));
        }
        echo json_encode($ArrayLocationList);
        break;
    //LocationsAVG
    case 'getLocationsAVGByYear':
        $ArrayLocationList = array();
        $LocationTime = $AnaliticsTrends->getAVGOfViewLocationsByYear($Year);
        foreach ($LocationTime as $Location) {
            array_push($ArrayLocationList, array(
                'LTNAME' => $Location['Canal'],
                'AVGHRS' => $Location['promedio_horas'],
                'AVGMTS' => $Location['promedio_minutos'],
                'AVGSCD' => $Location['promedio_segundos']
            ));
        }
        echo json_encode($ArrayLocationList);
        break;
    case 'getLocationsAVGByYear_Month':
        $ArrayLocationList = array();
        $LocationTime = $AnaliticsTrends->getAVGOfViewLocationsByMonth($Year, $Month);
        foreach ($LocationTime as $Location) {
            array_push($ArrayLocationList, array(
                'LTNAME' => $Location['Canal'],
                'AVGHRS' => $Location['promedio_horas'],
                'AVGMTS' => $Location['promedio_minutos'],
                'AVGSCD' => $Location['promedio_segundos']
            ));
        }
        echo json_encode($ArrayLocationList);
        break;
    case 'getLocationsAVGTimeByDate':
        $ArrayLocationList = array();
        $LocationTime = $AnaliticsTrends->getAVGOfViewLocationsByDate($startDate, $endDate);
        foreach ($LocationTime as $Location) {
            array_push($ArrayLocationList, array(
                'LTNAME' => $Location['Canal'],
                'AVGHRS' => $Location['promedio_horas'],
                'AVGMTS' => $Location['promedio_minutos'],
                'AVGSCD' => $Location['promedio_segundos']
            ));
        }
        echo json_encode($ArrayLocationList);
        break;
    case 'UPDATEBTN':
        $command = escapeshellcmd('sudo cd /var/www/html/BBINCO/BBINCOTZE/ && git pull https://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@github.com/EmiSalazar/BBINCOTZE.git && git pull https://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@github.com/EmiSalazar/Media.git');
        $output = shell_exec($command);
        break;
}