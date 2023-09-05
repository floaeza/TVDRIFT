// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Noviembre 2019
 * @Tipo: Funciones para controlar la guia
 */

var EpgContainer            = document.getElementById('EpgContainer'),
    EpgDay                  = document.getElementById('EpgDay'),
    EpgDate                 = document.getElementById('EpgDate'),
    EpgChannelLogo          = document.getElementById('EpgChannelLogo'),
    EpgNowAiring            = document.getElementById('EpgNowAiring'),
    EpgHours                = document.getElementById('EpgHours'),
    EpgHoursNodes           = EpgHours.childNodes,
    EpgInfoContainerNodes   = document.getElementById('EpgProgramInfo').childNodes;

var DaysEpg                 = [],
    MaxEpgDay               = 10,
    EpgDayNumber            = 0;

var TotalPrograms           = 100,
    MaxRows                 = 5,
    Rows                    = 1;

var HourRows                = 1,
    MaxHourRows             = 5;

var OnloadProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 },
    FirstProgramsPositions  = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 },
    LastProgramsPositions   = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    FirstChannelPosition    = 0,
    CurrentChannelPosition  = 0,
    LastChannelPosition     = 0;

var OnLoadHourPosition      = 0,
    CurrentHourPosition     = 0,
    LastHourPosition        = 0;

var RowSelected             = 1,
    ProgramSelected         = 0;

var FocusChannelPosition    = 0;
FocusProgramPosition    = 0;

var ColorFocus              = '';
BackgroundFocus         = '';

var ProgramsToLeft          = false,
    ProgramsToChange          = false;

var EpgTime                 = '',
    SecondsToCloseEpg       = 300,
    TimeoutEpg              = SecondsToCloseEpg * 1000;

GetFocusStyle();

//setTimeout(OpenEpg,2000, '');

var NextChannelsJson        = [],
    ChannelsJsonToday       = [],
    NextEpgDataActive       = false,
    NextEpgActive           = false;

function GetNextJsonEpg(Direction){
    NextEpgDataActive = false;

    (Direction === 'RIGHT') ? EpgDayNumber++: EpgDayNumber--;


    var NewEpgDateFormat = AddDays(EpgDayNumber),
        NewEpgDate = NewEpgDateFormat.yyyymmdd(),
        NewSourceEpgFile = Libraries['EpgDaysPath'] + 'epg_' + NewEpgDate + '_' + Device['Services']['PackageId'] + '.json';

    $.ajax({
        async: false,
        url: NewSourceEpgFile,
        success: function (response){
            NextChannelsJson = [];
            NextChannelsJson = response;

            NextEpgDataActive = true;

            if(EpgDayNumber === 1){
                ChannelsJsonToday = ChannelsJson;
            }

            Debug('------- GetNextJsonEpg -> ChannelsLength: '+ChannelsLength);
        },
        error: function (response){
            // El archivo no se encuentra o viene vacio, consulta a la base de datos
            NextEpgDataActive = false;
        }
    });
}

/*******************************************************************************
 *
 *******************************************************************************/

function OpenEpg(){
    
    if(ActiveEpgContainer === false && EpgDataActive === true){
        Debug('------- OpenEpg 1 -> EpgDataActive: '+EpgDataActive);

        /* Activa bandera, muestra contenedor y asigna la informacion de la cabecera */
        EpgContainer.style.visibility = 'visible';
        EpgNowAiring.innerHTML = 'Now airing: '+ChannelsJson[ChannelPosition].INDC + ' - ' + ChannelsJson[ChannelPosition].CHNL + '<br> ('+ChannelsJson[ChannelPosition].PROGRAMS[ProgramPosition].TTLE+')';
        EpgDate.textContent = FormatDateAndHour;
        EpgDay.textContent = 'Today';
        ActiveEpgContainer = true;



        if(NextEpgActive === true){
            OnLoadHourPosition      = 0;
            CurrentHourPosition     = 0;
            EpgDay.textContent      = AddDaysFormat(EpgDayNumber);

            /*Contruye los renglones de la programacion actual */
            CurrentChannelPosition  = FirstChannelPosition;
        } else {
            EpgDayNumber = 0;

            EpgDay.textContent = 'Today';
            OnLoadHourPosition      = FindCurrentHour(GetCurrentHour());
            CurrentHourPosition     = OnLoadHourPosition;

            /*Contruye los renglones de la programacion actual */
            CurrentChannelPosition  = ChannelPosition;
        }

        BuildProgramsRow(CurrentHourPosition, CurrentChannelPosition);

        BuildChannelsRow(CurrentChannelPosition);

        FocusEpgProgram(RowSelected,ProgramSelected);

        GetWeather();

        MinimizeTV();

        EpgTimer = setTimeout(CloseEpg,TimeoutEpg);

        SetChannelLogo();
        Debug('------- OpenEpg 2 -> EpgDataActive: '+EpgDataActive);
    } else if(ActiveEpgContainer === true){
        Debug('------- OpenEpg 3 -> EpgDataActive: '+EpgDataActive);
        CloseEpg();
    }
}

