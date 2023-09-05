// @ts-nocheck
/* Creado por: Tania Maldonado
 * Fecha: Abril 2020
 * Tipo: Manejador de eventos
 * Vendor: Amino
 */
    
    /* Eventos PVR */

    var PVR_REC_RECORDING_STARTED   = 58,
        PVR_REC_END_OF_STREAM       = 57,
        PVR_PLAY_END_OF_FILE        = 67;

    var RTSP_STATUS_END_OF_STREAM   = 8,
        RTSP_STATUS_NOT_FOUND       = 9,
        RTSP_SETUP_SUCCESS          = 51,
        RTSP_CONNECTION_STOPPED     = 12,
        RTSP_CONNECTION_DIED        = 4,
        RTSP_CONNECT_FAILED         = 1;

    var CONNECTION_STOPPED          = 95,
        IGMP_STATUS_END_OF_STREAM   = 11,
        HDMI_STATUS_UPDATED         = 89,
        STATUS_END_OF_STREAM        = 90,
        STATUS_PLAYING              = 92,
        VIDEO_STARTED               = 84,
        IGMP_STATUS_PLAYING         = 15;

    var ProgramsToSchedule          = '',
        ProgramsToDelete            = '',
        AssetsIdList                = [],
        SizePerSecond               = 0,
        SizeAvailable               = 0,
        SizeTotal                   = 0,
        AssetsCount                 = 0;
    
    var NUMBER_EVENT                = 0;

    var TIMERS,
        xhr;

//Debug('########################### HandleEvent() ');

        AVMedia.onEvent='HandleEvent()';

        //NetMan.onEvent = 'processNetManEvent()';

        //function processNetManEvent() {
        //    EventNetman = NetMan.Event;

        //    //Debug('########################### NetMan.Event: '+EventNetman);

        //    if(Executing === false){
        //        UpdateQuickInfoDevice();
        //    }
        //} 
/*******************************************************************************
 * Manejador de eventos
 *******************************************************************************/

    function HandleEvent() {
        
        //Debug('*************AVMedia.Event: '+AVMedia.Event);
        NUMBER_EVENT = AVMedia.Event;
        if(System.HdmiConnected === true){
            EventHdmi = 1;
        } else {
            EventHdmi = 0;
        }

        if(NUMBER_EVENT === PVR_REC_RECORDING_STARTED || NUMBER_EVENT === PVR_REC_END_OF_STREAM){
            // Actualiza el estado del disco en el grabador y actualiza
            UpdateAssetsId();

            UpdateDiskInfo();
        } else if(NUMBER_EVENT === RTSP_STATUS_END_OF_STREAM || NUMBER_EVENT === PVR_PLAY_END_OF_FILE){
            // Termino reproduccion grabacion
            OpenRecordPlayOptions();
            Browser.CacheFlush();
        } else if(NUMBER_EVENT === RTSP_CONNECTION_STOPPED || NUMBER_EVENT === RTSP_CONNECTION_DIED || NUMBER_EVENT === RTSP_CONNECT_FAILED){ 
            // No encuentra la grabacion (Reinicio del PVR o no encuentra la grabacion)
            OpenRecordPlayOptions();
            Browser.CacheFlush();
        } else if(NUMBER_EVENT === CONNECTION_STOPPED){ 
            //
            EventString = 'CONNECTION_STOPPED';

            if(Executing === false){
                UpdateQuickInfoDevice();
            }

            Browser.CacheFlush();
        } else if(NUMBER_EVENT === IGMP_STATUS_END_OF_STREAM){ 
            //
            EventString = 'STATUS_ERROR_STREAM';

            if(Executing === false){
                UpdateQuickInfoDevice();
            }

            Browser.CacheFlush();
        }  else if(NUMBER_EVENT === VIDEO_STARTED){
            //
            EventString = 'STATUS_PLAYING';

            //Debug('----> HANDLE EVENTS VIDEO_STARTED');
            if(Executing === false){
                UpdateQuickInfoDevice();
            }
        }
        // else if(NUMBER_EVENT === IGMP_STATUS_PLAYING || NUMBER_EVENT === STATUS_PLAYING){
        //     //
        //     //Debug('----> HANDLE EVENTS STATUS_PLAYING');
        //     EventString = 'STATUS_PLAYING';
        //
        //
        //
        //     //Debug('----> HANDLE EVENTS Executing: '+Executing);
        //     if(Executing === false){
        //         UpdateQuickInfoDevice();
        //     }
        //
        //     //Debug('----> HANDLE EVENTS STATUS_PLAYING <');
        // }
        else if(NUMBER_EVENT === STATUS_END_OF_STREAM){
            if(CurrentModule === 'Tv'){
            	if (PlayingChannel == true && PlayDigita == false){
            		TvChannelUp();
            	}else{
            		SetDigitalChannel();
            	}
            } else if(CurrentModule === 'Movies'){
                //EndOfMovie();
                //Debug('STATUS_END_OF_STREAM');
                PlayVideo(Libraries['MoviesSource'] + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].FILE);
                AVMedia.SetPos(PositionAsset);
                //Debug('Se detuvo y se reprodujo de nuevo');
            }

            EventString = 'STATUS_END_OF_STREAM';

            if(Executing === false){
                UpdateQuickInfoDevice();
            }
        } else if(NUMBER_EVENT === HDMI_STATUS_UPDATED) {
            if(System.HdmiConnected === true){
                EventHdmi = 1;
            } else {
                EventHdmi = 0;
            }

            if(Executing === false){
                UpdateQuickInfoDevice();
            }
        }

        NUMBER_EVENT = null;
        AVMedia.onEvent=null;
        AVMedia.onEvent='HandleEvent()';
    }



