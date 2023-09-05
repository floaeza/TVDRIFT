// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Infomir
 */

// Variables globales

var PlayingChannel  = false,
    PlayingVod      = true,
    PauseLive       = false;

var WindowMaxWidth  = 0,
    WindowMaxHeight = 0,
    WindowMinWidth  = 0,
    WindowMinHeight = 0;

var player = stbPlayerManager.list[0];
//gSTB.SetTopWin(0);

player.videoWindowMode = 1;
player.aspectConversion = 0;
if(gSTB.GetDeviceModel() !== 'MAG520' && gSTB.GetDeviceModel() !=='MAG524'){
    var player2 = stbPlayerManager.list[1];
    player2.videoWindowMode = 0;
    player2.aspectConversion = 5;    
}

var Swap            = false,
    Playlist        = '',
    IndexPlaylist   = -1;


var idSeconds       = null,
    idPosition      = null,
    RewFor          = null,
    Position        = 0,
    TimeShiftStart  = 0,
    seconds         = 0,
    NewSpeed        = 0,
    isPause         = false;
LengthPlaylist  = 0;

GetWindowFullSize();
GetWindowMinSize();

/* Set the preset window over others.
 * 0 	graphic window
 * 1 	video window   */


gSTB.SetTopWin(0);

var storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
var USB = storageInfo.result || [];
if((gSTB.GetDeviceModel() == 'MAG424' || gSTB.GetDeviceModel() =='MAG524') && (USB.length !== 0)){
    // set folder for saving TimeShift buffer data
    timeShift.SetTimeShiftFolder(USB[0].mountPath+"/records");
    timeShift.SetMaxDuration(7500);
    // set mode which defines what happens after reaching the left boundary of TimeShift buffer in paused mode
    timeShift.SetSlidingMode(true);
}

var Ext = gSTB.StandBy(false);


/* *****************************************************************************
 * Reproductor de canal
 * ****************************************************************************/
function PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition){
    var CheckPort = '';
    
    if((gSTB.GetDeviceModel() == 'MAG424' || gSTB.GetDeviceModel() =='MAG524') && (USB.length !== 0)){
        timeShift.ExitTimeShift();
        //Establece de forma manual la posicion en la que se encuentra el reproductor de video
        if(idPosition !== null){
            clearInterval(idPosition);
            idPosition = null;
            Position = 0;
            idPosition = setInterval(updatePosition,1000);
        }else{
            Position = 0;
            idPosition = setInterval(updatePosition,1000);
        }
        if(idSeconds !== null){
            timeShift.ExitTimeShift();
            clearInterval(idSeconds);
            seconds = 0;
            Position = 0;
            idSeconds = null;
            TvPlay();
            SwapPausePlay = true;
            ResumeVideo()
            if(RewFor !== null){
                clearInterval(RewFor);
                RewFor = null;
            }
        }else{
            Debug("############################################");
            seconds = 0;
            Position = 0;
            idSeconds = null;
            TvPlay();
            ResumeVideo()
            idSeconds = setInterval(updateSeconds,1000);
            if(RewFor !== null){
                clearInterval(RewFor);
                RewFor = null;
            }
        }
        //clearInterval(id);
        //alert(id);
        seconds = 0;
    }
    if(Port){
        CheckPort = ':' + Port;
    }
    // Detiene el proceso de la reproduccion anterior
    Source = Source.replace('igmp','udp');
    Source = (Source).slice(0, 6) + "@" + (Source).slice(6);
    
    // Detiene el proceso de la reproduccion anterior
    StopVideo();
    Debug("Source "+ Source +" Port "+CheckPort);
    //gSTB.Play(Source + CheckPort);
    if((gSTB.GetDeviceModel() == 'MAG424' || gSTB.GetDeviceModel() =='MAG524') && (USB.length !== 0)){
        player.play({
            uri: Source + CheckPort,
            solution: 'extTimeShift',
            program: ProgramIdPosition
        });
    }else{
        player.play({
            uri: Source + CheckPort,
            solution: 'auto',
            program: ProgramIdPosition
        }); 
    }
    

    player.onTracksInfo = function () {
        Debug('Information on audio and video tracks of the media content is received.');
    };

    player.onPlayStart = function () {
        Debug('Video playback has begun.');
    };

    player.onPlayError = function () {
        Debug('Video playback error.');
    };

    // Maximiza el video en caso de que no este en pantalla completa
    MaximizeTV();
    Debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    // Activamos la bandera
    PlayingChannel = true;

    // Si la guia esta cerrada muestra cuadro con informacion del canal en reproduccion
    ShowInfo();

    // Si tiene una fecha ya registrada guarda estadisticas en la BD
    if(StartDateChannel !== ''){
        SetChannelStatistics();
    }

    // Actualiza la fecha inicio de la reproduccion del canal */
    StartDateChannel = new Date();
}

