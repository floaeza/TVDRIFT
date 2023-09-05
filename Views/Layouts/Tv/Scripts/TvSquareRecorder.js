// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: Grabador y reproductor de grabaciones
 * Vendor: Generic
 * - PVR_ONLY [STB con HDD, ubicacion DEFAULT]
 * - WHP_HDDY [STB con HDD, ubicacion HABITACION, VILLA O RESIDENCIA]
 * - WHP_HDDN [STB sin HDD, ubicacion HABITACION, VILLA O RESIDENCIA con STB grabador]
 * - NONE     [STB sin HDD, ubicacion DEFAULT || ubicacion sin STB grabador]
 */

/* Variables contenedores generales */
var PlayingRecording            = false,
    RecordingOptionsActive      = false,
    RecordManualOptionsActive   = false,
    RecordPlayOptionsActive     = false,
    ActivePvrInfoContainer      = false,
    RecordingPanel              = false,
    RecordOptions               = false,
    DeleteOptions               = false,
    RecorderMessageActive       = false;

/* Variables a utilizar con grabador activo */
if(Device['Type'] !== 'NONE'){

    /* Panel pvr en la guia */
    var RecordingOptions        = document.getElementById('RecordingOptions'),
        RecordingOptionsNodes   = RecordingOptions.childNodes,
        RecordManualOptions     = document.getElementById('RecordingManualOptions'),
        RecordManualOptionsNodes= RecordManualOptions.childNodes,
        RecorderMessage         = document.getElementById('RecorderMessage');

    var OptionsNodesArray       = [1,3,5,7],
        ManualNodesArray        = [4,6,8,10,15,17],
        RecordsNodesArray       = [1,3,5],
        OptionsFocus            = -1,
        RecorderMessageTimer    = '',
        RecordingOptionTimer    = '',
        RecordingManualTimer    = '',
        MacAddressPvr           = MacAddress;

    var OperationsList          = { record:1, delete:2, recording:3, recorded:4};

    var RecordingsList          = '',
        SchedulesList           = '',
        SeriesList              = '',
        DiskInfo                = '';

    var RecordPlayOptions       = document.getElementById('RecordPlayOptions'),
        RecordPlayOptionsNodes  = RecordPlayOptions.childNodes;

    /* Pvr panel */
    var PvrContainer            = document.getElementById('PvrContainer'),
        PvrOptions              = document.getElementById('PvrOptions'),
        PvrOptionsNodes         = PvrOptions.childNodes,
        PvrDeleteOptions        = document.getElementById('PvrDeleteOptions'),
        PvrDeleteOptionsNodes   = PvrDeleteOptions.childNodes,
        PvrListNodes            = document.getElementById('PvrList').childNodes,
        PvrInfoNodes            = document.getElementById('PvrInfo').childNodes,
        CurrentPvrOption        = document.getElementById('CurrentPvrOption'),
        PvrDiskInfoNodes        = document.getElementById('PvrDiskInfo').childNodes;

    var PvrTimer                = '',
        SecondsToClosePvr       = 300,
        TimeoutPvr              = SecondsToClosePvr * 1000;

    var OptionPanel             = '',
        ListTypeFocus           = '',
        RowTypeFocus            = '',
        PvrRowFocus             = 1,
        LastPvrRowFocus         = 0,
        DiskInfoIndex           = 0;

    /* Recordings */
    var IndexRecordedFocus      = -1,
        IndexRecordedProgFocus  = 0,
        FirstIndexRecorded      = 0;

    /* Schedules */
    var IndexScheduleFocus      = -1,
        IndexScheduleProgFocus  = 0,
        FirstIndexSchedule      = 0;

    /* Series */
    var IndexSerieFocus         = -1,
        FirstIndexSerie         = 0;

    var NewStartHour            = '',
        NewEndHour              = '',
        ProgramUtcStartDate     = 0,
        REC_CHNL_POS            = 0,
        REC_PROG_POS            = 0,
        ADD_SERIE_BCKG          = false,
        ProgramUtcEndDate       = 0,
        SecondsRange            = 20 * 60, //20 min
        SecondsOffset           = Math.abs((Device.OffsetZone * 60 * 60));

    var SpeedArray              = ['2','4','8','12','16'],
        Speed                   = 0,
        SpeedText               = '',
        OptionText              = '',
        ForwardIndex            = -1,
        BackwardIndex           = -1;

    var BarContainer            = document.getElementById('BarContainer'),
        BarPosition             = document.getElementById('BarPosition'),
        BarStatus               = document.getElementById('BarStatus');

    var BarTimer                = '',
        BarUpdate               = '',
        DurationAsset           = 0,
        PositionAsset           = 0,
        PercentagePosition      = 0;

    var ManualHour              = 1,
        ManualMinute            = 0,
        ManualIndicator         = 0,
        ManualTime              = 0,
        ManualListIndicator     = ['AM','PM'],
        ManualListTime          = ['+15 min','+30 min','+1 hour','+1.5 hours','+2 hours', '+2.5 hours','+3 hours'],
        ManualListMinutes       = [15,30,60,90,120,150,180];

}

/*******************************************************************************
 * Abre, cierra y pone el foco en las opciones del grabador solo si la guia esta activa y "puede" grabar
 *******************************************************************************/

function OpenRecordingOptions(){
    RecordingOptionsActive = true;

    clearTimeout(RecordingOptionTimer);
    RecordingOptionTimer = setTimeout(CloseRecordingOptions,8000);

    // Quita las lineas de los programas para que no se vean encima del cuadro de opciones
    var AllPrograms = document.getElementsByClassName('Program'),
        IndexProgram = 0;
    for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
        AllPrograms[IndexProgram].style.outline = 'none'; //1px solid rgb(0, 68, 114)
    }
    //
    RecordingOptions.style.visibility = 'visible';

    SetFocusOptionRecording('down');
}

function SetFocusOptionRecording(Direction){
    if(OptionsFocus >= 0){
        RecordingOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= OptionsNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (OptionsNodesArray.length -1 );
    }

    RecordingOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');

    clearTimeout(RecordingOptionTimer);

    RecordingOptionTimer = setTimeout(CloseRecordingOptions,8000);
}

function CloseRecordingOptions(){
    if(ActiveEpgContainer === true && RecordingOptionsActive === true){
        RecordingOptionsActive = false;

        clearTimeout(RecordingOptionTimer);

        OptionsFocus = -1;

        // Agrega las lineas de los programas
        var AllPrograms = document.getElementsByClassName('Program'),
            IndexProgram = 0;
        for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
            AllPrograms[IndexProgram].style.outline = '1px solid '+BackgroundFocus;
        }

        RecordingOptions.style.visibility = 'hidden';

        var IndexOptionsNodes = 0;

        for(IndexOptionsNodes = 0; IndexOptionsNodes < OptionsNodesArray.length; IndexOptionsNodes++){
            RecordingOptionsNodes[OptionsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
        }
    }
}

function SelectRecordingsOption(){
    Debug('--- TvOk - SelectRecordingsOption');
    switch (OptionsNodesArray[OptionsFocus]) {
        case 1:
            CloseRecordingOptions();

            PlayChannelEpg();

            break;

        case 3:
            REC_CHNL_POS = FocusChannelPosition;
            REC_PROG_POS = FocusProgramPosition;

            ADD_SERIE_BCKG = false;

            if(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].DRTN !== '24'){
                CheckRecordings();
            } else {
                CloseRecordingOptions();
                OpenManualRecord();
            }
            break;

        case 5:
            Debug('--- TvOk - 5');
            if(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].DRTN !== '24'){
                AddSerie();
                Debug('--- TvOk - AddSerie');
            } else {
                ShowRecorderMessage('Not available on this channel');
            }
            break;

        case 7:
            CloseRecordingOptions();
            break;
    }
}

/*******************************************************************************
 * Agrega programa en serie
 *******************************************************************************/

function ShowRecorderMessage(Message){
    clearTimeout(RecorderMessageTimer);

    RecorderMessageTimer = setTimeout(HideRecorderMessage,5000);
    RecorderMessage.textContent = '';
    RecorderMessage.style.display = 'inline';
    RecorderMessage.textContent = Message;
}

function HideRecorderMessage(){
    clearTimeout(RecorderMessageTimer);
    RecorderMessage.textContent = '';
    RecorderMessage.style.display = 'none';
}