/*******************************************************************************
 * Actualiza informacion del disco duro
 *******************************************************************************/

function UpdateDiskInfo(){
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SetPvrInfo',
            LocationId : Device['LocationId'],
            MacAddress : MacAddress,
            TotalSize : SizeTotal,
            AvailableSize : SizeAvailable,
            SizeRecords : SizePerSecond
        }
    });
    xhr = null;
}

/*******************************************************************************
 * Obtien lista de programas para grabar
 *******************************************************************************/

function GetProgramsToSchedule(){
    //Debug('-------->> GetProgramsToSchedule');
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckProgramsToSchedule',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToSchedule = $.parseJSON(response);

            var Indexps     = 0,
                NewSchedule = [],
                ProgramId   = '',
                Title       = '',
                Source      = '',
                Start       = '',
                End         = '';

            for(Indexps = 0;  Indexps < ProgramsToSchedule.length; Indexps++){

                ProgramId = ProgramsToSchedule[Indexps]['id_programa'];
                Title = ProgramsToSchedule[Indexps]['titulo_programa'];
                Source = ProgramsToSchedule[Indexps]['url_canal'];
                Start = ProgramsToSchedule[Indexps]['utc_inicio'];
                End = ProgramsToSchedule[Indexps]['utc_final'];

                //Debug('>> '+Source +', '+ Title +', '+ Start +', '+ End);

                //Debug('ProgramsToSchedule.length: '+ProgramsToSchedule.length);

                NewSchedule = PVR.AddSchedule(Source, ProgramId, Start, End);

                if (typeof(NewSchedule) === 'undefined'){
                    //CurrentTime = Date.UTC(moment().format('Y'), moment().format('MM'), moment().format('DD'), moment().format('HH'), moment().format('mm'));
                    //Debug('> Fail new schedule');
                    DeleteProgram(ProgramId);
                } else {
                    NewSchedule.WriteMeta('This is Metadata for scheduled asset '+ Title);
                    //Debug('New schedule added, streamid = '+NewSchedule.streamId);
                    //Debug('> '+ProgramId + ', '+OperationsList.recording+', '+NewSchedule.streamId);
                    UpdateProgramStreamId(ProgramId, OperationsList.recording, NewSchedule.streamId);
                }
            }
        }
    });
    xhr = null;
    //Debug('--------<< GetProgramsToSchedule');
}

/*******************************************************************************
 * Obtien lista de programas a eliminar
 *******************************************************************************/

function GetSchedulesToDelete(){

    //Debug('-------->> GetSchedulesToDelete');
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckSchedulesToDelete',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToDelete = $.parseJSON(response);

            var Indexps     = 0;


            var ResultDelete = -1,
                StreamId     = -1,
                AssetId      = -1,
                Active       = -1;

            for(Indexps = 0;  Indexps < ProgramsToDelete.length; Indexps++){

                StreamId = parseInt(ProgramsToDelete[Indexps].id_stream,10);
                AssetId  = parseInt(ProgramsToDelete[Indexps].id_asset,10);
                Active   = parseInt(ProgramsToDelete[Indexps].grabacion_activa,10);

                if(StreamId === 0){
                    DeleteProgram(ProgramsToDelete[Indexps].id_programa);
                } if(AssetId > 0 && Active === 0){
                    ResultDelete = PVR.DeleteAsset(AssetId);

                    if(ResultDelete === 0){
                        DeleteProgram(ProgramsToDelete[Indexps].id_programa);
                    }
                } else {
                    ResultDelete = PVR.DeleteSchedule(StreamId);

                    if(Active === 1){
                        UpdateProgramDelete(ProgramsToDelete[Indexps].id_programa, OperationsList.delete, AssetId);
                    } else {
                        DeleteProgram(ProgramsToDelete[Indexps].id_programa);
                    }
                }
            }
        }
    });
    xhr = null;
    //Debug('--------<< GetSchedulesToDelete');
}

