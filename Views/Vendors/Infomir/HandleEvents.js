// @ts-nocheck

window.stbEvent = {
    onEvent: function ( event, info ) {

        Debug('Evento:  '+event);
        EventNetman = gSTB.GetLanLinkStatus();

        switch ( Number (event) ) {

            case 1:
                //The player reached the end of the media content or detected a discontinuity of the stream
                EventString = 'STATUS_END_OF_STREAM';

                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
            break;

            case 2:
                //Information on audio and video tracks of the media content is received
                EventString = 'STATUS_PLAYING';

                Debug("---------------> " + EventString + " <---------------");
            break;

            case 4:
                //Video and/or audio playback has begun
                EventString = 'STATUS_PLAYING';

                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
            break;

            case 5:
                //Error when opening the content: content not found on the server or connection with the server was rejected
                EventString = 'STATUS_ERROR_STREAM';

                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
            break;

            case 32:
                //HDMI device has been connected.
                EventHdmi = 1;
            
                Debug('....................HDMI 1........................');
                gSTB.StandBy(false);
                Debug('..................STANDBY EXIT..........................');
                var SWS = gSTB.GetStandByStatus();
                Debug('----------------------- SWS'+SWS);
                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
                
                break;  

            case 33:
                //HDMI device has been disconnected.
                EventHdmi = -1;

                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
                break;
            case 36:
                info = JSON.parse(info);
                Debug('TimeShift mode is enabled. TimeShift data:', info);
                break;
            case 39: //Task started recording.
                    EventString = 'STATUS_START_RECORD';
                    Debug("---------------> " + EventString + " <---------------");
                    var tas = JSON.parse(pvrManager.GetAllTasks());
                    var reco = [];
                    for(var x = 0; x < tas.length; x++){
                        if (tas[x].state === 2){
                            reco.push(tas[x]);
                        }
                    }
                    var inre = reco[reco.length - 1];
                    UpdateProgramOpera(inre.fileName, OperationsList.recording);
                    UpdateDiskInfoInformir();
                    break;
            case 34: //Task has been finished successfully.
                    EventString = 'STATUS_END_RECORD';
                    Debug("---------------> " + EventString + " <---------------");
                    var tas = JSON.parse(pvrManager.GetAllTasks());
                    var reco = [];
                    for(var x = 0; x < tas.length; x++){
                        if (tas[x].state === 4){
                            reco.push(tas[x]);
                        }
                    }
                    var inre = reco[reco.length - 1];
                    Debug("---------------> EXITOOOO  "+OperationsList.recorded+" <---------------");
                    UpdateProgramOpera(inre.fileName, OperationsList.recorded);
                    UpdateDiskInfoInformir();
                    break;
            case 35: //Task has been finished with error.
                    EventString = 'STATUS_ERROR_RECORD';
                    Debug("---------------> " + EventString + " <---------------");
                    var tas = JSON.parse(pvrManager.GetAllTasks());
                    var reco = [];
                    for(var x = 0; x < tas.length; x++){
                        if (tas[x].state === 3){
                            reco.push(tas[x]);
                        }
                    }
                    var inre = reco[reco.length - 1];
                    UpdateProgramOpera(inre.fileName, 2);
                    UpdateDiskInfoInformir();
                    break;
        }
    },
    onBroadcastMessage: function( from, message, data ) {
        if ( message === 'storage.mount' ) {
            InfomirUSB = 1;
        } else if ( message === 'storage.unmount' ) {
            InfomirUSB = 0;
        }
    }
};


/*******************************************************************************
 * Actualiza informacion del disco duro
 *******************************************************************************/

function UpdateDiskInfoInformir(){
    Debug("-------> UPDATE DISK INFOMIR");
    storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
    USB = storageInfo.result || [];
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SetPvrInfo',
            LocationId : Device['LocationId'],
            MacAddress : gSTB.GetDeviceMacAddress(),
            TotalSize : USB[0].size / 1024,
            AvailableSize : USB[0].freeSize / 1024,
            SizeRecords : '320'
        },
        success: function (response){
            //Debug(response);
        }
    });
    ;
}

