// @ts-nocheck

function Red(){
     location.reload(true);
}

function Blue(){
    if (window.tizen !== undefined){
        var onSuccess = function() {
            Debug("[rebootDevice] succeeded!");
        };
        var onError = function(error) {
            Debug("[rebootDevice] failed! error code: " + error.code + " error name: " + error.name + "  message " + error.message);
        };
        b2bcontrol.rebootDevice(onSuccess, onError);
    }else if(typeof(ASTB) !== 'undefined'){
        ASTB.Reboot();
    }

    
}
function Green(){
    //alert(JSON.stringify(Browser.GetWindowNames()));
}

function Yellow(){
    // @ts-nocheck
    //var f = gSTB.GetEnv('{ "varList":["timezone_conf"] }');
    //Debug(f);
    //var g = gSTB.SetEnv('{ "timezone_conf":"America/Mexico_City" }');
    //Debug(g);

    //player.speed = 4;
    //Debug(player.speeds);
}

function Close(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
    } else if(CurrentModule === 'Movies'){
        VodClose();
    } else if(CurrentModule === 'Moods'){
        MoodsClose();
    }
}

function Back(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
    } else if(CurrentModule === 'Movies'){
        VodClose();
    } else if(CurrentModule === 'Moods'){
        MoodsClose();
    }else{
        GoPage('menu.php', Device['MenuId'], 'Menu');
    }
}

function Menu(){
    Debug('--------------------------MENU() CurrentModule:: ' +CurrentModule + ' DEVICE[SERVICES][ACTIVEMENU] '+ Device['Services']['ActiveMenu']);
    if(CurrentModule !== 'Menu' && Device['Services']['ActiveMenu'] === true){
        //alert("Menu");
        Debug('----------- GOPAGE');
        //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
        //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
        //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
        //if(CurrentModule == 'Tv'){
           //document.getElementById('loadingTV').style.display = "block"; 
        //}
        
        GoPage('menu.php', Device['MenuId'], 'Menu');
        GoPage('menu.php', Device['MenuId'], 'Menu');
    } else if(CurrentModule === 'Tv' && Device['Services']['ActiveMenu'] === false){
        Debug('----------- TV RECORDER');
        TvRecorder();
    }
}
