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
    RecorderMessageActive       = false,
    FullDisk                    = false;

/* Variables a utilizar con grabador activo */
// @ts-ignore
if(Device['Type'] !== 'NONE'){

    /* Panel pvr en la guia */
    var RecordingOptions        = document.getElementById('RecordingOptions'),
        // @ts-ignore
        RecordingOptionsNodes   = RecordingOptions.childNodes,
        RecordManualOptions     = document.getElementById('RecordingManualOptions'),
        // @ts-ignore
        RecordManualOptionsNodes= RecordManualOptions.childNodes,
        RecorderMessage         = document.getElementById('RecorderMessage'),
        PanelMessage            = document.getElementById('PanelMessage');

    var OptionsNodesArray       = [1,3,5,7],
        ManualNodesArray        = [4,6,8,10,15,17],
        RecordsNodesArray       = [1,3,5],
        OptionsFocus            = -1,
        RecorderMessageTimer    = '',
        RecordingOptionTimer    = '',
        RecordingManualTimer    = '',
        // @ts-ignore
        MacAddressPvr           = MacAddress;

    var OperationsList          = { record:1, delete:2, recording:3, recorded:4};

    var RecordingsList          = '',
        SchedulesList           = '',
        SeriesList              = '',
        DiskInfo                = '';

    var RecordPlayOptions       = document.getElementById('RecordPlayOptions'),
        // @ts-ignore
        RecordPlayOptionsNodes  = RecordPlayOptions.childNodes;

    /* Pvr panel */
    var PvrContainer            = document.getElementById('PvrContainer'),
        PvrOptions              = document.getElementById('PvrOptions'),
        // @ts-ignore
        PvrOptionsNodes         = PvrOptions.childNodes,
        PvrDeleteOptions        = document.getElementById('PvrDeleteOptions'),
        // @ts-ignore
        PvrDeleteOptionsNodes   = PvrDeleteOptions.childNodes,
        // @ts-ignore
        PvrListNodes            = document.getElementById('PvrList').childNodes,
        // @ts-ignore
        PvrInfoNodes            = document.getElementById('PvrInfo').childNodes,
        CurrentPvrOption        = document.getElementById('CurrentPvrOption'),
        // @ts-ignore
        PvrDiskInfoNodes        = document.getElementById('PvrDiskInfo').childNodes;

    var PvrDate                 = document.getElementById('PvrDate');

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
        // @ts-ignore
        SecondsOffset           = Math.abs((Device.OffsetZone * 60 * 60));

    var SpeedArray              = ['2','4','8','12','16'],
        Speed                   = 0,
        SpeedText               = '',
        OptionText              = '',
        ForwardIndex            = -1,
        BackwardIndex           = -1;

    var BarContainer            = document.getElementById('BarContainer'),
        BarPosition             = document.getElementById('BarPosition'),
        BarTimes                = document.getElementById('BarTimes'),
        BarDuration             = document.getElementById('BarDuration'),
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

    // @ts-ignore
    clearTimeout(RecordingOptionTimer);
    // @ts-ignore
    RecordingOptionTimer = setTimeout(CloseRecordingOptions,8000);

    // Quita las lineas de los programas para que no se vean encima del cuadro de opciones
    var AllPrograms = document.getElementsByClassName('Program'),
        IndexProgram = 0;
    for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
        // @ts-ignore
        AllPrograms[IndexProgram].style.outline = 'none'; //1px solid rgb(0, 68, 114)
    }
    //
    // @ts-ignore
    RecordingOptions.style.visibility = 'visible';

    SetFocusOptionRecording('down');
}

function SetFocusOptionRecording(Direction){
    if(OptionsFocus >= 0){
        // @ts-ignore
        RecordingOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= OptionsNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (OptionsNodesArray.length -1 );
    }

    // @ts-ignore
    RecordingOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');

    // @ts-ignore
    clearTimeout(RecordingOptionTimer);

    // @ts-ignore
    RecordingOptionTimer = setTimeout(CloseRecordingOptions,8000);
}

function CloseRecordingOptions(){
    // @ts-ignore
    if(ActiveEpgContainer === true && RecordingOptionsActive === true){
        RecordingOptionsActive = false;

        // @ts-ignore
        clearTimeout(RecordingOptionTimer);

        OptionsFocus = -1;

        // Agrega las lineas de los programas
        var AllPrograms = document.getElementsByClassName('Program'),
            IndexProgram = 0;
        for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
            // @ts-ignore
            AllPrograms[IndexProgram].style.outline = OutlineColor;
        }

        // @ts-ignore
        RecordingOptions.style.visibility = 'hidden';

        var IndexOptionsNodes = 0;

        for(IndexOptionsNodes = 0; IndexOptionsNodes < OptionsNodesArray.length; IndexOptionsNodes++){
            // @ts-ignore
            RecordingOptionsNodes[OptionsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
        }
    }
}

function SelectRecordingsOption(){
    // @ts-ignore
    Debug('--- TvOk - SelectRecordingsOption');
    switch (OptionsNodesArray[OptionsFocus]) {
        case 1:
            CloseRecordingOptions();

            // @ts-ignore
            PlayChannelEpg();

            break;

        case 3:
            // @ts-ignore
            REC_CHNL_POS = FocusChannelPosition;
            // @ts-ignore
            REC_PROG_POS = FocusProgramPosition;

            ADD_SERIE_BCKG = false;

            // @ts-ignore
            if(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].DRTN !== '24'){
                // @ts-ignore
                Debug("Caso 3");
                CheckRecordings();
            } else {
                CloseRecordingOptions();
                OpenManualRecord();
            }
            break;

        case 5:
            // @ts-ignore
            Debug('--- TvOk - 5');
            // @ts-ignore
            if(ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].DRTN !== '24'){
                    AddSerie();
                // @ts-ignore
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
    if(RecorderMessageActive === false){
        // Quita las lineas de los programas para que no se vean encima del cuadro de opciones
        var AllPrograms = document.getElementsByClassName('Program'),
            IndexProgram = 0;
        for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
            // @ts-ignore
            AllPrograms[IndexProgram].style.outline = 'none'; //1px solid rgb(0, 68, 114)
        }

        RecorderMessageActive = true;

        // @ts-ignore
        RecorderMessage.textContent = '';
        // @ts-ignore
        PanelMessage.style.display = 'inline';
        // @ts-ignore
        RecorderMessage.textContent = Message;
    }
}

function HideRecorderMessage(){
    RecorderMessageActive = false;
    // @ts-ignore
    RecorderMessage.textContent = '';
    // @ts-ignore
    PanelMessage.style.display = 'none';
}

/*******************************************************************************
 * Muestra lista de graciones, schedules y series
 *******************************************************************************/

function OpenPvr(){
    if(RecordingPanel === false){

        IndexRecordedFocus  = -1;
        IndexRecordedProgFocus = 0;

        GetRecordings();

        HidePvrInfo();

        // @ts-ignore
        PvrContainer.style.visibility = 'visible';

        RecordingPanel = true;

        OptionPanel = 'Recordings';

        ListTypeFocus = 'all';

        SetOptionPanel();

        GetPvrInfo();

        GetWeatherPvr();

        // @ts-ignore
        PvrTimer = setTimeout(ClosePvr,TimeoutPvr);

        MinimizeTV();
    }
}

function ClosePvr(){
    // @ts-ignore
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

    // @ts-ignore
    clearTimeout(PvrTimer);
}

function HidePvr(){
    // @ts-ignore
    PvrContainer.style.visibility = 'hidden';

    RecordingPanel = false;

    MaximizeTV();

    HideRecordOption();

    HideDeleteOption();

    // @ts-ignore
    clearTimeout(PvrTimer);
}

function UnhidePvr(){
    // @ts-ignore
    PvrContainer.style.visibility = 'visible';

    MinimizeTV();

    HidePvrInfo();

    RecordingPanel = true;

    SetOptionPanel();

    GetPvrInfo();

    GetWeatherPvr();

    // @ts-ignore
    PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
}

function SetOptionPanel(){
    if(OptionPanel === 'Recordings'){
        SetRecordings('');

        SetFocusRecordings();

        // @ts-ignore
        CurrentPvrOption.textContent = OptionPanel;
    } else if(OptionPanel === 'Schedules'){
        SetSchedules('');

        SetFocusSchedules();

        // @ts-ignore
        CurrentPvrOption.textContent = 'To be recorded';
    } else if(OptionPanel === 'Series'){
        SetSeries('');

        SetFocusSeries();

        // @ts-ignore
        CurrentPvrOption.textContent = OptionPanel;
    }
}

