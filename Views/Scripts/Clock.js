// @ts-nocheck
/******************************************************************************
 * @Objetivo: Actualiza la hora en los STB marca amino
 * @CreadoPor: Tania Maldonado
 * @Fecha: Octubre 2021
 *******************************************************************************/

/* Validacion para reinicar dispositivo y buscar actualizaciones de la epg */
var TimeRunning       = 0,
    MaxMinutesRunning = 15,
    TimerDate         = 0,
    Offset            = 0;

var MonthArr = ['Jan','Feb','Mar',
    'April','May','June',
    'July','Aug','Sep',
    'Oct','Nov','Dec'];

var DayArr = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];

var NewDate = new Date(),
    date = '',
    month = '',
    montth = '',
    year = '',
    day = '',
    hour = '',
    hourt = '',
    min = '',
    sec = '',
    ampm = '';


function SetDate() {
    TimeRunning++;
    
    NewDate = new Date();
    date  = NewDate.getDate();
    month = NewDate.getMonth();
    year  = NewDate.getFullYear();
    day   = NewDate.getDay();
    hourt  = NewDate.getHours();
    min   = NewDate.getMinutes();
    sec   = NewDate.getSeconds();

    ampm = hourt >= 12 ? ' PM' : ' AM';
    hour = hourt % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    min = min < 10 ? '0'+min : min;
    montth = MonthArr[month];
    day = DayArr[day];

    FormatDateAndHour = montth+','+ date + ' / '+ hour + ':' + min + ':' + ampm;

    date = date < 10 ? '0'+date : date;
    month++;
    month = month < 10 ? '0'+month : month;

    hour = hour < 10 ? '0'+hour : hour;

    CurrentStbDate = year+'-'+month+'-'+date+' '+hourt + ':' + min + ':' + sec;


    if(!Device){
        //Debug('------------------------------------------------ Device::if');
        ////Debug('################################################ !Device ');
        if (Device.Client === 'CHL') {
            //Debug("+++++++++++++++++++++++++++++++++++++++");
            FormatHour = hour + ':' + min + ':' + ampm;
        } else {
            FormatHour = month+' '+ date + ', '+ hour + ':' + min + ':' + ampm;
            ////Debug('------------------------------------------------ 2');
        }
    } else {
        FormatHour = hour + ':' + min + ':' + ampm;
        //Debug('------------------------------------------------ Device::else');
    }

    if(CurrentModule === 'Tv'){

        //Debug('############################################################### CurrentModule === '+CurrentModule);
        if(typeof (ActiveInfoContainer) !== 'undefined' && ActiveInfoContainer === true){
            InfoContainerNodes[7].textContent  = FormatHour;
        } else if(typeof (ActiveEpgContainer) !== 'undefined' && ActiveEpgContainer === true){
            EpgDate.textContent = FormatDateAndHour;
        } else if(typeof (RecordingPanel) !== 'undefined' && RecordingPanel === true){
            PvrDate.textContent = FormatHour;
        }

        //Debug('############################################################### FormatHour2 === '+FormatHour);

        if(FormatHour === '12:01 AM'){

            SetEpgFile();
            //Debug('------------------------------ SetEpgFile -> FormatHour: '+FormatHour);

            if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
                if(EpgDataActive === true){
                    GetProgramsSerie();
                }
            }
        }

    } else if(CurrentModule === 'Menu' || CurrentModule === 'Movies'){

        MenuDate.textContent = montth +' '+ date + ', '+ year;
        MenuHour.textContent = FormatHour;
    }


    /* */

    //Debug('TimeRunning: '+TimeRunning);
    if(TimeRunning > MaxMinutesRunning){

        TimeRunning = 0;

        if(Executing === false){
            if(CurrentModule !== 'Tv') {
                UpdateInfoDevice();
            } else {
                UpdateQuickInfoDevice();
            }
        }
    }
    //Debug('-------------------------------- FormatDateAndHour: '+FormatDateAndHour);
}


/*******************************************************************************
 * Activa timer para que se ejecute cada minuto (60000 milisegundos = 60 segundos)
 *******************************************************************************/
/* Lo ejecuta la primera vez que carga */
setTimeout(SetDate,500);

/* Agrega intervalo 50000 = 50 segundos*/

TimerDate = setInterval(SetDate, 50000);