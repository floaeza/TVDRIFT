// @ts-nocheck
/******************************************************************************
 * @Objetivo: Funciones generales, envio de estadisticas y clima
 * @CreadoPor: Tania Maldonado
 * @Fecha: Noviembre 2019
 *******************************************************************************/

    var SM_StartDateModule     = new Date(),
        SM_FormatStartDate     = '',
        SM_EndDateModule       = '',
        SM_FormatEndDate       = '',
        SM_StartDateModuleMM   = '',
        SM_EndDateModuleMM     = '',
        SM_MinSeconds          = 10000, // 30 segundos
        SM_DifferenceInSec     = '';
        
    var FormatStartDate     = '',
        EndDateModule       = '',
        FormatEndDate       = '',
        StartDateModuleMM   = '',
        EndDateModuleMM     = '',
        MinSeconds          = 90000, // 30 segundos
        MaxSeconds          = 18000000, // 420 minutos | 7 horas
        DifferenceInSec     = '';

    var MM_StartDateMovie      = new Date(),
        MM_FormatStartDate    = '',
        MM_EndDateMovie       = '',
        MM_FormatEndDate      = '',
        MM_StartDateMovieMM   = '',
        MM_EndDateMovieMM     = '',
        MM_MinSeconds         = 600000, // 30 minutos
        MM_DifferenceInSec    = '',
        xhr;
    var ObjectWeather =[];

        window.localStorage;

    function GoPage(Page, ModuleId, ChangeModule){
        //alert('Pagina: '+ Page+'Module Id: '+ ModuleId+'CangeModule: '+ChangeModule);
        ////Debug(ModuleId + "  " + OnScreen + "  " + ChannelPosition);
        updateDataModule(ModuleId);

        ////Debug('GoPage ---> '+Page);
        if(CurrentModule !== 'Menu'){
        }
        //if(CurrentModule === 'Tv' && StartDateChannel !== ''){
        if(CurrentModule === 'Tv'){
            //Debug('TVCLOSE & SETCHANNELSTATISTICS');
            StopVideo();
            TvClose();
            //SetChannelStatistics();
        }
        ////Debug('StopVideo ---> ');

        //SetModuleStatistics();
        
        ////Debug('SetModuleStatistics ---> ');
        
        ////Debug(Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule);

        // if(typeof(ASTB) !== 'undefined' || MacAddress == '00:00:00:00:00:00'){
        //     //parent.document.getElementById('Menu').src=Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule;

        //     for(var i = 0; parent.document.getElementsByTagName('iframe').length; i++){
        //         parent.document.getElementsByTagName('iframe')[i].style.width='0%';
        //         parent.document.getElementsByTagName('iframe')[i].style.height='0%';
        //     }
        //     parent.document.getElementById(ChangeModule).style.width='100%';
        //     parent.document.getElementById(ChangeModule).style.height='100%';
        //     parent.document.getElementById(ChangeModule).focus();

        // }else{
            if (window.tizen !== undefined) {

                //Debug('Window.tizen !== undefined');
                var PageH = Page.replace('php','html');
                
                //Debug('GoPageHTML ---> '+PageH);
                
                localStorage.setItem('Module', ChangeModule);
                localStorage.setItem('Id', ModuleId);
    
                //location.replace(PageH);
                window.location.href = PageH;
                
            } else {
                ////Debug('>>>>>>> LOCATION.REPLACE');
                //Executing = true;
                //location.replace(Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule);
    
                //location.replace(Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule);
                //  if(typeof(ASTB) !== 'undefined'){
                //      Browser.Go('http://172.22.22.10//BBINCO/TV/' + Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule)
                //  }else{
                if(typeof(ASTB) !== 'undefined'){
                    location.href= Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule;
                }else{
                    window.location.href = Page+'?MacAddress='+MacAddress+'&ModuleId='+ModuleId+'&CurrentModule='+ChangeModule;
                }
                
            }
        }
    //}
    
    function SetChannelStatistics(){ 
            FormatStartDate     = getDate(StartDateChannel);
            EndDateModule       = new Date();
            FormatEndDate       = getDate(EndDateModule);
            StartDateModuleMM   = StartDateChannel.getTime();
            EndDateModuleMM     = EndDateModule.getTime();
            DifferenceInSec     = EndDateModuleMM - StartDateModuleMM;
            //alert("Start: " + StartDateModuleMM + " End: " + EndDateModuleMM+ " Diferencia: "+DifferenceInSec);
        /* Valida si el tiempo de vista del modulo esta en un rango de tiempo coherente */
        if(DifferenceInSec > MinSeconds && DifferenceInSec < MaxSeconds){
            
            var ChannelName    = ChannelsJson[ChannelPosition].NAME,
                ChannelStation = ChannelsJson[ChannelPosition].STTN;
        
            xhr = $.ajax({
                cache: false,
                type: 'POST',
                url: ServerSource + 'Core/Controllers/Statistics.php',
                data: {
                    Option: 'Channels',
                    MacAddress: MacAddress,
                    ChannelName: ChannelName,
                    StationNumber: ChannelStation,
                    LocationId: Device['LocationId'],
                    StartTime: FormatStartDate,
                    EndTime: FormatEndDate
                }
            });
            xhr = null;
        }
    }
            
    function SetModuleStatistics(){ 
            SM_FormatStartDate     = getDate(SM_StartDateModule);
            SM_EndDateModule       = new Date();
            SM_FormatEndDate       = getDate(SM_EndDateModule);
            SM_StartDateModuleMM   = SM_StartDateModule.getTime();
            SM_EndDateModuleMM     = SM_EndDateModule.getTime();
            SM_DifferenceInSec     = SM_EndDateModuleMM - SM_StartDateModuleMM;

        /* Valida si el tiempo de vista del modulo esta en un rango de tiempo coherente */
        if(Math.abs(SM_DifferenceInSec) > SM_MinSeconds){

            xhr = $.ajax({
                cache: false,
                type: 'POST',
                url: ServerSource + 'Core/Controllers/Statistics.php',
                data: {
                    Option: 'Modules',
                    CurrentModule: CurrentModule,
                    MacAddress: MacAddress,
                    LocationId: Device['LocationId'],
                    StartTime: SM_FormatStartDate,
                    EndTime: SM_FormatEndDate
                }
            });
            xhr = null;
        }
    }
    function updateDataModule(Module){
        //alert(Module);
        xhr = $.ajax({
            cache: false,
            type: 'POST',
            url: './././Core/Controllers/DevicesStatus.php',
            data: { 
                Option : 'updateDataModules',
                MacAddress : MacAddress,
                LastModule: parseInt(Module)
            }
        });
        xhr = null;
    }
    function SetMoviesStatistics(){
        MM_FormatStartDate    = getDate(MM_StartDateMovie);
        MM_EndDateMovie       = new Date();
        MM_FormatEndDate      = getDate(MM_EndDateMovie);
        MM_StartDateMovieMM   = MM_StartDateMovie.getTime();
        MM_EndDateMovieMM     = MM_EndDateMovie.getTime();
        MM_DifferenceInSec    = MM_EndDateMovieMM - MM_StartDateMovieMM; 

        /* Valida si el tiempo de vista del modulo esta en un rango de tiempo coherente */
        if(Math.abs(MM_DifferenceInSec) > MM_MinSeconds){
            xhr = $.ajax({
                cache: false,
                type: 'POST',
                url: ServerSource + 'Core/Controllers/Statistics.php',
                data: {
                    Option: 'Movies',
                    CurrentMovie: CurrentMovie,
                    MacAddress: MacAddress,
                    LocationId: Device['LocationId'],
                    StartTime: MM_FormatStartDate,
                    EndTime: MM_FormatEndDate
                }
            });
            xhr = null;
        }
    }

    