function SetPvrInfoGB(){
    //Device['MacAddressPvr'].length

    var AvailableSize  = 0,
        TotalSize = 0;

    // @ts-ignore
    if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
        var StorageInfo = [];

        // @ts-ignore
        if(typeof(ASTB) !== 'undefined') {
            // @ts-ignore
            StorageInfo = PVR.GetStorageInfo();

            AvailableSize = (parseInt(StorageInfo.availableSize,10)/ 1024);
            TotalSize = (parseInt(StorageInfo.totalSize,10)/ 1024);

        // @ts-ignore
        } else if(typeof(ENTONE) !== 'undefined'){
            // @ts-ignore
            StorageInfo = ENTONE.recorder.getStorageInfo();

            TotalSize = (StorageInfo.pvrTotalSpace / 1024) / 1024;
            AvailableSize = (StorageInfo.pvrFreeSpace / 1024) / 1024;

        // @ts-ignore
        }else if(typeof(gSTB) !== 'undefined'){
            // @ts-ignore
            storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
            // @ts-ignore
            USB = storageInfo.result || [];

            // @ts-ignore
            TotalSize = (USB[0].size / 1024) / 1024;
            // @ts-ignore
            AvailableSize = (USB[0].freeSize / 1024) / 1024;
        }
    } else {
        // @ts-ignore
        AvailableSize  = (parseInt(DiskInfo[DiskInfoIndex].espacio_disponible,10) / 1024);
        // @ts-ignore
        TotalSize = (parseInt(DiskInfo[DiskInfoIndex].espacio_total,10) / 1024);
    }

    // @ts-ignore
    AvailableSize  = (AvailableSize / 1024).toFixed(2);
    // @ts-ignore
    TotalSize = (TotalSize / 1024).toFixed(2);

    var Percentage = (AvailableSize / TotalSize) * 100,
        PercentageSize = (100 - Percentage).toFixed(2);

    PvrDiskInfoNodes[1].textContent = AvailableSize + ' GB available of ' + TotalSize + ' GB';
    PvrDiskInfoNodes[5].textContent = PercentageSize + '%';
    // @ts-ignore
    PvrDiskInfoNodes[5].style.width = PercentageSize + '%';

//#da7848 naranja
//#d97676 rojo
    // @ts-ignore
    if(PercentageSize > 90){
        // @ts-ignore
        PvrDiskInfoNodes[5].style.backgroundColor = '#da7848';
        FullDisk = true;
    // @ts-ignore
    } else if(PercentageSize > 94){
        // @ts-ignore
        PvrDiskInfoNodes[5].style.backgroundColor = '#d97676';
        FullDisk = true;
    } else {
        FullDisk = false;
    }

    // @ts-ignore
    TotalSize = null;
    // @ts-ignore
    Percentage = null;
}

function SetPvrInfo(){
    //Device['MacAddressPvr'].length

    var AvailableSize  = 0,
        TotalSize = 0;

    // @ts-ignore
    if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
        var StorageInfo = [];

        // @ts-ignore
        if(typeof(ASTB) !== 'undefined') {
            // @ts-ignore
            StorageInfo = PVR.GetStorageInfo();

            AvailableSize = parseInt(StorageInfo.availableSize,10);

            TotalSize = parseInt(StorageInfo.totalSize,10);
        // @ts-ignore
        } else if(typeof(ENTONE) !== 'undefined'){
            // @ts-ignore
            StorageInfo = ENTONE.recorder.getStorageInfo();

            AvailableSize = (StorageInfo.pvrFreeSpace / 1000);

            TotalSize = (StorageInfo.pvrTotalSpace / 1000);
        // @ts-ignore
        }else if(typeof(gSTB) !== 'undefined'){
            // @ts-ignore
            storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
            // @ts-ignore
            USB = storageInfo.result || [];
            // @ts-ignore
            TotalSize = (USB[0].size / 1024) / 1024;
            // @ts-ignore
            AvailableSize = (USB[0].freeSize / 1024) / 1024;
            //Debug('Infomir');
        }
    } else {
        // @ts-ignore
        AvailableSize  = parseInt(DiskInfo[DiskInfoIndex].espacio_disponible,10) ;
        // @ts-ignore
        TotalSize = parseInt(DiskInfo[DiskInfoIndex].espacio_total,10);
    }

    // @ts-ignore
    Debug('AvailableSize: '+AvailableSize);
    // @ts-ignore
    Debug('TotalSize: '+TotalSize);

    // @ts-ignore
    var SizePerSeconds = (typeof(gSTB) !== 'undefined')? 0.3: parseInt(DiskInfo[DiskInfoIndex].tamano_grabaciones);

    //Debug('SizePerSeconds: '+SizePerSeconds);
    var TimeRemaining = Math.round(AvailableSize / SizePerSeconds);
    
    // @ts-ignore
    Debug('TimeRemaining: '+TimeRemaining);
    var Percentage = (AvailableSize / TotalSize) * 100,
        PercentageSize = parseFloat((100 - Percentage).toFixed(2));
    //Debug('PercentageSize: '+PercentageSize);
    
    //Debug(SecondsToTime(Math.round(TimeRemaining)));
    // @ts-ignore
    PvrDiskInfoNodes[1].textContent = secondsToString(Math.round(TimeRemaining)); + ' available';
    PvrDiskInfoNodes[5].textContent = PercentageSize + '%';
    // @ts-ignore
    PvrDiskInfoNodes[5].style.width = PercentageSize + '%';

//#da7848 naranja
//#d97676 rojo

    // @ts-ignore
    Debug('PercentageSize>  '+typeof PercentageSize);

    if(PercentageSize > 90){
        // @ts-ignore
        PvrDiskInfoNodes[5].style.backgroundColor = '#da7848';
        FullDisk = true;
    } else if(PercentageSize > 94){
        // @ts-ignore
        PvrDiskInfoNodes[5].style.backgroundColor = '#d97676';
        FullDisk = true;
    } else {
        FullDisk = false;
    }

    // @ts-ignore
    TotalSize = null;
    // @ts-ignore
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
                IndexRecorded -= 10; //**11
                IndexRecordedFocus--;
            } else {
                IndexRecordedFocus++;
            }
        }

        var ActiveRec = '',
            LastChr = '';
        for (Row = 1; Row <= 17; Row++) {

            IndexRecorded++;

            if(Row === 1){
                FirstIndexRecorded = IndexRecorded;
            }

            if(IndexRecorded < RecordingsList.length){
                if(RecordingsList[IndexRecorded].length > 2){
                    Icon = '<i class="fa fa-folder-open"></i>';
                    Title = 'serie';
                    // @ts-ignore
                    PvrListNodes[Row].innerHTML = '\u00A0'+ Icon + ' '+ RecordingsList[IndexRecorded][IndexProgram];
                } else {
                    Icon = '<i class="fa fa-file"></i>';
                    Title = 'rec';

                    // @ts-ignore
                    if(RecordingsList[IndexRecorded][1].active === '1'){
                        ActiveRec = ' (recording)';
                        Icon = '<i class="fa fa-circle" id="IconRecording"></i>';
                    } else {
                        // @ts-ignore
                        LastChr = RecordingsList[IndexRecorded][1].url;

                        if(LastChr.substr(LastChr.length - 4) === '0000'){
                            ActiveRec = ' (scheduled)';
                            Icon = '<i class="fa fa-chevron-right" id="IconRecording"></i>';
                        } else {
                            ActiveRec = '';
                        }
                    }
                    // @ts-ignore
                    Debug('** '+RecordingsList[IndexRecorded][1].duration);
                    // @ts-ignore
                    PvrListNodes[Row].innerHTML = '\u00A0'+ Icon + ' '+ RecordingsList[IndexRecorded][IndexProgram] + ActiveRec + '<p class="RowDur">'+TimeConvert( RecordingsList[IndexRecorded][1].duration)+'</p>';
                }


                // @ts-ignore
                PvrListNodes[Row].title = Title + ','+IndexRecorded+',1';

                Row++;
            } else {
                // @ts-ignore
                PvrListNodes[Row].innerHTML = '';
                // @ts-ignore
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
            IndexProgram -= 10; //**11
            IndexRecordedProgFocus--;
        }

        for (Row = 1; Row <= 17; Row++) {

            if(IndexProgram < RecordingsList[IndexRecordedFocus].length){

                // @ts-ignore
                if(RecordingsList[IndexRecordedFocus][IndexProgram].active === '1'){
                    ActiveRec = ' (recording)';
                    Icon = '<i class="fa fa-circle" id="IconRecording"></i>';
                } else {
                    ActiveRec = '';
                }

                // @ts-ignore
                if(RecordingsList[IndexRecordedFocus][IndexProgram].episode !== ''){
                    // @ts-ignore
                    PvrListNodes[Row].innerHTML = '\u00A0'+Icon + ' '+ IndexProgram+ ' - '+ RecordingsList[IndexRecordedFocus][IndexProgram].episode + ActiveRec + '<p class="RowDur">'+TimeConvert( RecordingsList[IndexRecordedFocus][IndexProgram].duration)+'</p>';
                } else {
                    // @ts-ignore
                    PvrListNodes[Row].innerHTML = '\u00A0'+Icon + ' '+ IndexProgram+ ' - '+  moment(RecordingsList[IndexRecordedFocus][IndexProgram].date).format('MMMM Do YYYY')  + ActiveRec + '<p class="RowDur">'+TimeConvert( RecordingsList[IndexRecordedFocus][IndexProgram].duration)+'</p>';
                }

                // @ts-ignore
                PvrListNodes[Row].title = '\u00A0'+Title + ','+IndexRecordedFocus+','+IndexProgram;
                Row++;
            } else {
                // @ts-ignore
                PvrListNodes[Row].innerHTML = '';
                // @ts-ignore
                PvrListNodes[Row].title = '';
            }

            IndexProgram++;
        }
    }
}