/*******************************************************************************
 *
 *******************************************************************************/

function CloseEpg(){
    if(ActiveEpgContainer === true){
        EpgContainer.style.visibility = 'hidden';
        ActiveEpgContainer = false;

        OnloadProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };
        FirstProgramsPositions  = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };
        LastProgramsPositions   = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        FirstChannelPosition    = 0;
        CurrentChannelPosition  = 0;
        LastChannelPosition     = 0;

        OnLoadHourPosition      = 0;
        CurrentHourPosition     = 0;
        LastHourPosition        = 0;

        RowSelected             = 1;
        ProgramSelected         = 0;

        FocusChannelPosition    = 0;
        FocusProgramPosition    = 0;

        ProgramsToLeft          = false;
        ProgramsToChange          = false;

        MaximizeTV();

        if(NextEpgActive === true){
            ChannelsJson = ChannelsJsonToday;

            ChannelsJsonToday = [];
        }

        NextEpgDataActive   = false;
        NextEpgActive       = false;
        EpgDayNumber        =  0;

        clearTimeout(EpgTimer);
    }
}

/*******************************************************************************
 *
 *******************************************************************************/

function ClearEpg(){
    ActiveEpgContainer      = false;
    OnloadProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };
    FirstProgramsPositions  = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };
    LastProgramsPositions   = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    //FirstChannelPosition    = 0;
    LastChannelPosition     = 0;

    OnLoadHourPosition      = 0;
    CSrrentHourPosition     = 0;
    LastHourPosition        = 0;

    ProgramSelected         = 0;

    FocusChannelPosition    = 0;
    FocusProgramPosition    = 0;

    ProgramsToLeft          = false;
    ProgramsToChange          = false;
}

/*******************************************************************************
 * Construye los renglones con la programacion
 *******************************************************************************/


function BuildProgramsRow(SetCurrentHourPosition, CurrentChannelPosition){
    //console.log('__________ [1][BuildProgramsRow]: ('+SetCurrentHourPosition+','+ CurrentChannelPosition+')');

    var HourPosition        = -1,
        ExtraHourPosition   = -1,
        BuildHoursPositions = SetCurrentHourPosition,
        BuildHourPosition   = SetCurrentHourPosition;

    for (HourRows = 1; HourRows <= MaxHourRows; HourRows++) {

        if(BuildHoursPositions <= (Hours.length-1)){
            //console.log('__________ [1.1][BuildProgramsRow]:  BuildHoursPositions '+ BuildHoursPositions + ' HourPosition: '+Hours[BuildHoursPositions][1]);
//                if(BuildHoursPositions >= 0 && BuildHoursPositions <= 12){
//                    EpgHours.style.backgroundImage	= 'url("./Media/General/def.png")';
//                } else if(BuildHoursPositions > 12 && BuildHoursPositions <= 25){
//                    EpgHours.style.backgroundImage	= 'url("./Media/General/def.png")';
//                } else if(BuildHoursPositions > 25 && BuildHoursPositions <= 29){
//                    EpgHours.style.backgroundImage	= 'url("./Media/General/def.png")';
//                } else if(BuildHoursPositions > 29 && BuildHoursPositions <= 37){
//                    EpgHours.style.backgroundImage	= 'url("./Media/General/def.png")';
//                } else if(BuildHoursPositions > 37 && BuildHoursPositions <= 47){
//                    EpgHours.style.backgroundImage	= 'url("./Media/General/def.png")';
//                }

            HourPosition += 2;
            EpgHoursNodes[HourPosition].textContent = Hours[BuildHoursPositions][1];
            EpgHoursNodes[HourPosition].title = BuildHoursPositions;
            BuildHoursPositions++;
            LastHourPosition = BuildHoursPositions;

        } else {
            HourPosition += 2;
            ExtraHourPosition++;
            EpgHoursNodes[HourPosition].textContent = Hours[ExtraHourPosition][1];
            EpgHoursNodes[HourPosition].title = 46;

        }
    }


    var CurrentProgramPosition  = 0;
    CurrentHourPosition = SetCurrentHourPosition;
    //console.log('_________ [1.4][BuildProgramsRow]: ('+BuildHourPosition+','+ CurrentChannelPosition+')');
    for (Rows = 1; Rows <= MaxRows; Rows++) {
        CurrentProgramPosition = LoadCurrentDataPosition(BuildHourPosition, CurrentChannelPosition);

        //console.log('_________ [1.5][BuildProgramsRow]: CurrentProgramPosition= '+CurrentProgramPosition);

        //console.log('_________ [1.6][BuildProgramsRow]: -> WriteProgramsRow(CurrentProgramPosition: '+CurrentProgramPosition +' CurrentChannelPosition: '+CurrentChannelPosition + ' Row: '+Rows+')');
        WriteProgramsRow(CurrentProgramPosition, CurrentChannelPosition, Rows);
        ++CurrentChannelPosition;

        if(CurrentChannelPosition > ChannelsLength){
            CurrentChannelPosition = 0;
        }
    }

    //console.log('______________________________________');
    //console.log('OnloadProgramsPositions: ');
    //console.log(OnloadProgramsPositions);
    //console.log('FirstProgramsPositions: ');
    //console.log(FirstProgramsPositions);
    //console.log('LastProgramsPositions: ');
    //console.log(LastProgramsPositions);
    //console.log('______________________________________');

    GetRowsPrograms();
    //console.log('_________ [1.7][BuildProgramsRow]: -> GetRowsPrograms');
}