// Funciones genericas

/* */

    function ShowStars(StarsText){
        var Index = 0,
            StarsNumber = 0,
            Icons = ' ';
    
        if(StarsText !== null){

            if(StarsNumber > 1){
                for(Index = 0; Index < StarsNumber; Index++){
                    Icons += "<i class='fa fa-star'></i>";
                }
            } else if(StarsNumber === 0){
                //Do nothing
            } else  {
                for(Index = 0; Index < StarsText.length; Index++){
                    Icons += "<i class='fa fa-star'></i>";
                }
            }
        }

        return Icons;
    }
    
    function getDate(seDate){
        rDate = seDate.getFullYear() + '-' + twoDigits((seDate.getMonth()+1)) + '-' + twoDigits(seDate.getDate()) + ' ' + twoDigits(seDate.getHours()) + ':' + twoDigits(seDate.getMinutes()) + ':' + twoDigits(seDate.getSeconds());
        return rDate;
    }
    
    function twoDigits(d) {
        if(0 <= d && d < 10) return '0' + d.toString();
        if(-10 < d && d < 0) return '-0' + (-1*d).toString();
        return d.toString();
    }
    
    /* Suma dias a una fecha */ 
    function AddDays(days) {
        var result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }
    
    function AddDaysFormat(days){
        var nowPlusOneDay = moment().add(days, 'days');
        var nowPlusOneDayStr = nowPlusOneDay.format('MMM, DD');
        return nowPlusOneDayStr;
    }
    
