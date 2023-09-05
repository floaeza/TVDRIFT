// @ts-nocheck
/******************************************************************************
 * @Objetivo: Ejecutar botones del control remoto para todas las marcas
 * @CreadoPor: Tania Maldonado
 * @Fecha: Mayo 26, 2018
 *******************************************************************************/

var PressedKey      = 0,
    Clicks          = 0,
    MaxClicks       = 10,
    TimeClicks      = 1000, //milisegundos
    TimeCheck       = 2000, //milisegundos
    Sequence        = 0,
    ClearingClicks  = false,
    CheckingClicks  = false,
    timeMenu        = 0,
    showInfoDevi  = false,
    timeInfoDevice  = null,
    contInfoDevice  = 0;

    document.addEventListener('keydown',KeyHandler,false);
    
    var SwapPausePlay = true;
    
var CheckInfo = 0;
    

// setTimeout(removeEventListenerKeydown, 60000);

// function removeEventListenerKeydown(){
//     //Debug("+++++++removeEventListener+++++++");
//     document.removeEventListener('keydown',KeyHandler,false);
//     document.addEventListener('keydown',KeyHandler,false);
//     setTimeout(removeEventListenerKeydown, 600000);
// }

    function KeyHandler(e) {
        PressedKey = e.which;
        e.preventDefault();
        //alert(PressedKey);
        
        if(typeof(gSTB) !== 'undefined' && PressedKey === 9){
            ShiftKey = e.shiftKey;
            if(ShiftKey === true){
                PressedKey = 7;
            }
        }
        
        //Debug('>> PressedKey: '+PressedKey);
        if(Clicks <= MaxClicks) {
            //alert(REMOTE_RED);
            //alert(PressedKey);
            switch (PressedKey) {
                case REMOTE_RED:
                    if(showInfoDevi == false){
                        Red();
                    }
                break;
                case REMOTE_BLUE:
                    if(showInfoDevi == false){
                        Blue();
                    }
                break;

                case REMOTE_GREEN:
                    if(showInfoDevi == false){
                        Green();
                    }
                break;

                case REMOTE_YELLOW:
                    // if(contInfoDevice == 2 && showInfoDevi == false){
                    //     clearTimeout(timeInfoDevice);
                    //     contInfoDevice++;
                    //     timeInfoDevice = setTimeout(function(){
                    //         contInfoDevice=0;
                    //     }, 5500);
                    // }
                    if(showInfoDevi == false){
                       Yellow(); 
                    }
                    
                break;

        /********** NAVEGACION **********/

                case ARROW_KEY_UP:
                    if(contInfoDevice == 0 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 2 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }
                    console.log(contInfoDevice);
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvUp();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuUp();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodUp();
                    }
                break;

                case ARROW_KEY_DOWN:
                    if(contInfoDevice == 1 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 3 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }
                    console.log(contInfoDevice);
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvDown();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuDown();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodDown();
                    }
                break;

                case ARROW_KEY_RIGHT:
                    if(contInfoDevice == 4 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 6 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }
                    console.log(contInfoDevice);
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvRight();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuRight();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodRight();
                    } else if(CurrentModule === 'Moods' && showInfoDevi == false){
                        MoodsRight();
                    } 
                break;

                case ARROW_KEY_LEFT:
                    if(contInfoDevice == 5 && showInfoDevi == false){
                        contInfoDevice++;
                        timeInfoDevice = setTimeout(function(){
                            contInfoDevice=0;
                        }, 5500);
                    }else if(contInfoDevice == 7 && showInfoDevi == false){
                        clearTimeout(timeInfoDevice);
                        showInfoDevice();
                        contInfoDevice=0;
                        showInfoDevi = true;
                    }
                    console.log(contInfoDevice);
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvLeft();
                    } else if(CurrentModule === 'Menu' && showInfoDevi == false){
                        MenuLeft();
                    } else if(CurrentModule === 'Movies' && showInfoDevi == false){
                        VodLeft();
                    } else if(CurrentModule === 'Moods' && showInfoDevi == false){
                        MoodsLeft();
                    } 
                break;
                
                case SMALL_ARROW_UP:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvPageUp();
                    }
                break;
                
                case SMALL_ARROW_DOWN:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvPageDown();
                    }
                break;
                
        /********** CANAL +/- **********/

                case REMOTE_CHANNEL_UP:
                    if (ActiveEpgContainer === true && typeof(ENTONE) !== 'undefined') {
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            TvPageUp();
                        }
                    }else{
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            TvChannelUp();
                        }
                    }
                    
                break;

                case REMOTE_CHANNEL_DOWN:
                    if (ActiveEpgContainer === true && typeof(ENTONE) !== 'undefined') {
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            TvPageDown();
                        }
                    }else{
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            TvChannelDown();
                        }
                    }
                break;
                
        /********** OPERACIONES **********/
        
                case REMOTE_OK:
                    //Debug('REMOTE_OK');
                    CheckInfo++;
                    if(CurrentModule === 'Tv'){
                        //Debug('REMOTE_OK > CurrentModule '+CurrentModule);
                        TvOk();
                        
                        if(CheckInfo === 2){
                            CheckInfo = 0;
                            TvInfo();
                        }
                    } else if(CurrentModule === 'Menu'){
                        //Debug('REMOTE_OK > MenuOk '+CurrentModule);
                        MenuOk();
                    } else if(CurrentModule === 'Movies'){
                        VodOk();
                    } else if(CurrentModule === 'Moods'){
                        MoodsOk();
                    } 
                    break;
            
                case REMOTE_INFO:
                    // if(contInfoDevice == 3 && showInfoDevi == false){
                    //     clearTimeout(timeInfoDevice);
                    //     showInfoDevice();
                    //     contInfoDevice=0;
                    //     showInfoDevi = true;
                    // }
                    if(CurrentModule === 'Tv'){
                        TvInfo();
                    } else if(CurrentModule === 'Movies'){
                        VodInfo();
                    }
                break;
                
                case REMOTE_BACK:
                    if(showInfoDevi == false){
                        Back();
                    }else{
                        removeInfoDevice();
                    }
                    
                break;

                case REMOTE_CLOSE:
                    if(showInfoDevi == false){
                        Close();
                    }else{
                        removeInfoDevice();
                    }
                break;
                
                case PREVIOUS_PROGRAM:
                    if(CurrentModule === 'Tv'  && showInfoDevi == false){
                        //Debug('PREVIOUS_PROGRAM');
                        ReturnLastChannel();
                    }else if(showInfoDevi){
                        removeInfoDevice();
                    }
                break;
                
        /********** GUIA **********/
                
                case REMOTE_GUIDE:
                    if(CurrentModule === 'Tv'  && showInfoDevi == false){
                        
                        TvGuide();
                    }
                break;
                
        /********** MENU **********/
                
                case REMOTE_MENU:
                    if(timeMenu == 0){
                        timeMenu = 1;
                        setTimeout(function(){
                            timeMenu = 0;
                        },2000)
                        Menu();
                    }
                break;
                
        /********** GRABADOR | PAUSELIVE TV **********/
        
                case REMOTE_PVR:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        Debug("REMOTE_PVR");
                        TvRecorder();
                    }
                break;
                
                case REMOTE_STOP:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvStop();
                    }
                break;
                
                case REMOTE_PLAY:

                    if(typeof(gSTB) !== 'undefined'){
                        
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            if(SwapPausePlay === false){
                                
                                TvPlay();
                                SwapPausePlay = true;
                            } else {
                                
                                TvPause();
                                SwapPausePlay = false;
                            }
                        }
                    } else {
                        if(CurrentModule === 'Tv' && showInfoDevi == false){
                            TvPlay();
                        }
                    }
                break;

                case REMOTE_PAUSE:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvPause();
                    }
                break;
                
                case REMOTE_FORWARD:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvForward();
                    }
                break;
                
                case REMOTE_BACKWARD:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvBackward();

                    }
                break;
                
                case REMOTE_RECORD:
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        TvRecord();
                    }
                break;
                
                // case REMOTE_FAST_BACKWARD:
                //     if(CurrentModule === 'Tv'){
                //         // AGREGAR OPCION PARA ADELANTAR CAPITULOS
                //         // CUANDO SE ESTE REPRODUCIENDO UNA SERIE DEL PVR
                        
                //     }
                // break;
            
                // case REMOTE_FAST_FORWARD:
                //     // AGREGAR OPCION PARA ADELANTAR CAPITULOS
                //     // CUANDO SE ESTE REPRODUCIENDO UNA SERIE DEL PVR
                    
                    
                // break;
                
                
        /********** NUMEROS **********/        
                
            
                case 48: // 0
                case 49: // 1
                case 50: // 2
                case 51: // 3
                case 52: // 4 
                case 53: // 5
                case 54: // 6
                case 55: // 7
                case 56: // 8
                case 57: // 9
                    if(CurrentModule === 'Tv' && showInfoDevi == false){
                        NumericChange(PressedKey - 48);
                    }
                    break;
                
                case 96: // 0
                case 97: // 1
                case 98: // 2
                case 99: // 3
                case 100: // 4 
                case 101: // 5
                case 102: // 6
                case 103: // 7
                case 104: // 8
                case 105: // 9
                    if(CurrentModule === 'Tv' && MacAddress === '00:00:00:00:00:00'){
                        NumericChange(PressedKey - 96);
                    }
                break;
            }

            ++Clicks;
            
            if(CheckingClicks === false){
                setTimeout(CheckClicks,TimeCheck);
                CheckingClicks = true;
            }
        }  else if (Clicks > MaxClicks){
            if(ClearingClicks === false){
                ClearingClicks = true;
                setTimeout(ClearClicks,TimeClicks);
            } 
        }
    }
    
    function ClearClicks(){
        CheckInfo = 0;
        Clicks = 0;
        ClearingClicks = false;
        Sequence = 0;
    }
    
    function CheckClicks(){
        if(ClearingClicks === false){
            Clicks = 0;
            CheckingClicks = false;
        }
    }

/*******************************************************************************
 * Función para ejecutar los eventos de las teclas en Pantalla de Vendor = Generic
 *******************************************************************************/
function MakeEvent(key){
    document.dispatchEvent(new KeyboardEvent('keydown', {'keyCode':key, 'which':key}));
}
    
    
