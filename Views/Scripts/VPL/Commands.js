// @ts-nocheck

function Red(){
     location.reload(true);
}

function Blue(){
    var onSuccess = function() {
        Debug("[rebootDevice] succeeded!");
    };
    var onError = function(error) {
        Debug("[rebootDevice] failed! error code: " + error.code + " error name: " + error.name + "  message " + error.message);
    };
    b2bcontrol.rebootDevice(onSuccess, onError);


}
function Green(){
    alert(JSON.stringify(Browser.GetWindowNames()));
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
        GoPage('menu.php', Device['MenuId'], 'Menu');
    } else if(CurrentModule === 'Tv' && Device['Services']['ActiveMenu'] === false){
        Debug('----------- TV RECORDER');
        TvRecorder();
    }
}