function SetFocusRecordings(){
    var Row = 1;

    for (Row = 1; Row <= 17; Row++) {
        // @ts-ignore
        PvrListNodes[Row].setAttribute('class','PvrProgram');
        Row++;
    }

    // @ts-ignore
    PvrListNodes[PvrRowFocus].setAttribute('class','PvrProgramFocus');

    // @ts-ignore
    RowTypeFocus  = PvrListNodes[PvrRowFocus].title.split(',')[0];

    if(RowTypeFocus !== ''){
        // @ts-ignore
        IndexRecordedFocus  = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[1]);
        // @ts-ignore
        IndexRecordedProgFocus   = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[2]);

        if(RowTypeFocus === 'serie'){
            PvrInfoNodes[1].textContent  = 'Episodes: '+(RecordingsList[IndexRecordedFocus].length - 1);
            PvrInfoNodes[3].textContent  = '';
            // @ts-ignore
            PvrInfoNodes[5].innerHTML    = '';
            // @ts-ignore
            PvrInfoNodes[7].textContent  = RecordingsList[IndexRecordedFocus].length - 1;
            PvrInfoNodes[9].textContent  = '';
            PvrInfoNodes[11].textContent = RecordingsList[IndexRecordedFocus][0];
        } else {
            // @ts-ignore
            PvrInfoNodes[1].textContent  = moment(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].date).format('MMM, DD ');
            // @ts-ignore
            PvrInfoNodes[3].textContent  = TimeConvert( RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration);
            // @ts-ignore
            PvrInfoNodes[5].innerHTML    = ShowStars(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].rating);
            // @ts-ignore
            PvrInfoNodes[7].textContent  = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].episode;
            // @ts-ignore
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

    // @ts-ignore
    PvrOptions.style.visibility = 'visible';

    SetFocusOptionRecord('down');
}

function HideRecordOption(){
    RecordOptions = false;

    // @ts-ignore
    PvrOptions.style.visibility = 'hidden';

    OptionsFocus = -1;

    var IndexOptionsNodes = 0;

    for(IndexOptionsNodes = 0; IndexOptionsNodes < RecordsNodesArray.length; IndexOptionsNodes++){
        // @ts-ignore
        PvrOptionsNodes[RecordsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
    }
}


function SetFocusOptionRecord(Direction){
    if(OptionsFocus >= 0){
        // @ts-ignore
        PvrOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= RecordsNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (RecordsNodesArray.length -1 );
    }

    // @ts-ignore
    PvrOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');
}

function SelectRecordOption(){

    switch (RecordsNodesArray[OptionsFocus]) {
        case 1:
            ClearSpeed();

            GetPvrInfo();

            // @ts-ignore
            if(parseInt(DiskInfo[DiskInfoIndex].rtsp_conexiones) >= 4){
                ShowRecorderMessage('All connections to your recorder are active, please wait or close a connection');
            } else {
                UpdateRtspConnections('add');
                ClearSpeed();
                // @ts-ignore
                PlayingRecording = true;
                //alert();
                //Debug("#################################3"+PlayingRecording);
                PlayVideo(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);
                // @ts-ignore
                ShowPvrInfo();
                Debug('URL>>>>>> '+RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);
                //* ClosePvr();
                HidePvr();
                

                SetSpeed('play');
            }
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
 *  Funcion para actualizar el estatus de los RTSP activos
 *******************************************************************************/

    function UpdateRtspConnections(OprRtsp){
        // @ts-ignore
        $.ajax({
            type: 'POST',
            url: 'Core/Controllers/Recorder.php',
            data: {
                Option     : 'SetRtsp',
                // @ts-ignore
                LocationId : Device['LocationId'],
                MacAddress : MacAddressPvr,
                OptionRtsp : OprRtsp
            },
            // @ts-ignore
            success: function (response){
                //Debug('---------->> UpdateRtspConnections');
                //Debug($.parseJSON(response));
            }
        });
    }

/*******************************************************************************
 *  Opciones para eliminar algun schedule o serie
 *******************************************************************************/

function ShowDeleteOption(){
    DeleteOptions = true;

    // @ts-ignore
    PvrDeleteOptions.style.visibility = 'visible';

    SetFocusOptionDelete('down');
}

function HideDeleteOption(){
    DeleteOptions = false;

    // @ts-ignore
    PvrDeleteOptions.style.visibility = 'hidden';

    OptionsFocus = -1;

    var IndexOptionsNodes = 0;

    for(IndexOptionsNodes = 0; IndexOptionsNodes < (RecordsNodesArray.length - 1); IndexOptionsNodes++){
        // @ts-ignore
        PvrDeleteOptionsNodes[RecordsNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
    }
}


function SetFocusOptionDelete(Direction){
    if(OptionsFocus >= 0){
        // @ts-ignore
        PvrDeleteOptionsNodes[RecordsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= (RecordsNodesArray.length - 1)){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (RecordsNodesArray.length - 2);
    }

    // @ts-ignore
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
        // @ts-ignore
        InfoContainer.style.visibility = 'visible';
        
        ShowBarStatus();

        ActivePvrInfoContainer = true;
        var EpisodeInfo = '';

        // @ts-ignore
        if(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].episode){
            // @ts-ignore
            EpisodeInfo = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].episode+': ';
        }

        // @ts-ignore
        InfoContainerNodes[1].innerHTML  = '<p class="RecInfo">REC:</p> ' +RecordingsList[IndexRecordedFocus][0];
        // @ts-ignore
        InfoContainerNodes[3].textContent  = '';
        // @ts-ignore
        InfoContainerNodes[5].textContent  = '';
        // @ts-ignore
        InfoContainerNodes[7].textContent  = FormatHour;
        // @ts-ignore
        InfoContainerNodes[9].innerHTML    = moment(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].date).format('MMM, DD') +'    ('+TimeConvert(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration) + ') ';
        // @ts-ignore
        InfoContainerNodes[11].textContent = '';
        // @ts-ignore
        InfoContainerNodes[13].textContent = '';
        // @ts-ignore
        InfoContainerNodes[15].textContent = EpisodeInfo + RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].description;

        // @ts-ignore
        clearTimeout(InfoTimer);

        // @ts-ignore
        InfoTimer = setTimeout(HidePvrInfo,TimeoutInfo);
    } else {
        HideBarStatus();
        HidePvrInfo();
    }
}

