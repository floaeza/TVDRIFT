// @ts-nocheck
var MenuDate            = document.getElementById('MenuDate'),
    MenuHour            = document.getElementById('MenuHour'),
    MenuList            = document.getElementById('MenuList'),
    MenuListChildren    = MenuList.children;

$(document).ready(function() {
    initial();
});

function initial(){
    GetWeather();
}

function MenuSelect(Direction){
    switch (Direction) {
        case 'RIGHT':
            var position = getFocusPosition(MenuListChildren);
            if (position+1 > MenuListChildren.length-1) {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[1].className = 'MenuNodes focus';
            } else {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[position+1].className = 'MenuNodes focus';
            }
            break;    
        case 'LEFT':
            var position = getFocusPosition(MenuListChildren);
            if (position-1 <= 0) {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[MenuListChildren.length-1].className = 'MenuNodes focus';
            } else {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[position-1].className = 'MenuNodes focus';
            }
            break;
        case 'UP':
            var position = getFocusPosition(MenuListChildren);
            if (position-1 <= 0) {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[MenuListChildren.length-1].className = 'MenuNodes focus';
            } else {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[position-1].className = 'MenuNodes focus';
            }
            break;
        case 'DOWN':
            var position = getFocusPosition(MenuListChildren);
            if (position+1 > MenuListChildren.length-1) {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[1].className = 'MenuNodes focus';
            } else {
                MenuListChildren[position].className = 'MenuNodes';
                MenuListChildren[position+1].className = 'MenuNodes focus';
            }
            break;
        case 'ENTER':
            var position = getFocusPosition(MenuListChildren),
                text     = MenuListChildren[position].innerHTML;
            if (text == 'LIVE TV') {
                GoPage('tv.php', '1', 'Tv');
            }else if(text == 'Mezcal Bar'){
                GoPage('content.php', '11', 'Mezcal');
            }else if (text == 'Movies') {
                GoPage('content.php', '3', 'Movies');
            }
            break;
    }

}

function MenuRight(){
    MenuSelect('RIGHT');
}

function MenuLeft(){
    MenuSelect('LEFT');
}

function MenuDown(){
    MenuSelect('DOWN');
}

function MenuUp(){
    MenuSelect('UP');
}
function MenuOk(){
    MenuSelect('ENTER');
}


//Utilidades
function getArrayinX(lenght) {
    var arreglo = []
    var x = 0;
    for (x = 0; x < lenght; x++) {
        arreglo.push(x)
    }
    return arreglo;
  }
function getFocusPosition(List){
    var position = -1;
    for (var x = 0; x < List.length; x++) {
        if (List[x].className == 'MenuNodes focus') {
            position = x;
        }
    }
    return position;
}