/*******************************************************************************
 * Muestra lista de graciones, schedules y series
 *******************************************************************************/

function OpenPvr(){
    if(RecordingPanel === false){

        IndexRecordedFocus  = -1;
        IndexRecordedProgFocus = 0;

        MinimizeTV();

        GetRecordings();

        HidePvrInfo();

        PvrContainer.style.visibility = 'visible';

        RecordingPanel = true;

        OptionPanel = 'Recordings';

        ListTypeFocus = 'all';

        SetOptionPanel();

        GetPvrInfo();

        PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
    }
}

function ClosePvr(){
    PvrContainer.style.visibility = 'hidden';

    RecordingPanel          = false;
    RecordOptions           = false;
    DeleteOptions           = false;

    MaximizeTV();

    if(PlayingRecording === false){
        RecordingsList          = '';
    }

    SchedulesList           = '';
    SeriesList              = '';

    OptionPanel             = '';
    ListTypeFocus           = '';
    RowTypeFocus            = '';
    PvrRowFocus             = 1;
    LastPvrRowFocus         = 0;

    FirstIndexRecorded      = 0;

    IndexScheduleFocus      = -1;
    IndexScheduleProgFocus  = 0;
    FirstIndexSchedule      = 0;

    IndexSerieFocus         = -1;
    FirstIndexSerie         = 0;

    HideRecordOption();

    HideDeleteOption();

    clearTimeout(PvrTimer);
}

function SetOptionPanel(){
    if(OptionPanel === 'Recordings'){
        SetRecordings('');

        SetFocusRecordings();

        CurrentPvrOption.textContent = OptionPanel;
    } else if(OptionPanel === 'Schedules'){
        SetSchedules('');

        SetFocusSchedules();

        CurrentPvrOption.textContent = OptionPanel;
    } else if(OptionPanel === 'Series'){
        SetSeries('');

        SetFocusSeries();

        CurrentPvrOption.textContent = OptionPanel;
    }
}

function SetPvrInfo(){
    //Device['MacAddressPvr'].length

    var AvailableSize  = 0,
        TotalSize = 0;

    if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
        var StorageInfo = [];

        if(typeof(ASTB) !== 'undefined') {
            StorageInfo = PVR.GetStorageInfo();

            AvailableSize = (parseInt(StorageInfo.availableSize,10)/ 1024);
            TotalSize = (parseInt(StorageInfo.totalSize,10)/ 1024);

        } else if(typeof(ENTONE) !== 'undefined'){
            StorageInfo = ENTONE.recorder.getStorageInfo();

             TotalSize = (StorageInfo.pvrTotalSpace / 1024) / 1024;
             AvailableSize = (StorageInfo.pvrFreeSpace / 1024) / 1024;

        }else if(typeof(gSTB) !== 'undefined'){
            storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
            USB = storageInfo.result || [];

            TotalSize = (USB[0].size / 1024) / 1024;
            AvailableSize = (USB[0].freeSize / 1024) / 1024;
        }
    } else {
        AvailableSize  = (parseInt(DiskInfo[DiskInfoIndex].espacio_disponible,10) / 1024);
        TotalSize = (parseInt(DiskInfo[DiskInfoIndex].espacio_total,10) / 1024);
    }

    AvailableSize  = (AvailableSize / 1024).toFixed(2);
    TotalSize = (TotalSize / 1024).toFixed(2);

    var Percentage = (AvailableSize / TotalSize) * 100,
        PercentageSize = (100 - Percentage).toFixed(2);

    PvrDiskInfoNodes[1].textContent = AvailableSize + ' GB available of ' + TotalSize + ' GB';
    PvrDiskInfoNodes[5].textContent = PercentageSize + '%';
    PvrDiskInfoNodes[5].style.width = PercentageSize + '%';

    if(PercentageSize > 95){
        PvrDiskInfoNodes[5].style.color = '#e36464';
        if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
            DeleteOldestAssets();
        }
    }

    TotalSize = null;
    Percentage = null;
}

/*******************************************************************************
 * Muestra lista de graciones
 *******************************************************************************/

function SetRecordings(Direction){

    var Row  = 1,
        Icon  = '',
        Title = '',
        IndexProgram = 0;

    var IndexRecorded = 0;

    if(ListTypeFocus === 'all'){

        if(IndexRecordedFocus === -1){
            IndexRecorded = -1;
        } else {
            IndexRecorded = IndexRecordedFocus;

            if (Direction === 'up'){
                IndexRecorded -= 11;
                IndexRecordedFocus--;
            } else {
                IndexRecordedFocus++;
            }
        }

        var ActiveRec = '',
            LastChr = '';
        for (Row = 1; Row <= 19; Row++) {

            IndexRecorded++;

            if(Row === 1){
                FirstIndexRecorded = IndexRecorded;
            }

            if(IndexRecorded < RecordingsList.length){
                if(RecordingsList[IndexRecorded].length > 2){
                    Icon = '<i class="fa fa-folder-open"></i>';
                    Title = 'serie';
                } else {
                    Icon = '<i class="fa fa-file"></i>';
                    Title = 'rec';

                    if(RecordingsList[IndexRecorded][1].active === '1'){
                        ActiveRec = ' (recording)';
                        Icon = '<i class="fa fa-circle" id="IconRecording"></i>';
                    } else {
                        LastChr = RecordingsList[IndexRecorded][1].url;

                        if(LastChr.substr(LastChr.length - 1) === '0'){
                            ActiveRec = ' (scheduled)';
                            Icon = '<i class="fa fa-chevron-right" id="IconRecording"></i>';
                        } else {
                            ActiveRec = '';
                        }
                    }
                }

                PvrListNodes[Row].innerHTML = Icon + ' '+ RecordingsList[IndexRecorded][IndexProgram] + ActiveRec;
                PvrListNodes[Row].title = Title + ','+IndexRecorded+',1';

                Row++;
            } else {
                PvrListNodes[Row].innerHTML = '';
                PvrListNodes[Row].title = '';
            }
        }
    } else {
        Icon = '<i class="fa fa-file"></i>';
        Title = 'rec';

        IndexProgram = IndexRecordedProgFocus;

        if(IndexRecordedProgFocus !== 1){
            IndexProgram++;
        }

        if (Direction === 'up'){
            IndexProgram -= 11;
            IndexRecordedProgFocus--;
        }

        for (Row = 1; Row <= 19; Row++) {

            if(IndexProgram < RecordingsList[IndexRecordedFocus].length){

                if(RecordingsList[IndexRecordedFocus][IndexProgram].active === '1'){
                    ActiveRec = ' (recording)';
                    Icon = '<i class="fa fa-circle" id="IconRecording"></i>';
                } else {
                    ActiveRec = '';
                }

                if(RecordingsList[IndexRecordedFocus][IndexProgram].episode !== ''){
                    PvrListNodes[Row].innerHTML = Icon + ' '+ IndexProgram+ ' - '+ RecordingsList[IndexRecordedFocus][IndexProgram].episode + ActiveRec;
                } else {
                    PvrListNodes[Row].innerHTML = Icon + ' '+ IndexProgram+ ' - '+  moment(RecordingsList[IndexRecordedFocus][IndexProgram].date).format('MMMM Do YYYY')  + ActiveRec;
                }

                PvrListNodes[Row].title = Title + ','+IndexRecordedFocus+','+IndexProgram;
                Row++;
            } else {
                PvrListNodes[Row].innerHTML = '';
                PvrListNodes[Row].title = '';
            }

            IndexProgram++;
        }
    }
}