/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function DeleteProgram(ProgramId){
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'DeleteProgram',
            ProgramId : ProgramId
        }
    });
    xhr = null;
}

/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function UpdateProgramAsset(ProgramId, OperationId, AssetId, ActiveRecording){

    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramAsset',
            ProgramId : ProgramId,
            OperationId : OperationId,
            AssetId : AssetId,
            ActiveRecording : ActiveRecording
        }
    });
    xhr = null;
}

function UpdateProgramStreamId(ProgramId, OperationId, StreamId){
    //Debug('--------->> UpdateProgramStreamid= '+ ProgramId + ', ' + OperationId + ', '+StreamId);
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStreamId',
            ProgramId : ProgramId,
            OperationId : OperationId,
            StreamId : StreamId
        }
    });
    xhr = null;
}

function UpdateProgramDelete(ProgramId, OperationId, AssetId){

    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStatusDelete',
            ProgramId : ProgramId,
            OperationId : OperationId,
            AssetId : AssetId
        }
    });
    xhr = null;
}

/*******************************************************************************
 * Actualiza el asset id
 *******************************************************************************/
    
    
    function UpdateAssetsId(){
        var Durations   = 0,
            Sizes   = 0;
    
        //Debug('-------->> UpdateAssetsId');
        
        AssetsIdList = PVR.GetAssetIdList();
        
        if (typeof AssetsIdList !== 'object'){ AssetsCount = 0; } else { AssetsCount = AssetsIdList.count; }
               
        var YesterdayUtcDate = Date.UTC(moment().format('Y'), (moment().format('MM') -2), moment().format('DD'), moment().format('HH'), moment().format('mm'));
                    YesterdayUtcDate = YesterdayUtcDate / 1000;
                    
        ////Debug('>>>>>>>>>>> YesterdayUtcDate '+YesterdayUtcDate);

        if (AssetsCount > 0){
            
            var Indexal = 1,
                AssetInfo = [],
                ActRec    = false,
                Option = '';
            ////Debug('****************************************************>>>');
            for(Indexal = 1;  Indexal <= AssetsIdList.count; Indexal++){
                
                ////Debug('::::::::= '+AssetsIdList.count);
                
                AssetInfo = PVR.GetAssetById(AssetsIdList[Indexal]);
                
                if(AssetInfo.startTime < YesterdayUtcDate){
                    //Debug('<<<<<<<<<< startTime <<<<'+AssetInfo.startTime);
                } else {
                    //Debug('>>>>>>>>>>> startTime >>>>'+AssetInfo.startTime);

                    //Debug(JSON.stringify(AssetInfo));

                    ActRec = (AssetInfo.activeRecording === 0) ? false : true;

                    Option = (AssetInfo.activeRecording === 0) ? OperationsList.recorded : OperationsList.recording;

                    ////Debug(AssetInfo.title +', '+ OperationsList.recorded +', '+  Option +', '+ AssetsIdList[Indexal] +', '+  ActRec);

                    UpdateProgramAsset(AssetInfo.title, Option, AssetsIdList[Indexal], ActRec);
                }


                // //Debug('--> AssetInfo.duration: '+parseInt(AssetInfo.duration));
                // //Debug('--> AssetInfo.totalSize: '+parseInt(AssetInfo.totalSize));

                Durations = Durations + parseInt(AssetInfo.duration); // seconds
                Sizes = Sizes + parseInt(AssetInfo.totalSize); // kb
            }

            var StorageInfo = [];
                StorageInfo = PVR.GetStorageInfo();

            // //Debug('****************************************************<<<');
            // //Debug('-----> Sizes: '+Sizes);
            // //Debug('-----> Durations: '+Durations);
            // //Debug('-----> AssetsIdList.count: '+AssetsIdList.count);
            SizeAvailable = StorageInfo.totalSize - Sizes;
            SizeTotal = StorageInfo.totalSize;
            SizePerSecond = Math.round((Sizes / Durations));

             //Debug('----> SizePerSecond: '+SizePerSecond);
        }

        StorageInfo = null;
        Durations = null;
        Sizes = null;
    //Debug('--------<< UpdateAssetsId');
    }


/*******************************************************************************
 * Carga inicial con funciones para el DVR
 *******************************************************************************/

if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){

    HandlerPvr();

    UpdateDiskInfo();

    GetProgramsSerie();

    HandlerPvr();
}

function HandlerPvr(){

    UpdateAssetsId();

    GetProgramsToSchedule();

    GetSchedulesToDelete();

    //Debug('-------> HandlerPvr');

    setTimeout(HandlerPvr,50000);
}


