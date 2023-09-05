<!DOCTYPE html>
<!-- Contiene la cabecera de los modulos-->
<script> 
    var CurrentModule = '[@CurrentModule]',
        ModuleId      = '[@ModuleId]',
        IndexLogo     = '[@IndexLogo]';
</script>
<html>
    <head>
        <meta http-equiv='Content-Type' content='application/vnd.apple.mpegurl'>
        <meta http-equiv='cache-control' content='max-age=0' />
        <meta http-equiv='cache-control' content='no-cache'>
        <meta http-equiv='expires' content='0'>
        <meta http-equiv='expires' content='Tue, 01 Jan 1980 1:00:00 GMT' />
        <meta http-equiv='pragma' content='no-cache'>

        <link rel='icon' href='./Media/General/icon.png'>

        <link rel='stylesheet' href='[@GeneralStyles]' type='text/css'>
        <link rel='stylesheet' href='[@ThemeStyle]' type='text/css'>
        <link rel='stylesheet' href='[@FontAwesome]'>
        
        <link rel='stylesheet' href='[@LayoutStyle]' type='text/css'>

        <script src='[@Jquery]'></script>
        <script src='[@Skycons]'></script>
        <script src='[@Hcap]'></script>
        <script src='[@Moment]'></script>
        
        <script src='[@General]'></script>
        <script src='[@Keys]'></script>
        <script src='[@Commands]'></script>
        <script src='[@RemoteControl]'></script>
        <script src='[@AppControl]'></script>
        <!-- <script src='./Views/Scripts/AppControl.js'></script> -->

    </head>
    <body>
        <div class='GeneralBox'>
            <div id="DebugText"></div> 
            