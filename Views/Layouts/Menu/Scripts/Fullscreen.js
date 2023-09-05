// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Enero 2020
 * @Tipo: Controla el menu
 */
    var MenuDate        = document.getElementById('MenuDate'),
        MenuHour        = document.getElementById('MenuHour'),
        MenuBackground  = document.getElementById('MenuBackgrounds'),
        MenuGrid        = document.getElementById('MenuGrid'),
        ImagesUrl       = ServerSource+'Media/Menu/',
        FormatDate      = '',
        FormatHour      = '',
        MenuList        = '',
        MenuIndex       = 0;
        MenuBackground  = document.getElementById('MenuBackgrounds'),
        MenuGrid        = document.getElementById('MenuGrid'),
        ImagesUrl       = ServerSource+'Media/Menu/',
        FormatDate      = '',
        FormatHour      = '',
        MenuList        = '',
        MenuIndex       = 0;

    function SetMenuList(){
        $.ajax({
            type: 'POST',
            async: false,
            url: ServerSource + 'Core/Controllers/Menu.php',
            data: { 
                Option : 'GetModules',
                ProjectId: '1'
            },
            success: function (response){
                MenuList = $.parseJSON(response);
                SetBackgrounds();
            }
        });
    }

    SetMenuList();

    function SetBackgrounds(){
        MenuBackground.src = Libraries['MenuPath'] + MenuList[MenuIndex].Image;

        var img = '';

        for(MenuIndex = 0; MenuIndex < MenuList.length; MenuIndex++){

                img = document.createElement('img');

                img.src = Libraries['MenuPath'] + MenuList[MenuIndex].Name.replace(/\s/g, '') + '.png';

            MenuGrid.appendChild(img);
        }

        img = null;

    }


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

            MenuListNodes[Index].textContent = MenuList[IndexM].Name;
            IndexM++;
        }



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