/*******************************************************************************
 * Obtien lista de programas para grabar
 *******************************************************************************/

 function GetProgramsToScheduleInformir(){
    Debug('-------->> GetProgramsToSchedule');
    $.ajax({
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
                Fecha       = '',
                Source      = '',
                Start       = '',
                End         = '';

            for(Indexps = 0;  Indexps < ProgramsToSchedule.length; Indexps++){

                ProgramId = ProgramsToSchedule[Indexps]['id_programa'];
                Title = ProgramsToSchedule[Indexps]['titulo_programa'];
                Fecha = ProgramsToSchedule[Indexps]['fecha_programa'];
                Source = ProgramsToSchedule[Indexps]['url_canal'];
                Start = ProgramsToSchedule[Indexps]['utc_inicio'];
                End = ProgramsToSchedule[Indexps]['utc_final'];

                Debug('>> '+Source +', '+ Title +', '+ Start +', '+ End);

                Debug('ProgramsToSchedule.length: '+ProgramsToSchedule.length);
                
                storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
                USB = storageInfo.result || [];
                Debug(USB[0].mountPath+'/'+Title);
                Source = Source.replace('igmp','udp');
                Source = (Source).slice(0, 6) + "@" + (Source).slice(6);
                var NewTask = pvrManager.CreateTask(Source, USB[0].mountPath+"/"+ProgramId+'_'+Title.replace(/ /g, "_")+'_'+Fecha+".mp4", Start, End)
                if (NewTask<0){
                    //CurrentTime = Date.UTC(moment().format('Y'), moment().format('MM'), moment().format('DD'), moment().format('HH'), moment().format('mm'));
                    Debug('> Fail new schedule');
                    DeleteProgramInformir(ProgramId);
                } else {
                    var tasks = JSON.parse(pvrManager.GetAllTasks());
                    Debug(tasks[tasks.length-1].id);
                    
                    Debug('New schedule added, streamid = '+tasks[tasks.length-1].id);
                    Debug('> '+ProgramId + ', '+OperationsList.recording+', '+tasks[tasks.length-1].id);
                    UpdateProgramStreamIdInformir(ProgramId, OperationsList.recording, tasks[tasks.length-1].id);
                    UpdateProgramStatusInformir(ProgramId, OperationsList.recording, tasks[tasks.length-1].fileName);
                }
            }
        }
    });
    Debug('--------<< GetProgramsToSchedule');
}



/*******************************************************************************
 * Obtien lista de programas a eliminar
 *******************************************************************************/

 function GetSchedulesToDeleteInformir(){
    
    Debug('-------->> GetSchedulesToDelete');
    $.ajax({
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
                    DeleteProgramInformir(ProgramsToDelete[Indexps].id_programa);
                } if(AssetId > 0 && Active === 0){
                    ResultDelete = gSTB.RDir('RemoveFile '+ProgramsToDelete[Indexps].file);
                    UpdateDiskInfoInformir();
                    if(ResultDelete === "Ok"){
                        DeleteProgramInformir(ProgramsToDelete[Indexps].id_programa);
                    }
                } else {
                    ResultDelete = gSTB.RDir('RemoveFile '+ProgramsToDelete[Indexps].file);
                    UpdateDiskInfoInformir();
                    if(Active === 1){
                        UpdateProgramDeleteInformir(ProgramsToDelete[Indexps].id_programa, OperationsList.delete, AssetId);
                    } else {
                        DeleteProgramInformir(ProgramsToDelete[Indexps].id_programa);
                    }
                }
            }
        }
    });
    
    Debug('--------<< GetSchedulesToDelete');
}

/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function DeleteProgramInformir(ProgramId){
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'DeleteProgram',
            ProgramId : ProgramId
        },
        success: function (response){
            //Debug(response);
        }
    });
}
function DeleteProgramByFile(file){
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'DeleteProgramByFile',
            File : file
        },
        success: function (response){
            //Debug(response);
        }
    });
}
/*******************************************************************************
 * Actualiza el estatus de la grabacion mediante el Stream Id y el Asset Id
 *******************************************************************************/

 function UpdateProgramOpera(file, OperationId){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramOpera',
            File : file,
            OperationId : OperationId,
        },
        success: function (response){
            Debug('----------UpdateProgramOpera----------');
            Debug(response);
        }
    });
}
/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function UpdateProgramStatusInformir(ProgramId, OperationId, file){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStatusInformir',
            ProgramId : ProgramId,
            OperationId : OperationId,
            file : file,
        },
        success: function (response){
            Debug('----------UpdateProgramStatusInformir----------');
            Debug(response);
        }
    });
}

function UpdateProgramStreamIdInformir(ProgramId, OperationId, StreamId){
    Debug('--------->> UpdateProgramStreamid= '+ ProgramId + ', ' + OperationId + ', '+StreamId);
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStreamId',
            ProgramId : ProgramId,
            OperationId : OperationId,
            StreamId : StreamId
        },
        success: function (response){
            Debug('----------UpdateProgramStreamid----------');
            Debug(response);
        }
    });
}

function UpdateProgramDeleteInformir(ProgramId, OperationId, AssetId){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStatusDelete',
            ProgramId : ProgramId,
            OperationId : OperationId,
            AssetId : AssetId
        },
        success: function (response){
            Debug('----------UpdateProgramDelete----------');
            Debug(response);
        }
    });
}
/*******************************************************************************
 * Carga inicial con funciones para el DVR
 *******************************************************************************/

 if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
    
    HandlerPvrInformir();
    Debug("------>DESPUES");
    UpdateDiskInfoInformir();
    Debug("------>DESPUES UPDATE");
    GetProgramsSerie();
    Debug("------>DESPUES GET PROGRAM");

}

function HandlerPvrInformir(){
        
    GetProgramsToScheduleInformir();

    GetSchedulesToDeleteInformir();
    Debug('-------> HandlerPvrInformir <-------');
    
    setTimeout(HandlerPvrInformir,30000);
    
}
