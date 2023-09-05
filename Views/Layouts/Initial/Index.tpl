<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
        <link rel="stylesheet" href="[@GeneralStyles]" type="text/css">
        <link rel='icon' href='./Media/General/icon.png'>
        <script src="[@Jquery]"></script>
        <script src="[@Hcap]"></script>
    </head>
    <body>
        <div class="GeneralBox BackgroundSolid">
            <div class="ContainerIndex" style="background-image: url('[@IndexLogo]') ">
                <br>
                <div id="CenterText"><h1>[@Step]</h1></div> 
                <h2 id="DebugText"></h2>
            </div>
        </div>
    </body>
</html>
<script>
    /* Carga inicial */
    window.addEventListener('load',SetData,false);
    
    /* Valida la informacion despues de las posibles cargas por cada tipo de dispositivo */
    setTimeout(GetInfoDevice,3000);

    /* Variables generales */
    var Option      = '[@Option]',
        MacAddress  = '00:00:00:00:00:00',
        
        IpAddress   = '0.0.0.0',
        Firmware    = 'Developer',
        Model       = 'Test',
        Hdd         = 'N',
        Vendor      = 'Generic',
        KamaiModels = { 49: '500x' };

/*******************************************************************************
 *  AMINO
 ******************************************************************************/
    function AminoDevice(){
        if(typeof(ASTB) !== 'undefined'){
            MacAddress  = ASTB.GetMacAddress();
            IpAddress   = ASTB.GetConfig('DHCPC.IPADDR');
            Firmware    = ASTB.GetSoftwareVersion();
            Model       = ASTB.GetConfig('SYSTEM.STB_MODEL');
            Hdd         = ASTB.GetConfig('SYSTEM.INTERNAL_HDD_PRESENT');
            Vendor      = 'Amino';
            
            ASTB.SetConfig('snake', 'SETTINGS.PLT_START_DELAY', '1');
            ASTB.SetConfig('snake', 'SETTINGS.PLT_SPOOLTIME', '1440');
            ASTB.CommitConfig();
        } else {
            KamaiDevice();
        }
    }
        
/*******************************************************************************
 *  LG
 ******************************************************************************/  
    function LgDevice(){ 
        //hcap.channel.stopCurrentChannel({ /* vacio*/ });
        
        /* Detenemos el canal actual */
        hcap.channel.stopCurrentChannel({
            'onSuccess' : function() {
                console.log('onSuccess');
            }, 
            'onFailure' : function(f) {
                console.log('onFailure : errorMessage = ' + f.errorMessage);
            }
        });
        
        /* Modelo */  
        var GetModel = {
            'key' : 'model_name',
            'onSuccess' : function(response_model) {
                Model = response_model.value;
            }
        };
        hcap.property.getProperty(GetModel);

        /* Firmware */
        var GetFirmware = {
            'key' : 'platform_version',
            'onSuccess' : function(response_version) {
                Firmware = response_version.value;
            }
        };
        
        hcap.property.getProperty(GetFirmware);

        /* Macaddress, Ip, Vendor, Hdd */
        var GetNetwork = {
            'index' : 1,
            'onSuccess' : function(response_device) {
                MacAddress  = response_device.mac;
                Hdd         = 'N';
                Vendor      = 'Lg';
            }
        };
        media = hcap.Media.createMedia({
            "url" : 'http://10.40.3.10/Multimedia/back.mp4', 
            "mimeType" : "video/mp4",  
        });
        hcap.Media.startUp({
            "onSuccess" : function() {
                Debug('Exito');
                media.play({
                    //"repeatCount" : 2,
                    "onSuccess" : function() {
                        Debug('REPRODUCIENDO CANAL');
                    }, 
                    "onFailure" : function(f) {
                        Debug('FALLO');
                    }
                });
            },
            "onFailure" : function(f) {
                Debug('FALLO');
            }
        });

        hcap.network.getNetworkDevice(GetNetwork);
        
        hcap.network.getNetworkInformation({
            'onSuccess' : function(s) {
                IpAddress = s.ip_address;
            }
        });
        
        var Year  = '', Month = '', Day   = '', Min   = '', Hour  = '', Sec   = '';
        
        $.ajax({
            type: 'POST',
            url: '[@Time]',
            async : false,
            success: function (response) {
                var Today = $.parseJSON(response);
                    Year  = Today.Year;
                    Month = Today.Month;
                    Day   = Today.Day;
                    Min   = Today.Hours;
                    Hour  = Today.Minutes;
                    Sec   = Today.Seconds;
                    
                var ActualDate = {
                    'year'   : parseInt(Year,10), 
                    'month'  : parseInt(Month,10),
                    'day'    : parseInt(Day,10),
                    'hour'   : parseInt(Min,10),
                    'minute' : parseInt(Hour,10),
                    'second' : parseInt(Sec,10),
                    'gmtOffsetInMinute' : -600,
                    'isDaylightSaving'  : false
                };

                hcap.time.setLocalTime(ActualDate);
            }
        });
    }