function SetFocusRecordings(){
    var Row = 1;

    for (Row = 1; Row <= 19; Row++) {
        PvrListNodes[Row].setAttribute('class','PvrProgram');
        Row++;
    }

    PvrListNodes[PvrRowFocus].setAttribute('class','PvrProgramFocus');

    RowTypeFocus  = PvrListNodes[PvrRowFocus].title.split(',')[0];

    if(RowTypeFocus !== ''){
        IndexRecordedFocus  = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[1]);
        IndexRecordedProgFocus   = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[2]);

        if(RowTypeFocus === 'serie'){
            PvrInfoNodes[1].textContent  = 'Episodes:';
            PvrInfoNodes[3].textContent  = '';
            PvrInfoNodes[5].innerHTML    = '';
            PvrInfoNodes[7].textContent  = RecordingsList[IndexRecordedFocus].length - 1;
            PvrInfoNodes[9].textContent  = '';
            PvrInfoNodes[11].textContent = RecordingsList[IndexRecordedFocus][0];
        } else {
            PvrInfoNodes[1].textContent  = moment(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].date).format('MMMM Do YYYY');
            PvrInfoNodes[3].textContent  = TimeConvert(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration);
            PvrInfoNodes[5].innerHTML    = ShowStars(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].rating);
            PvrInfoNodes[7].textContent  = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].episode;
            PvrInfoNodes[9].textContent  = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].description;
            PvrInfoNodes[11].textContent = RecordingsList[IndexRecordedFocus][0];
        }
    }  else {
        ClearInfoPanelPvr();
    }
}

/*******************************************************************************
 *  Opciones para las grabaciones completas
 *******************************************************************************/

function ShowRecordOption(){
    RecordOptions = true;

    PvrOptions.style.visibility = 'visible';

    SetFocusOptionRecord('down');
}

function HideRecordOption(){
    RecordOptions = false;

    PvrOptions.style.visibility = 'hidden';

    OptionsFocus = -1;

    var IndexOptionsNodes = 0;

    for(IndexOptionsNodes = 0; IndexOptionsNodes < RecordsNodesArray.length; IndexOptionsNodes++){
        PvrOptionsNodes[RecordsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
    }
}


function SetFocusOptionRecord(Direction){
    if(OptionsFocus >= 0){
        PvrOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= RecordsNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (RecordsNodesArray.length -1 );
    }

    PvrOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');
}

function SelectRecordOption(){

    switch (RecordsNodesArray[OptionsFocus]) {
        case 1:
            ClearSpeed();

            PlayVideo(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);

            Debug('URL>>>>>> '+RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url)

            PlayingRecording = true;

            ClosePvr();

            ShowPvrInfo();

            SetSpeed('play');
            break;

        case 3:
            HideRecordOption();

            SetDeleteProgram();
            break;

        case 5:
            HideRecordOption();
            break;
    }
}

/*******************************************************************************
 *  Opciones para eliminar algun schedule o serie
 *******************************************************************************/

function ShowDeleteOption(){
    DeleteOptions = true;

    PvrDeleteOptions.style.visibility = 'visible';

    SetFocusOptionDelete('down');
}

function HideDeleteOption(){
    DeleteOptions = false;

    PvrDeleteOptions.style.visibility = 'hidden';

    OptionsFocus = -1;

    var IndexOptionsNodes = 0;

    for(IndexOptionsNodes = 0; IndexOptionsNodes < (RecordsNodesArray.length - 1); IndexOptionsNodes++){
        PvrDeleteOptionsNodes[RecordsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
    }
}


function SetFocusOptionDelete(Direction){
    if(OptionsFocus >= 0){
        PvrDeleteOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= (RecordsNodesArray.length - 1)){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (RecordsNodesArray.length - 2);
    }

    PvrDeleteOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');
}

function SelectDeleteOption(){

    switch (RecordsNodesArray[OptionsFocus]) {
        case 1:
            HideDeleteOption();

            if(OptionPanel === 'Schedules'){
                SetDeleteProgram();
            } else {
                DeleteSerie();
            }
            break;

        case 3:
            HideDeleteOption();
            break;
    }
}

/*******************************************************************************
 * Muestra y oculta la informacion de la grabacion en reproduccion
 *******************************************************************************/

function ShowPvrInfo(){

    if(ActivePvrInfoContainer === false){
        InfoContainer.style.visibility = 'visible';

        ShowBarStatus();

        ActivePvrInfoContainer = true;

        InfoContainerNodes[1].innerHTML  = '<p class="RecInfo">REC:</p>';
        InfoContainerNodes[3].textContent  = '';
        InfoContainerNodes[5].textContent  = RecordingsList[IndexRecordedFocus][0];
        InfoContainerNodes[7].textContent  = moment(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].date).format('MMMM Do YYYY');
        InfoContainerNodes[9].textContent  = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].episode;
        InfoContainerNodes[11].innerHTML   = ShowStars(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].rating);
        InfoContainerNodes[13].textContent = TimeConvert(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration);
        InfoContainerNodes[15].textContent = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].description;

        clearTimeout(InfoTimer);

        InfoTimer = setTimeout(HidePvrInfo,TimeoutInfo);
    } else {
        HideBarStatus();
        HidePvrInfo();
    }
}

function HidePvrInfo(){
    if(ActivePvrInfoContainer === true){
        ActivePvrInfoContainer = false;

        InfoContainer.style.visibility = 'hidden';

        InfoContainerNodes[1].innerHTML  = '';
        InfoContainerNodes[3].textContent  = '';
        InfoContainerNodes[5].textContent  = '';
        InfoContainerNodes[7].textContent  = '';
        InfoContainerNodes[9].textContent  = '';
        InfoContainerNodes[11].innerHTML   = '';
        InfoContainerNodes[13].textContent = '';
        InfoContainerNodes[15].textContent = '';

        clearTimeout(InfoTimer);
    }
}

/*******************************************************************************
 * Muestra lista de schedules
 *******************************************************************************/

function SetSchedules(Direction){

    var Row  = 1,
        Icon  = '',
        Title = '',
        IndexProgram = 0;

    var IndexSchedule = 0;

    if(ListTypeFocus === 'all'){

        if(IndexScheduleFocus === -1){
            IndexSchedule = -1;
        } else {
            IndexSchedule = IndexScheduleFocus;

            if (Direction === 'up'){
                IndexSchedule -= 11;
                IndexScheduleFocus--;
            } else {
                IndexScheduleFocus++;
            }
        }


        for (Row = 1; Row <= 19; Row++) {

            IndexSchedule++;

            if(Row === 1){
                FirstIndexSchedule = IndexSchedule;
            }

            if(IndexSchedule < SchedulesList.length){
                if(SchedulesList[IndexSchedule].length > 2){
                    Icon = '<i class="fa fa-folder-open"></i>';
                    Title = 'serie';
                } else {
                    Icon = '<i class="fa fa-file-o"></i>';
                    Title = 'rec';
                }

                PvrListNodes[Row].innerHTML = Icon + ' '+ SchedulesList[IndexSchedule][IndexProgram];
                PvrListNodes[Row].title = Title + ','+IndexSchedule+',1';

                Row++;
            } else {
                PvrListNodes[Row].innerHTML = '';
                PvrListNodes[Row].title = '';
            }
        }
    } else {
        Icon = '<i class="fa fa-file"></i>';
        Title = 'rec';

        IndexProgram = IndexScheduleProgFocus;

        if(IndexScheduleProgFocus !== 1){
            IndexProgram++;
        }

        if (Direction === 'up'){
            IndexProgram -= 11;
            IndexScheduleProgFocus--;
        }

        for (Row = 1; Row <= 19; Row++) {

            if(IndexProgram < SchedulesList[IndexScheduleFocus].length){

                if(SchedulesList[IndexScheduleFocus][IndexProgram].episode !== ''){
                    PvrListNodes[Row].innerHTML = Icon + ' '+ IndexProgram+ ' - '+ SchedulesList[IndexScheduleFocus][IndexProgram].episode;
                } else {
                    PvrListNodes[Row].innerHTML = Icon + ' '+ IndexProgram+ ' - '+  moment(SchedulesList[IndexScheduleFocus][IndexProgram].date).format('MMMM Do YYYY');
                }
                PvrListNodes[Row].title = Title + ','+IndexScheduleFocus+','+IndexProgram;
                Row++;
            } else {
                PvrListNodes[Row].innerHTML = '';
                PvrListNodes[Row].title = '';
            }

            IndexProgram++;
        }
    }
}

