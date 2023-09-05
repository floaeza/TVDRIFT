var REMOTE_OK                    = 13, // Enter
    PREVIOUS_PROGRAM             = 10190, // P<P
    ARROW_KEY_LEFT               = 37, // >
    ARROW_KEY_UP                 = 38, // <
    ARROW_KEY_RIGHT              = 39, //
    ARROW_KEY_DOWN               = 40, //

    REMOTE_POWER                 = 0, // STB
    REMOTE_MENU                  = 10133, // MENU // TOOLS 10135
    REMOTE_MUTE                  = 0, // MUTE X
    REMOTE_RED                   = 403, // ROJO
    REMOTE_GREEN                 = 404, // VERDE
    REMOTE_YELLOW                = 405, // AMARILLO
    REMOTE_BLUE                  = 406, // AZUL
    REMOTE_BACK                  = 10009, // <- REGRESAR

    REMOTE_GUIDE                 = 10073, // GUIDE
    REMOTE_CHANNEL_UP            = 427, // CHANNEL +
    REMOTE_CHANNEL_DOWN          = 428, // CHANNEL -
    SMALL_ARROW_UP               = 0,  // PAGE UP
    SMALL_ARROW_DOWN             = 0,  // PAGE DOWN
    REMOTE_INFO                  = 457, // i
    REMOTE_PVR                   = 0, // GRABADOR
    REMOTE_CLOSE                 = 10182,   // X
    REMOTE_RECORD                = 0, // REC
    REMOTE_STOP                  = 413, // STOP
    REMOTE_PLAY                  = 415, // PLAY
    REMOTE_PAUSE                 = 19, // PAUSE
    REMOTE_BACKWARD              = 412, // BACKWARD
    REMOTE_FORWARD               = 417, // FORWARD
    REMOTE_FAST_BACKWARD         = 0, // |<
    REMOTE_FAST_FORWARD          = 0; // >|

function registerkeys(Page){

    console.log('register keys function called');

    var usedKeys=['0','1','2', '3', '4', '5', '6', '7', '8', '9',
        'ColorF0Red','ColorF1Green','ColorF2Yellow','ColorF3Blue','ChannelDown','ChannelUp',
        'Info','Exit','ChannelList','PreviousChannel','Minus',
        'MediaPlayPause','MediaRewind','MediaFastForward','MediaPlay','MediaPause','MediaStop','MediaRecord','MediaTrackPrevious','MediaTrackNext',
        'Menu','Tools'];

    if (window.tizen !== undefined) {

        // KEYS
        usedKeys.forEach(
        function (keyName) {
            tizen.tvinputdevice.registerKey(keyName);
        });

        //SCREEN SAVER
        webapis.appcommon.setScreenSaver(
            webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF,
            function(result) {
                console.log(result);
            }, function(error) {
                console.log(JSON.stringify(error));
            }
        );

        // NETWORK ACTIVE
        var ActiveConnectionType = webapis.network.getActiveConnectionType();


        if (ActiveConnectionType !== 0) {
            if(Page === 'index') {
                SetIndexData();
            }
        }

        // NETWORK GATEWAY
        webapis.network.addNetworkStateChangeListener(function(value) {
            if (value == webapis.network.NetworkState.GATEWAY_CONNECTED) {
                // Something you want to do when network is connected again
                if(Page === 'index') {
                    SetIndexData();
                    //alert('GATEWAY_CONNECTED');
                }
            }
        });
        //addNetworkStateChangeListener();
        ActiveConnectionType = null;
    }
}