/*******************************************************************************
 * Obtiene la posicion actual del programa del canal en contruccion
 *******************************************************************************/

function LoadCurrentDataPosition(HourPosition, CurrentChannelPosition){
    var NewProgramPosition = 0,
        CurrentHour     = Hours[HourPosition][0],
        StartHour       = '',
        EndHour         = '',
        IndexProgram    = 0;

    for(IndexProgram = 0; IndexProgram < ChannelsJson[CurrentChannelPosition].P_Length; IndexProgram++){
        /*Obtiene las horas inicio y fin de cada programa*/
        StartHour = ChannelsJson[CurrentChannelPosition].PROGRAMS[IndexProgram].STRH;
        EndHour   = ChannelsJson[CurrentChannelPosition].PROGRAMS[IndexProgram].FNLH;

        //console.log('######## StartHour: '+ StartHour+ ' EndHour: '+EndHour);
        //console.log('######## CompareStartHour: '+ CompareHours(StartHour, CurrentHour) + ' CurrentHour '+CurrentHour);
        //console.log('######## CompareEndHour: '+ CompareHours(EndHour, CurrentHour) + ' CurrentHour '+CurrentHour);

        //Debug('StartHour: '+StartHour + ' CurrentHour: '+CurrentHour + ' CompareHours: ' + CompareHours(StartHour, CurrentHour));
        if(CompareHours(StartHour, CurrentHour) === '='){
            /* Asigna la posicion correcta */
            NewProgramPosition = IndexProgram;

            /* Iguala IndexPrograma para terminar el ciclo FOR */
            IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
            //console.log('///////// '+CompareHours(StartHour, CurrentHour) + ' = '+NewProgramPosition);
        } else if(CompareHours(StartHour, CurrentHour) === '>'){
            /* Asigna la posicion correcta */
            NewProgramPosition = IndexProgram;

            /* Iguala IndexPrograma para terminar el ciclo FOR */
            IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
            //console.log('///////// '+CompareHours(StartHour, CurrentHour) + ' > '+NewProgramPosition);
        } else if(CompareHours(StartHour, CurrentHour) === '<' && CompareHours(EndHour, CurrentHour) === '>'){
            /* Asigna la posicion correcta */
            NewProgramPosition = IndexProgram;

            /* Iguala IndexPrograma para terminar el ciclo FOR */
            IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
            //console.log('///////// '+CompareHours(StartHour, CurrentHour) + ' < > '+NewProgramPosition);
        }
        else if(CompareHours(StartHour, CurrentHour) === '<' && CompareHours(StartHour, '23:00') === '='){
            /* Asigna la posicion correcta */
            NewProgramPosition = IndexProgram;

            /* Iguala IndexPrograma para terminar el ciclo FOR */
            IndexProgram = ChannelsJson[CurrentChannelPosition].P_Length;
            //console.log('///////// '+CompareHours(StartHour, CurrentHour) + ' < = '+NewProgramPosition);
        }
    }

    //Debug('%% NewProgramPosition '+NewProgramPosition);
    return NewProgramPosition;
}

/*******************************************************************************
 * Contuye y agrega los datos a mostrar de cada renglon con la programacion
 *******************************************************************************/