function SetFocusSchedules(){
    var Row = 1,
        ScheduleDate = '',
        StartHour    = '',
        FinalHour    = '';

    for (Row = 1; Row <= 19; Row++) {
        PvrListNodes[Row].setAttribute('class','PvrProgram');
        Row++;
    }

    PvrListNodes[PvrRowFocus].setAttribute('class','PvrProgramFocus');

    RowTypeFocus  = PvrListNodes[PvrRowFocus].title.split(',')[0];

    if(RowTypeFocus !== ''){
        IndexScheduleFocus  = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[1]);
        IndexScheduleProgFocus   = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[2]);

        if(RowTypeFocus === 'serie'){
            PvrInfoNodes[1].textContent  = 'Episodes:';
            PvrInfoNodes[3].textContent  = '';
            PvrInfoNodes[5].textContent  = '';
            PvrInfoNodes[7].textContent  = SchedulesList[IndexScheduleFocus].length - 1;
            PvrInfoNodes[9].textContent  = '';
            PvrInfoNodes[11].textContent = SchedulesList[IndexScheduleFocus][0];
        } else {

            ScheduleDate = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].date;
            StartHour    = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].start;
            StartHour    = StartHour.replace(/:/g,'');
            FinalHour    = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].final;
            FinalHour    = FinalHour.replace(/:/g,'');

            PvrInfoNodes[1].textContent  = moment(ScheduleDate).format('MMMM Do YYYY');
            PvrInfoNodes[3].textContent  = moment(ScheduleDate + ' ' + StartHour).format('h:mm a') + ' - ' + moment(ScheduleDate + ' ' + FinalHour).format('h:mm a');
            PvrInfoNodes[5].textContent  = '';
            PvrInfoNodes[7].textContent  = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].episode;
            PvrInfoNodes[9].textContent  = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].description;
            PvrInfoNodes[11].textContent = SchedulesList[IndexScheduleFocus][0];
        }
    }  else {
        ClearInfoPanelPvr();
    }
}

/*******************************************************************************
 * Muestra lista de series
 *******************************************************************************/

function SetSeries(Direction){

    var Row  = 1,
        Icon = '<i class="fa fa-bookmark"></i>',
        Title = 'series';

    var IndexSerie = 0;

    if(ListTypeFocus === 'all'){

        if(IndexSerieFocus === -1){
            IndexSerie = -1;
        } else {
            IndexSerie = IndexSerieFocus;

            if (Direction === 'up'){
                IndexSerie -= 11;
                IndexSerieFocus--;
            } else {
                IndexSerieFocus++;
            }
        }

        for (Row = 1; Row <= 19; Row++) {

            IndexSerie++;

            if(Row === 1){
                FirstIndexSerie = IndexSerie;
            }

            if(IndexSerie < SeriesList.length){
                PvrListNodes[Row].innerHTML = Icon + ' '+ SeriesList[IndexSerie].titulo;
                PvrListNodes[Row].title = Title + ','+IndexSerie;

                Row++;
            } else {
                PvrListNodes[Row].innerHTML = '';
                PvrListNodes[Row].title = '';
            }
        }
    }
}

function SetFocusSeries(){
    var Row = 1,
        SerieDate = '';

    for (Row = 1; Row <= 19; Row++) {
        PvrListNodes[Row].setAttribute('class','PvrProgram');
        Row++;
    }

    PvrListNodes[PvrRowFocus].setAttribute('class','PvrProgramFocus');

    RowTypeFocus  = PvrListNodes[PvrRowFocus].title.split(',')[0];

    if(RowTypeFocus !== ''){
        IndexSerieFocus  = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[1]);

        SerieDate = SeriesList[IndexSerieFocus].fecha_adicion;

        PvrInfoNodes[1].textContent  = 'Recording since: '+moment(SerieDate).format('MMMM Do YYYY');
        PvrInfoNodes[3].textContent  = '';
        PvrInfoNodes[5].textContent  = '';
        PvrInfoNodes[7].textContent  = 'Recording on: '+SeriesList[IndexSerieFocus].canal;
        PvrInfoNodes[9].textContent  = '';
        PvrInfoNodes[11].textContent = '';
    } else {
        ClearInfoPanelPvr();
    }
}


function ClearInfoPanelPvr(){
    PvrInfoNodes[1].textContent  = '';
    PvrInfoNodes[3].textContent  = '';
    PvrInfoNodes[5].textContent  = '';
    PvrInfoNodes[7].textContent  = '';
    PvrInfoNodes[9].textContent  = '';
    PvrInfoNodes[11].textContent = '';
}

/*******************************************************************************
 * Abre, cierra y pone el foco en las opciones de la grabacion
 *******************************************************************************/

function OpenRecordPlayOptions(){
    if(PlayingRecording === true){
        RecordPlayOptionsActive = true;

        RecordPlayOptions.style.visibility = 'visible';

        SetFocusOptionRecordPlay('down');
    }
}

function SetFocusOptionRecordPlay(Direction){
    if(OptionsFocus >= 0){
        RecordPlayOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= OptionsNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (OptionsNodesArray.length -1 );
    }

    RecordPlayOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');
}

function CloseRecordPlayOptions(){
    if(RecordPlayOptionsActive === true){
        RecordPlayOptionsActive = false;

        OptionsFocus = -1;

        RecordPlayOptions.style.visibility = 'hidden';

        var IndexOptionsNodes = 0;

        for(IndexOptionsNodes = 0; IndexOptionsNodes < OptionsNodesArray.length; IndexOptionsNodes++){
            RecordPlayOptionsNodes[OptionsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
        }
    }
}

function SelectRecordPlayOption(){

    switch (OptionsNodesArray[OptionsFocus]) {
        case 1:
            // play again
            ClearSpeed();

            PlayingRecording = true;

            PlayVideo(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);

            Debug('URL>>>>>>>>>> '+RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);

            ShowPvrInfo();

            SetSpeed('play');
            break;

        case 3:
            // delete
            OptionPanel = 'Recordings';

            SetDeleteProgram();

            StopVideo();

            SetChannel('');

            break;

        case 5:
            // stop
            PlayingRecording =  false;

            StopVideo();

            HideBarStatus();

            SetChannel('');
            break;
    }

    CloseRecordPlayOptions();
}

/*******************************************************************************
 * Opciones reproduccion
 *******************************************************************************/

function ClearSpeed(){
    SpeedText           = '';
    OptionText          = '';
    Speed               = 0;
    ForwardIndex        = -1;
    BackwardIndex       = -1;
    PercentagePosition  = 0;
    PositionAsset       = 0;
    DurationAsset       = 0;
}

function SetSpeed(Option){
    Debug('SetSpeed -->> ' + Option);
    if(Option === 'forward'){
        BackwardIndex = -1;

        if(ForwardIndex < (SpeedArray.length - 1)){
            ForwardIndex++;
        }

        Speed = SpeedArray[ForwardIndex];

        SpeedText = Speed+'x';

        SpeedVideo(Speed);
    } else if(Option === 'backward'){
        ForwardIndex = -1;

        if(BackwardIndex < (SpeedArray.length - 1)){
            BackwardIndex++;
        }

        Speed = -Math.abs(SpeedArray[BackwardIndex]);

        SpeedText = Speed+'x';

        SpeedVideo(Speed);
    } else if(Option === 'pause'){
        ForwardIndex = -1;
        BackwardIndex = -1;

        Speed = 0;
        SpeedText = '';

        PauseVideo();
    } else if(Option === 'play'){
        ForwardIndex = -1;
        BackwardIndex = -1;

        Speed = 1;
        SpeedText = '';

        Debug('SetSpeed -->>> ' + Speed);
        ResumeVideo();
        Debug('ResumeVideo -->>> ');
    }

    OptionText = Option;

    ShowBarStatus();
}

function ShowBarStatus(){

    /* Muestra la barra */
    BarContainer.style.display = 'inline';

    if(OptionText === 'play'){
        /* Limpia el contador */
        clearTimeout(BarTimer);

        /* Contador para ocultar contenedor principal con la informacion*/
        BarTimer = setTimeout(HideBarStatus,7000);
    } else {
        clearTimeout(BarTimer);
    }

    Debug('ShowBarStatus......');
    UpdateBarStatus();

    clearTimeout(BarUpdate);

    BarUpdate = setInterval(UpdateBarStatus,1000);
}

function UpdateBarStatus(){
    var AssetDuration = 0;

    if(PlayingRecording === true){
        AssetDuration = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration;
    }
    AssetStatus(AssetDuration);

    BarPosition.style.width = PercentagePosition +'%';
    BarPosition.textContent = SecondsToTime(PositionAsset);
    BarStatus.innerHTML = "<p>"+SecondsToTime(DurationAsset)+"</p><i class='fa fa-"+OptionText+"' ></i><p>"+SpeedText+"</p>";
}

function HideBarStatus(){
    BarContainer.style.display = 'none';
    clearTimeout(BarTimer);
    clearTimeout(BarUpdate);
}

/*******************************************************************************
 *  Opciones para agregar manualmente una grabaciones
 *******************************************************************************/

function OpenManualRecord(){
    RecordManualOptionsActive = true;

    clearTimeout(RecordingManualTimer);
    RecordingManualTimer = setTimeout(CloseManualRecord,8000);

    // Quita las lineas de los programas para que no se vean encima del cuadro de opciones
    var AllPrograms = document.getElementsByClassName('Program'),
        IndexProgram = 0;
    for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
        AllPrograms[IndexProgram].style.outline = 'none'; //1px solid rgb(0, 68, 114)
    }
    //

    RecordManualOptions.style.visibility = 'visible';

    SetFocusManualOption('down');

    ManualHour   = parseInt(moment().format('h'));
    ManualMinute = parseInt(moment().format('mm'));

    if(moment().format('A') === 'AM'){
        ManualIndicator = 0;
    } else {
        ManualIndicator = 1;
    }

    RecordManualOptionsNodes[ManualNodesArray[0]].textContent = pad(ManualHour,2);
    RecordManualOptionsNodes[ManualNodesArray[1]].textContent = pad(ManualMinute,2);
    RecordManualOptionsNodes[ManualNodesArray[2]].textContent = ManualListIndicator[ManualIndicator];
    RecordManualOptionsNodes[ManualNodesArray[3]].textContent = ManualListTime[ManualTime];
}

