// if (window.tizen !== undefined) {
//     var b2bcontrol = window.b2bapis.b2bcontrol;
// }

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
    numberOfLanguages   = 0;

var WindowMaxWidth  = 0,
    WindowMaxHeight = 0,
    WindowMinWidth  = 0,
    WindowMinHeight = 0;

var Checker = null;

    Player.setListener(listener);

    Debug('PLAYER WEBAPIS.AVPLAY >>s LISTENER');

GetWindowFullSize();

setTimeout(function(){ GetWindowMinSize(); }, 2000);

/* *****************************************************************************
 * Reproductor de canal
 * ****************************************************************************/

function PlayChannel(Source, Port){
Debug('PlayChannel('+Source+', '+Port+')');
    var CheckPort = '';

    if(Port){
        CheckPort = ':' + Port;
    }

    // Detiene el proceso de la reproduccion anterior
    StopVideo();
    Source = Source.replace('igmp','udp');
    Debug('PlayChannel=::::::: '+Source+CheckPort);
    PlayDigita = false;
    // Reproduce el canal actual
    try {

        Player.open(Source+CheckPort);
        Debug('Player.open : '+Source+CheckPort);

        // Maximiza el video en caso de que no este en pantalla completa
        

        Player.prepareAsync(function() {
            Player.play();  
        });
        MaximizeTV();
        Debug('PlayChannel > PLAYER');

    } catch (error) {
        Debug('PlayChannel > Error name = '+ error.name + ', Error message = ' + error.message);
    }


    PlayDigita = false;

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
    Debug('PlayDigitalChannel > ::::::: '+Source);

    // Reproduce el video
    try {
        Player.open(Source);
        // Maximiza el video en caso de que no este en pantalla completa
        Player.prepareAsync(function() {
            Player.play();  
        });
        Checker = setTimeout(Red, 2000);
        MaximizeTV();
        //Player.setDisplayMethod("PLAYER_DISPLAY_MODE_FULL_SCREEN");
    } catch (error) {
        Debug('PlayDigitalChannel > Error name = '+ error.name + ', Error message = ' + error.message);
    }
    PlayDigita = false;
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
    Debug('PlayVideo: '+Source);
    StopVideo();
    Debug('Player samsung');
    // Reproduce el video
    // Reproduce el video
    try {

        Player.open(Source);
        Debug('playvideo open: '+Source);
        
        Player.prepareAsync(function() {
            Player.play();
        });
        MaximizeTV();
    } catch (error) {
        Debug('PlayVideo > Error name = '+ error.name + ', Error message = ' + error.message);
    }

    // Maximiza el video en caso de que no este en pantalla completa
    MaximizeTV();
}

function PlayMovie(Source){
    // Guarda la estadistica
    StopVideo();

    // Reproduce el video


    // Maximiza el video en caso de que no este en pantalla completa
    MaximizeTV();
}

function PreviewVideo(Source){
    // Guarda la estadistica
    StopVideo();

    // Reproduce el video


    SetPosition(400);

    // Maximiza el video en caso de que no este en pantalla completa
    MaximizeTV();

    PlayingVod = true;
}

function SetPosition(Pos){

}

/* *****************************************************************************
 * Obtiene los tamanos maximos y minimos de la pantalla
 * ****************************************************************************/

function GetWindowFullSize(){
    WindowMaxWidth   = 1920;
    WindowMaxHeight  = 1080;
}

function GetWindowMinSize(){
    Debug('TvPercentageSize: '+TvPercentageSize);
    WindowMinWidth   = ((1920)*TvPercentageSize)/100;
    WindowMinHeight  = ((1080)*TvPercentageSize)/100;
    Debug('WindowMinHeight: '+WindowMinHeight);
}

/* *****************************************************************************
 * Funcion para poner TV en pantalla completa
 * ****************************************************************************/

function MaximizeTV(){
    if(CurrentModule === 'Tv'){
        if(ActiveEpgContainer === true){
            // do nothing
        } else if(RecordingPanel === true){
            // do nothing
        } else  {
            Player.setDisplayRect(0, 0, WindowMaxWidth, WindowMaxHeight);
        }
    } else {
        Player.setDisplayRect(0, 0, WindowMaxWidth, WindowMaxHeight);
    }
}


/* *****************************************************************************
 * Funcion para minimizar la TV
 * ****************************************************************************/

function MinimizeTV(){
    Player.setDisplayRect(TvPositionLeft, TvPositionTop, WindowMinWidth, WindowMinHeight);
}

/* *****************************************************************************
 * Reinicia el dispositivo
 * ****************************************************************************/

function RebootDevice(){
    //APAGA LA TELEVISION POR COMPLETO, PERO NO LA ENCIENDE EN AUTOMATICO

    var onSuccess = function() {
        Debug("[rebootDevice] succeeded!");
    };

    var onError = function(error) {
        Debug("[rebootDevice] failed! error code: " + error.code + " error name: " + error.name + "  message " + error.message);
    };

    b2bcontrol.rebootDevice(onSuccess, onError);
}

/* *****************************************************************************
 * Opciones reproduccion
 * ****************************************************************************/

function StopVideo(){
    Debug('STOP VIDEO >>>');

    try {
        Debug('STOP VIDEO > close');
        Player.close();
    } catch (e)  {
        Debug('STOP VIDEO > catch'+e);
    }

    PauseLive = false;
    PlayDigita = false;
    PlayingRecording = false;
    Debug('STOP VIDEO <');
}

function PauseVideo(){

}

function ResumeVideo(){

}

function SpeedVideo(Speed){

}

function UpdatePosition(Option){
    PositionAsset = 0; /*SAMSUNG API*/

    (Option === 'add') ? PositionAsset += 30: PositionAsset -= 30;

    PositionAsset = 0; /*SAMSUNG API*/
}

/* *****************************************************************************
 * Obtiene la posicion del video en reproduccion (PAUSE LIVE Y GRABACIONES)
 * ****************************************************************************/

function AssetStatus(Duration){
    if(PlayingRecording === true || PlayingVod === true){

        PositionAsset = 0; /*SAMSUNG API*/

        DurationAsset = parseInt(Duration,10) * 60;

        PercentagePosition = Math.round((PositionAsset * 100) / DurationAsset);

    }
}