function WriteProgramsRow(CurrentProgramPosition, CurrentChannelPosition, Row){
    //console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: WriteProgramsRow('+CurrentProgramPosition+','+ CurrentChannelPosition+','+ Row+')');
    var ProgramRow          = document.getElementById('ProgramRow'+Row),
        ProgramNode         = '',
        DivElement          = '',
        ProgramWidth        = 0,
        RowProgramPosition  = 0,
        TotalWidth          = 0;

    var NewFormatFinal      = 0,
        NewFormatCurrent    = 0,
        SubstractLenght     = 0;

    ProgramRow.innerHTML = '';

    if(FirstProgramsPositions[Row] === -1){
        FirstProgramsPositions[Row] = CurrentProgramPosition;
        OnloadProgramsPositions[Row]   = CurrentProgramPosition;
        //console.log('................. 1.0) FirstProgramsPositions[Row] === -1: '+FirstProgramsPositions[Row]);
    } else {
        FirstProgramsPositions[Row] = CurrentProgramPosition;
        //console.log('................. 1.1) FirstProgramsPositions[Row]: '+FirstProgramsPositions[Row]);
    }

    for (RowProgramPosition = CurrentProgramPosition; RowProgramPosition < TotalPrograms; RowProgramPosition++) {
        /* Obtiene la hora inicial del programa */
        //console.log('................. FOR ('+CurrentProgramPosition+','+ CurrentChannelPosition+','+ Row+')');
        var ProgramStart    = ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].STRH,
            ProgramFinal    = ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].FNLH,
            NextStartHour   = EpgHoursNodes[9].title;
        ++NextStartHour;
        if(NextStartHour >= 47){ NextStartHour = 46; }

        var CurrentStartEpgHour  = Time12to24(EpgHoursNodes[1].textContent),
            CurrentFinalEpgHour  = Time12to24(Hours[(++NextStartHour)][1]),
            CompareStartEpgHours = CompareHours(ProgramStart, CurrentStartEpgHour),
            CompareFinalEpgHours = CompareHours(ProgramFinal, CurrentFinalEpgHour),
            Overflow = 0;

        //console.log('ProgramStart: ' +ProgramStart + ' ProgramFinal: '+ProgramFinal);
        //console.log('CurrentStart: ' +CurrentStartEpgHour + ' CurrentFinal: '+CurrentFinalEpgHour);
        //console.log('CompareStartEpgHours: ' +CompareStartEpgHours);
        //console.log('CompareFinalEpgHours: ' +CompareFinalEpgHours);

        if(CompareStartEpgHours === '<'){
            /* Obtiene la hora inicio del programa para sacar la diferencia */
            if(ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].FNLH === '00:00'){
                NewFormatFinal = moment('23:59', 'HH:mm');
            } else {
                NewFormatFinal = moment(ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].FNLH, 'HH:mm');
            }
            NewFormatCurrent = moment(CurrentStartEpgHour, 'HH:mm');
            SubstractLenght = Math.abs(NewFormatFinal.diff(NewFormatCurrent, 'hours', true));
            //console.log('................. < 1.1.1) SubstractLenght: '+SubstractLenght);

            ProgramWidth = (SubstractLenght * 40);
            //console.log('................. < 1.1.2) ProgramWidth: '+ProgramWidth);
            TotalWidth = 0;
            TotalWidth += ProgramWidth;
            //console.log('................. < 1.1.3) TotalWidth: '+TotalWidth);

        } else if(CompareFinalEpgHours === '>'){
            /* Obtiene la hora final del programa para sacar la diferencia */
            NewFormatFinal = moment(ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].STRH, 'HH:mm');
            NewFormatCurrent = moment(CurrentFinalEpgHour, 'HH:mm');
            SubstractLenght = Math.abs(NewFormatFinal.diff(NewFormatCurrent, 'hours', true));
            //console.log('................. > 1.1.1) SubstractLenght: '+SubstractLenght);

            ProgramWidth = (SubstractLenght * 40);
            //console.log('................. > 1.1.2) ProgramWidth: '+ProgramWidth);

            TotalWidth += ProgramWidth;
            //console.log('................. > 1.1.3) TotalWidth: '+TotalWidth);
        } else {
            /* Obtiene la longitud del programa */
            ProgramWidth = (parseFloat(ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].DRTN, 10) * 40);
            //console.log('................. 1.1.4) ProgramWidth: '+ProgramWidth);

            /* Suma la longitud contruida */
            TotalWidth += ProgramWidth;
            //console.log('................. 1.1.5) TotalWidth: '+TotalWidth);
        }

        if(TotalWidth > 100){
            Overflow = TotalWidth - 100;
            ProgramWidth = ProgramWidth - Overflow;
        }

        if(ChannelsJson[CurrentChannelPosition].P_Length === 1){
            ProgramWidth = 100;
        }


        //console.log('................. 1.2.0) Width: '+ProgramWidth + ' C: '+CurrentChannelPosition+' P: '+RowProgramPosition);
        //console.log('................. 1.2.2) Start: '+ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].STRH +' Final: '+ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].FNLH+' Title: '+ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].TTLE);
        DivElement  = document.createElement('div');
        ProgramNode = document.createTextNode(ChannelsJson[CurrentChannelPosition].PROGRAMS[RowProgramPosition].TTLE);
        DivElement.appendChild(ProgramNode);
        DivElement.setAttribute('class', 'Program');
        DivElement.setAttribute('title', CurrentChannelPosition+','+RowProgramPosition);
        DivElement.setAttribute('style', 'width:'+ProgramWidth+'%');

        ProgramRow.appendChild(DivElement);


        if(TotalWidth === 100){
            /* Valida si la longitud contruida es igual a 100 */
            LastProgramsPositions[Row] = RowProgramPosition;
            //console.log('................. 1.3.0) LastProgramsPositions[Row]: '+Row + ' - ' +LastProgramsPositions[Row]);

            RowProgramPosition = TotalPrograms;
            //console.log('................. 1.3.1) RowProgramPosition: '+RowProgramPosition);
        }
        else if(TotalWidth > 99){
            /* Valida si la longitud contruida es mayor a 100 */
            LastProgramsPositions[Row] = RowProgramPosition;
            //console.log('................. 1.3.2) LastProgramsPositions[Row]: '+Row + ' - ' +LastProgramsPositions[Row]);

            RowProgramPosition = TotalPrograms;
            //console.log('................. 1.3.3) RowProgramPosition: '+RowProgramPosition);
        }
        else if(RowProgramPosition === (ChannelsJson[CurrentChannelPosition].P_Length - 1)){
            /* Valida si la longitud contruida es mayor a 100 */
            LastProgramsPositions[Row] = RowProgramPosition;
            //console.log('................. 1.3.2) LastProgramsPositions[Row]: '+Row + ' - ' +LastProgramsPositions[Row]);

            RowProgramPosition = TotalPrograms;
            //console.log('................. 1.3.3) RowProgramPosition: '+RowProgramPosition);
        }

        //console.log('_._._._._._._._._._._._._._._._._._._.');
    }
    //console.log(':::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
    //console.log(' ');
}

