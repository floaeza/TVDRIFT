// @ts-nocheck
/******************************************************************************
 * @Objetivo: Obtiene la configuracion del dispositivo y define la forma de debuguear
 * @CreadoPor: Tania Maldonado
 * @Fecha: Noviembre 2019
 *******************************************************************************/
var Offset = 0,
    xhr;

if (window.tizen !== undefined) {
    var now = new tizen.TZDate(),
        TvHour = now.getHours();

    console.log('------------------------- NOW:::: '+now);

    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: 'http://'+ServerIp+'/BBINCO/TV/Core/Models/Time.php',
        //async : false,
        success: function (response) {
            var Today = $.parseJSON(response),
                ServerHour   = Today.Hours;

            console.log('****************************************** > '+TvHour);
            console.log('****************************************** > '+ServerHour);

            Offset = parseInt(TvHour) - parseInt(ServerHour);

            console.log(':::::::::::::::::::::::::::::OFFSET:: '+Offset);

            Today = null;
            ServerHour = null;
        }
    });
    xhr = null;

    now = null;
    TvHour = null;
}

    var Line        = 0,
        Executing   = false,
        EventString = '',
        EventHdmi   = 0,
        EventNetman = '',
        CurrentStbDate = '';

    var StorageInfo,
        InfomirUSB  = 0,
        USB;

    var DivDebug  = document.getElementById('DebugText'),
        DebugText = '';

    function DebugOnScreen(DebugTxt){
        DebugText = document.createElement('P');


        ++Line;

        if(Line > 35){
            ClearDebugOnScreen();
            Line = 0;
        }

        DebugText.innerHTML = DebugTxt;
        DivDebug.appendChild(DebugText);
    }
    
    function ClearDebugOnScreen(){
        DivDebug.innerHTML = '';
    }

    var MacAddress  = '00:00:00:00:00:00',
        Device      = '',
        Libraries   = '',
        Debug       = console.log;

         if(typeof(ServerSource) === 'undefined'){
             var ServerSource = '';
        }

    SetData();

    function AminoDevice(){
        if(typeof(ASTB) !== 'undefined'){
            MacAddress = ASTB.GetMacAddress();
            Debug      = ASTB.DebugString;

            Debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~ A M I N O   D E V I C E !!!!')
        } else {
            KamaiDevice();
        }
    }
        
    function LgDevice(){
        if(typeof(hcap) !== 'undefined') {
            var GetNetwork = {
                'index': 1,
                'onSuccess': function (response_device) {
                    MacAddress = response_device.mac;
                    Debug = DebugOnScreen;
                }
            };
            hcap.network.getNetworkDevice(GetNetwork);
        } else {
            //
        }
    }

    function SamsungDevice(){
        if (window.tizen !== undefined) {
            var b2bcontrol = window.b2bapis.b2bcontrol;
            try {
                MacAddress = b2bcontrol.getMACAddress();
                Debug      = DebugOnScreen;
            } catch (e) {
                //'[getMACAddress] call syncFunction exception [' + e.code + '] name: ' + e.name + ' message: ' + e.message);
            }
        } else {
            LgDevice();
        }
    }

    function KamaiDevice(){
        if(typeof(ENTONE) !== 'undefined'){
            MacAddress = ENTONE.stb.getMacAddress();
            Debug      = DebugOnScreen;
        } else {
            InfomirDevice();
        }
    }
    
    function InfomirDevice(){
        if(typeof(gSTB) !== 'undefined'){
            MacAddress = gSTB.GetDeviceMacAddress();
            Debug      = DebugOnScreen;
        } else {
            SamsungDevice();
        }
    }

