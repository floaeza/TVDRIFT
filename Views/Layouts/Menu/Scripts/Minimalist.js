// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Enero 2020
 * @Tipo: Controla el menu
 */


window.history.forward(1);
var MenuListNodes   = document.getElementsByClassName('MenuList');
//MenuSelected    = document.getElementById('MenuSelected'),
//BackgroundsNodes = '';
ImagesUrl       = ServerSource+'Media/Menu/',
FormatDate      = '',
FormatHour      = '',
MenuList        = '',

MenuIndex       = 0,
IndexM = null,
xhr = null;

function SetMenuList(){
    MenuList = null;
    xhr = $.ajax({
        type: 'POST',
        cache: false,
        async: false,
        url: ServerSource + 'Core/Controllers/Menu.php',
        data: { 
            Option : 'GetModules',
            ProjectId: '1'
            //ProjectId: Device['Services']['ProjectId']
        },
        success: function (response){
            
            MenuList = $.parseJSON(response);
            
            
        }
    });
    xhr = null;
    // if(typeof(ASTB) !== 'undefined'){
    //     setFrames();  
    // }
   
    SetMenuInfo();
}

function setFrames(){
    //alert(parent.document.getElementsByTagName('<iframe>')[0]);
    for(var i = 0; i < MenuList.length; i++){
        //parent.document.getElementById(MenuList[i].Name).src='tv.php'+'?MacAddress='+'00:00:00:00:00:00'+'&ModuleId='+1+'&CurrentModule=Tv';
        if(typeof(ASTB) !== 'undefined')
            parent.document.getElementById(MenuList[i].Name).src=MenuList[i].Url+'?MacAddress='+ASTB.GetMacAddress()+'&ModuleId='+MenuList[i].Id+'&CurrentModule='+MenuList[i].Name;
        else
            parent.document.getElementById(MenuList[i].Name).src=MenuList[i].Url+'?MacAddress='+'00:00:00:00:00:00'+'&ModuleId='+MenuList[i].Id+'&CurrentModule='+MenuList[i].Name;
    }
    
}
GetWeather();
SetMenuList();
//SetMenuInfo()

function SetMenuInfo(){

    ((MenuIndex - 1) >= 0)?MenuListNodes[0].textContent = MenuList[MenuIndex-1].Name : MenuListNodes[0].textContent = MenuList[MenuList.length -1].Name;
    MenuListNodes[1].textContent = MenuList[MenuIndex].Name;
    ((MenuIndex + 1) <= (MenuList.length-1))?MenuListNodes[2].textContent = MenuList[MenuIndex+1].Name : MenuListNodes[2].textContent = MenuList[0].Name;
}
/*******************************************************************************
* MOVIMIENTOS FLECHAS EPG
*******************************************************************************/

function MenuOk(){
    
    if(MenuList[MenuIndex].Url !== 'menu.php'){
        //Page, ModuleId, ChangeModule
        GoPage(MenuList[MenuIndex].Url, MenuList[MenuIndex].Id, MenuList[MenuIndex].Name);
    }
    
}

function MenuRight(){
    //MenuSelect('RIGHT');
    MenuIndex++;
    if(MenuIndex > MenuList.length - 1){
        MenuIndex = 0;
    }
    SetMenuInfo();
}

function MenuLeft(){
    //MenuSelect('LEFT');
    MenuIndex--;
    if(MenuIndex < 0){
        MenuIndex = MenuList.length - 1;
    }
    SetMenuInfo();
}

function MenuDown(){

}

function MenuUp(){

}