function HidePvrInfo(){
    if(ActivePvrInfoContainer === true){
        ActivePvrInfoContainer = false;

        // @ts-ignore
        InfoContainer.style.visibility = 'hidden';

        // @ts-ignore
        InfoContainerNodes[1].innerHTML  = '';
        // @ts-ignore
        InfoContainerNodes[3].textContent  = '';
        // @ts-ignore
        InfoContainerNodes[5].textContent  = '';
        // @ts-ignore
        InfoContainerNodes[7].textContent  = '';
        // @ts-ignore
        InfoContainerNodes[9].innerHTML    = '';
        // @ts-ignore
        InfoContainerNodes[11].textContent = '';
        // @ts-ignore
        InfoContainerNodes[13].textContent = '';
        // @ts-ignore
        InfoContainerNodes[15].textContent = '';

        // @ts-ignore
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
                IndexSchedule -= 10; //**11
                IndexScheduleFocus--;
            } else {
                IndexScheduleFocus++;
            }
        }


        for (Row = 1; Row <= 17; Row++) {

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

                // @ts-ignore
                PvrListNodes[Row].innerHTML = Icon + ' '+ SchedulesList[IndexSchedule][IndexProgram];
                // @ts-ignore
                PvrListNodes[Row].title = Title + ','+IndexSchedule+',1';

                Row++;
            } else {
                // @ts-ignore
                PvrListNodes[Row].innerHTML = '';
                // @ts-ignore
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
            IndexProgram -= 10; //**11
            IndexScheduleProgFocus--;
        }

        for (Row = 1; Row <= 17; Row++) {

            if(IndexProgram < SchedulesList[IndexScheduleFocus].length){

                // @ts-ignore
                if(SchedulesList[IndexScheduleFocus][IndexProgram].episode !== ''){
                    // @ts-ignore
                    PvrListNodes[Row].innerHTML = Icon + ' '+ IndexProgram+ ' - '+ SchedulesList[IndexScheduleFocus][IndexProgram].episode;
                } else {
                    // @ts-ignore
                    PvrListNodes[Row].innerHTML = Icon + ' '+ IndexProgram+ ' - '+  moment(SchedulesList[IndexScheduleFocus][IndexProgram].date).format('MMMM Do YYYY');
                }
                // @ts-ignore
                PvrListNodes[Row].title = Title + ','+IndexScheduleFocus+','+IndexProgram;
                Row++;
            } else {
                // @ts-ignore
                PvrListNodes[Row].innerHTML = '';
                // @ts-ignore
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

    for (Row = 1; Row <= 17; Row++) {
        // @ts-ignore
        PvrListNodes[Row].setAttribute('class','PvrProgram');
        Row++;
    }

    // @ts-ignore
    PvrListNodes[PvrRowFocus].setAttribute('class','PvrProgramFocus');

    // @ts-ignore
    RowTypeFocus  = PvrListNodes[PvrRowFocus].title.split(',')[0];

    if(RowTypeFocus !== ''){
        // @ts-ignore
        IndexScheduleFocus  = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[1]);
        // @ts-ignore
        IndexScheduleProgFocus   = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[2]);

        if(RowTypeFocus === 'serie'){
            PvrInfoNodes[1].textContent  = 'Episodes:';
            PvrInfoNodes[3].textContent  = '';
            PvrInfoNodes[5].textContent  = '';
            // @ts-ignore
            PvrInfoNodes[7].textContent  = SchedulesList[IndexScheduleFocus].length - 1;
            PvrInfoNodes[9].textContent  = '';
            PvrInfoNodes[11].textContent = SchedulesList[IndexScheduleFocus][0];
        } else {

            // @ts-ignore
            ScheduleDate = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].date;
            // @ts-ignore
            StartHour    = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].start;
            StartHour    = StartHour.replace(/:/g,'');
            // @ts-ignore
            FinalHour    = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].final;
            FinalHour    = FinalHour.replace(/:/g,'');

            // @ts-ignore
            PvrInfoNodes[1].textContent  = moment(ScheduleDate).format('MMMM Do YYYY');
            // @ts-ignore
            PvrInfoNodes[3].textContent  = moment(ScheduleDate + ' ' + StartHour).format('h:mm a') + ' - ' + moment(ScheduleDate + ' ' + FinalHour).format('h:mm a');
            PvrInfoNodes[5].textContent  = '';
            // @ts-ignore
            PvrInfoNodes[7].textContent  = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].episode;
            // @ts-ignore
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
                IndexSerie -= 10; //**11
                IndexSerieFocus--;
            } else {
                IndexSerieFocus++;
            }
        }

        for (Row = 1; Row <= 17; Row++) {

            IndexSerie++;

            if(Row === 1){
                FirstIndexSerie = IndexSerie;
            }

            if(IndexSerie < SeriesList.length){
                // @ts-ignore
                PvrListNodes[Row].innerHTML = Icon + ' '+ SeriesList[IndexSerie].titulo;
                // @ts-ignore
                PvrListNodes[Row].title = Title + ','+IndexSerie;

                Row++;
            } else {
                // @ts-ignore
                PvrListNodes[Row].innerHTML = '';
                // @ts-ignore
                PvrListNodes[Row].title = '';
            }
        }
    }
}

function SetFocusSeries(){
    var Row = 1,
        SerieDate = '';

    for (Row = 1; Row <= 17; Row++) {
        // @ts-ignore
        PvrListNodes[Row].setAttribute('class','PvrProgram');
        Row++;
    }

    // @ts-ignore
    PvrListNodes[PvrRowFocus].setAttribute('class','PvrProgramFocus');

    // @ts-ignore
    RowTypeFocus  = PvrListNodes[PvrRowFocus].title.split(',')[0];

    if(RowTypeFocus !== ''){
        // @ts-ignore
        IndexSerieFocus  = parseInt(PvrListNodes[PvrRowFocus].title.split(',')[1]);

        // @ts-ignore
        SerieDate = SeriesList[IndexSerieFocus].fecha_adicion;

        // @ts-ignore
        PvrInfoNodes[1].textContent  = 'Recording since: '+moment(SerieDate).format('MMM, DD');
        PvrInfoNodes[3].textContent  = '';
        PvrInfoNodes[5].textContent  = '';
        // @ts-ignore
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

        // @ts-ignore
        RecordPlayOptions.style.visibility = 'visible';

        SetFocusOptionRecordPlay('down');
    }
}

