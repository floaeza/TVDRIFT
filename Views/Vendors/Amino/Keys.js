/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Codigos control remoto
 * Vendor: Amino
 */

    var Model = ASTB.GetConfig('SYSTEM.STB_MODEL');

    if(Model === 'A50'){
        /* OPERA 12 */
        var REMOTE_OK                    = 13, // Enter
            PREVIOUS_PROGRAM             = 8, // P<P
            ARROW_KEY_LEFT               = 37, // >
            ARROW_KEY_UP                 = 38, // <
            ARROW_KEY_RIGHT              = 39, //
            ARROW_KEY_DOWN               = 40, //

            REMOTE_POWER                 = 409, // STB
            REMOTE_MENU                  = 462, // MENU
            REMOTE_MUTE                  = 449, // MUTE X
            REMOTE_RED                   = 403, // ROJO
            REMOTE_GREEN                 = 404, // VERDE
            REMOTE_YELLOW                = 405, // AMARILLO
            REMOTE_BLUE                  = 406, // AZUL
            REMOTE_BACK                  = 461, // <- REGRESAR

            REMOTE_GUIDE                 = 458, // GUIDE
            REMOTE_CHANNEL_UP            = 427, // CHANNEL +
            REMOTE_CHANNEL_DOWN          = 428, // CHANNEL -
            SMALL_ARROW_UP               = 33,  // PAGE UP 
            SMALL_ARROW_DOWN             = 34,  // PAGE DOWN
            REMOTE_INFO                  = 457, // i
            REMOTE_PVR                   = 520, // GRABADOR
            REMOTE_CLOSE                 = 3,   // X
            REMOTE_RECORD                = 416, // REC
            REMOTE_STOP                  = 413, // STOP
            REMOTE_PLAY                  = 415, // PLAY
            REMOTE_PAUSE                 = 463, // PAUSE
            REMOTE_BACKWARD              = 412, // BACKWARD
            REMOTE_FORWARD               = 417, // FORWARD
            REMOTE_FAST_BACKWARD         = 424, // |<
            REMOTE_FAST_FORWARD          = 425; // >|
    } else {
        /* OPERA 11 */
        var REMOTE_OK                    = 13, // Enter
            PREVIOUS_PROGRAM             = 8, // P<P
            ARROW_KEY_LEFT               = 37, // >
            ARROW_KEY_UP                 = 38, // <
            ARROW_KEY_RIGHT              = 39, //
            ARROW_KEY_DOWN               = 40, //

            REMOTE_POWER                 = 8498, // STB
            REMOTE_MENU                  = 8516, // MENU
            REMOTE_MUTE                  = 8497, // MUTE X
            REMOTE_RED                   = 8512, // ROJO
            REMOTE_GREEN                 = 8513, // VERDE
            REMOTE_YELLOW                = 8514, // AMARILLO
            REMOTE_BLUE                  = 8515, // AZUL
            REMOTE_BACK                  = 8568, // <- REGRESAR

            REMOTE_GUIDE                 = 8537, // GUIDE
            REMOTE_CHANNEL_UP            = 8492, // CHANNEL +
            REMOTE_CHANNEL_DOWN          = 8494, // CHANNEL -
            SMALL_ARROW_UP               = 8525, // PAGE UP 
            SMALL_ARROW_DOWN             = 8490, // PAGE DOWN
            REMOTE_INFO                  = 8534, // i
            REMOTE_PVR                   = 8569, // GRABADOR
            REMOTE_CLOSE                 = 8536, // X
            REMOTE_RECORD                = 8510, // REC
            REMOTE_STOP                  = 8501, // STOP
            REMOTE_PLAY                  = 8499, // PLAY
            REMOTE_PAUSE                 = 8504, // PAUSE
            REMOTE_BACKWARD              = 8502, // BACKWARD
            REMOTE_FORWARD               = 8500, // FORWARD
            REMOTE_FAST_BACKWARD         = 8566, // |<
            REMOTE_FAST_FORWARD          = 8567; // >|
    }