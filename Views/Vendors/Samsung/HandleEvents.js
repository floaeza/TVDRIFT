
var listener = {
    onbufferingstart: function() {
        Debug('Buffering start.');
        EventString = 'BUFFERING_START';
        clearTimeout(Checker);
    },
    onbufferingcomplete: function() {
        Debug('............................ Buffering complete. > start: ' +Executing);
        if(Executing === false){
            UpdateQuickInfoDevice();
            EventString = 'STATUS_PLAYING';
        }
    },
    onstreamcompleted: function() {
        Debug('Stream Completed > end');
        EventString = 'CONNECTION_STOPPED';


        if(CurrentModule === 'Tv'){
            SetDigitalChannel();
        }
        if(typeof(LoopVideo) !== 'undefined'){
            if(LoopVideo === true){
                LoopMedia();
            }
        }
        if(Executing === false){
            UpdateQuickInfoDevice();
        }
    },
    onerror: function(eventType) {
        Debug('event type error : ' + eventType);
        EventString = 'STATUS_ERROR_STREAM';
    },
    onevent: function(eventType, eventData) {
        EventString = eventType;
        Debug('event type: ' + eventType + ', data: ' + eventData);
    }
};