function CloseManualRecord(){
    if(ActiveEpgContainer === true && RecordManualOptionsActive === true){
        RecordManualOptionsActive = false;

        clearTimeout(RecordingManualTimer);

        // Agrega las lineas de los programas
        var AllPrograms = document.getElementsByClassName('Program'),
            IndexProgram = 0;
        for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
            AllPrograms[IndexProgram].style.outline = '1px solid '+BackgroundFocus;
        }

        RecordManualOptions.style.visibility = 'hidden';

        OptionsFocus = -1;

        ManualHour              = 1;
        ManualMinute            = 0;
        ManualIndicator         = 0;
        ManualTime              = 0;

        var IndexOptionsNodes = 0;

        for(IndexOptionsNodes = 0; IndexOptionsNodes < (ManualNodesArray.length - 1); IndexOptionsNodes++){
            RecordManualOptionsNodes[ManualNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
        }
    }
}


function SetFocusManualOption(Direction){
    if(OptionsFocus >= 0){
        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= ManualNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (ManualNodesArray.length - 1 );
    }

    RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');

    clearTimeout(RecordingManualTimer);

    RecordingManualTimer = setTimeout(CloseManualRecord,8000);
}


function SetManualTime(Option){
    if(OptionsFocus === 0){
        // 01 - 12
        (Option === 'down') ? ManualHour--: ManualHour++;

        if(ManualHour > 12){
            ManualHour = 1;
        } else if(ManualHour <= 0){
            ManualHour = 12;
        }

        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].textContent = pad(ManualHour,2);
    } else if(OptionsFocus === 1){
        // 00 - 59
        (Option === 'down') ? ManualMinute--: ManualMinute++;

        if(ManualMinute > 59){
            ManualMinute = 0;
        } else if(ManualHour <= 0){
            ManualMinute = 59;
        }

        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].textContent = pad(ManualMinute,2);
    } else if(OptionsFocus === 2){
        // AM - PM
        (Option === 'down') ? ManualIndicator--: ManualIndicator++;

        if(ManualIndicator > 1){
            ManualIndicator = 0;
        } else if(ManualIndicator < 0){
            ManualIndicator = 1;
        }

        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].textContent = ManualListIndicator[ManualIndicator];
    } else if(OptionsFocus === 3){
        // +15, +30, +1, +1.5, +2, +2.5 +3
        (Option === 'down') ? ManualTime--: ManualTime++;

        if(ManualTime > (ManualListTime.length -1)){
            ManualTime = 0;
        } else if(ManualTime < 0){
            ManualTime = ManualListTime.length -1;
        }

        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].textContent = ManualListTime[ManualTime];
    } else if(OptionsFocus === 4){
        SetFocusManualOption('up');
    } else if(OptionsFocus === 5){
        SetFocusManualOption('down');
//            OptionsFocus = 0;
//            ManualHour--;
//            SetManualTime('up');


    }

    clearTimeout(RecordingManualTimer);

    RecordingManualTimer = setTimeout(CloseManualRecord,8000);
}

function SelectManualRecordOption(){

    switch (ManualNodesArray[OptionsFocus]) {
        case 4:
        case 6:
        case 8:
        case 10:
            SetFocusManualOption('down');
            break;

        case 15:
            CheckManualRecording();
            break;

        case 17:
            CloseManualRecord();
            break;
    }
}

/*******************************************************************************
 * Funciones botones
 *******************************************************************************/

function PvrUp(){
    if(RecordOptions === true){
        SetFocusOptionRecord('up');
    } else if(DeleteOptions === true){
        SetFocusOptionDelete('up');
    } else if(OptionPanel === 'Recordings') {
        if(PvrRowFocus === 1){
            if(ListTypeFocus === 'serie'){
                if(IndexRecordedProgFocus !== 1){
                    SetRecordings('up');

                    PvrRowFocus = 19;

                    SetFocusRecordings();
                }
            } else {
                if(IndexRecordedFocus !== 0){
                    SetRecordings('up');

                    PvrRowFocus = 19;

                    SetFocusRecordings();
                }
            }
        } else {
            if(PvrRowFocus <= 19){
                PvrRowFocus -= 2;
                SetFocusRecordings();
            }
        }
    }else if(OptionPanel === 'Schedules') {
        if(PvrRowFocus === 1){
            if(ListTypeFocus === 'serie'){
                if(IndexScheduleProgFocus !== 1){
                    SetSchedules('up');

                    PvrRowFocus = 19;

                    SetFocusScheduless();
                }
            } else {
                if(IndexScheduleFocus !== 0){
                    SetSchedules('up');

                    PvrRowFocus = 19;

                    SetFocusSchedules();
                }
            }
        } else {
            if(PvrRowFocus <= 19){
                PvrRowFocus -= 2;
                SetFocusSchedules();
            }
        }
    } else if(OptionPanel === 'Series') {
        if(PvrRowFocus === 1){
            if(IndexSerieFocus !== 0){
                SetSeries('up');

                PvrRowFocus = 19;

                SetFocusSeries();
            }
        } else {
            if(PvrRowFocus <= 19){
                PvrRowFocus -= 2;
                SetFocusSeries();
            }
        }
    }

    clearTimeout(PvrTimer);
    PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
}

function PvrDown(){
    if(RecordOptions === true){
        SetFocusOptionRecord('down');
    } else if(DeleteOptions === true){
        SetFocusOptionDelete('down');
    } else if(OptionPanel === 'Recordings') {
        if(PvrRowFocus === 19){
            if(ListTypeFocus === 'serie'){
                if((RecordingsList[IndexRecordedFocus].length - 1) > 10 && IndexRecordedProgFocus < (RecordingsList[IndexRecordedFocus].length - 1) ){
                    SetRecordings('down');

                    PvrRowFocus = 1;

                    SetFocusRecordings();
                }
            } else {
                if(RecordingsList.length > 10 && IndexRecordedFocus < (RecordingsList.length - 1)){
                    SetRecordings('down');

                    PvrRowFocus = 1;

                    SetFocusRecordings();
                }
            }
        } else {
            if(PvrRowFocus >= 1){
                PvrRowFocus += 2;
                SetFocusRecordings();
            }
        }
    } else if(OptionPanel === 'Schedules') {
        if(PvrRowFocus === 19){
            if(ListTypeFocus === 'serie'){
                if((SchedulesList[IndexScheduleFocus].length - 1) > 10 && IndexScheduleProgFocus < (SchedulesList[IndexScheduleFocus].length - 1) ){
                    SetSchedules('down');

                    PvrRowFocus = 1;

                    SetFocusSchedules();
                }
            } else {
                if(SchedulesList.length > 10 && IndexScheduleFocus < (SchedulesList.length - 1)){
                    SetSchedules('down');

                    PvrRowFocus = 1;

                    SetFocusSchedules();
                }
            }
        } else {
            if(PvrRowFocus >= 1){
                PvrRowFocus += 2;
                SetFocusSchedules();
            }
        }
    } else if(OptionPanel === 'Series') {
        if(PvrRowFocus === 19){
            if(SeriesList.length > 10 && IndexSerieFocus < (SeriesList.length - 1)){
                SetSeries('down');

                PvrRowFocus = 19;

                SetFocusSeries();
            }
        } else {
            if(PvrRowFocus >= 1){
                PvrRowFocus += 2;
                SetFocusSeries();
            }
        }
    }

    clearTimeout(PvrTimer);
    PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
}