/* *****************************************************************************
 * Reproduce canales digitales
 * ****************************************************************************/

function PlayDigitalChannel(Source){
    // Detiene el proceso de la reproduccion anterior
    StopVideo();

    // Reproduce el video
    player.play({
        uri: Source,
        solution: 'auto'
    });

    player.onPlayStart = function () {
        ImageDigital.src = '';
        ImageDigital.style.display = 'none';
    };

    player.onPlayEnd = function () {
        SetDigitalChannel();
    };

    // Maximiza el video en caso de que no este en pantalla completa
    MaximizeTV();

    // Activamos la bandera
    PlayingChannel = true;
    // Si tiene una fecha ya registrada guarda estadisticas en la BD
    if(StartDateChannel !== ''){
        SetChannelStatistics();
    }
    // Actualiza la fecha inicio de la reproduccion del canal */
    StartDateChannel = new Date();
}

/* *****************************************************************************
 * Reproduce videos
 * ****************************************************************************/

var Playlist = '',
    IndexPlaylist = 0;
    LengthPlaylist = 0;

function PlayVideo(Source){
    
    // Detiene el proceso de la reproduccion anterior
    var conti = false;
    if(PlayingRecording===true){
        conti = true;
    }
    StopVideo();
    if(conti == true){
        PlayingRecording = true;
    }
    //Debug(Source);
    if(CurrentModule === 'Tv'){
        if(Source.indexOf('pvr') !== -1 || Source.indexOf('rtsp') !== -1){
            GetRaws(Source);

            LengthPlaylist = Playlist.length;
            Debug('--------------->>> '+Playlist[IndexPlaylist]);
            //Reproduce el video
            player.play({
                uri: Playlist[IndexPlaylist],
                solution: 'auto'
            });
        }else{
            //alert(Source);
            Debug('--------------->>> '+Source);
            //Reproduce el video
            player.play({
                uri: Source,
                solution: 'auto'
            });
            player.onTracksInfo = function () {
                Debug('Information on audio and video tracks of the media content is received.');
                Debug(JSON.stringify(player.metadataInfo));
            };
        }
    } else {
        //Reproduce el video
        Debug(src);
        player.play({
            uri: src,
            solution: 'auto'
        });
        
    }

    player.onPlayEnd = function () {
        if(CurrentModule === 'Tv' && PlayingRecording === true){
            // segmente de la grabacion termino
            SetPlaylist('forward');
        } else if(CurrentModule === 'Movies'){
            // Termino pelicula
            EndOfMovie();
        }
    };

    // Maximiza el video en caso de que no este en pantalla completa
    MaximizeTV();

}



function GetRaws(Source){
    var RawSource = Source.replace('rtsp','http') + '/raw/';
    RawSource = RawSource.replace('554','8080');

    Debug(RawSource);

    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/GetRaws.php',
        data : {
            SourceRaw: RawSource
        },
        success: function(data){
            Playlist = $.parseJSON(data);

            LengthPlaylist = Playlist.length;

            Debug('---------- LengthPlaylist= '+LengthPlaylist);

            if(LengthPlaylist === 0){
                Debug('---------- Stop record, sorry= '+LengthPlaylist);
                PlayingRecording =  false;

                ShowRecorderMessage('Sorry for the incoveniences, it will be activated at short term.');

                StopVideo();

                HideBarStatus();

                SetChannel('');
            } else {
                LengthPlaylist--;

                DualPlay();
            }
        }
    });
}

