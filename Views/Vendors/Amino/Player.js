// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Amino
 */
    // Variables globales
    var PlayingChannel      = false,
        PlayingVod          = false,
        PlayDigita          = false,
        PauseLive           = false,
        PIDS                = [],
        numberOfLanguages   = 0,
        fx =0;
        
    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0;

        GetWindowFullSize();
        GetWindowMinSize();


    var windowTV        = VideoDisplay.GetVideoWindow();
        
/* *****************************************************************************
 * Reproductor de canal
 * ****************************************************************************/
    
    function PlayChannel(Source, Port, ProgramIdChannnel, ProgramIdPosition, AudioPid){
        
        var CheckPort = '',
            CheckProgram = '';
        
            if(Port){
                CheckPort = ':' + Port;
            }

Debug('########################### Channelinfo: '+ProgramIdChannnel);

            if(ProgramIdChannnel){
            //  CheckProgram = ';Progid='+ProgramIdChannnel+';audiopid='+AudioPid;
	     //	CheckProgram = ';Progid='+ProgramIdChannnel;
                if(AudioPid!=null){
                    CheckProgram = ';Progid='+ProgramIdChannnel+';audiopid='+AudioPid;
                }else{
                    CheckProgram = ';Progid='+ProgramIdChannnel;
                }
            }
	  Debug('########################### Channelinfo: '+CheckProgram);
        // Detiene el proceso de la reproduccion anterior
        StopVideo();

        // Reproduce el canal actual
        AVMedia.Play('src='+ Source+''+CheckPort+CheckProgram);
        PlayDigita = false;
        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();
        
        // Activamos la bandera
        PlayingChannel   = true;
        
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
        AVMedia.Play('src='+ Source);
        PlayDigita = true;
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

    function PlayVideo(Source){
        // Guarda la estadistica
        StopVideo();

        // Reproduce el video
        AVMedia.Play('src='+ Source);
        Debug("Se esta reproduciendo exitosamente amino "+Source)
        //setTimeout(getPIDSInfo, 15000);
        // Maximiza el video en caso de que no este en pantalla completa
           MaximizeTV();
       
    }
    function getPIDSInfo(){
        var PIDObject = AVMedia.GetAudioPIDs();
            numberOfLanguages = PIDObject.pids;
        for (var x = 1; x <= numberOfLanguages; x++) {
            PIDS.push(PIDObject[x].AudioLanguage);
        }
    }
    
    function PreviewVideo(Source){
        // Guarda la estadistica
        StopVideo();

        // Reproduce el video
        AVMedia.Play('src='+ Source);

        SetPosition(400);
        
        // Maximiza el video en caso de que no este en pantalla completa
        MaximizeTV();
        
        PlayingVod = true;
    }
    
    function SetPosition(Pos){
        AVMedia.SetPosition(Pos);
    }
    
    
/* *****************************************************************************
 * Obtiene los tamanos maximos y minimos de la pantalla
 * ****************************************************************************/

    function GetWindowFullSize(){
        WindowMaxWidth   = window.screen.width;
        WindowMaxHeight  = window.screen.height;
    }
    
    function GetWindowMinSize(){
        WindowMinWidth   = ((window.screen.width)*33)/100;
        WindowMinHeight  = ((window.screen.height)*33)/100;
    }

/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/
    
    function MaximizeTV(){
        windowTV.SetRectangle('0', '0', WindowMaxWidth, WindowMaxHeight);
    }

/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/
    
    function MinimizeTV(){
        //windowTV.SetRectangle((10*WindowMaxWidth)/100, (13*WindowMaxWidth)/100, WindowMinWidth, WindowMinHeight);
        windowTV.SetRectangle(TvPositionLeft, TvPositionTop, WindowMinWidth, WindowMinHeight);
    }
    
/* *****************************************************************************
 * Reinicia el dispositivo
 * ****************************************************************************/ 
    
    function RebootDevice(){
        ASTB.Reboot();
    }

/* *****************************************************************************
 * Opciones reproduccion
 * ****************************************************************************/ 

    function StopVideo(){
        AVMedia.Stop();
        AVMedia.Kill();
        PauseLive = false;
        PlayingRecording = false;
        PlayDigita = false;
    }
    
    function PauseVideo(){
        //AVMedia.SetSpeed(0);
        AVMedia.Pause();
    }
    
    function ResumeVideo(){
        //AVMedia.SetSpeed(1);
        AVMedia.Continue();
    }
    
    function SpeedVideo(Speed){
        AVMedia.SetSpeed(Speed);
    }
    
    function UpdatePosition(Option){
        PositionAsset = AVMedia.GetPos();

        (Option === 'add') ? PositionAsset += 30: PositionAsset -= 30;

        AVMedia.SetPos(PositionAsset);

        PositionAsset = AVMedia.GetPos();

        //AVMedia.Continue();
    }
    
/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/ 

    function AssetStatus(Duration){
        if(PlayingRecording === true || PlayingVod === true){

            PositionAsset = AVMedia.GetPosition();
           
            DurationAsset = parseInt(Duration,10) * 60;
            
            PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);

        } else if(PauseLive === true){
            
            var PltInfo = PVR.GetPltInfo();
            
            if(typeof PltInfo === 'object') {
                DurationAsset = PltInfo.duration;
                PositionAsset = PltInfo.position;
                
                if(DurationAsset !== 0){
                    PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);
                }
            }
        }
    }

    function changeLanguage(positionLanguage){
        var PIDS = AVMedia.GetAudioPIDs();
        var AudioPid = PIDS[positionLanguage+1].AudioPID;
        var Status = AVMedia.SetAudioPID(AudioPid);
    }