function PvrRight(){
    if(RecordOptions === false && DeleteOptions === false){

        if(ListTypeFocus === 'serie'){
            PvrClose();
        }

        if(OptionPanel === 'Recordings'){

            IndexScheduleFocus      = -1;
            IndexScheduleProgFocus  = 0;

            GetSchedules();

            OptionPanel = 'Schedules';

        } else if(OptionPanel === 'Schedules'){

            IndexSerieFocus         = -1;

            GetSeries();

            OptionPanel = 'Series';

        } else if(OptionPanel === 'Series'){

            IndexRecordedFocus      = -1;
            IndexRecordedProgFocus  = 0;

            GetRecordings();

            OptionPanel = 'Recordings';
        }

        SetOptionPanel();
    }

    clearTimeout(PvrTimer);
    PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
}

function PvrLeft(){
    if(RecordOptions === false && DeleteOptions === false){

        if(ListTypeFocus === 'serie'){
            PvrClose();
        }

        if(OptionPanel === 'Recordings'){

            IndexSerieFocus         = -1;

            GetSeries();

            OptionPanel = 'Series';

        } else if(OptionPanel === 'Schedules'){

            IndexRecordedFocus      = -1;
            IndexRecordedProgFocus  = 0;

            GetRecordings();

            OptionPanel = 'Recordings';

        } else if(OptionPanel === 'Series'){

            IndexScheduleFocus      = -1;
            IndexScheduleProgFocus  = 0;

            GetSchedules();

            OptionPanel = 'Schedules';
        }

        SetOptionPanel();
    }

    clearTimeout(PvrTimer);
    PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
}

function PvrOk(){
    if(RecordOptions === true){
        SelectRecordOption();
    } else if(DeleteOptions === true){
        SelectDeleteOption();
    } else if(OptionPanel === 'Recordings') {
        if(RowTypeFocus === 'serie'){

            ListTypeFocus = 'serie';

            SetRecordings('');

            LastPvrRowFocus = PvrRowFocus;

            PvrRowFocus = 1;

            SetFocusRecordings();
        } else {
            if(IndexRecordedFocus !== -1){
                ShowRecordOption();
            }
        }
    }else if(OptionPanel === 'Schedules' || OptionPanel === 'Series') {
        if(RowTypeFocus === 'serie'){

            ListTypeFocus = 'serie';

            SetSchedules('');

            LastPvrRowFocus = PvrRowFocus;

            PvrRowFocus = 1;

            SetFocusSchedules();
        } else {
            if((OptionPanel === 'Schedules' && IndexScheduleFocus !== -1) || (OptionPanel === 'Series' && IndexSerieFocus !== -1)){
                ShowDeleteOption();
            }
        }
    }
}

function PvrClose(){
    if(ListTypeFocus === 'serie'){
        if(OptionPanel === 'Recordings') {
            FirstIndexRecorded--;

            IndexRecordedFocus = FirstIndexRecorded;

            ListTypeFocus = 'all';

            SetRecordings('');

            PvrRowFocus = LastPvrRowFocus;

            SetFocusRecordings();
        } else if(OptionPanel === 'Schedules') {
            FirstIndexSchedule--;

            IndexScheduleFocus = FirstIndexSchedule;

            ListTypeFocus = 'all';

            SetSchedules('');

            PvrRowFocus = LastPvrRowFocus;

            SetFocusSchedules();
        }
    } else {
        ClosePvr();
    }
}

/******************************************************************************************************************************************************************
 *  AJAX!
 ******************************************************************************************************************************************************************/

/*******************************************************************************
 * Agrega programa en serie
 *******************************************************************************/

function SetMacAddressPvr(){
    // Elige aleatoriamente la mac addres donde se guardara la serie en caso de que haya mas de un grabador
    if(Device['Type'] === 'WHP_HDDN' || ((gSTB.GetDeviceModel() == 'MAG424' || gSTB.GetDeviceModel() == 'MAG524') && (USB.length !== 0))){
        
        if((gSTB.GetDeviceModel() == 'MAG424'  || gSTB.GetDeviceModel() == 'MAG524') && (USB.length !== 0)){
            MacAddressPvr = gSTB.GetDeviceMacAddress();
        }else{
            if(Device['MacAddressPvr'].length > 1){
                var RandomMac = getRandomInt(0,Device['MacAddressPvr'].length);
                MacAddressPvr = Device['MacAddressPvr'][RandomMac];
            } else {
                MacAddressPvr = Device['MacAddressPvr'][0];
            }
        }
    }
}

function AddSerie(){
    Debug('---- AddSerie');
    SetMacAddressPvr();

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'AddSerie',
            LocationId : Device['LocationId'],
            MacAddressPvr : MacAddressPvr,
            OperationId : OperationsList['record'],
            TitleSerie : ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].TTLE,
            Channel : ChannelsJson[FocusChannelPosition].CHNL + ' - ' +ChannelsJson[FocusChannelPosition].INDC,
            Position : parseInt(FocusChannelPosition,10)
        },
        success: function (response){
            ShowRecorderMessage($.parseJSON(response));
            CloseRecordingOptions();

            GetProgramsSerie();
        }
    });
}

/*******************************************************************************
 *
 *******************************************************************************/

function GetProgramsSerie(){
    Debug('::::::::::::::::::::::::: GetProgramsSerie::: ');
    GetSeries();

    var IndexS = 0,
        IndexP = 0,
        Position = 0;

    Debug('SeriesList.length::: ' + SeriesList.length);

    if(EpgDataActive === true && SeriesList.length > 0){

        ADD_SERIE_BCKG = true;

        for(IndexS = 0; IndexS < SeriesList.length; IndexS++){

            Position = SeriesList[IndexS].posicion;
            Debug('Pos::: '+Position);


            if(ChannelsJsonToday.length === 0){
                for(IndexP = 0; IndexP < ChannelsJson[Position].P_Length; IndexP++){
                    if(SeriesList[IndexS].titulo === ChannelsJson[Position].PROGRAMS[IndexP].TTLE){
                        Debug('*-*-*-*-*- Encontro coincidencia: '+ChannelsJson[Position].PROGRAMS[IndexP].TTLE + ' ' +ChannelsJson[Position].PROGRAMS[IndexP].DBKY);

                        REC_CHNL_POS = Position;
                        REC_PROG_POS = IndexP;

                        CheckRecordings();
                    }
                }
            }
        }
    }
}

/*******************************************************************************
 * Agrega programa
 *******************************************************************************/
function GetRecordings(){
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsList',
            LocationId : Device['LocationId'],
            MacAddress : MacAddress
        },
        success: function (response){
            RecordingsList = $.parseJSON(response);
        }
    });
}

function GetSchedules(){
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SchedulesList',
            LocationId : Device['LocationId']
        },
        success: function (response){
            SchedulesList = $.parseJSON(response);
        }
    });
}

function GetSeries(){
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SeriesList',
            LocationId : Device['LocationId']
        },
        success: function (response){
            SeriesList = $.parseJSON(response);
        }
    });
}

function GetRecordingsToRecord(){
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsToRecord',
            LocationId : Device['LocationId']
        },
        success: function (response){
            RecordingsToCheck = $.parseJSON(response);
        }
    });
}

function GetPvrInfo(){
    if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
        SetPvrInfo();
    } else {
        $.ajax({
            type: 'POST',
            url: 'Core/Controllers/Recorder.php',
            data: {
                Option     : 'GetPvrInfo',
                LocationId : Device['LocationId'],
                MacAddress : MacAddress
            },
            success: function (response){
                DiskInfo = $.parseJSON(response);

                if(DiskInfo.length > 0){
                    SetPvrInfo();
                }
            }
        });
    }
}