/*******************************************************************************
 * Construye los renglones con los canales
 *******************************************************************************/

function BuildChannelsRow(CurrentChannelPosition){
    FirstChannelPosition = CurrentChannelPosition;

    for (Rows = 1; Rows <= MaxRows; Rows++) {
        WriteChannelsRow(CurrentChannelPosition, Rows);
        LastChannelPosition = CurrentChannelPosition;
        ++CurrentChannelPosition;

        if(CurrentChannelPosition > ChannelsLength){
            CurrentChannelPosition = 0;
        }
    }
}

/*******************************************************************************
 * Contuye y agrega los datos a mostrar de cada renglon con la programacion
 *******************************************************************************/

function WriteChannelsRow(CurrentChannelPosition, Row){

    var ChannelRowNodes = document.getElementById('ChannelRow'+Row).childNodes;
    ChannelRowNodes[0].textContent = ChannelsJson[CurrentChannelPosition].CHNL;
    if(ChannelsJson[CurrentChannelPosition].QLTY === 'HD'){
        ChannelRowNodes[1].textContent = ChannelsJson[CurrentChannelPosition].INDC +' '+ChannelsJson[CurrentChannelPosition].QLTY;
    } else {
        ChannelRowNodes[1].textContent = ChannelsJson[CurrentChannelPosition].INDC;
    }
}

/*******************************************************************************
 *
 *******************************************************************************/
var NodesRowPrograms1 = '',
    NodesRowPrograms2 = '',
    NodesRowPrograms3 = '',
    NodesRowPrograms4 = '',
    NodesRowPrograms5 = '';

function GetRowsPrograms(){
    NodesRowPrograms1 = document.getElementById('ProgramRow1').childNodes;
    NodesRowPrograms2 = document.getElementById('ProgramRow2').childNodes;
    NodesRowPrograms3 = document.getElementById('ProgramRow3').childNodes;
    NodesRowPrograms4 = document.getElementById('ProgramRow4').childNodes;
    NodesRowPrograms5 = document.getElementById('ProgramRow5').childNodes;
}

function GetFocusStyle(){
    var ProgramFocus        = document.getElementById('ProgramFocus'),
        ProgramFocusStyle   = window.getComputedStyle(ProgramFocus);
    ColorFocus          = ProgramFocusStyle.color;
    BackgroundFocus     = ProgramFocusStyle.backgroundColor;

    ProgramFocus = null;
    ProgramFocusStyle = null;
}