/*
 * Funcion utilizada para obtener la hora actual en le cliente
 *                      ¡¡¡ OJO !!!
 * Este metodo solo es funcional para la EPG, ya que devielve la hora
 * en funcion de cada 30 min. Es decir, si son las 14:15 devolvera 14:00,
 * so son las 14:45 devolvera 14:30 y asi...
 */
    function GetCurrentHour(){

        var GDate = new Date();
        var CurrentHour = GDate.getHours() - Offset,
            CurrentMinute = '';

        if(GDate.getMinutes() > 30){
            CurrentMinute = '30';
        }else{
            CurrentMinute =  '00';
        }
        if(CurrentHour < 10){
            CurrentHour = '0'+CurrentHour;
        }
        var Hour = CurrentHour+':'+CurrentMinute;
        GDate = null;
        CurrentMinute = null;
        CurrentHour = null;

        return Hour;
    }
    
/*
 * Funcion de busqueda del indice de la hora actual dentro del arreglo de horas
 * Parametros:
 * hour: La hora actual al momento de consultar
 */
    function FindCurrentHour(hour){
        var Result = 0,
            i = 0;
        for(i = 0; i < Hours.length; i++){
            if(Hours[i][0] === hour){
                Result = i;
                i = Hours.length;
            }
        }
        return Result;
    }
    
/*
 * Funcion para comparar horas dentro de la EPG. Esta funcion se encarga de validar
 * si Hour1 es mayor o menor que Hour2.
 * Parametros:
 * Hour1: Hora inicial a comparar
 * Hour2: Hora final a comparar
 * Retornos:
 * Los valores a retornar pueden ser >, < ó =; Los cuales se utilizaran como indicadores
 * para hacer comparaciones.
 */
    function CompareHours(Hour1, Hour2){

        //console.log('CompareHours -----------> Recibiendo Hour1= '+Hour1+ ' Hour2= ' +Hour2);
        
        
        var Result = '',
            Minut1 = Hour1.split(':')[1],
            Hours1 = Hour1.split(':')[0],
            Minut2 = Hour2.split(':')[1],
            Hours2 = Hour2.split(':')[0];
    
            Minut1 = parseInt(Minut1,10);
            Hours1 = parseInt(Hour1,10);
            Minut2 = parseInt(Minut2,10);
            Hours2 = parseInt(Hour2,10);
            
            //console.log(Hours1+' - '+Minut1);
            //console.log(Hours2+' - '+Minut2);
        if(Minut1 >= 25 && Minut1 <=29){
            Minut1 = 30;
        }
         
        if(Minut1 >= 55 && Minut1 <=59){
            Minut1 = 60;
        }

        
        ////Debug('CompareHours -----------> Hora1: '+Hour1.substr(0,2)+' Minuto1: '+Hour1.substr(3,2)+' Hora2: '+Hour2.substr(0,2)+' Minuto2: '+Hour2.substr(3,2));
        if(Hours1 > Hours2){
            //console.log('CompareHours -----------> if(Hours1 > Hours2) '+Hours1+ ' > ' +Hours2);
            Result = '>';
        }else if(Hours1 < Hours2){
            //console.log('CompareHours -----------> else if(Hours1 < Hours2) '+Hours1+ ' < ' +Hours2);
            Result = '<';
        }else if(Hours1 == Hours2 && Minut1 > Minut2){
            //console.log('CompareHours -----------> else if(Hours1 == Hours2 && Minut1 > Minut2) '+Hours1+':'+Minut1+ ' > ' +Hours2+':'+Minut2);
            Result = '>';
        }else if(Hours1 == Hours2 && Minut1 < Minut2){
            //console.log('CompareHours -----------> else if(Hours1 == Hours2 && Minut1 < Minut2) '+Hours1+':'+Minut1+ ' < ' +Hours2+':'+Minut2);
            Result = '<';
        }else if(Hours1 == Hours2 && Minut1 == Minut2){
            //console.log('CompareHours -----------> else if(Hours1 == Hours2 && Minut1 == Minut2) '+Hours1+':'+Minut1+ ' = ' +Hours2+':'+Minut2);
            Result = '=';
        }
        //console.log('Result '+ Result);

        Minut1 = null;
        Hours1 = null;
        Minut2 = null;
        Hours2 = null;

        return Result;
    }
    
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    
/* Funcion utilizada para dar formato de 12 hrs a las horas de la EPGv*/
    function FormatHours(Hour){
        var Minute = Hour.substr(3,2), Hour = parseInt(Hour.substr(0,2), 10), ActualHour = '';
        if(Hour >= 12){
            if(Hour > 12){
                ActualHour = (Hour-12)+':'+Minute+' pm';
            }else{
                ActualHour = Hour+':'+Minute+' pm';
            }
        }else{
            if(Hour === 0){
                Hour = 12;
            }
            ActualHour = Hour+':'+Minute+' am';
        }
        Minute = Hour = null;
        return ActualHour;
    }
    
    function TimeConvert(n) {
        var num = n,
            hours = (num / 60),
            rhours = Math.floor(hours),
            minutes = (hours - rhours) * 60,
            rminutes = Math.round(minutes);
    
        if(num !== ''){
            if(n > 60){
                return rhours + ' hrs ' + rminutes + ' min';
            } else {
                return num + ' min';
            }
        } else {
            return '';
        }
    }
    
    function SecondsToTime(time) {
            var hr = ~~(time / 3600),
                min = ~~((time % 3600) / 60),
                sec = time % 60,
                sec_min = '',
                hrs = 0;
        
            if (hr > 0) {
               sec_min += '' + hrs + 'h ' + (min < 10 ? '0' : '');
            }
            sec_min += '' + min + ':' + (sec < 10 ? '0' : '');
            sec_min += '' + sec;
            return sec_min+ ' min';
         }
    