function CheckManualRecording(){
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsToRecord',
            LocationId : Device['LocationId']
        },
        success: function (response){
            RecordingsToCheck = $.parseJSON(response);

            // Convierte a UTC el tiempo inicio de la grabacion que se quiere agregar
            var ProgramYear    = ChannelsJson[REC_CHNL_POS].DTNU.slice(0,4),
                ProgramMonth   = ChannelsJson[REC_CHNL_POS].DTNU.slice(4,6),
                ProgramDay     = ChannelsJson[REC_CHNL_POS].DTNU.slice(6,8);



            var ProgramStart = Time12to24(ManualHour+':'+ManualMinute+' '+ManualListIndicator[ManualIndicator].toLowerCase());
            var ProgramEnd   = moment(ProgramStart, 'HH:mm').add(ManualListMinutes[ManualTime], 'minutes').format('HH:mm');

            var ProgramStartHour    = pad(ProgramStart.slice(0,2),2),
                ProgramStartMinute  = pad(ProgramStart.slice(3,5),2),
                ProgramEndHour      = ProgramEnd.slice(0,2),
                ProgramEndMinute    = ProgramEnd.slice(3,5);

            ProgramUtcStartDate = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, ProgramStartHour, ProgramStartMinute);
            ProgramUtcEndDate   = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, ProgramEndHour, ProgramEndMinute);

            ProgramUtcStartDate = ProgramUtcStartDate / 1000;
            ProgramUtcEndDate = ProgramUtcEndDate / 1000;

            NewStartHour = ProgramStart;
            NewEndHour   = ProgramEnd;


            var CurrentUtcDate = Date.UTC(moment().format('Y'), (moment().format('MM') -1), moment().format('DD'), moment().format('HH'), moment().format('mm'));
            CurrentUtcDate = CurrentUtcDate / 1000;

            if(ProgramUtcStartDate < CurrentUtcDate){
                Coincidences = 2;
            }

            /* Agregamos el tiempo offset -6 o -7 en segundos */
            ProgramUtcStartDate = ProgramUtcStartDate + SecondsOffset;
            ProgramUtcEndDate   = ProgramUtcEndDate + SecondsOffset;

            if(ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY === ''){
                NewDatabasekey  = 'PR'+ProgramStartHour+ProgramStartMinute+ProgramEndHour+ProgramEndMinute+ProgramMonth+ProgramDay;
            } else {
                NewDatabasekey = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY;
            }

            if(RecordingsToCheck.length > 0){
                var IndexR                  = 0,
                    ProgramUtcStartDate_DB  = '',
                    ProgramUtcEndDate_DB    = '';

                var Coincidences    = 0,
                    SameDatabasekey = false;

                for(IndexR = 0; IndexR < RecordingsToCheck.length; IndexR++){
                    /* VALIDACION 1 - Por databasekey si ya existe en la BD finaliza el proceso */

                    if(RecordingsToCheck[IndexR].databasekey === ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY){
                        SameDatabasekey = true;

                        IndexR = RecordingsToCheck.length;
                    } else {
                        /* Obtiene el tiempo de las grabaciones ya agregadas en la base de datos en UTC */
                        ProgramUtcStartDate_DB = parseInt(RecordingsToCheck[IndexR].utc_start,10);
                        ProgramUtcEndDate_DB   = parseInt(RecordingsToCheck[IndexR].utc_final,10);

                        //Debug('------ ProgramUtcStartDate: '+ProgramUtcStartDate + ' ProgramUtcEndDate: '+ProgramUtcEndDate);
                        //Debug('****** ProgramUtcStartDate: '+ProgramUtcStartDate_DB + ' ProgramUtcEndDate: '+ProgramUtcEndDate_DB);

                        /* Si la HoraIniProgAgregar es mayor a la HoraFinProgBd */
                        if(ProgramUtcStartDate > ProgramUtcEndDate_DB){
                            // 0 Coincidences
                        }
                        /* Else Si la HoraFinProgAgregar es menor a la HoraIniProgBD */
                        if(ProgramUtcStartDate < ProgramUtcStartDate_DB){
                            // 0 Coincidences
                        }
                        /* Else esta en el mismo rango de la hora inicio y final */
                        if(ProgramUtcStartDate >= ProgramUtcStartDate_DB && ProgramUtcEndDate <= ProgramUtcEndDate_DB){
                            Coincidences++;
                            //Debug('// 1 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                        }
                        /* Else esta en el mismo rango de la hora inicio */
                        else if(ProgramUtcStartDate > ProgramUtcStartDate_DB && ProgramUtcEndDate < (ProgramUtcStartDate_DB + SecondsRange)){
                            Coincidences++;
                            //Debug('// 2 Else esta en el mismo rango de la hora inicio::: Coincidences: '+Coincidences);
                        }
                        /* Else esta en el mismo rango de la hora inicio y final */
                        else if(ProgramUtcEndDate < ProgramUtcEndDate_DB && ProgramUtcStartDate > (ProgramUtcEndDate_DB + SecondsRange)){
                            Coincidences++;
                            //Debug('// 3 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                        }
                    }
                    //Debug('Coincidences: '+Coincidences);
                    //Debug('-------------------------------------------------------------------');
                }


                if(Coincidences >= 2){
                    if(ADD_SERIE_BCKG === false){
                        ShowRecorderMessage('Reached the limit of schedules at the same time');
                    }
                } else {
                    AddRecord();
                }
            } else {
                AddRecord();
            }
        }
    });
}