function FocusEpgProgram(RowSelected,ProgramSelect){
    //console.log('================= 1) FocusEpgProgram('+RowSelected+','+ProgramSelect+')');
    if(ProgramsToLeft === true){
        switch (RowSelected) {
            case 1:
                ProgramSelect = NodesRowPrograms1.length;
                --ProgramSelect;
                break;

            case 2:
                ProgramSelect = NodesRowPrograms2.length;
                --ProgramSelect;
                break;

            case 3:
                ProgramSelect = NodesRowPrograms3.length;
                --ProgramSelect;
                break;

            case 4:
                ProgramSelect = NodesRowPrograms4.length;
                --ProgramSelect;
                break;

            case 5:
                ProgramSelect = NodesRowPrograms5.length;
                --ProgramSelect;
                break;
        }
        ProgramSelected = ProgramSelect;
        ProgramsToLeft = false;
    } else if(ProgramsToChange === true){
        switch (RowSelected) {
            case 1:
                if(typeof(NodesRowPrograms1[ProgramSelect]) === 'undefined') {
                    --ProgramSelect;
                    while(typeof(NodesRowPrograms1[ProgramSelect]) === 'undefined') {
                        --ProgramSelect;
                    }
                }
                break;

            case 2:
                if(typeof(NodesRowPrograms2[ProgramSelect]) === 'undefined') {
                    --ProgramSelect;
                    while(typeof(NodesRowPrograms2[ProgramSelect]) === 'undefined') {
                        --ProgramSelect;
                    }
                }
                break;

            case 3:
                if(typeof(NodesRowPrograms3[ProgramSelect]) === 'undefined') {
                    --ProgramSelect;
                    while(typeof(NodesRowPrograms3[ProgramSelect]) === 'undefined') {
                        --ProgramSelect;
                    }
                }
                break;

            case 4:
                if(typeof(NodesRowPrograms4[ProgramSelect]) === 'undefined') {
                    --ProgramSelect;
                    while(typeof(NodesRowPrograms4[ProgramSelect]) === 'undefined') {
                        --ProgramSelect;
                    }
                }
                break;

            case 5:
                if(typeof(NodesRowPrograms5[ProgramSelect]) === 'undefined') {
                    --ProgramSelect;
                    while(typeof(NodesRowPrograms5[ProgramSelect]) === 'undefined') {
                        --ProgramSelect;
                    }
                }
                break;
        }
        ProgramSelected = ProgramSelect;
        ProgramsToChange = false;
    }

    //console.log('================= 2) FocusEpgProgram('+RowSelected+','+ProgramSelect+')');

    switch (RowSelected) {
        case 1:
            NodesRowPrograms1[ProgramSelect].style.backgroundColor = BackgroundFocus;
            NodesRowPrograms1[ProgramSelect].style.color = ColorFocus;
            Positions = NodesRowPrograms1[ProgramSelect].title;
            FocusChannelPosition = Positions.split(',')[0];
            FocusProgramPosition = Positions.split(',')[1];
            break;

        case 2:
            NodesRowPrograms2[ProgramSelect].style.backgroundColor = BackgroundFocus;
            NodesRowPrograms2[ProgramSelect].style.color = ColorFocus;
            Positions = NodesRowPrograms2[ProgramSelect].title;
            FocusChannelPosition = Positions.split(',')[0];
            FocusProgramPosition = Positions.split(',')[1];
            break;

        case 3:
            NodesRowPrograms3[ProgramSelect].style.backgroundColor = BackgroundFocus;
            NodesRowPrograms3[ProgramSelect].style.color = ColorFocus;
            Positions = NodesRowPrograms3[ProgramSelect].title;
            FocusChannelPosition = Positions.split(',')[0];
            FocusProgramPosition = Positions.split(',')[1];
            break;

        case 4:
            NodesRowPrograms4[ProgramSelect].style.backgroundColor = BackgroundFocus;
            NodesRowPrograms4[ProgramSelect].style.color = ColorFocus;
            Positions = NodesRowPrograms4[ProgramSelect].title;
            FocusChannelPosition = Positions.split(',')[0];
            FocusProgramPosition = Positions.split(',')[1];
            break;

        case 5:
            NodesRowPrograms5[ProgramSelect].style.backgroundColor = BackgroundFocus;
            NodesRowPrograms5[ProgramSelect].style.color = ColorFocus;
            Positions = NodesRowPrograms5[ProgramSelect].title;
            FocusChannelPosition = Positions.split(',')[0];
            FocusProgramPosition = Positions.split(',')[1];
            break;
    }
    //console.log('================= 3) FocusEpgProgram('+RowSelected+','+ProgramSelect+')');
    ShowInfoEpg();
}

var BackgroundUnfocus = 'transparent',
    ColorUnfocus = '#fff';