function SetFocusOptionRecordPlay(Direction){
    if(OptionsFocus >= 0){
        // @ts-ignore
        RecordPlayOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= OptionsNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (OptionsNodesArray.length -1 );
    }

    // @ts-ignore
    RecordPlayOptionsNodes[OptionsNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');
}

function CloseRecordPlayOptions(){
    if(RecordPlayOptionsActive === true){
        RecordPlayOptionsActive = false;

        OptionsFocus = -1;

        // @ts-ignore
        RecordPlayOptions.style.visibility = 'hidden';

        var IndexOptionsNodes = 0;

        for(IndexOptionsNodes = 0; IndexOptionsNodes < OptionsNodesArray.length; IndexOptionsNodes++){
            // @ts-ignore
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

            // @ts-ignore
            PlayVideo(RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);
            

            // @ts-ignore
            Debug('URL>>>>>>>>>> '+RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].url);

            ShowPvrInfo();

            SetSpeed('play');
            break;

        case 3:
            // delete
            OptionPanel = 'Recordings';

            SetDeleteProgram();

            StopVideo();

            // @ts-ignore
            SetChannel('');

            UpdateRtspConnections('substract');

            break;

        case 5:
            // stop
            PlayingRecording =  false;

            StopVideo();

            HideBarStatus();

            // @ts-ignore
            SetChannel('');

            UpdateRtspConnections('substract');

        break;

        case 7:
            PlayingRecording =  false;

            StopVideo();

            UpdateRtspConnections('substract');

            HideBarStatus();

            // @ts-ignore
            SetChannel('');

            UnhidePvr();
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
    // @ts-ignore
    Debug('SetSpeed -->> ' + Option);
    if(Option === 'forward'){
        BackwardIndex = -1;

        if(ForwardIndex < (SpeedArray.length - 1)){
            ForwardIndex++;
        }

        // @ts-ignore
        Speed = SpeedArray[ForwardIndex];

        SpeedText = Speed+'x';

        SpeedVideo(Speed);
    } else if(Option === 'backward'){
        ForwardIndex = -1;

        if(BackwardIndex < (SpeedArray.length - 1)){
            BackwardIndex++;
        }

        // @ts-ignore
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

        // @ts-ignore
        Debug('SetSpeed -->>> ' + Speed);
        ResumeVideo();
        // @ts-ignore
        Debug('ResumeVideo -->>> ');
    }

    OptionText = Option;

    ShowBarStatus();
}

function ShowBarStatus(){

    /* Muestra la barra */
    // @ts-ignore
    BarContainer.style.display = 'inline';

    if(OptionText === 'play'){
        /* Limpia el contador */
        // @ts-ignore
        clearTimeout(BarTimer);

        /* Contador para ocultar contenedor principal con la informacion*/
        // @ts-ignore
        BarTimer = setTimeout(HideBarStatus,7000);
    } else {
        // @ts-ignore
        clearTimeout(BarTimer);
    }

    // @ts-ignore
    Debug('ShowBarStatus......RRRRRRRRR');
    UpdateBarStatus();

    // @ts-ignore
    clearTimeout(BarUpdate);

    // @ts-ignore
    BarUpdate = setInterval(UpdateBarStatus,1000);
}

function UpdateBarStatus(){
    var AssetDrt = 0;

    if(PlayingRecording === true){
        // @ts-ignore
        AssetDrt = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].duration;
    }

    AssetStatus(AssetDrt);

    // @ts-ignore
    BarPosition.style.width = PercentagePosition +'%';
    // @ts-ignore
    BarDuration.textContent = SecondsToTime(DurationAsset);

    if(PlayingRecording === true) {
        // @ts-ignore
        BarTimes.textContent = SecondsToTime(DurationAsset - PositionAsset); //"<p>"+SecondsToTime(DurationAsset)+"</p>
    } else {
        // @ts-ignore
        BarTimes.textContent = SecondsToTime(PositionAsset);
    }

    // @ts-ignore
    BarStatus.innerHTML = "<i class='fa fa-"+OptionText+"' ></i><p>"+SpeedText+"</p>";
}

function HideBarStatus(){
    // @ts-ignore
    BarContainer.style.display = 'none';
    // @ts-ignore
    BarTimes.textContent = '';
    // @ts-ignore
    BarDuration.textContent = '';
    // @ts-ignore
    BarStatus.innerHTML = '';
    // @ts-ignore
    clearTimeout(BarTimer);
    // @ts-ignore
    clearTimeout(BarUpdate);
}

/*******************************************************************************
 *  Opciones para agregar manualmente una grabaciones
 *******************************************************************************/

function OpenManualRecord(){
    RecordManualOptionsActive = true;

    // @ts-ignore
    clearTimeout(RecordingManualTimer);
    // @ts-ignore
    RecordingManualTimer = setTimeout(CloseManualRecord,8000);

    // Quita las lineas de los programas para que no se vean encima del cuadro de opciones
    var AllPrograms = document.getElementsByClassName('Program'),
        IndexProgram = 0;
    for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
        // @ts-ignore
        AllPrograms[IndexProgram].style.outline = 'none'; //1px solid rgb(0, 68, 114)
    }
    //

    // @ts-ignore
    RecordManualOptions.style.visibility = 'visible';

    SetFocusManualOption('down');

    // @ts-ignore
    ManualHour   = parseInt(moment().format('h'));
    // @ts-ignore
    ManualMinute = parseInt(moment().format('mm'));

    // @ts-ignore
    if(moment().format('A') === 'AM'){
        ManualIndicator = 0;
    } else {
        ManualIndicator = 1;
    }

    // @ts-ignore
    RecordManualOptionsNodes[ManualNodesArray[0]].textContent = pad(ManualHour,2);
    // @ts-ignore
    RecordManualOptionsNodes[ManualNodesArray[1]].textContent = pad(ManualMinute,2);
    RecordManualOptionsNodes[ManualNodesArray[2]].textContent = ManualListIndicator[ManualIndicator];
    RecordManualOptionsNodes[ManualNodesArray[3]].textContent = ManualListTime[ManualTime];
}

function CloseManualRecord(){
    // @ts-ignore
    if(ActiveEpgContainer === true && RecordManualOptionsActive === true){
        RecordManualOptionsActive = false;

        // @ts-ignore
        clearTimeout(RecordingManualTimer);

        // Agrega las lineas de los programas
        var AllPrograms = document.getElementsByClassName('Program'),
            IndexProgram = 0;
        for(IndexProgram = 0; IndexProgram < AllPrograms.length; IndexProgram++) {
            // @ts-ignore
            AllPrograms[IndexProgram].style.outline = '1px solid '+BackgroundFocus;
        }

        // @ts-ignore
        RecordManualOptions.style.visibility = 'hidden';

        OptionsFocus = -1;

        ManualHour              = 1;
        ManualMinute            = 0;
        ManualIndicator         = 0;
        ManualTime              = 0;

        var IndexOptionsNodes = 0;

        for(IndexOptionsNodes = 0; IndexOptionsNodes < (ManualNodesArray.length - 1); IndexOptionsNodes++){
            // @ts-ignore
            RecordManualOptionsNodes[ManualNodesArray[IndexOptionsNodes]].classList.remove('RecordingOptionFocus');
        }
    }
}


function SetFocusManualOption(Direction){
    if(OptionsFocus >= 0){
        // @ts-ignore
        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].classList.remove('RecordingOptionFocus');
    }

    (Direction === 'down') ? OptionsFocus++: OptionsFocus--;

    if(OptionsFocus >= ManualNodesArray.length){
        OptionsFocus = 0;
    } else if(OptionsFocus < 0){
        OptionsFocus = (ManualNodesArray.length - 1 );
    }

    // @ts-ignore
    RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].classList.add('RecordingOptionFocus');

    // @ts-ignore
    clearTimeout(RecordingManualTimer);

    // @ts-ignore
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

        // @ts-ignore
        RecordManualOptionsNodes[ManualNodesArray[OptionsFocus]].textContent = pad(ManualHour,2);
    } else if(OptionsFocus === 1){
        // 00 - 59
        (Option === 'down') ? ManualMinute--: ManualMinute++;

        if(ManualMinute > 59){
            ManualMinute = 0;
        } else if(ManualHour <= 0){
            ManualMinute = 59;
        }

        // @ts-ignore
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

    // @ts-ignore
    clearTimeout(RecordingManualTimer);

    // @ts-ignore
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

                    PvrRowFocus = 17;

                    SetFocusRecordings();
                }
            } else {
                if(IndexRecordedFocus !== 0){
                    SetRecordings('up');

                    PvrRowFocus = 17;

                    SetFocusRecordings();
                }
            }
        } else {
            if(PvrRowFocus <= 17){
                PvrRowFocus -= 2;
                SetFocusRecordings();
            }
        }
    }else if(OptionPanel === 'Schedules') {
        if(PvrRowFocus === 1){
            if(ListTypeFocus === 'serie'){
                if(IndexScheduleProgFocus !== 1){
                    SetSchedules('up');

                    PvrRowFocus = 17;

                    // @ts-ignore
                    SetFocusScheduless();
                }
            } else {
                if(IndexScheduleFocus !== 0){
                    SetSchedules('up');

                    PvrRowFocus = 17;

                    SetFocusSchedules();
                }
            }
        } else {
            if(PvrRowFocus <= 17){
                PvrRowFocus -= 2;
                SetFocusSchedules();
            }
        }
    } else if(OptionPanel === 'Series') {
        if(PvrRowFocus === 1){
            if(IndexSerieFocus !== 0){
                SetSeries('up');

                PvrRowFocus = 17;

                SetFocusSeries();
            }
        } else {
            if(PvrRowFocus <= 17){
                PvrRowFocus -= 2;
                SetFocusSeries();
            }
        }
    }

    // @ts-ignore
    clearTimeout(PvrTimer);
    // @ts-ignore
    PvrTimer = setTimeout(ClosePvr,TimeoutPvr);
}