/*******************************************************************************
 *  Kamai
 ******************************************************************************/
    function KamaiDevice(){
        if(typeof(ENTONE) !== 'undefined'){
            MacAddress  = ENTONE.stb.getMacAddress();
            IpAddress   = ENTONE.stb.getIPAddress();
            Firmware    = ENTONE.stb.getSoftwareVersion();
            //KamaiModels con valor de ENTONE.stb.getHardwareModel() evita tener que hacer comparaciones y solamente 
            //se tiene que agregar en el JSON los siguientes modelos de Kamai que sean incorporados
            Model       = KamaiModels[ENTONE.stb.getHardwareModel()]; // En Integer (49 para Kamai 500x)
            Hdd         = 'N';
            Vendor      = 'Kamai';
        } else {
            InfomirDevice();
        }
    }
    
/*******************************************************************************
 *  Infomir
 ******************************************************************************/
    function InfomirDevice(){
        if(typeof(gSTB) !== 'undefined'){
            MacAddress  = gSTB.GetDeviceMacAddress();
            Firmware    = gSTB.GetDeviceImageDesc();
            Model       = gSTB.GetDeviceModel();
            Hdd         = 'N';
            Vendor      = gSTB.GetDeviceVendor();
            IpAddress   = gSTB.RDir('IPAddress');
        } else {
            LgDevice();
        }
    }


/*******************************************************************************
 *  Obtiene los datos de los dispositivos por marca en el siguiente orden:
 *  1 - Amino 
 *  2 - Kamai
 *  3 - Infomir
 *  4 - Lg
 ******************************************************************************/
    function SetData() {
        AminoDevice();
    }
    
/*******************************************************************************
 * Obtiene informacion del dispositivo
 ******************************************************************************/
    function GetInfoDevice(){
        $.ajax({
            type: 'POST',
            url: '[@Index]',
            data: { 
                Option      : Option,
                MacAddress  : MacAddress,
                IpAddress   : IpAddress,
                Firmware    : Firmware,
                Model       : Model,
                Hdd         : Hdd,
                Vendor      : Vendor
            },
            success: function (response) {
                
                var Data = $.parseJSON(response);

                if(Data['Option'] === 'RELOAD'){
                    var DeviceInfo = ' Mac: '+MacAddress+' Ip: '+IpAddress+' Firmware: '+Firmware+' Model: '+Model+' Vendor : '+Vendor;
                    document.getElementById('DebugText').innerHTML = DeviceInfo;
                    
                    window.location.href = Data['ModuleUrl']+'?MacAddress='+MacAddress+'&ModuleId='+Data['ModuleId']+'&CurrentModule='+Data['ModuleName'];
                } else if(Data['Option'] === 'LICENSE'){
                    //
                } else {
                    window.location.href = 'index.php?Option='+Data['Option'];
                }
            }
        });
    }
</script>