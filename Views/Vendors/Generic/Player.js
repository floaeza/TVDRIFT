// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Reproductor tv
 * Vendor: Generico
 */

    // Variables globales
    var PlayingChannel  = false,
        PauseLive       = false;

    var WindowMaxWidth  = 0,
        WindowMaxHeight = 0,
        WindowMinWidth  = 0,
        WindowMinHeight = 0;

    var Sources = ['http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/AAA.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/ABC.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/CN.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/CNM.mp4',
                  'http://201.116.203.114/MULTIMEDIA_DMO/ChannelsVideos/ESPN.mp4'
                 ];

    var IndexChannel = 0;

/* *****************************************************************************
 * Reproductor de canal
 * ****************************************************************************/
    function PlayChannel(Source, Port){
        // Activamos la bandera
        PlayingChannel = true;
        
        Debug('Playing: '+Source + ':'+Port);



        document.getElementById('DigitalChannel').innerHTML = '<video id="VideoPlaying" autoplay loop><source src='+Sources[IndexChannel]+' type="video/mp4"></video>';
        document.getElementById('DigitalChannel').style.display = 'inline';

        IndexChannel++;

        if(IndexChannel > Sources.length - 1){
            IndexChannel = 0;
        }
        
        // Si la guia esta cerrada muestra cuadro con informacion del canal en reproduccion
        ShowInfo();
    }

/* *****************************************************************************
 * Reproduce canales digitales
 * ****************************************************************************/
    
    function PlayDigitalChannel(Source){
        // Activamos la bandera
        PlayingChannel = true;

        document.getElementById('DigitalChannel').innerHTML = '<video id="VideoPlaying" autoplay loop><source src='+Sources[IndexChannel]+' type="video/mp4"></video>';
        document.getElementById('DigitalChannel').style.display = 'inline';

        IndexChannel++;

        if(IndexChannel > Sources.length - 1){
            IndexChannel = 0;
        }

        // Si la guia esta cerrada muestra cuadro con informacion del canal en reproduccion
        ShowInfo();
    }
    
/* *****************************************************************************
 * Reproduce videos
 * ****************************************************************************/

    function PlayVideo(Source){
        Debug('Playing: '+Source);
        Debug('GETRAWS: '+Source);
        GetRaws(Source);
    }
    
    function GetRaws(Source){
        var RawSource = Source.replace('rtsp','http') + '/raw/';
        RawSource = RawSource.replace('554','8080');

        Debug(RawSource);
        IndexPlaylist = 0;
        LengthPlaylist = 0;

        $.ajax({
            type: 'POST',
            async: false,
            url: 'Core/Controllers/GetRaws.php',
            data : {
                SourceRaw: RawSource
            },
            success: function(data){
                Playlist = $.parseJSON(data);
                
                console.log(Playlist);
                
                IndexPlaylist = 0;
                LengthPlaylist = Playlist.length - 1;
            }
        });
    }
    
    function SetPlaylist(option){
        //if(option === 'forward'){
            
            IndexPlaylist++;
            
            if(IndexPlaylist === LengthPlaylist){
                OpenRecordPlayOptions();
            } else {
                // play
               Debug(Playlist[IndexPlaylist]);
            }
  
        //} 
    }
    
/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/
    function MaximizeTV(){
    }

/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/
    function MinimizeTV(){
    }
    
/* *****************************************************************************
 *
 * ****************************************************************************/ 
    function RebootDevice(){
        location.reload();
    }
    
/* *****************************************************************************
 * Opciones reproduccion
 * ****************************************************************************/ 

    function StopVideo(){
        PauseLive = false;
        PlayingRecording = false;
    }
    
    function PauseVideo(){

    }
    
    function ResumeVideo(){

    }
    
    function SpeedVideo(Speed){

    }

/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/ 

    function AssetStatus(Duration){
        if(PlayingRecording === true){

        }
    }