function UnfocusEpgProgram(RowSelected,ProgramSelected){

    switch (RowSelected) {
        case 1:
            NodesRowPrograms1[ProgramSelected].style.backgroundColor = BackgroundUnfocus;
            NodesRowPrograms1[ProgramSelected].style.color = ColorUnfocus;
            break;

        case 2:
            NodesRowPrograms2[ProgramSelected].style.backgroundColor = BackgroundUnfocus;
            NodesRowPrograms2[ProgramSelected].style.color = ColorUnfocus;
            break;

        case 3:
            NodesRowPrograms3[ProgramSelected].style.backgroundColor = BackgroundUnfocus;
            NodesRowPrograms3[ProgramSelected].style.color = ColorUnfocus;
            break;

        case 4:
            NodesRowPrograms4[ProgramSelected].style.backgroundColor = BackgroundUnfocus;
            NodesRowPrograms4[ProgramSelected].style.color = ColorUnfocus;
            break;

        case 5:
            NodesRowPrograms5[ProgramSelected].style.backgroundColor = BackgroundUnfocus;
            NodesRowPrograms5[ProgramSelected].style.color = ColorUnfocus;
            break;
    }
}

function ShowInfoEpg(){
    EpgInfoContainerNodes[1].innerHTML  = ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].TTLE;
    if(RecordingsToCheck !== ''){
        for(IndexRec = 0; IndexRec < RecordingsToCheck.length; IndexRec++){
            if(RecordingsToCheck[IndexRec].databasekey === ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].DBKY) {
                EpgInfoContainerNodes[1].innerHTML  = ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].TTLE + '<p class="RecInfo">  REC</p>';
                IndexRec = RecordingsToCheck.length;
            }
        }
    }
    EpgInfoContainerNodes[3].textContent  = ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].DSCR;
    EpgInfoContainerNodes[5].textContent  = FormatHours(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].STRH)+' - '+FormatHours(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].FNLH);
    EpgInfoContainerNodes[7].textContent  = TimeConvert(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].MNTS);
    EpgInfoContainerNodes[9].textContent  = ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].TVRT;
    EpgInfoContainerNodes[11].innerHTML   = ShowStars(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].STRS);
    EpgInfoContainerNodes[13].textContent = ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].EPSD;
}


function SetChannelLogo(){
    EpgChannelLogo.style.backgroundImage = 'url("'+ Libraries['ChannelsPath'] + ChannelsJson[CurrentChannelPosition].LOGO+'")';
}

/*******************************************************************************
 *
 *******************************************************************************/

function ProgramRight(){
    if(ChannelsJson[FocusChannelPosition].P_Length === 1){
        /* Mueve por posicion de hora*/
        if(LastHourPosition < 47){
            UnfocusEpgProgram(RowSelected,ProgramSelected);

            BuildProgramsRow(LastHourPosition, FirstChannelPosition);

            ProgramSelected = 0;

            FocusEpgProgram(RowSelected,ProgramSelected);
        }
    } else if(parseInt(FocusProgramPosition,10) === LastProgramsPositions[RowSelected]){
        /* Mientras no llegue al final de la programacion */
        if(parseInt(FocusProgramPosition,10) < (ChannelsJson[FocusChannelPosition].P_Length - 1)){
            /* Mueve por posicion de hora*/
            UnfocusEpgProgram(RowSelected,ProgramSelected);

            BuildProgramsRow(LastHourPosition, FirstChannelPosition);

            ProgramSelected = 0;

            FocusEpgProgram(RowSelected,ProgramSelected);
        } else if(parseInt(FocusProgramPosition,10) === (ChannelsJson[FocusChannelPosition].P_Length - 1)){

            GetNextJsonEpg('RIGHT');

            if(NextEpgDataActive === true){

                NextEpgActive = true;

                ClearEpg();

                ChannelsJson = NextChannelsJson;

                OpenEpg();
            }
        }
    } else {
        /* Cambia foco del programa */
        UnfocusEpgProgram(RowSelected,ProgramSelected);

        ++ProgramSelected;

        FocusEpgProgram(RowSelected,ProgramSelected);
    }
}

/*******************************************************************************
 *
 *******************************************************************************/

function ProgramLeft(){

    if(ChannelsJson[FocusChannelPosition].P_Length === 1){

        if(CurrentHourPosition > OnLoadHourPosition){

            UnfocusEpgProgram(RowSelected,ProgramSelected);

            var NewCurrentHourPosition = CurrentHourPosition;

            NewCurrentHourPosition -= 5;

            BuildProgramsRow(NewCurrentHourPosition, FirstChannelPosition);

            ProgramsToLeft = true;

            FocusEpgProgram(RowSelected,ProgramSelected);
        }
    } else if(parseInt(FocusProgramPosition,10) === OnloadProgramsPositions[RowSelected]){
        // Do nothing
        if(NextEpgDataActive === true && NextEpgActive === true){
            if(EpgDayNumber === 1){
                CloseEpg();

                OpenEpg();
            } else {
                GetNextJsonEpg('LEFT');

                ClearEpg();

                ChannelsJson = NextChannelsJson;

                OpenEpg();
            }
        }
    }  else if(parseInt(FocusProgramPosition,10) === FirstProgramsPositions[RowSelected]){

        UnfocusEpgProgram(RowSelected,ProgramSelected);

        var NewCurrentHourPosition = CurrentHourPosition;

        NewCurrentHourPosition -= 5;

        BuildProgramsRow(NewCurrentHourPosition, FirstChannelPosition);

        ProgramsToLeft = true;

        FocusEpgProgram(RowSelected,ProgramSelected);

    } else if(parseInt(FocusProgramPosition,10) !== OnloadProgramsPositions[RowSelected]){

        UnfocusEpgProgram(RowSelected,ProgramSelected);

        --ProgramSelected;

        FocusEpgProgram(RowSelected,ProgramSelected);
    }
}

