/******************************************************************************
 * @Objetivo: Actualiza la hora
 * @CreadoPor: Tania Maldonado
 * @Fecha: Noviembre 2019
 *******************************************************************************/
Debug('########################### Time() ');
/* Validacion para reinicar dispositivo y buscar actualizaciones de la epg */
    var TimeRunning       = 0,
        MaxMinutesRunning = 15;

/*******************************************************************************
 * Funcion que escribe la fecha actual en la EPG, esta funcion tiene un timer
 * para actualozar fecha y hora infinitamente
 *******************************************************************************/
    
    function SetDate(){
        TimeRunning++;
        
        FormatDateAndHour = moment().format('MMM, DD / h:mm A');
        FormatHour = moment().format('h:mm A');

        if(CurrentModule === 'Tv'){
            if(ActiveInfoContainer === true){
                InfoContainerNodes[7].textContent  = FormatDateAndHour;
            }

            if(ActiveEpgContainer === true){
                EpgDate.textContent = FormatDateAndHour;
            }

            if(typeof (RecordingPanel) !== 'undefined'){
                if(RecordingPanel === true) {
                    PvrDate.textContent = FormatDateAndHour;
                }
            }

        } else if(CurrentModule === 'Menu' || CurrentModule === 'Movies'){
            FormatDate = moment().format('MMM DD ');
            FormatHour = moment().format('h:mm a');
        
            MenuDate.textContent = FormatDate;
            MenuHour.textContent = FormatHour;
        }

        
        CurrentHour = moment().format('HHmm');
        
        //Debug('------------- SetDate -> CurrentHour: '+CurrentHour);

        /* */
        if(CurrentHour === '0001'){
            if(CurrentModule === 'Tv'){
                SetEpgFile();
                Debug('------------- SetEpgFile -> CurrentHour: '+CurrentHour);
                
                if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
                    GetProgramsSerie();
                }
            }
        } 
        
        
        /* */
        if(TimeRunning > MaxMinutesRunning){
            
            TimeRunning = 0;

            if(Executing === false){
                UpdateInfoDevice();
            }
        }
        Debug('------------- FormatDateAndHour: '+FormatDateAndHour);
    }

/*******************************************************************************
 * Activa timer para que se ejecute cada minuto (60000 milisegundos = 60 segundos)
 *******************************************************************************/
    /* Lo ejecuta la primera vez que carga */
    SetDate();
    
    /* Agrega intervalo 50000 = 50 segundos*/
    setInterval(SetDate,50000);