function PvrDown(){
    if(RecordOptions === true){
        SetFocusOptionRecord('down');
    } else if(DeleteOptions === true){
        SetFocusOptionDelete('down');
    } else if(OptionPanel === 'Recordings') {
        if(PvrRowFocus === 17){
            if(ListTypeFocus === 'serie'){
                if((RecordingsList[IndexRecordedFocus].length - 1) > 9 && IndexRecordedProgFocus < (RecordingsList[IndexRecordedFocus].length - 1) ){
                    SetRecordings('down');

                    PvrRowFocus = 1;

                    SetFocusRecordings();
                }
            } else {
                if(RecordingsList.length > 9 && IndexRecordedFocus < (RecordingsList.length - 1)){
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
        if(PvrRowFocus === 17){
            if(ListTypeFocus === 'serie'){
                if((SchedulesList[IndexScheduleFocus].length - 1) > 9 && IndexScheduleProgFocus < (SchedulesList[IndexScheduleFocus].length - 1) ){
                    SetSchedules('down');

                    PvrRowFocus = 1;

                    SetFocusSchedules();
                }
            } else {
                if(SchedulesList.length > 9 && IndexScheduleFocus < (SchedulesList.length - 1)){
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
        if(PvrRowFocus === 17){
            if(SeriesList.length > 9 && IndexSerieFocus < (SeriesList.length - 1)){
                SetSeries('down');

                PvrRowFocus = 17;

                SetFocusSeries();
            }
        } else {
            if(PvrRowFocus >= 1){
                PvrRowFocus += 2;
                SetFocusSeries();
            }
        }
    }

    // @ts-ignore
    clearTimeout(PvrTimer);
    // @ts-ignore
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

    // @ts-ignore
    clearTimeout(PvrTimer);
    // @ts-ignore
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

    // @ts-ignore
    clearTimeout(PvrTimer);
    // @ts-ignore
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
    // @ts-ignore
    if(Device['Type'] === 'WHP_HDDN'){
        // @ts-ignore
        if(Device['MacAddressPvr'].length > 1){
            // @ts-ignore
            var RandomMac = getRandomInt(0,Device['MacAddressPvr'].length);
            // @ts-ignore
            MacAddressPvr = Device['MacAddressPvr'][RandomMac];
        } else {
            // @ts-ignore
            MacAddressPvr = Device['MacAddressPvr'][0];
        }
    }
}

SetMacAddressPvr();

function AddSerie(){
    if(FullDisk === false) {
        // @ts-ignore
        Debug('---- AddSerie');
        SetMacAddressPvr();

        // @ts-ignore
        $.ajax({
            type: 'POST',
            url: 'Core/Controllers/Recorder.php',
            data: {
                Option     : 'AddSerie',
                // @ts-ignore
                LocationId : Device['LocationId'],
                MacAddressPvr : MacAddressPvr,
                OperationId : OperationsList['record'],
                // @ts-ignore
                TitleSerie : ChannelsJson[FocusChannelPosition].PROGRAMS[FocusProgramPosition].TTLE,
                // @ts-ignore
                Channel : ChannelsJson[FocusChannelPosition].CHNL + ' - ' +ChannelsJson[FocusChannelPosition].INDC,
                // @ts-ignore
                Position : parseInt(FocusChannelPosition,10)
            },
            success: function (response){
                // @ts-ignore
                ShowRecorderMessage($.parseJSON(response));
                CloseRecordingOptions();

                GetProgramsSerie();
            }
        });
    } else {
        ShowRecorderMessage('Your disk is almost full, delete some recordings');
    }
}

/*******************************************************************************
 *
 *******************************************************************************/

function GetProgramsSerie(){
    // @ts-ignore
    Debug('::::::::::::::::::::::::: GetProgramsSerie::: ');
    GetSeries();

    var IndexS = 0,
        IndexP = 0,
        Position = 0;

    // @ts-ignore
    Debug('SeriesList.length::: ' + SeriesList.length);

    // @ts-ignore
    if(EpgDataActive === true && SeriesList.length > 0){

        ADD_SERIE_BCKG = true;

        for(IndexS = 0; IndexS < SeriesList.length; IndexS++){

            // @ts-ignore
            Position = SeriesList[IndexS].posicion;
            // @ts-ignore
            Debug('Pos::: '+Position);


            // @ts-ignore
            if(ChannelsJsonToday.length === 0){
                // @ts-ignore
                for(IndexP = 0; IndexP < ChannelsJson[Position].P_Length; IndexP++){
                    // @ts-ignore
                    if(SeriesList[IndexS].titulo === ChannelsJson[Position].PROGRAMS[IndexP].TTLE){
                        // @ts-ignore
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
    // @ts-ignore
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsList',
            // @ts-ignore
            LocationId : Device['LocationId'],
            // @ts-ignore
            MacAddress : MacAddress
        },
        success: function (response){
            // @ts-ignore
            RecordingsList = $.parseJSON(response);
        }
    });
}

function GetSchedules(){
    // @ts-ignore
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SchedulesList',
            // @ts-ignore
            LocationId : Device['LocationId']
        },
        success: function (response){
            // @ts-ignore
            SchedulesList = $.parseJSON(response);
        }
    });
}

function GetSeries(){
    // @ts-ignore
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SeriesList',
            // @ts-ignore
            LocationId : Device['LocationId']
        },
        success: function (response){
            // @ts-ignore
            SeriesList = $.parseJSON(response);
        }
    });
}

function GetRecordingsToRecord(){
    // @ts-ignore
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsToRecord',
            // @ts-ignore
            LocationId : Device['LocationId']
        },
        success: function (response){
            // @ts-ignore
            RecordingsToCheck = $.parseJSON(response);
        }
    });
}

function GetPvrInfo(){
    // @ts-ignore
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'GetPvrInfo',
            // @ts-ignore
            LocationId : Device['LocationId'],
            // @ts-ignore
            MacAddress : MacAddress
        },
        success: function (response){
            // @ts-ignore
            DiskInfo = $.parseJSON(response);
            // @ts-ignore
            Debug(DiskInfo);
            if(DiskInfo.length > 0){
                SetPvrInfo();
            }
        }
    });
}
GetPvrInfo();

function CheckManualRecording(){
    // @ts-ignore
    $.ajax({
        type: 'POST',
        async: false,
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'RecordingsToRecord',
            // @ts-ignore
            LocationId : Device['LocationId']
        },
        success: function (response){
            // @ts-ignore
            RecordingsToCheck = $.parseJSON(response);

            // Convierte a UTC el tiempo inicio de la grabacion que se quiere agregar
            // @ts-ignore
            var ProgramYear    = ChannelsJson[REC_CHNL_POS].DTNU.slice(0,4),
                // @ts-ignore
                ProgramMonth   = ChannelsJson[REC_CHNL_POS].DTNU.slice(4,6),
                // @ts-ignore
                ProgramDay     = ChannelsJson[REC_CHNL_POS].DTNU.slice(6,8);



            // @ts-ignore
            var ProgramStart = Time12to24(ManualHour+':'+ManualMinute+' '+ManualListIndicator[ManualIndicator].toLowerCase());
            // @ts-ignore
            var ProgramEnd   = moment(ProgramStart, 'HH:mm').add(ManualListMinutes[ManualTime], 'minutes').format('HH:mm');

            // @ts-ignore
            var ProgramStartHour    = pad(ProgramStart.slice(0,2),2),
                // @ts-ignore
                ProgramStartMinute  = pad(ProgramStart.slice(3,5),2),
                ProgramEndHour      = ProgramEnd.slice(0,2),
                ProgramEndMinute    = ProgramEnd.slice(3,5);

            ProgramUtcStartDate = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, ProgramStartHour, ProgramStartMinute);
            ProgramUtcEndDate   = Date.UTC(ProgramYear, (ProgramMonth -1), ProgramDay, ProgramEndHour, ProgramEndMinute);

            ProgramUtcStartDate = ProgramUtcStartDate / 1000;
            ProgramUtcEndDate = ProgramUtcEndDate / 1000;

            NewStartHour = ProgramStart;
            NewEndHour   = ProgramEnd;


            // @ts-ignore
            var CurrentUtcDate = Date.UTC(moment().format('Y'), (moment().format('MM') -1), moment().format('DD'), moment().format('HH'), moment().format('mm'));
            CurrentUtcDate = CurrentUtcDate / 1000;

            if(ProgramUtcStartDate < CurrentUtcDate){
                Coincidences = 2;
            }

            /* Agregamos el tiempo offset -6 o -7 en segundos */
            ProgramUtcStartDate = ProgramUtcStartDate + SecondsOffset;
            ProgramUtcEndDate   = ProgramUtcEndDate + SecondsOffset;

            // @ts-ignore
            if(ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY === ''){
                // @ts-ignore
                NewDatabasekey  = 'PR'+ProgramStartHour+ProgramStartMinute+ProgramEndHour+ProgramEndMinute+ProgramMonth+ProgramDay;
            } else {
                // @ts-ignore
                NewDatabasekey = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY;
            }

            // @ts-ignore
            if(RecordingsToCheck.length > 0){
                var IndexR                  = 0,
                    ProgramUtcStartDate_DB  = '',
                    ProgramUtcEndDate_DB    = '';

                var Coincidences    = 0,
                    // @ts-ignore
                    SameDatabasekey = false;

                // @ts-ignore
                for(IndexR = 0; IndexR < RecordingsToCheck.length; IndexR++){
                    /* VALIDACION 1 - Por databasekey si ya existe en la BD finaliza el proceso */

                    // @ts-ignore
                    if(RecordingsToCheck[IndexR].databasekey === ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY){
                        SameDatabasekey = true;

                        // @ts-ignore
                        IndexR = RecordingsToCheck.length;
                    } else {
                        /* Obtiene el tiempo de las grabaciones ya agregadas en la base de datos en UTC */
                        // @ts-ignore
                        ProgramUtcStartDate_DB = parseInt(RecordingsToCheck[IndexR].utc_start,10);
                        // @ts-ignore
                        ProgramUtcEndDate_DB   = parseInt(RecordingsToCheck[IndexR].utc_final,10);

                        //Debug('------ ProgramUtcStartDate: '+ProgramUtcStartDate + ' ProgramUtcEndDate: '+ProgramUtcEndDate);
                        //Debug('****** ProgramUtcStartDate: '+ProgramUtcStartDate_DB + ' ProgramUtcEndDate: '+ProgramUtcEndDate_DB);

                        /* Si la HoraIniProgAgregar es mayor a la HoraFinProgBd */
                        // @ts-ignore
                        if(ProgramUtcStartDate > ProgramUtcEndDate_DB){
                            // 0 Coincidences
                        }
                        /* Else Si la HoraFinProgAgregar es menor a la HoraIniProgBD */
                        // @ts-ignore
                        if(ProgramUtcStartDate < ProgramUtcStartDate_DB){
                            // 0 Coincidences
                        }
                        /* Else esta en el mismo rango de la hora inicio y final */
                        // @ts-ignore
                        if(ProgramUtcStartDate >= ProgramUtcStartDate_DB && ProgramUtcEndDate <= ProgramUtcEndDate_DB){
                            Coincidences++;
                            //Debug('// 1 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                        }
                        /* Else esta en el mismo rango de la hora inicio */
                        // @ts-ignore
                        else if(ProgramUtcStartDate > ProgramUtcStartDate_DB && ProgramUtcEndDate < (ProgramUtcStartDate_DB + SecondsRange)){
                            Coincidences++;
                            //Debug('// 2 Else esta en el mismo rango de la hora inicio::: Coincidences: '+Coincidences);
                        }
                        /* Else esta en el mismo rango de la hora inicio y final */
                        // @ts-ignore
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
                        ShowRecorderMessage('Reached the limit of recordings at the same time');
                    }
                } else {
                    if(Date.now()/1000 < ProgramUtcEndDate+ 400){
                        if(Date.now()/1000 < ProgramUtcStartDate+100){
                           AddRecord(); 
                        }else{
                            ProgramUtcStartDate = (Date.now()/1000) + 100;
                            AddRecord(); 
                        }
                    }else{
                        ShowRecorderMessage('This program has already ended');
                    }
                }
            } else {
                if(Date.now()/1000 < ProgramUtcEndDate+ 400){
                    if(Date.now()/1000 < ProgramUtcStartDate+100){
                       AddRecord(); 
                    }else{
                        ProgramUtcStartDate = (Date.now()/1000) + 100;
                        AddRecord(); 
                    }
                }else{
                    ShowRecorderMessage('This program has already ended');
                }
            }
        }
    });
}

