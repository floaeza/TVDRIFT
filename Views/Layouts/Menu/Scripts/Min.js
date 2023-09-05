// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Enero 2020
 * @Tipo: Controla el menu
 */
    var MenuDate        = document.getElementById('MenuDate'),
        MenuHour        = document.getElementById('MenuHour'),
        MenuContainer   = document.getElementById('MenuContainer'),
        MenuSelected    = document.getElementById('MenuSelected'),
        MenuListNodes   = document.getElementById('MenuBar').childNodes;
        //BackgroundsNodes = '';
        ImagesUrl       = ServerSource+'Media/Menu/',
        FormatDate      = '',
        FormatHour      = '',
        MenuList        = '',
        MenuIndex       = 0;

    function SetMenuList(){
        //alert(Device['Services']['ProjectId']);
        //alert();
        $.ajax({
            type: 'POST',
            async: false,
            url: ServerSource + 'Core/Controllers/Menu.php',
            data: { 
                Option : 'GetModules',
                ProjectId: '1'
                //ProjectId: Device['Services']['ProjectId']
            },
            success: function (response){
                MenuList = null;
                MenuList = $.parseJSON(response);
                SetBackgrounds();
            }
        });
    }

    function SetBackgrounds(){

        var img = $('<img />', { id: 'menuBackImg', class: 'BackgroundsMenu'}).appendTo($('#MenuBackgrounds'));

        img = null;
        IndexM = null;
        //MenuBackgrounds = null;
        SetMenuInfo();
    }

    SetMenuList();
    GetWeather();


function SetMenuInfo(){
        var IndexM = MenuIndex - 2,
            Index = 1;

        for(Index = 0; Index < 10; Index++){
            Index++;

            if(MenuIndex === 0){
                if(IndexM < 0){
                    IndexM = MenuList.length - 2;
                }
            }

            if(MenuIndex === 1){
                if(IndexM < 0){
                    IndexM = MenuList.length - 1;
                }
            }

            if(IndexM >= MenuList.length){
                IndexM = 0;
            }

            //BackgroundsNodes[IndexM].style.visibility = 'hidden';



            MenuListNodes[Index].textContent = MenuList[IndexM].Name;
            //$("#menuBackImg").attr("src",Libraries['MenuPath'] + MenuList[IndexM].Image);
            IndexM++;
        }

        //BackgroundsNodes[MenuIndex].style.visibility = 'visible';
        //var MenuBackgrounds = document.getElementById('menuBackImg');
        //MenuBackgrounds.style.backgroundImage = 'url('+Libraries['MenuPath'] + MenuList[MenuIndex].Image+')';
        $("#menuBackImg").attr("src", Libraries['MenuPath'] + MenuList[MenuIndex].Image);
        //Debug(BackgroundsNodes[MenuIndex]);

            IndexM = null;
            Index = null;

        
    }

    function MenuSelect(Direction){

       (Direction === 'RIGHT') ? MenuIndex++: MenuIndex--;

        if(MenuIndex > MenuList.length - 1){
            MenuIndex = 0;
        } else if(MenuIndex < 0){
            MenuIndex = MenuList.length - 1;
        }
        
        SetMenuInfo();
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
        MenuSelect('RIGHT');
    }
    
    function MenuLeft(){
        MenuSelect('LEFT');
    }
    
    function MenuDown(){

    }
    
    function MenuUp(){
        
    }