function DualPlay(){
    IndexPlaylist++;
    Debug('------------------->>> a=  '+IndexPlaylist);
    Debug('------------------->>> A=  '+Playlist[IndexPlaylist]);

    player.play({
        uri: Playlist[IndexPlaylist],
        solution: 'auto'
    });

    IndexPlaylist++;

    if(IndexPlaylist === LengthPlaylist){
        // do nothing
    } else {
        Debug('------------------->>> b=  '+IndexPlaylist);
        Debug('------------------->>> B= '+Playlist[IndexPlaylist]);
        player2.play({
            uri: Playlist[IndexPlaylist],
            solution: 'auto'
        });
    }


    player.onPlayStart = function () {
        //player.position = 300;
        setTimeout(function(){
            if(Swap === false){
                player2.pause();
                Debug('--------------> player2.pause '+Swap);
            } else {
                player.pause();
                Debug('--------------> player.pause '+Swap);
            }
        }, 3000);
    };

    stbPlayerManager.swap(player2, player);

    player.onPlayEnd = function () {
        if(CurrentModule === 'Tv' && PlayingRecording === true){
            Debug('--------------> player.onPlayEnd '+IndexPlaylist);
            // Grabacion termino

            if(IndexPlaylist === LengthPlaylist){
                OpenRecordPlayOptions();
            } else {
                SwapPlayers();
            }
        }
    };

}

function SwapPlayers(){

//            player2.videoWindowMode = 1;
//            player.videoWindowMode = 2;

    Debug('--------------> SwapPlayers > Swap = '+Swap);
    if(Swap === false){
        Debug('--------------> SwapPlayers > FALSE ');
        player2.resume();
        Debug('--------------> SwapPlayers > player2.resume ');
        stbPlayerManager.swap(player, player2);
        Debug('--------------> SwapPlayers > stbPlayerManager.swap ');
        Swap = true;
        Debug('--------------> SwapPlayers > Swap = '+Swap);


        IndexPlaylist++;
        if(IndexPlaylist < LengthPlaylist){
            player.play({
                uri: Playlist[IndexPlaylist],
                solution: 'auto'
            });
        }
    } else {
        player.resume();
        stbPlayerManager.swap(player2, player);
        Swap = false;

        IndexPlaylist++;
        if(IndexPlaylist < LengthPlaylist){
            player2.play({
                uri: Playlist[IndexPlaylist],
                solution: 'auto'
            });
        }
    }
}


/* *****************************************************************************
 * Obtiene los tamanos maximos y minimos de la pantalla
 * ****************************************************************************/

function GetWindowFullSize(){
//        WindowMaxWidth   = player.viewport['width'];
//        WindowMaxHeight  = player.viewport['height'];
//
//        Debug(WindowMaxWidth);
//        Debug(WindowMaxHeight);
    var display = stbDisplayManager.list[0];

    WindowMaxWidth   = display.width;
    WindowMaxHeight  = display.height;

    Debug(WindowMaxWidth);
    Debug(WindowMaxHeight);
}

function GetWindowFullSize(){
    WindowMaxWidth   = window.screen.width;
    WindowMaxHeight  = window.screen.height;
}

function GetWindowMinSize(){
    WindowMinWidth   = ((window.screen.width)*50)/100;
    WindowMinHeight  = ((window.screen.height)*50)/100;
}

/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/

function MaximizeTV(){
    //gSTB.SetViewport(WindowMaxWidth, WindowMaxHeighc, 0, 0);
    //player.setViewport({x: 0, y: 0, width: WindowMaxWidth, height: WindowMaxHeight});
    //gSTB.SetViewport(3840, 2160, 0, 0);
    //Debug("Maximizar");
    
    
     player.fullscreen = true;
    // if(gSTB.GetDeviceModel() !== 'MAG520' && gSTB.GetDeviceModel() !=='MAG524'){
    //     player2.fullscreen = true;
    // }
    
    
    //Debug(JSON.stringify(player.viewport));
}

/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/

function MinimizeTV(){
    //gSTB.SetViewport(WindowMinWidth, WindowMinHeight, 15, 60);
    //player.setViewport({x: 15, y: 60, width: WindowMinWidth, height: WindowMinHeight});

    //    if(window.screen.width === 1280){
    //        gSTB.SetViewport(WindowMinWidth, WindowMinHeight, 40, 80);
    //    } else {
    //        gSTB.SetViewport(WindowMinWidth, WindowMinHeight, 15, 60);
    //    }

    player.setViewport({x: (20*WindowMaxWidth)/100, y: (8*WindowMaxWidth)/100, width: WindowMinWidth, height: WindowMinHeight});
}