/*******************************************************************************
 *
 *******************************************************************************/

function ProgramDown(){
    if(RowSelected === 5){

        ++LastChannelPosition;

        if(LastChannelPosition > ChannelsLength){
            LastChannelPosition = 0;
        }

        UnfocusEpgProgram(RowSelected,ProgramSelected);

        var TmpCurrentHourPosition = CurrentHourPosition;

        FirstProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };

        BuildProgramsRow(OnLoadHourPosition, LastChannelPosition);

        BuildProgramsRow(TmpCurrentHourPosition, LastChannelPosition);

        RowSelected = 1;

        CurrentChannelPosition = LastChannelPosition;

        SetChannelLogo();

        ProgramsToChange = true;

        FocusEpgProgram(RowSelected,ProgramSelected);

        BuildChannelsRow(LastChannelPosition);
    } else {
        ProgramsToChange = true;

        UnfocusEpgProgram(RowSelected,ProgramSelected);

        ++CurrentChannelPosition;
        ++RowSelected;

        if(CurrentChannelPosition > ChannelsLength){
            CurrentChannelPosition = 0;
        }

        SetChannelLogo();

        FocusEpgProgram(RowSelected,ProgramSelected);
    }
}

function PageDown(){
    ++LastChannelPosition;

    if(LastChannelPosition > ChannelsLength){
        LastChannelPosition = 0;
    }

    UnfocusEpgProgram(RowSelected,ProgramSelected);

    var TmpCurrentHourPosition = CurrentHourPosition;

    FirstProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };

    BuildProgramsRow(OnLoadHourPosition, LastChannelPosition);

    BuildProgramsRow(TmpCurrentHourPosition, LastChannelPosition);

    CurrentChannelPosition = LastChannelPosition;

    SetChannelLogo();

    ProgramsToChange = true;

    FocusEpgProgram(RowSelected,ProgramSelected);

    BuildChannelsRow(LastChannelPosition);

}

/*******************************************************************************
 *
 *******************************************************************************/

function ProgramUp(){
    if(RowSelected === 1){

        FirstChannelPosition -= 5;

        if(FirstChannelPosition < 0){
            FirstChannelPosition = ChannelsLength - 4;
        }

        UnfocusEpgProgram(RowSelected,ProgramSelected);

        var TmpCurrentHourPosition = CurrentHourPosition;

        FirstProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };

        BuildProgramsRow(OnLoadHourPosition, FirstChannelPosition);

        BuildProgramsRow(TmpCurrentHourPosition, FirstChannelPosition);

        RowSelected = 5;

        ProgramsToChange = true;

        FocusEpgProgram(RowSelected,ProgramSelected);

        BuildChannelsRow(FirstChannelPosition);

        CurrentChannelPosition = LastChannelPosition;

        SetChannelLogo();
    } else {
        ProgramsToChange = true;

        UnfocusEpgProgram(RowSelected,ProgramSelected);

        --CurrentChannelPosition;
        --RowSelected;

        if(CurrentChannelPosition < 0){
            CurrentChannelPosition = ChannelsLength;
        }

        SetChannelLogo();

        FocusEpgProgram(RowSelected,ProgramSelected);
    }
}


function PageUp(){

    FirstChannelPosition -= 5;

    if(FirstChannelPosition < 0){
        FirstChannelPosition = ChannelsLength - 4;
    }

    UnfocusEpgProgram(RowSelected,ProgramSelected);

    var TmpCurrentHourPosition = CurrentHourPosition;

    FirstProgramsPositions = { 1:-1, 2:-1, 3:-1, 4:-1, 5:-1 };

    BuildProgramsRow(OnLoadHourPosition, FirstChannelPosition);

    BuildProgramsRow(TmpCurrentHourPosition, FirstChannelPosition);

    ProgramsToChange = true;

    FocusEpgProgram(RowSelected,ProgramSelected);

    BuildChannelsRow(FirstChannelPosition);

    CurrentChannelPosition = LastChannelPosition;

    SetChannelLogo();
}
