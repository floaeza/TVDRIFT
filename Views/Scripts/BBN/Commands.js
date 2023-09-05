// @ts-nocheck

    function Red(){
        location.reload(true);
    }

    function Blue(){

    }

    function Green(){

    }

    function Yellow(){

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
        }
    }

    function Menu(){
        if(CurrentModule !== 'Menu' && Device['Services']['ActiveMenu'] === true){
            Debug('----------- GOPAGE');
            //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
            //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
            //SE MANDA LLAMAR DOS VECES A PROPOSITO, NO CAMBIAR
            GoPage('menu.php', Device['MenuId'], 'Menu');
            GoPage('menu.php', Device['MenuId'], 'Menu');
        }
    }