/* *****************************************************************************
 * Reinicia el dispositivo
 * ****************************************************************************/

function RebootDevice(){
    gSTB.ExecAction('reboot');
}

/* *****************************************************************************
 * Funcion para detener la reproduccion de un video, multicast, etc.
 * ****************************************************************************/

function StopVideo(){
    player.stop();
    if(gSTB.GetDeviceModel() !== 'MAG520' && gSTB.GetDeviceModel() !=='MAG524'){
        if(player2.state !== 0){
            player2.stop();
        }
    }
    PlayingRecording = false;
}

function PauseVideo(){
    if((gSTB.GetDeviceModel() == 'MAG424' || gSTB.GetDeviceModel() =='MAG524') && (USB.length !== 0)){
        timeShift.EnterTimeShift();
        TimeShiftStart = Position;
    }
    if(RewFor !== null){
        clearInterval(RewFor);
        RewFor = null;
    }
    storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
    USB = storageInfo.result || [];
    //timeShift.EnterTimeShift();
    player.pause();
}
function updateSeconds(){
    if(seconds-TimeShiftStart<7500){
        seconds += 1;
    }
    //Debug("#################################3       "+seconds);
}
function updatePosition(){
    if(player.state != 3){
        Position += 1;
    }
}



function ResumeVideo(){
    if(RewFor !== null){
        clearInterval(RewFor);
        RewFor = null;
    }
    player.resume();
}

function SpeedVideo(Speed){
    player.speed = parseInt(Speed);
    Debug(player.speed);
    Debug("############3    ID RewFor:"+RewFor + "   E############");
    if(RewFor === null){
        NewSpeed = Speed;
        RewFor = setInterval(updateRewFor,1000);
        //Debug("############3    ID RewFor Es Null:"+RewFor + "   E############");
    }else{
        //Debug("############3    ID RewFor No Es Null:"+RewFor + "   E############");
        clearInterval(RewFor);
        RewFor = null;
        NewSpeed = Speed;
        RewFor = setInterval(updateRewFor,1000);
    }
}
function updateRewFor(){
    //Debug("############3    "+player.position + "   E############");
    var pos = player.position;
    if(PauseLive === true){
        if(parseInt(Position) + (parseInt(NewSpeed)-1) >= parseInt(Position) + (parseInt(seconds) - parseInt(TimeShiftStart))){
            Debug("############3    Se Pasa: "+parseInt(player.position) + "   E############");
            clearInterval(RewFor);
        }else{
            if(NewSpeed<0){
                player.position += (parseInt(NewSpeed)-1);
            }else{
                player.position += parseInt(NewSpeed);
            }
            
            Position = parseInt(Position) + parseInt(NewSpeed);
            Debug("############3    player.position "+parseInt(player.position) + "   E############");
        }
    }else{
        if(parseInt(player.position) + parseInt(NewSpeed) >= player.duration || parseInt(player.position) + parseInt(NewSpeed) <= 0){
            //Debug("############3    Se Pasa: "+parseInt(player.position) + "   E############");
            clearInterval(RewFor);
        }else{
            player.position += parseInt(NewSpeed);
            Position = parseInt(Position) + parseInt(NewSpeed);
            //Debug("############3    player.position "+parseInt(player.position) + "   E############");
        }
    }
}
/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/

function AssetStatus(Duration){
    if(PlayingRecording === true){
        
        PositionAsset = player.position;
        Debug('AssetStatus------------->'+ PositionAsset);
        //PositionAsset = stbPlayer.position;
        DurationAsset = parseInt(Duration,10) * 60;

        PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
        
    }else{ if (PauseLive === true){
        //alert('as');
        DurationAsset = Math.round(seconds);
        
        //DurationAsset = Video.getDuration();
        //DurationAsset = parseInt(Duration,10) * 60;
        Debug('>>>>>> DurationAsset: '+DurationAsset);
        PositionAsset = Math.round(Position);
        Debug('>>>>>> PositionAsset: '+PositionAsset);
        // if(DurationAsset !== 0){
            PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
            if(PercentagePosition > 100){
                PercentagePosition = 100;
            }
            Debug('>>>>>> PercentagePosition: '+PercentagePosition);
            //DurationAsset = DurationAsset * 2;
        // }
        
    }}
}