function CheckRecordings() {
    if(FullDisk === false){
        // @ts-ignore
        $.ajax({
            type: 'POST',
            async: false,
            url: 'Core/Controllers/Recorder.php',
            data: {
                Option: 'RecordingsToRecord',
                // @ts-ignore
                LocationId: Device['LocationId']
            },
            success: function (response) {
                // @ts-ignore
                RecordingsToCheck = $.parseJSON(response);

                // @ts-ignore
                Debug('--------------------------------------->>0');
                // @ts-ignore
                Debug("Channel Pos:     "+ REC_CHNL_POS);
                // @ts-ignore
                Debug("Program Pos:     " + REC_PROG_POS);

                // Convierte a UTC el tiempo inicio de la grabacion que se quiere agregar
                // @ts-ignore
                var ProgramYear = ChannelsJson[REC_CHNL_POS].DTNU.slice(0, 4),
                    // @ts-ignore
                    ProgramMonth = ChannelsJson[REC_CHNL_POS].DTNU.slice(4, 6),
                    // @ts-ignore
                    ProgramDay = ChannelsJson[REC_CHNL_POS].DTNU.slice(6, 8),

                    // @ts-ignore
                    ProgramStartHour = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRH.slice(0, 2),
                    // @ts-ignore
                    ProgramStartMinute = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRH.slice(3, 5),

                    // @ts-ignore
                    ProgramEndHour = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].FNLH.slice(0, 2),
                    // @ts-ignore
                    ProgramEndMinute = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].FNLH.slice(3, 5);

                // @ts-ignore
                Debug('--------------------------------------->>1');
                // @ts-ignore
                Debug(ProgramStartHour + ' ' + ProgramStartMinute);
                // @ts-ignore
                Debug(ProgramEndHour + ' ' + ProgramEndMinute);

                ProgramUtcStartDate = Date.UTC(ProgramYear, (ProgramMonth - 1), ProgramDay, ProgramStartHour, ProgramStartMinute);

                // @ts-ignore
                Debug('--------------------------------------->>2');
                // @ts-ignore
                Debug(ProgramUtcStartDate);
                // @ts-ignore
                Debug(ProgramUtcEndDate);

                ProgramUtcStartDate = ProgramUtcStartDate / 1000;

                // @ts-ignore
                if (parseInt(REC_PROG_POS) === LastProgramsPositions[RowSelected]) {
                    // @ts-ignore
                    Debug('--------------------------------------->>2.1 ');
                    // @ts-ignore
                    var ProgramSeconds = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].MNTS * 60;
                    // @ts-ignore
                    Debug(ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].MNTS);
                    // @ts-ignore
                    Debug(ProgramSeconds);
                    ProgramUtcEndDate = ProgramUtcStartDate + ProgramSeconds;
                } else {
                    // @ts-ignore
                    Debug('--------------------------------------->>2.2 ');
                    ProgramUtcEndDate = Date.UTC(ProgramYear, (ProgramMonth - 1), ProgramDay, ProgramEndHour, ProgramEndMinute);
                    ProgramUtcEndDate = ProgramUtcEndDate / 1000;
                }

                // @ts-ignore
                Debug('--------------------------------------->>3');
                // @ts-ignore
                Debug(ProgramUtcStartDate);
                // @ts-ignore
                Debug(ProgramUtcEndDate);

                // @ts-ignore
                Debug('--------------------------------------->>3.1');
                // @ts-ignore
                Debug(parseInt(REC_CHNL_POS));
                // @ts-ignore
                Debug(OnloadProgramsPositions[RowSelected]);
                // @ts-ignore
                Debug(EpgDayNumber);

                // @ts-ignore
                if (parseInt(REC_PROG_POS) === OnloadProgramsPositions[RowSelected] && EpgDayNumber === 0) {

                    // @ts-ignore
                    var CurrentHour = moment().format('HH:mm');
                    // @ts-ignore
                    NewStartHour = moment(CurrentHour, 'HH:mm')
                        .add(1, 'minutes')
                        .format('HH:mm');

                    // @ts-ignore
                    ProgramUtcStartDate = Date.UTC(ProgramYear, (ProgramMonth - 1), ProgramDay, moment().format('HH'), moment().format('mm'));
                    ProgramUtcStartDate = ProgramUtcStartDate / 1000;

                    ProgramUtcStartDate = ProgramUtcStartDate + 100;

                    // @ts-ignore
                    Debug('--------------------------------------->>3.2');
                    // @ts-ignore
                    Debug(NewStartHour);
                    // @ts-ignore
                    Debug(ProgramUtcStartDate);


                } else {
                    // @ts-ignore
                    NewStartHour = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRH;
                }


                // @ts-ignore
                NewEndHour = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].FNLH;

                // @ts-ignore
                Debug('--------------------------------------->>4');
                // @ts-ignore
                Debug(NewStartHour);
                // @ts-ignore
                Debug(NewEndHour);

                // @ts-ignore
                var CurrentUtcDate = Date.UTC(moment().format('Y'), (moment().format('MM') - 1), moment().format('DD'), moment().format('HH'), moment().format('mm'));
                CurrentUtcDate = CurrentUtcDate / 1000;

                // @ts-ignore
                Debug('--------------------------------------->>5');
                // @ts-ignore
                Debug(CurrentUtcDate);
                // @ts-ignore
                Debug(ProgramUtcStartDate);


                var TimeDiff = ProgramUtcStartDate - CurrentUtcDate;
                // @ts-ignore
                Debug(TimeDiff);

                var TimeDiffEnd = ProgramUtcEndDate - ProgramUtcStartDate;
                // @ts-ignore
                Debug(TimeDiffEnd);

                if (TimeDiff < 0 || TimeDiffEnd < 0) {
                    // @ts-ignore
                    Debug('--------------------------------------->>5.1 FIN');
                    ShowRecorderMessage('The program has already been broadcast ');
                } else {

                    // @ts-ignore
                    if (ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY === '') {
                        // @ts-ignore
                        NewDatabasekey = 'PR' + ProgramStartHour + ProgramStartMinute + ProgramEndHour + ProgramEndMinute + ProgramMonth + ProgramDay;
                    } else {
                        // @ts-ignore
                        NewDatabasekey = ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY;
                    }

                    /* Agregamos el tiempo offset -6 o -7 en segundos */
                    ProgramUtcStartDate = ProgramUtcStartDate + SecondsOffset;
                    ProgramUtcEndDate = ProgramUtcEndDate + SecondsOffset;

                    // @ts-ignore
                    Debug('--------------------------------------->>6');
                    // @ts-ignore
                    Debug(ProgramUtcStartDate);
                    // @ts-ignore
                    Debug(ProgramUtcEndDate);

                    // @ts-ignore
                    if (RecordingsToCheck.length > 0) {
                        var IndexR = 0,
                            ProgramUtcStartDate_DB = '',
                            ProgramUtcEndDate_DB = '';

                        var Coincidences = 0,
                            SameDatabasekey = false;

                        // @ts-ignore
                        for (IndexR = 0; IndexR < RecordingsToCheck.length; IndexR++) {
                            /* VALIDACION 1 - Por databasekey si ya existe en la BD finaliza el proceso */

                            // @ts-ignore
                            if (RecordingsToCheck[IndexR].databasekey === ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DBKY) {
                                SameDatabasekey = true;

                                // @ts-ignore
                                IndexR = RecordingsToCheck.length;
                            } else {
                                /* Obtiene el tiempo de las grabaciones ya agregadas en la base de datos en UTC */
                                // @ts-ignore
                                ProgramUtcStartDate_DB = parseInt(RecordingsToCheck[IndexR].utc_start, 10);
                                // @ts-ignore
                                ProgramUtcEndDate_DB = parseInt(RecordingsToCheck[IndexR].utc_final, 10);

                                //Debug('------ ProgramUtcStartDate: '+ProgramUtcStartDate + ' ProgramUtcEndDate: '+ProgramUtcEndDate);
                                //Debug('****** ProgramUtcStartDate: '+ProgramUtcStartDate_DB + ' ProgramUtcEndDate: '+ProgramUtcEndDate_DB);

                                /* Si la HoraIniProgAgregar es mayor a la HoraFinProgBd */
                                // @ts-ignore
                                if (ProgramUtcStartDate > ProgramUtcEndDate_DB) {
                                    // 0 Coincidences
                                }
                                /* Else Si la HoraFinProgAgregar es menor a la HoraIniProgBD */
                                // @ts-ignore
                                if (ProgramUtcStartDate < ProgramUtcStartDate_DB) {
                                    // 0 Coincidences
                                }
                                /* Else esta en el mismo rango de la hora inicio y final */
                                // @ts-ignore
                                if (ProgramUtcStartDate >= ProgramUtcStartDate_DB && ProgramUtcEndDate <= ProgramUtcEndDate_DB) {
                                    Coincidences++;
                                    //Debug('// 1 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                                }
                                /* Else esta en el mismo rango de la hora inicio */
                                // @ts-ignore
                                else if (ProgramUtcStartDate > ProgramUtcStartDate_DB && ProgramUtcEndDate < (ProgramUtcStartDate_DB + SecondsRange)) {
                                    Coincidences++;
                                    //Debug('// 2 Else esta en el mismo rango de la hora inicio::: Coincidences: '+Coincidences);
                                }
                                /* Else esta en el mismo rango de la hora inicio y final */
                                // @ts-ignore
                                else if (ProgramUtcEndDate < ProgramUtcEndDate_DB && ProgramUtcStartDate > (ProgramUtcEndDate_DB + SecondsRange)) {
                                    Coincidences++;
                                    //Debug('// 3 Else esta en el mismo rango de la hora inicio y final::: Coincidences: '+Coincidences);
                                }
                            }
                            //Debug('Coincidences: '+Coincidences);
                            //Debug('-------------------------------------------------------------------');
                        }


                        if (SameDatabasekey === true) {
                            if (ADD_SERIE_BCKG === false) {
                                ShowRecorderMessage('Program already added');
                            }
                        } else {
                            if (Coincidences >= 2) {
                                if (ADD_SERIE_BCKG === false) {
                                    ShowRecorderMessage('Reached the limit of recordings at the same time');
                                }
                            } else {
                                if(Date.now()/1000 < ProgramUtcEndDate+ 400){
                                    if(Date.now()/1000 < ProgramUtcStartDate+100){
                                       AddRecord(); 
                                    }else{
                                        ProgramUtcStartDate = (Date.now()/1000) + 100;
                                        AddRecord(); 
                                    }
                                }else{
                                    ShowRecorderMessage('This program has already ended');
                                }
                            }
                        }
                    } else {
                        if(Date.now()/1000 < ProgramUtcEndDate+ 400){
                            if(Date.now()/1000 < ProgramUtcStartDate+100){
                               AddRecord(); 
                            }else{
                                ProgramUtcStartDate = (Date.now()/1000) + 100;
                                AddRecord(); 
                            }
                        }else{
                            ShowRecorderMessage('This program has already ended');
                        }
                    }
                }
            }
        });
    } else {
        ShowRecorderMessage('Your disk is almost full, delete some recordings');
    }
}