// Obtiene los datos de los dispositivos por marca en el siguiente orden:
// 1 - Amino 
// 2 - Kamai
// 3 - Infomir
// 4 - Samsung
// 5 - Lg

    function SetData() {
        AminoDevice();

        // console.log(CurrentStbDate);


        //CurrentStbDate = moment().subtract('hours', Offset).format('Y-MM-DD h:mm:ss');
        CurrentStbDate = 'UPDATED';

        //Debug('CurrentStbDate = '+CurrentStbDate);
    }

    //Debug(ServerSource + 'Core/Controllers/Device.php');

    // Device
    xhr = $.ajax({
        cache: false,
        type: 'POST',
        async: false,
        url: ServerSource + 'Core/Controllers/Device.php',
        data: {
            MacAddress : MacAddress,
            EventString : 'BOOT_SUCCESSFUL',
            CurrentDateStb : CurrentStbDate
        },
        success: function (response){
            //Debug(CurrentStbDate);
            
            Device = $.parseJSON(response);
            //alert(Device['Type']);
            //Debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DEVICE:'+JSON.stringify(Device));

              if(Device['Debug'] === '1'){
                  DivDebug.style.display = 'inline';
                  Debug = DebugOnScreen;
              }
        }
    });
    xhr = null;
    //Libraries
    xhr = $.ajax({
        type: 'POST',
        async: false,
        cache: false,
        url: ServerSource + 'Core/Models/Libraries.php',
        data: {
            GetJson : true
        },
        success: function (response){
            Libraries = $.parseJSON(response);
        }
    });
    xhr = null;
    
    function UpdateInfoDevice(){
        //Debug('----------------> UpdateInfoDevice');

        //Debug('----------------> MacAddress '+MacAddress);
        //Debug('----------------> EventString '+EventString);
        //Debug('----------------> EventHdmi '+EventHdmi);
        //Debug('----------------> Date '+CurrentStbDate);
        xhr = $.ajax({
            cache: false,
            type: 'POST',
            url: ServerSource + 'Core/Controllers/Device.php',
            data: {
                MacAddress: MacAddress,
                EventString: EventString,
                EventHdmi: EventHdmi,
                //EventNetman: EventNetman,
                CurrentDate: CurrentStbDate,
                Grabador: InfomirUSB
            },
            beforeSend: function (){
                Executing = true;
            },
            success: function (response) {
                Device = $.parseJSON(response);

                //Debug('----------------> Device'+Device);

                if (Device['Services']['Reboot'] === true) {
                    RebootDevice();
                } else {
                    //Debug('----------------> CurrentModule '+CurrentModule);
                    // Busca actualizacion si lleva mas de un dia funcionando el amino
                    if (CurrentModule === 'Tv') {
                        if (Device['EpgModificationTime'] !== '03' && LastUpdatedTime !== Device['EpgModificationTime']) {
                            // Actualiza si la hora del archivo es diferente de la hora programada de actualizacion
                            // Y si no se ha actualizado a la hora
                            if (ActiveEpgContainer !== true && ActiveInfoContainer !== true) {
                                // Solo actualiza si no esta activa la guia o la info
                                LastUpdatedTime = Device['EpgModificationTime'];

                                BackUpChannelsJson = ChannelsJson;

                                SetEpgFile();

                                CheckUpdatedJson();
                            }
                        }
                    } else if (CurrentModule === 'Menu' || CurrentModule === 'Movies') {
                        // do nothing
                    } else {
                        UpdateMultimedia();
                    }
                }
            },
            complete: function (data){
                Executing = false;
            }
        });

        xhr = null;

        //Debug('----------------< UpdateInfoDevice');
    }

function UpdateQuickInfoDevice(){
    //Debug('_______________________________________________________________________________________ UpdateQuickInfoDevice 1');
    var OnScreen = '';
    if (CurrentModule === 'Tv') {
        OnScreen = ChannelsJson[ChannelPosition].CHNL + ' - ' +ChannelsJson[ChannelPosition].NAME;
    } else {
        OnScreen =  CurrentModule;
    }

    //Debug('----------------------------# CurrentModule:: '+CurrentModule);
    //Debug('----------------------------# OnScreen:: '+OnScreen);

    //Debug('----------------------------# Device.DeviceId:: '+Device.DeviceId);
    //Debug('----------------------------# EventString:: '+EventString);
    //Debug('----------------------------# EventHdmi:: '+EventHdmi);
    //Debug('----------------------------# CurrentStbDate:: '+CurrentStbDate);
    //Debug('----------------------------# LastChannel:: '+OnScreen);
    //Debug('----------------------------# Channelpos:: '+ChannelPosition);

    xhr = $.ajax({
        cache: false,
        type: 'POST',
        url: ServerSource + 'Core/Controllers/DeviceInfo.php',
        data: {
            MacAddress: MacAddress,
            DeviceId: Device.DeviceId,
            EventString: EventString,
            EventHdmi: EventHdmi,
            //EventNetman: EventNetman,
            LastChannel: OnScreen,
            Channelpos: ChannelPosition,
            CurrentDateStb: CurrentStbDate
        },
        beforeSend: function (){
            Executing = true;
            //Debug('BD > Executing:: '+Executing);
        },
        success: function (response) {
            var RebootResponse = $.parseJSON(response);

            //Debug('RebootResponse:: '+RebootResponse);

            if(RebootResponse === '1'){
                RebootDevice();
            }

            RebootResponse = null;
        },
        complete: function (data){
            Executing = false;
            //Debug('CT > Executing:: '+Executing);
        }
    });
    xhr = null;
    //Debug('_______________________________________________________________________________________ UpdateQuickInfoDevice 2');
}