function CheckRecordings(){
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsToRecord',
            LocationId : Device['LocationId']
        },
        success: function (response){
            RecordingsToCheck = $.parseJSON(response);

            Debug('--------------------------------------->>0');
            Debug(REC_CHNL_POS);
            Debug(REC_PROG_POS);

            // Convierte a UTC el tiempo inicio de la grabacion que se quiere agregar
            var ProgramYear    = ChannelsJson[REC_CHNL_POS].DTNU.slice(0,4),
                ProgramMonth   = ChannelsJson[REC_CHNL_POS].DTNU.slice(4,6),
                ProgramDay     = ChannelsJson[REC_CHNL_POS].DTNU.slice(6,8),

                ProgramStartHour   = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRH.slice(0,2),
                ProgramStartMinute = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRH.slice(3,5),

                ProgramEndHour     = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].FNLH.slice(0,2),
                ProgramEndMinute   = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].FNLH.slice(3,5);

            Debug('--------------------------------------->>1');
            Debug(ProgramStartHour + ' '+ProgramStartMinute);
            Debug(ProgramEndHour + ' '+ProgramEndMinute);

            ProgramUtcStartDate = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, ProgramStartHour, ProgramStartMinute);

            Debug('--------------------------------------->>2');
            Debug(ProgramUtcStartDate);
            Debug(ProgramUtcEndDate);

            ProgramUtcStartDate = ProgramUtcStartDate / 1000;

            if(parseInt(REC_PROG_POS) === LastProgramsPositions[RowSelected]){
                Debug('--------------------------------------->>2.1 ');
                var ProgramSeconds   = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].MNTS * 60;
                Debug(ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].MNTS);
                Debug(ProgramSeconds);
                ProgramUtcEndDate = ProgramUtcStartDate + ProgramSeconds;
            } else {
                Debug('--------------------------------------->>2.2 ');
                ProgramUtcEndDate = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, ProgramEndHour, ProgramEndMinute);
                ProgramUtcEndDate = ProgramUtcEndDate / 1000;
            }

            Debug('--------------------------------------->>3');
            Debug(ProgramUtcStartDate);
            Debug(ProgramUtcEndDate);

            Debug('--------------------------------------->>3.1');
            Debug(parseInt(REC_CHNL_POS));
            Debug(OnloadProgramsPositions[RowSelected]);
            Debug(EpgDayNumber);

            if(parseInt(REC_PROG_POS) === OnloadProgramsPositions[RowSelected] && EpgDayNumber === 0){

                var CurrentHour  = moment().format('HH:mm');
                NewStartHour = moment(CurrentHour, 'HH:mm')
                    .add(1, 'minutes')
                    .format('HH:mm');

                ProgramUtcStartDate = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, moment().format('HH'), moment().format('mm'));
                ProgramUtcStartDate = ProgramUtcStartDate / 1000;

                ProgramUtcStartDate = ProgramUtcStartDate + 100;

                Debug('--------------------------------------->>3.2');
                Debug(NewStartHour);
                Debug(ProgramUtcStartDate);


            } else {
                NewStartHour = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRH;
            }



            NewEndHour = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].FNLH;

            Debug('--------------------------------------->>4');
            Debug(NewStartHour);
            Debug(NewEndHour);

            var CurrentUtcDate = Date.UTC(moment().format('Y'), (moment().format('MM') -1), moment().format('DD'), moment().format('HH'), moment().format('mm'));
            CurrentUtcDate = CurrentUtcDate / 1000;

            Debug('--------------------------------------->>5');
            Debug(CurrentUtcDate);
            Debug(ProgramUtcStartDate);


            var TimeDiff = ProgramUtcStartDate - CurrentUtcDate;
            Debug(TimeDiff);

            var TimeDiffEnd = ProgramUtcEndDate - ProgramUtcStartDate;
            Debug(TimeDiffEnd);

            if(TimeDiff < 0 || TimeDiffEnd < 0){
                Debug('--------------------------------------->>5.1 FIN');
                ShowRecorderMessage('The program has already been broadcast ');
            } else {

                if(ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY === ''){
                    NewDatabasekey  = 'PR'+ProgramStartHour+ProgramStartMinute+ProgramEndHour+ProgramEndMinute+ProgramMonth+ProgramDay;
                } else {
                    NewDatabasekey = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY;
                }

                /* Agregamos el tiempo offset -6 o -7 en segundos */
                ProgramUtcStartDate = ProgramUtcStartDate + SecondsOffset;
                ProgramUtcEndDate   = ProgramUtcEndDate + SecondsOffset;

                Debug('--------------------------------------->>6');
                Debug(ProgramUtcStartDate);
                Debug(ProgramUtcEndDate);

                if(RecordingsToCheck.length > 0){
                    var IndexR                  = 0,
                        ProgramUtcStartDate_DB  = '',
                        ProgramUtcEndDate_DB    = '';

                    var Coincidences    = 0,
                        SameDatabasekey = false;

                    for(IndexR = 0; IndexR < RecordingsToCheck.length; IndexR++){
                        /* VALIDACION 1 - Por databasekey si ya existe en la BD finaliza el proceso */

                        if(RecordingsToCheck[IndexR].databasekey === ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY){
                            SameDatabasekey = true;

                            IndexR = RecordingsToCheck.length;
                        } else {
                            /* Obtiene el tiempo de las grabaciones ya agregadas en la base de datos en UTC */
                            ProgramUtcStartDate_DB = parseInt(RecordingsToCheck[IndexR].utc_start,10);
                            ProgramUtcEndDate_DB   = parseInt(RecordingsToCheck[IndexR].utc_final,10);

                            //Debug('------ ProgramUtcStartDate: '+ProgramUtcStartDate + ' ProgramUtcEndDate: '+ProgramUtcEndDate);
                            //Debug('****** ProgramUtcStartDate: '+ProgramUtcStartDate_DB + ' ProgramUtcEndDate: '+ProgramUtcEndDate_DB);

                            /* Si la HoraIniProgAgregar es mayor a la HoraFinProgBd */
                            if(ProgramUtcStartDate > ProgramUtcEndDate_DB){
                                // 0 Coincidences
                            }
                            /* Else Si la HoraFinProgAgregar es menor a la HoraIniProgBD */
                            if(ProgramUtcStartDate < ProgramUtcStartDate_DB){
                                // 0 Coincidences
                            }
                            /* Else esta en el mismo rango de la hora inicio y final */
                            if(ProgramUtcStartDate >= ProgramUtcStartDate_DB && ProgramUtcEndDate <= ProgramUtcEndDate_DB){
                                Coincidences++;
                                //Debug('// 1 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                            }
                            /* Else esta en el mismo rango de la hora inicio */
                            else if(ProgramUtcStartDate > ProgramUtcStartDate_DB && ProgramUtcEndDate < (ProgramUtcStartDate_DB + SecondsRange)){
                                Coincidences++;
                                //Debug('// 2 Else esta en el mismo rango de la hora inicio::: Coincidences: '+Coincidences);
                            }
                            /* Else esta en el mismo rango de la hora inicio y final */
                            else if(ProgramUtcEndDate < ProgramUtcEndDate_DB && ProgramUtcStartDate > (ProgramUtcEndDate_DB + SecondsRange)){
                                Coincidences++;
                                //Debug('// 3 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                            }
                        }
                        //Debug('Coincidences: '+Coincidences);
                        //Debug('-------------------------------------------------------------------');
                    }


                    if(SameDatabasekey === true){
                        if(ADD_SERIE_BCKG === false){
                            ShowRecorderMessage('Program already added');
                        }
                    } else {
                        if(Coincidences >= 2){
                            if(ADD_SERIE_BCKG === false){
                                ShowRecorderMessage('Reached the limit of schedules at the same time');
                            }
                        } else {
                            AddRecord();
                        }
                    }
                } else {
                    AddRecord();
                }
            }
        }
    });
}


function AddRecord(){
    SetMacAddressPvr();

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option          : 'AddRecord',
            LocationId      : Device['LocationId'],
            MacAddressPvr   : MacAddressPvr,
            OperationId     : OperationsList['record'],
            Title           : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].TTLE,
            Databasekey     : NewDatabasekey,
            Episode         : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].EPSD,
            Description     : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DSCR,
            Rating          : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRS,
            Date            : ChannelsJson[REC_CHNL_POS].DTNU,
            StarTime        : NewStartHour,
            EndTime         : NewEndHour,
            UtcStart        : ProgramUtcStartDate,
            UtcEnd          : ProgramUtcEndDate,
            ChannelSource   : ChannelsJson[REC_CHNL_POS].SRCE +':'+ChannelsJson[REC_PROG_POS].PORT
        },
        success: function (response){
            if(ADD_SERIE_BCKG === false){
                ShowRecorderMessage($.parseJSON(response));
                CloseRecordingOptions();
                CloseManualRecord();
            }

            Debug('AddRecord '+MacAddressPvr+' - '+ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].TTLE);
        }
    });
}

/*******************************************************************************
 * Elimina logicamente la grabacion en la base de datos
 *******************************************************************************/

function SetDeleteProgram(){
    LastPvrRowFocus = PvrRowFocus ;

    var ProgramId = '';

    if(OptionPanel === 'Recordings'){
        ProgramId = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].id;
    } else {
        ProgramId = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].id;
    }

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option          : 'SetDeleteProgram',
            OperationId     : OperationsList['delete'],
            ProgramId       : ProgramId
        },
        success: function (response){

            Response = $.parseJSON(response);

            ShowRecorderMessage(Response.Message);

            if(Response.Update === true && PlayingRecording === false){

                if(OptionPanel === 'Recordings'){
                    GetRecordings();

                    FirstIndexRecorded--;

                    IndexRecordedFocus = FirstIndexRecorded;

                    ListTypeFocus = 'all';

                    SetRecordings('');

                    PvrRowFocus = LastPvrRowFocus;

                    SetFocusRecordings();
                } else {
                    GetSchedules();

                    FirstIndexSchedule--;

                    IndexScheduleFocus = FirstIndexSchedule;

                    ListTypeFocus = 'all';

                    SetSchedules('');

                    PvrRowFocus = LastPvrRowFocus;

                    SetFocusSchedules();
                }
            }
        }
    });
}

/*******************************************************************************
 * Elimina de la lista la serie
 *******************************************************************************/

function DeleteSerie(){
    LastPvrRowFocus = PvrRowFocus ;

    Debug('IndexSerieFocus: '+IndexSerieFocus);
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option  : 'DeleteSerie',
            SerieId : SeriesList[IndexSerieFocus].id_serie
        },
        success: function (response){

            Response = $.parseJSON(response);

            ShowRecorderMessage(Response.Message);

            if(Response.Delete === true){

                GetSeries();

                FirstIndexSerie--;

                IndexSerieFocus = FirstIndexSerie;

                SetSeries('');

                PvrRowFocus = LastPvrRowFocus;
            }
        }
    });
}