function AddRecord(){
    SetMacAddressPvr();

    // @ts-ignore
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option          : 'AddRecord',
            // @ts-ignore
            LocationId      : Device['LocationId'],
            MacAddressPvr   : MacAddressPvr,
            OperationId     : OperationsList['record'],
            // @ts-ignore
            Title           : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].TTLE,
            // @ts-ignore
            Databasekey     : NewDatabasekey,
            // @ts-ignore
            Episode         : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].EPSD,
            // @ts-ignore
            Description     : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].DSCR,
            // @ts-ignore
            Rating          : ChannelsJson[REC_CHNL_POS].PROGRAMS[REC_PROG_POS].STRS,
            // @ts-ignore
            Date            : ChannelsJson[REC_CHNL_POS].DTNU,
            StarTime        : NewStartHour,
            EndTime         : NewEndHour,
            UtcStart        : ProgramUtcStartDate,
            UtcEnd          : ProgramUtcEndDate,
            // @ts-ignore
            ChannelSource   : ChannelsJson[REC_CHNL_POS].SRCE +':'+ChannelsJson[REC_CHNL_POS].PORT
        },
        success: function (response){
            if(ADD_SERIE_BCKG === false){
                // @ts-ignore
                ShowRecorderMessage($.parseJSON(response));
                CloseRecordingOptions();
                CloseManualRecord();
            }

            // @ts-ignore
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
        // @ts-ignore
        ProgramId = RecordingsList[IndexRecordedFocus][IndexRecordedProgFocus].id;
    } else {
        // @ts-ignore
        ProgramId = SchedulesList[IndexScheduleFocus][IndexScheduleProgFocus].id;
    }

    // @ts-ignore
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option          : 'SetDeleteProgram',
            OperationId     : OperationsList['delete'],
            ProgramId       : ProgramId
        },
        success: function (response){

            // @ts-ignore
            Response = $.parseJSON(response);

            // @ts-ignore
            ShowRecorderMessage(Response.Message);

            // @ts-ignore
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

    // @ts-ignore
    Debug('IndexSerieFocus: '+IndexSerieFocus);
    // @ts-ignore
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option  : 'DeleteSerie',
            // @ts-ignore
            SerieId : SeriesList[IndexSerieFocus].id_serie
        },
        success: function (response){

            // @ts-ignore
            Response = $.parseJSON(response);

            // @ts-ignore
            ShowRecorderMessage(Response.Message);

            // @ts-ignore
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

function GetWeatherPvr(){

    // @ts-ignore
    PvrDate.textContent = FormatDateAndHour;

    // @ts-ignore
    $.ajax({
        type: 'GET',
        url: 'Core/Controllers/Weather.php',
        success: function (response) {
            // @ts-ignore
            ObjectWeather = JSON.parse(response);
            SetIconPvr();
        }
    });
}

function SetIconPvr(){
    // @ts-ignore
    var skycons = new Skycons({
        'color': 'white'
    });

    // @ts-ignore
    skycons.add('PvrWeatherIcon', ObjectWeather.Icon);
    // @ts-ignore
    $('#PvrWeatherFarenheit').html(String(Math.round(ObjectWeather.Temperature)));
    // @ts-ignore
    $('#PvrWeatherCelsius').html(String(toCelsius(ObjectWeather.Temperature)));
}