///**/

function secondsToString(seconds) {
    var hour = Math.floor(seconds / 3600);
    hour = (hour < 10)? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    return hour + ' h ' + minute + ' min';
}


function Time12to24(time12h){
    var time     = time12h.split(' '),
        modifier = time[1],
        times    = time[0].split(':'),
        hours    = times[0],
        minutes  = times[1].split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'pm') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return hours+':'+minutes;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function ConvertToHourEpoch(time24){

    var times    = time24.split(':'),
        Hours    = times[0],
        Minutes  = times[1];

    var HourNumber = parseInt(Hours);
        
        HourNumber -= Math.abs(17);
        
    return pad(HourNumber,2)+''+Minutes;
}

    
    function GetWeather(){
        xhr = $.ajax({
            cache: false,
            type: 'GET',
            url: ServerSource + 'Core/Controllers/Weather.php',
            success: function (response) {
                ObjectWeather = JSON.parse(response);
                SetIcon();
            }
        });
        xhr = null;
        
    }
    
    function SetIcon(){
        if(CurrentModule === 'Menu'){
            var skycons = new Skycons({
                'color': '#fff'
            });
        } else {
            var skycons = new Skycons({
                'color': '#EEB462'
            });
        }

        skycons.add('WeatherIcon', ObjectWeather.Icon);
        $('#WeatherSummary').text(ObjectWeather.Summary);
        $('#WeatherFarenheit').html(String(Math.round(ObjectWeather.Temperature)));
        $('#WeatherCelsius').html(String(toCelsius(ObjectWeather.Temperature)));
    }


        
    function toCelsius(f) {
        var x = (5/9) * (f-32);
        return Math.round(x);
    }
    
    var ErrorLoadGuide = 1;
    
    function SetLog(LogNumber){
        xhr = $.ajax({
            cache: false,
            type: 'POST',
            url: ServerSource + 'Core/Controllers/Log.php',
            data: { 
                MacAddress : MacAddress,
                LogNumber : LogNumber,
                CurrentModule: CurrentModule
            }
        });
        xhr = null;
    }
