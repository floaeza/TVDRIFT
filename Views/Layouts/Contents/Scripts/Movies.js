/* @Creado por: Tania Maldonado
 * @Fecha: Julio 2020
 * @Tipo: Funciones para controlar el layout de peliculas
 */
    //Variables Panel peliculas recomendadas
    var RecommendedMoviesList             = document.getElementById('RecommendedMoviesList'),
        // @ts-ignore
        RecommendedMoviesListNodes        = RecommendedMoviesList.childNodes,
        // @ts-ignore
        RecommendedMoviesListChildren     = RecommendedMoviesList.children;
    //Variables Panel peliculas recomendadas
    var AllMoviesList                     = document.getElementById('AllMoviesList'),
        // @ts-ignore
        AllMoviesListNodes                = AllMoviesList.childNodes,
        // @ts-ignore
        AllMoviesListChildren             = AllMoviesList.children,
        PanelRight                        = document.getElementById('PanelRight');
        //Variables Panel pelicula seleccionada
    var MoviePanel                        = document.getElementById('MoviePanel'),
        // @ts-ignore
        MoviePanelNodes                   = MoviePanel.childNodes,
        // @ts-ignore
        MoviePanelChildren                = MoviePanel.children;
    //Variables estilos
    var StyleFocusMovies                  = '3px solid rgb(233, 187, 38)',
        StyleFocusPanelMovie              = 'rgb(233, 187, 38)',
        StyleFocusPlayingMovie            = '3px solid rgb(255, 255, 255)',
        StyleFocusMenuHeader              = 'rgb(233, 187, 38)',
        StyleFocusMenuFilter              = 'rgb(233, 187, 38)',
        StyleFocusMenuYearFilter          = 'rgb(233, 187, 38)',
        StyleFocusMenuLanguage            = '3px solid rgb(233, 187, 38)';
    //Variebles de utilidad
    var y                                 = 0,
        CurrentMovieID                    = -1,
        IsOnPlay                          = true,
        IsMenuFilterSelected              =false;
    //Variables Panel Reproduciendo Peliculas
    var OnBackward                        = document.getElementById('OnBackward'),
        OnPlay                            = document.getElementById('OnPlay'),
        OnPause                           = document.getElementById('OnPause'),
        Onforward                         = document.getElementById('Onforward');
    //Variables Menu Principal
    var MenuHeader                        = document.getElementById('MenuOptions'),
        // @ts-ignore
        MenuHeaderNodes                   = MenuHeader.childNodes,
        // @ts-ignore
        MenuHeaderChildren                = MenuHeader.children;
        //Variebles Lista de filtros
    var FilterMovieCategoryList           = document.getElementById('filterMovieCategory'),
        PanelMenuFilters                  = document.getElementById('MenuFilters'),
        // @ts-ignore
        FilterMovieCategoryListNodes      = FilterMovieCategoryList.childNodes,
        // @ts-ignore
        FilterMovieCategoryListChildren   = FilterMovieCategoryList.children;
        //Variebles Panel filtro por año
    var PanelYearFilter                   = document.getElementById('PanelYearFilter'),
        YearFilter                        = document.getElementById('yearfilter'),
        // @ts-ignore
        YearFilterNodes                   = YearFilter.childNodes,
        // @ts-ignore
        YearFilterChildren                = YearFilter.children,
        MoviesByYearList                  = document.getElementById('MoviesByYearList'),
        // @ts-ignore
        MoviesByYearListNodes             = MoviesByYearList.childNodes,
        // @ts-ignore
        MoviesByYearListChildren          = MoviesByYearList.children;  
    //Variebles Panel filtro por genero
    var PanelGenderFilter                 = document.getElementById('PanelGenderFilter'),
        GenderFilter                      = document.getElementById('GenderFilter'),
        // @ts-ignore
        GenderFIlterNodes                 = GenderFilter.childNodes,
        // @ts-ignore
        GenderFilterChildren              = GenderFilter.children,
        PanelMoviesGenderFilter           = document.getElementById('MoviesByGenderList'),
        // @ts-ignore
        PanelMoviesGenderFilterNodes      = PanelMoviesGenderFilter.childNodes,
        // @ts-ignore
        PanelMoviesGenderFilterChildren   = PanelMoviesGenderFilter.children;
    //Variables menu para seleccionar idioma
    var MenuLanguagePanel                 = document.getElementById('MenuLanguagePanel'),
        // @ts-ignore
        MenuLanguageNodes                 = MenuLanguagePanel.childNodes,
        // @ts-ignore
        MenuLanguageChildren              = MenuLanguagePanel.children;
/*******************************************************************************
 * Variables generales
 *******************************************************************************/


// var FilterContainer         = document.getElementById('Filter'),
//     ListFilters             = document.getElementById('ListFilters'),
//     ListFiltersNodes        = ListFilters.childNodes;


var FiltersOptions          = ['By gender', 'By year'],
    FiltersByYear           = [],
    FiltersByGender         = [];


// @ts-ignore
var MenuOptionsNodes        = document.getElementById('MenuOptions').childNodes;
    //MenuNodesArray          = [1,3,5,7],
    // @ts-ignore
    MenuNodesArray          = [1],
    // @ts-ignore
    MenuFocus               = -1;


var CurrentFocus            = '';


var MoviesList              = [];


// @ts-ignore
var PanelRightNodes         = document.getElementById('PanelRight').childNodes,
    PanelRightNodesArray    = [1,3,5],
    MoviesRowLength         = 3,
    MoviesBoxLength         = 5,
    IndexMovies             = 0,
    MovieRowFocus           = -1,
    MovieFocus              = 0,
    MovieBox                = '';

var FolderSource            = '../../vod/mvs/';

var BackgroundPanel         = document.getElementById('BackgroundPanel');


var ListPanel               = document.getElementById('ListPanel'),
    MoviePanel              = document.getElementById('MoviePanel'),
    // @ts-ignore
    MoviePanelNodes         = MoviePanel.childNodes;

var MoviePanelPlay          = document.getElementById('PlayPanel'),
    MoviePanelExit          = document.getElementById('ExitPanel'),
    MoviePanelFocus         = 'Play';
    

var PlayingPanel            = document.getElementById('PlayingPanel'),
    PlayingOptions          = document.getElementById('PlayingOptions'),
    // @ts-ignore
    PlayingOptionsChildren  = PlayingOptions.children,
    // @ts-ignore
    PlayingOptionsNodes     = PlayingOptions.childNodes,
    PlayingNodesArray       = [1,3,5,7],
    PlayingFocus            = -1,
    PlayingPanelTimer       = '',
    PlayinPanelActive       = false;

var SpeedText               = '',
    OptionText              = 'play';

var BarPosition             = document.getElementById('PlayingPosition'),
    InfoPosition            = document.getElementById('InfoPosition'),
    PlayingSpeed            = document.getElementById('PlayingSpeed'),
    // ExitPlaying             = document.getElementById('ExitPlaying'),
    PlayingTitle            = document.getElementById('PlayingTitle');

var BarTimer                = '',
    BarUpdate               = '',
    DurationAsset           = 0,
    PositionAsset           = 0,
    PercentagePosition      = 0;

/*******************************************************************************
* Carga inicial
*******************************************************************************/

function Init(){
GetFiltersList();

SetFocusHeader('set');

CurrentFocus = 'Menu';

GetMoviesList();

SetMoviesList();

}

setTimeout(Init,300);

function GetFiltersList(){
// @ts-ignore
$.ajax({
    type: 'POST',
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
        Option : 'GetYearsList'
    },
    success: function (response){
        // @ts-ignore
        FiltersByYear = $.parseJSON(response);
    }
}); 

// @ts-ignore
$.ajax({
    type: 'POST',
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
        Option : 'GetGendersList'
    },
    success: function (response){
        // @ts-ignore
        FiltersByGender = $.parseJSON(response);
    }
}); 
}

/*******************************************************************************
* Navegacion header
*******************************************************************************/
function SetFocusHeader(Direction){
    if (Direction == 'set') {
        // @ts-ignore
        MenuHeaderChildren[0].style.backgroundColor = StyleFocusMenuHeader;
    } else if (Direction == 'down') {
        MenuHeader = document.getElementById('MenuOptions');
        // @ts-ignore
        MenuHeaderChildren = MenuHeader.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuHeader, MenuHeaderChildren);
        if (positionFocus+1 >= MenuHeaderChildren.length) {
            // @ts-ignore
            MenuHeaderChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            MenuHeaderChildren[0].style.backgroundColor = StyleFocusMenuHeader;
        }else{
            // @ts-ignore
            MenuHeaderChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            MenuHeaderChildren[positionFocus+1].style.backgroundColor = StyleFocusMenuHeader;
        }
    } else if (Direction == 'up') {
        MenuHeader = document.getElementById('MenuOptions');
        // @ts-ignore
        MenuHeaderChildren = MenuHeader.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuHeader, MenuHeaderChildren);
        if (positionFocus == 0) {
            // @ts-ignore
            MenuHeaderChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            MenuHeaderChildren[(MenuHeaderChildren.length)-1].style.backgroundColor = StyleFocusMenuHeader;
        }else{
            // @ts-ignore
            MenuHeaderChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            MenuHeaderChildren[positionFocus-1].style.backgroundColor = StyleFocusMenuHeader;
        }  
    }
// if(MenuFocus >= 0){
//     MenuOptionsNodes[MenuNodesArray[MenuFocus]].classList.remove('OptionFocus');
// }

// //(Direction === 'right') ? MenuFocus++: MenuFocus--;

// if(Direction === 'down' ){
//     MenuFocus++;
    
//     if(MenuFocus === 2) {
//         MenuFocus++;
//     }
// } else {
//     MenuFocus--;
    
//     if(MenuFocus === 2) {
//         MenuFocus--;
//     }
// }

// if(MenuFocus >= MenuNodesArray.length){
//     MenuFocus = (MenuNodesArray.length -1 );
// } else if(MenuFocus < 0){
//     MenuFocus = 0;
// }

// MenuOptionsNodes[MenuNodesArray[MenuFocus]].classList.add('OptionFocus');
}

function ClearFocusHeader(){
var IndexC = 0;

// @ts-ignore
for(IndexC = 0; IndexC < MenuNodesArray.length; IndexC++){
    // @ts-ignore
    MenuOptionsNodes[MenuNodesArray[IndexC]].classList.remove('OptionFocus');
}
}

function SelectMenuOption(){
    var position = getPositionFocusInMenu(StyleFocusMenuHeader, MenuHeaderChildren);
    switch (position) {
        case 0:
            //Home
            break;
        case 1:
            //Filtros
            FiltersList();
            break;
        case 2:
            //Salir al menu principal
            // @ts-ignore
            GoPage('menu.php', Device['MenuId'], 'Menu');
            break;
    }

// switch (MenuNodesArray[MenuFocus]) {
//     case 1:
//         // Lista de todas las peliculas
//         GoPage('menu.php', Device['MenuId'], 'Menu');
//     break;
    
//     case 3:
//         // Selecciona los filtros
//     break;
    
//     case 5:
//         // Search (aun no esta activo)
//     break;
    
//     case 7:
//         // Regresa a la television
        
//     break;
// }
}
/*******************************************************************************
* Lista peliculas, sin filtros
*******************************************************************************/

function GetMoviesList(){
// @ts-ignore
$.ajax({
    type: 'POST',
    async: false,
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
        Option : 'GetMoviesList'
    },
    success: function (response){
        // @ts-ignore
        MoviesList = $.parseJSON(response);
    }
}); 
}

function SetMoviesList(){
    // @ts-ignore
    StopVideo();
    refreshMoviesPrincipalList(MoviesList, 'RecommendedMoviesList');
    refreshMoviesPrincipalList(MoviesList, 'AllMoviesList');
    // @ts-ignore
    BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/BGMovies.PNG')";
    // @ts-ignore
    PlayingVod = false;
// var IndexR = 0,
//     IndexM = 0,
//     IndexB = 0;

// var BoxPoster = '',
//     BoxTitle  = '',
//     BoxDiv    = '';

// StopVideo(); 

// for(IndexR= 0; IndexR < MoviesRowLength; IndexR++){
    
//     for(IndexM= 0; IndexM < MoviesBoxLength; IndexM++){
            
//         if(IndexB > (MoviesList.length-1)){
//             IndexM = MoviesBoxLength;
//             IndexR = MoviesRowLength;
//         } else {
//             BoxDiv    = document.createElement('div');
//             BoxPoster = document.createElement('img');
//             BoxTitle  = document.createElement('h3');
            
//             BoxDiv.setAttribute('class', 'RowPoster');
//             BoxDiv.setAttribute('id', IndexB);
            
//             BoxPoster.src = FolderSource + MoviesList[IndexB].FLDR + MoviesList[IndexB].PSTR;
//             BoxTitle.textContent = MoviesList[IndexB].TTLE;
            
//             BoxDiv.appendChild(BoxPoster);
//             BoxDiv.appendChild(BoxTitle);
            
            
//             PanelRightNodes[PanelRightNodesArray[IndexR]].appendChild(BoxDiv);
            
//             IndexB++;
            
//         }
//     }
// }

// BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/2542.jpg')";


// PlayingVod = false;
}
function SetFocusMovie(Direction){

if(MovieRowFocus !== -1 && MovieFocus !== -1){
    // @ts-ignore
    PanelRightNodes[PanelRightNodesArray[MovieRowFocus]].childNodes[MovieFocus].style.border = '3px solid transparent';
}

if(Direction === 'up'){
    if(MovieRowFocus > 0){
        MovieRowFocus--;
    }
} else if(Direction === 'down'){
    MovieRowFocus++;
} else if(Direction === 'left'){
    
    if(MovieFocus > 0){
        MovieFocus--;
    }
} else if(Direction === 'right'){
    if(MovieFocus < (MoviesBoxLength -1)){
        MovieFocus++;
    }
} else if(Direction === 'set'){
    if(MovieRowFocus === -1){
        MovieRowFocus++;
    }
    MovieFocus = 0;
}

// @ts-ignore
MovieBox = PanelRightNodes[PanelRightNodesArray[MovieRowFocus]].childNodes[MovieFocus];

if(typeof(MovieBox) === 'undefined'){
    if(Direction === 'up'){
        MovieRowFocus++;
    } else if(Direction === 'down'){
        MovieRowFocus--;
    } else if(Direction === 'left'){

        if(MovieFocus > 0){
            MovieFocus++;
        }
    } else if(Direction === 'right'){

        if(MovieFocus < (MoviesBoxLength -1)){
            MovieFocus--;
        }
    }
    
    // @ts-ignore
    MovieBox = PanelRightNodes[PanelRightNodesArray[MovieRowFocus]].childNodes[MovieFocus];
} 

// @ts-ignore
MovieBox.style.border = '3px solid #fff'; //.classList.add('OptionFocus');
}
/*******************************************************************************
* 
*******************************************************************************/
function LoadMoviePanel(moviesContainer, movieOnPlay){
// CurrentFocus = 'MoviePanel';

// ListPanel.style.visibility = 'hidden';
// MoviePanel.style.visibility = 'visible';

// //MoviePanelNodes[1].src = FolderSource + MoviesList[MovieBox.id].FLDR + 'HD'+MoviesList[MovieBox.id].PSTR;
// MoviePanelNodes[1].src = FolderSource + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].PSTR;
// MoviePanelNodes[3].textContent  = MoviesList[MovieBox.id].TTLE;
// MoviePanelNodes[5].textContent  = MoviesList[MovieBox.id].SCOR;
// MoviePanelNodes[9].textContent  = MoviesList[MovieBox.id].DRTN;
// MoviePanelNodes[11].textContent = MoviesList[MovieBox.id].GNDR;
// MoviePanelNodes[13].textContent = MoviesList[MovieBox.id].YEAR;
// MoviePanelNodes[15].textContent = MoviesList[MovieBox.id].RTNG;
// MoviePanelNodes[17].textContent = MoviesList[MovieBox.id].DSCR;
// MoviePanelNodes[19].textContent = MoviesList[MovieBox.id].DRTR;
// MoviePanelNodes[21].textContent = 'Casting: '+MoviesList[MovieBox.id].CAST;

// BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + MoviesList[MovieBox.id].FLDR + 'preview.png' + "')";

// MoviePanelFocus = 'Play';
// SetFocusOnMoviePanel();

// PlayingFocus = -1;

// PlayingVod = false;
    //Funcion que carga el panel al seleccionar una pelicula, muestra la descripcion y detalles de la pelicula
    //Se le mandan dos argumento si uno de ellos es indefinido hace difrentes actualizaciones del panel de peliculas
    if (moviesContainer != undefined) {
        //Carga los datos de la pelicula que estaba recientemente seleccionada al salir de la reproduccion
        if(IsMenuFilterSelected == true){
            // @ts-ignore
            PanelYearFilter.style.visibility= 'hidden';
            // @ts-ignore
            PanelMenuFilters.style.visibility = 'hidden';
            var moviesArrayElement    = document.getElementById(moviesContainer);
            // @ts-ignore
            var movieSelectedPosition = getPositionFocusInMovies(StyleFocusMovies, moviesArrayElement.children);
            // @ts-ignore
            var moviesArray           = moviesArrayElement.children;
            var movieTagP             = moviesArray[movieSelectedPosition].getElementsByTagName('p');
            var movieName             = movieTagP[0].innerHTML;
            var buttonPlay            = document.getElementById('PlayPanel'); 
                // @ts-ignore
                buttonPlay.style.backgroundColor = StyleFocusPanelMovie;
            CurrentFocus = 'MoviePanel';
            // @ts-ignore
            ListPanel.style.visibility = 'hidden';
            // @ts-ignore
            MoviePanel.style.visibility = 'visible';
            // @ts-ignore
            PanelRight.style.visibility = 'hidden';
            var Movie = [];
            for (var x = 0; x < MoviesList.length; x++) {      
                if (MoviesList[x].TTLE == movieName) {
                    Movie.push(MoviesList[x]);
                    CurrentMovieID = x;
                }
            }
            // @ts-ignore
            MoviePanelNodes[1].src = FolderSource + Movie[0].FLDR + 'HD'+Movie[0].PSTR;
            MoviePanelNodes[3].textContent  = Movie[0].TTLE;
            MoviePanelNodes[5].textContent  = Movie[0].SCOR;
            MoviePanelNodes[9].textContent  = Movie[0].DRTN;
            MoviePanelNodes[11].textContent = Movie[0].GNDR;
            MoviePanelNodes[13].textContent = Movie[0].YEAR;
            MoviePanelNodes[15].textContent = Movie[0].RTNG;
            MoviePanelNodes[17].textContent = Movie[0].DSCR;
            MoviePanelNodes[19].textContent = Movie[0].DRTR;
            MoviePanelNodes[21].textContent = 'Casting: '+Movie[0].CAST;
            // @ts-ignore
            BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + Movie[0].FLDR + 'preview.png' + "')";
            // @ts-ignore
            PlayingVod = false;
        } else {
            var moviesArrayElement    = document.getElementById(moviesContainer);
            // @ts-ignore
            var movieSelectedPosition = getPositionFocusInMovies(StyleFocusMovies, moviesArrayElement.children);
            // @ts-ignore
            var moviesArray           = moviesArrayElement.children;
            var movieTagP             = moviesArray[movieSelectedPosition].getElementsByTagName('p');
            var movieName             = movieTagP[0].innerHTML;
            var buttonPlay            = document.getElementById('PlayPanel'); 
                // @ts-ignore
                buttonPlay.style.backgroundColor = StyleFocusPanelMovie;
            CurrentFocus = 'MoviePanel';
            // @ts-ignore
            ListPanel.style.visibility = 'hidden';
            // @ts-ignore
            MoviePanel.style.visibility = 'visible';
            // @ts-ignore
            PanelRight.style.visibility = 'hidden';
            var Movie = [];
            for (var x = 0; x < MoviesList.length; x++) {      
                if (MoviesList[x].TTLE == movieName) {
                    Movie.push(MoviesList[x]);
                    CurrentMovieID = x;
                }
            }
            // @ts-ignore
            MoviePanelNodes[1].src = FolderSource + Movie[0].FLDR + 'HD'+Movie[0].PSTR;
            MoviePanelNodes[3].textContent  = Movie[0].TTLE;
            MoviePanelNodes[5].textContent  = Movie[0].SCOR;
            MoviePanelNodes[9].textContent  = Movie[0].DRTN;
            MoviePanelNodes[11].textContent = Movie[0].GNDR;
            MoviePanelNodes[13].textContent = Movie[0].YEAR;
            MoviePanelNodes[15].textContent = Movie[0].RTNG;
            MoviePanelNodes[17].textContent = Movie[0].DSCR;
            MoviePanelNodes[19].textContent = Movie[0].DRTR;
            MoviePanelNodes[21].textContent = 'Casting: '+Movie[0].CAST;
            // @ts-ignore
            BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + Movie[0].FLDR + 'preview.png' + "')";
            // @ts-ignore
            PlayingVod = false;
        }

    } else if (movieOnPlay != undefined) {
        //Carga normalmente los datos de la pelicula
        // @ts-ignore
        if(MenuFilters.style.visibility == "visible"){
            // @ts-ignore
            MenuFilters.style.visibility = "hidden"; 
        }
        // var moviesArrayElement    = document.getElementById(moviesContainer);
        // var movieSelectedPosition = getPositionFocusInMovies(StyleFocusMovies, moviesArrayElement.children);
        // var moviesArray           = moviesArrayElement.children;
        // var movieTagP             = moviesArray[movieSelectedPosition].getElementsByTagName('p');
        // @ts-ignore
        var movieName                = movieOnPlay;
        var buttonPlay               = document.getElementById('PlayPanel'); 
            // @ts-ignore
            buttonPlay.style.backgroundColor  = StyleFocusPanelMovie;
        CurrentFocus = 'MoviePanel';
        // @ts-ignore
        ListPanel.style.visibility   = 'hidden';
        // @ts-ignore
        MoviePanel.style.visibility  = 'visible';
        // @ts-ignore
        PanelRight.style.visibility  = 'hidden';
        var Movie = [];
        for (var x = 0; x < MoviesList.length; x++) {      
            if (MoviesList[x].TTLE == movieName) {
                Movie.push(MoviesList[x]);
            }
        }
        // @ts-ignore
        MoviePanelNodes[1].src = FolderSource + Movie[0].FLDR + 'HD'+Movie[0].PSTR;
        MoviePanelNodes[3].textContent  = Movie[0].TTLE;
        MoviePanelNodes[5].textContent  = Movie[0].SCOR;
        MoviePanelNodes[9].textContent  = Movie[0].DRTN;
        MoviePanelNodes[11].textContent = Movie[0].GNDR;
        MoviePanelNodes[13].textContent = Movie[0].YEAR;
        MoviePanelNodes[15].textContent = Movie[0].RTNG;
        MoviePanelNodes[17].textContent = Movie[0].DSCR;
        MoviePanelNodes[19].textContent = Movie[0].DRTR;
        MoviePanelNodes[21].textContent = 'Casting: '+Movie[0].CAST;
        // @ts-ignore
        BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + Movie[0].FLDR + 'preview.png' + "')";
        // @ts-ignore
        PlayingVod = false;
    }
}

function ClearMoviePanel(){
// @ts-ignore
MoviePanel.style.visibility = 'hidden';

// @ts-ignore
MoviePanelNodes[1].src = '';
MoviePanelNodes[3].textContent  = '';
MoviePanelNodes[5].textContent  = '';
MoviePanelNodes[9].textContent  = '';
MoviePanelNodes[11].textContent = '';
MoviePanelNodes[13].textContent = '';
MoviePanelNodes[15].textContent = '';
MoviePanelNodes[17].textContent = '';
MoviePanelNodes[19].textContent = '';
MoviePanelNodes[21].textContent = '';

}

function SetFocusOnMoviePanel(){
if(MoviePanelFocus === 'Play'){
    // @ts-ignore
    MoviePanelPlay.classList.add('MovieOption');
    // @ts-ignore
    MoviePanelExit.classList.remove('MovieOption');
    MoviePanelFocus = 'Exit';
} else {
    // @ts-ignore
    MoviePanelPlay.classList.remove('MovieOption');
    // @ts-ignore
    MoviePanelExit.classList.add('MovieOption');
    MoviePanelFocus = 'Play';
}
}

function ClearFocusMovieList(){
// @ts-ignore
PanelRightNodes[PanelRightNodesArray[MovieRowFocus]].childNodes[MovieFocus].style.border = '3px solid transparent';
MovieFocus--;
}

function ExecOptionMoviePanel(){
if(MoviePanelFocus === 'Play'){
    // @ts-ignore
    ListPanel.style.visibility  = 'visible';
    // @ts-ignore
    MoviePanel.style.visibility = 'hidden';
    
    CurrentFocus = 'Movies';
    
    // @ts-ignore
    BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/BGMovies.PNG')";
} else {
    CurrentFocus = 'Playing';
    
    // @ts-ignore
    PlayMovie(Libraries['MoviesSource'] + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].FILE);
    
    // @ts-ignore
    PlayingVod = true;
    
    ClearMoviePanel();
    
    ShowPlayingPanel();
    
    SetFocusPlaying('right');
    
    // @ts-ignore
    BackgroundPanel.style.visibility = 'hidden';
}
}

/*******************************************************************************
* 
*******************************************************************************/

function ShowPlayingPanel(){
    // @ts-ignore
    PlayingPanel.style.visibility = 'visible';
    // @ts-ignore
    PlayingOptionsChildren[2].style.border = StyleFocusPlayingMovie;
// PlayinPanelActive = true;

// if(OptionText !== 'pause'){
//     clearTimeout(PlayingPanelTimer);
    
//     /* Contador para ocultar contenedor principal con la informacion*/
//     PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
// } else {
//     clearTimeout(PlayingPanelTimer);
// }

// @ts-ignore
PlayingTitle.textContent = MoviesList[CurrentMovieID].TTLE;
Debug('VodOk---> PlayingTitle.textContent');   

UpdateBarStatus();
Debug('VodOk---> UpdateBarStatus()');

// @ts-ignore
clearTimeout(BarUpdate);


// @ts-ignore
BarUpdate = setInterval(UpdateBarStatus,1000);
Debug('VodOk---> setInterval(UpdateBarStatus,1000)');

//SetFocusPlaying('right');
}
function HidePlayingPanel(){
if(PlayinPanelActive === true){
    // @ts-ignore
    PlayingPanel.style.visibility = 'hidden';

    PlayinPanelActive = false;

    // @ts-ignore
    clearTimeout(PlayingPanelTimer);

    // @ts-ignore
    clearTimeout(BarUpdate);
    
    // @ts-ignore
    ExitPlaying.classList.remove('ButtonFocus');
}
}
function SetFocusPlaying(Direction){
    PlayingOptions                  = document.getElementById('PlayingOptions'),
    // @ts-ignore
    PlayingOptionsNodes             = PlayingOptions.childNodes,
    // @ts-ignore
    PlayingOptionsChildren          = PlayingOptions.children;
    if (Direction == 'right') {
        var positionFocus = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
        if (positionFocus+1 >= PlayingOptionsChildren.length) {
             // @ts-ignore
             PlayingOptionsChildren[positionFocus].style.border = '';
             // @ts-ignore
             PlayingOptionsChildren[0].style.border = StyleFocusPlayingMovie;
        }else{
            // @ts-ignore
            PlayingOptionsChildren[positionFocus].style.border = '';
            // @ts-ignore
            PlayingOptionsChildren[positionFocus+1].style.border = StyleFocusPlayingMovie;
        }
    } else if (Direction == 'left') {
        var positionFocus = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
        if (positionFocus == 0) {
            // @ts-ignore
            PlayingOptionsChildren[positionFocus].style.border = '';
            // @ts-ignore
            PlayingOptionsChildren[(PlayingOptionsChildren.length)-1].style.border = StyleFocusPlayingMovie;
        }else{
            // @ts-ignore
            PlayingOptionsChildren[positionFocus].style.border = '';
            // @ts-ignore
            PlayingOptionsChildren[positionFocus-1].style.border = StyleFocusPlayingMovie;
        } 
    }
// if(PlayinPanelActive === true){

//     if(PlayingFocus >= 0 && PlayingFocus < PlayingNodesArray.length){
//         PlayingOptionsNodes[PlayingNodesArray[PlayingFocus]].classList.remove('ButtonFocus');
//     }

//     (Direction === 'right') ? PlayingFocus++: PlayingFocus--;


//     if(PlayingFocus >= PlayingNodesArray.length){
//         PlayingFocus = (PlayingNodesArray.length -1 );
//     } else if(PlayingFocus < 0){
//         PlayingFocus = 0;
//     }

//     PlayingOptionsNodes[PlayingNodesArray[PlayingFocus]].classList.add('ButtonFocus');

// /* */
//     clearTimeout(PlayingPanelTimer);

//     PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
    
// }
}
function ClearFocusPlaying(){
var IndexC = 0;

for(IndexC = 0; IndexC < PlayingNodesArray.length; IndexC++){
    // @ts-ignore
    PlayingOptionsNodes[PlayingNodesArray[IndexC]].classList.remove('ButtonFocus');
}
}

function SelectPlayingOption(){
    var positionFocus = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
    switch (positionFocus) {
        case 0:
            //Retroceso        
            break;
        case 1:
            //Reproducir de nuevo
            // StopVideo();
            // PlayingMovie();
            SetSpeed('backward');
            Debug('VodOk---> SelectPlayingOption SetSpeed backward');  
            break;
        case 2:
            //Play
            Debug('VodOk---> SelectPlayingOption SetSpeed play');
            SetSpeed('play');
            break;
        case 3:
            //Pausa
            Debug('VodOk---> SelectPlayingOption SetSpeed pause');
            SetSpeed('pause');
            break;
        case 4:
            Debug('VodOk---> SelectPlayingOption SetSpeed forward');
            SetSpeed('forward');
            
            break;

    }
// if(PlayinPanelActive === true){

   
//     switch (PlayingNodesArray[PlayingFocus]) {
//         case 1:
//             // Backward
//             SetSpeed('backward');
//         break;

//         case 3:
//             //SetSpeed('play');
            
//             ResumeVideo();
//         break;

//         case 5:
//             // Pause
//             //SetSpeed('pause');
            
//             PauseVideo();
//         break;

//         case 7:
//             // Forward
//             SetSpeed('forward');
//         break;
        
//         case 8:
//             // close
//             StopVideo();

//         break;
//     }
    
//     if(OptionText !== 'pause'){
//         clearTimeout(PlayingPanelTimer);

//         /* Contador para ocultar contenedor principal con la informacion*/
//         PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
//     } else {
//         clearTimeout(PlayingPanelTimer);
//     }
// }

}
function SetFocusClose(){

ClearFocusPlaying();
 
// @ts-ignore
ExitPlaying.classList.add('ButtonFocus');

PlayingFocus++;

CurrentFocus = 'StopPlaying';

// @ts-ignore
clearTimeout(PlayingPanelTimer);

// @ts-ignore
PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
}
function UnsetFocusClose(){
// @ts-ignore
ExitPlaying.classList.remove('ButtonFocus');

SetFocusPlaying('left');

CurrentFocus = 'Playing';
}
/*******************************************************************************
* Opciones reproduccion
*******************************************************************************/
function SetSpeed(Option){
// @ts-ignore
Debug('VodOk---> SetSpeed: '+Option);
if(Option === 'forward'){
    // @ts-ignore
    Debug('VodOk---> UpdatePosition: add');
    // @ts-ignore
    UpdatePosition('add');
} else if(Option === 'backward'){
    // @ts-ignore
    UpdatePosition('subtract');
} else if(Option === 'pause'){
    // @ts-ignore
    PauseVideo();
} else if(Option === 'play'){
    // @ts-ignore
    ResumeVideo();
}

OptionText = Option;
}

function UpdateBarStatus(){
// @ts-ignore
Debug('UpdateBarStatus-> '+MoviesList[CurrentMovieID].MNTS);
// @ts-ignore
AssetStatus(MoviesList[CurrentMovieID].MNTS);

// @ts-ignore
BarPosition.style.width = PercentagePosition +'%';
// @ts-ignore
InfoPosition.textContent = SecondsToTime(PositionAsset) + ' / '+MoviesList[CurrentMovieID].DRTN;
// @ts-ignore
PlayingSpeed.textContent = SpeedText;

// @ts-ignore
Debug('UpdateBarStatus-> PercentagePosition = '+PercentagePosition);
}
/*******************************************************************************
* 
*******************************************************************************/
function StopCloseMovie(){

// HidePlayingPanel();

// StopVideo();

// ListPanel.style.visibility  = 'visible';
// MoviePanel.style.visibility = 'hidden';
// BackgroundPanel.style.visibility = 'visible';

// CurrentFocus = 'Movies';

// BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/2542.jpg')";

// PlayingVod = false;
    //Cierra la pelicula cunado se esta reproduciendo y ademas manda las estadisticas a la base de datos
    // @ts-ignore
    BackgroundPanel.style.visibility='visible';
    HidePlayingPanel();
    // @ts-ignore
    StopVideo();
    // @ts-ignore
    clearInterval(BarUpdate);
    LoadMoviePanel(undefined, MoviesList[CurrentMovieID].TTLE);
    CurrentFocus = 'MoviePanel';
    // @ts-ignore
    CurrentMovie = MoviesList[CurrentMovieID].TTLE;
    // @ts-ignore
    SetMoviesStatistics();
    // @ts-ignore
    PlayingVod = false;
    var position = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
    // @ts-ignore
    PlayingOptionsChildren[position].style.border = '';
}
/*******************************************************************************
* Navegacion 
*******************************************************************************/
function VodRight(){
if(CurrentFocus === 'Menu'){
    // CurrentFocus = 'Movies';
    // ClearFocusHeader(); 
    // SetFocusMovie('set');
    SetFocusOnRecommendedMovies('set');
    
} else if(CurrentFocus === 'Movies'){
    SetFocusMovie('right');
} else if(CurrentFocus === 'MoviePanel'){
    SetFocusOnMoviePanel('right');
} else if(CurrentFocus === 'Playing'){
    SetFocusPlaying('right');
} else if (CurrentFocus === 'RecommendedMovies') {
    SetFocusOnRecommendedMovies('right');
}  else if(CurrentFocus === 'HiddenMode'){
    SetFocusOnHiddenMode('right');
}  else if (CurrentFocus === 'AllMovies') {
    SetFocusOnAllMovies('right');
} else if (CurrentFocus == 'FilterMovies') {
    SetFocusOnMenuFilter('right');
}   else if (CurrentFocus === 'SelectYear') {
    SetFocusOnMenuByYear('right');
}  else if (CurrentFocus === 'SelectMovieByYear') {
    SetFocusOnMovieByYear('right');
}   else if(CurrentFocus === 'SelectLanguage'){
    SetFocusOnMenuLanguage('right');
} 
}
function VodLeft(){
if(CurrentFocus === 'Menu'){
    ///
} else if(CurrentFocus === 'Movies'){
    if(MovieFocus === 0){
        // @ts-ignore
        MenuFocus--;
        CurrentFocus = 'Menu';
        
        ClearFocusMovieList();
        
        SetFocusHeader('down');
    } else {
        SetFocusMovie('left');
    }
} else if(CurrentFocus === 'MoviePanel'){
    SetFocusOnMoviePanel('left');
} else if(CurrentFocus === 'Playing'){
    SetFocusPlaying('left');
} else if (CurrentFocus === 'RecommendedMovies') {
    SetFocusOnRecommendedMovies('left');
}  else if(CurrentFocus === 'HiddenMode'){
    SetFocusOnHiddenMode('left');
}  else if (CurrentFocus === 'AllMovies') {
    SetFocusOnAllMovies('left');
}  else if (CurrentFocus === 'SelectMovieByYear') {
    SetFocusOnMovieByYear('left');
}  else if (CurrentFocus === 'SelectYear') {
    SetFocusOnMenuByYear('left');
}  else if(CurrentFocus === 'SelectLanguage'){
    SetFocusOnMenuLanguage('left');
} 
}
function VodDown(){
if(CurrentFocus === 'Menu'){
    SetFocusHeader('down');
} else if(CurrentFocus === 'Movies'){
    SetFocusMovie('down');
} else if(CurrentFocus === 'MoviePanel'){
    SetFocusOnMoviePanel();
} else if(CurrentFocus === 'StopPlaying'){
    UnsetFocusClose();
} else if (CurrentFocus === 'HiddenMode') {
    SetFocusOnHiddenMode('down');
} else  if (CurrentFocus === 'RecommendedMovies') {
    SetFocusOnRecommendedMovies('down');
}   else if (CurrentFocus === 'AllMovies') {
    SetFocusOnAllMovies('down');
}  else if (CurrentFocus === 'FilterMovies'){
    SetFocusOnMenuFilter('down');
}  else if (CurrentFocus === 'SelectYear') {
    SetFocusOnMenuByYear('down');
}  else if (CurrentFocus === 'SelectMovieByYear') {
    SetFocusOnMovieByYear('down');
}  else if(CurrentFocus === 'Playing'){
    StopCloseMovie();
}   else if(CurrentFocus === 'SelectLanguage'){
    SetFocusOnMenuLanguage('down');
} 
}
function VodUp(){
if(CurrentFocus === 'Menu'){
    SetFocusHeader('up');
} else if(CurrentFocus === 'Movies'){
    SetFocusMovie('up');
} else if(CurrentFocus === 'MoviePanel'){
    SetFocusOnMoviePanel();
} else if(CurrentFocus === 'Playing'){
    // SetFocusClose();
    SetFocusOnHiddenMode('set');
}   else if (CurrentFocus === 'AllMovies') {
    SetFocusOnAllMovies('up');
}  else if (CurrentFocus === 'FilterMovies'){
    SetFocusOnMenuFilter('up');
}  else if (CurrentFocus === 'SelectYear') {
    SetFocusOnMenuByYear('up');
}  else if (CurrentFocus === 'SelectMovieByYear') {
    SetFocusOnMovieByYear('up');
}  else if(CurrentFocus === 'HiddenMode'){
    SetFocusOnMenuLanguage('set');
} 
}
function VodClose(){
if(CurrentFocus === 'Playing' || CurrentFocus === 'StopPlaying'){
    HidePlayingPanel();
}
}
function VodOk(){
if(CurrentFocus === 'Menu'){
    SelectMenuOption();
} else if(CurrentFocus === 'Movies'){
    LoadMoviePanel();
} else if(CurrentFocus === 'MoviePanel'){
      ExecOptionMoviePanel();
    SelectPlayOption();
} else if(CurrentFocus === 'Playing'){
    SelectPlayingOption();
} else if(CurrentFocus === 'StopPlaying'){
    StopCloseMovie();
} else if (CurrentFocus == 'RecommendedMovies') {
    LoadMoviePanel('RecommendedMoviesList');
} else if (CurrentFocus === 'HiddenMode') {
    SetFocusOnHiddenMode('ok');
} else if (CurrentFocus === 'AllMovies') {
    LoadMoviePanel('AllMoviesList');
} else if (CurrentFocus === 'SelectMovieByYear') {
    LoadMoviePanel('MoviesByYearList');
}   else if(CurrentFocus === 'SelectLanguage'){
    SetFocusOnMenuLanguage('ok');
} else if (CurrentFocus === 'FilterMovies'){
    SetFocusOnMenuFilter('ok');
}  
}
function VodInfo(){
if(CurrentFocus === 'Playing' || CurrentFocus === 'StopPlaying'){
    ShowPlayingPanel();
}
}
 /*******************************************************************************
 * Utilidades
 *******************************************************************************/
function refreshMoviesPrincipalList(moviesList, panel){
    if (panel != 'RecommendedMoviesList' && panel != 'AllMoviesList') {
        //Eliminando Peliculas del panel
        var  element    = document.getElementById(panel);
        // @ts-ignore
        var  parent      = element.parentNode;
                // @ts-ignore
                parent.removeChild(element);
        var  div = document.createElement('div');
            div.setAttribute('id', panel);
            if (panel == 'MoviesByYearList') {
                div.setAttribute('class', 'MoviesByYearRow')
            }
            // @ts-ignore
            parent.appendChild(div);
        var rows = Math.ceil(moviesList.length/4);
        var matrix = getMatrix(rows,moviesList.length, 4);
        for (var Y = 0; Y < 2; Y++) {
            for (var X = 0; X < 4; X++) {
                var peliculaID = matrix[Y][X];
                if (peliculaID == -1) {
                    return;
                }else{
                    // @ts-ignore
                    BoxDiv               = document.createElement('div');
                    // @ts-ignore
                    BoxDiv.className     = 'RowMovieByYearPoster';
                    // @ts-ignore
                    BoxPoster            = document.createElement('img');
                    // @ts-ignore
                    BoxTitle             = document.createElement('p');
                    // @ts-ignore
                    BoxTitle.style.visibility = 'hidden';
                    // @ts-ignore
                    BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                    // @ts-ignore
                    BoxTitle.textContent = moviesList[peliculaID].TTLE;
                    // @ts-ignore
                    BoxDiv.appendChild(BoxPoster);
                    // @ts-ignore
                    BoxDiv.appendChild(BoxTitle);
                    // @ts-ignore
                    document.getElementById(panel).appendChild(BoxDiv);
                }
            }
        }
    }else{
        var element = document.getElementById(panel);
        // @ts-ignore
        var parent  = element.parentNode;
            // @ts-ignore
            parent.removeChild(element);
        var div = document.createElement('div');
            div.setAttribute('id', panel);
            if (panel == 'RecommendedMoviesList') {
                div.setAttribute('class', 'RecommendedMoviesRow');
            } else if (panel == 'AllMoviesList'){
                div.setAttribute('class', 'MoviesRow');
            }
            // @ts-ignore
            parent.appendChild(div);
        var rows   = Math.ceil(moviesList.length/4);
        var matrix = getMatrix(rows, moviesList.length, 4);
                for (var x = 0; x < 4; x++) {
                        var peliculaID  = matrix[0][x];
                        if (peliculaID == -1) {
                            return;
                        }else{
                                // @ts-ignore
                                BoxDiv               = document.createElement('div');
                                // @ts-ignore
                                BoxDiv.className     = 'RowPoster';
                                // @ts-ignore
                                BoxPoster            = document.createElement('img');
                                // @ts-ignore
                                BoxTitle             = document.createElement('p');
                                // @ts-ignore
                                BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                                // @ts-ignore
                                BoxTitle.textContent = moviesList[peliculaID].TTLE;
                                // @ts-ignore
                                BoxTitle.style.visibility = 'hidden';
                                // @ts-ignore
                                BoxDiv.appendChild(BoxPoster);
                                // @ts-ignore
                                BoxDiv.appendChild(BoxTitle);
                                // @ts-ignore
                                document.getElementById(panel).appendChild(BoxDiv);

                        }
                }
    }
}
function getMatrix(Rows, length, col){
    var matrix   = [];
    var aux      = 0;
    var contador = 0;
    for (var i = 0; i < Rows; i++) {
        matrix[i]= new Array(col);
    }
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < col; x++) {
        matrix[y][x]=aux++;                 
        }   
        }
        for (var y = 0; y < matrix.length; y++) {
            for (var x = 0; x < col; x++) {
                contador++;
            if (contador>length) {
                matrix[y][x]=-1;
            }
            }
            }
    return matrix;
}
function getimageMovie(movie){
    //Devuelve la direccion de la imagen de la pelicula
    return FolderSource + movie.FLDR + movie.PSTR;
}  
function getPositionFocusInMovies(style, panelNodes){
    //Esta funcion recupera la posicion de la pelicula que tiene el focus dentro de su padre
    var position = -1;
    for (var x = 0; x < panelNodes.length; x++) {
        if (panelNodes[x].style.border == style) {
        position=x;
    } 
    }
    return position;
}
function scrollRefresh(row, panel, moviesList){
    //Funcion para simular el efecto scroll dentro de una lista de peliculas 
    if (panel != 'RecommendedMoviesList' && panel != 'AllMoviesList') {
        //Eliminando peliculas del panel
        var  element    = document.getElementById(panel);
        // @ts-ignore
        var  parent      = element.parentNode;
             // @ts-ignore
             parent.removeChild(element);
        var  div = document.createElement('div');
             div.setAttribute('id', panel);
             if (panel == 'MoviesByYearList') {
                div.setAttribute('class', 'MoviesByYearRow')
            }
            // @ts-ignore
            parent.appendChild(div);
            var rows = Math.ceil(moviesList.length/4);
            var matrix = getMatrix(rows,moviesList.length, 4); 
        // @ts-ignore
        for (Y = row; Y < row+2; Y++) {
            for (var X = 0; X < 4; X++) {
                // @ts-ignore
                var peliculaID  = matrix[Y][X];
                if (peliculaID == -1) {
                    return;
                }else{
                    // @ts-ignore
                    BoxDiv               = document.createElement('div');
                    // @ts-ignore
                    BoxDiv.className     = 'RowMovieByYearPoster';
                    // @ts-ignore
                    BoxPoster            = document.createElement('img');
                    // @ts-ignore
                    BoxTitle             = document.createElement('p');
                    // @ts-ignore
                    BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                    // @ts-ignore
                    BoxTitle.textContent = moviesList[peliculaID].TTLE;
                    // @ts-ignore
                    BoxTitle.style.visibility = 'hidden';
                    // @ts-ignore
                    BoxDiv.appendChild(BoxPoster);
                    // @ts-ignore
                    BoxDiv.appendChild(BoxTitle);
                    // @ts-ignore
                    document.getElementById(panel).appendChild(BoxDiv);
                }
        } 
        }
 
    }else{
                    //Eliminando peliculas del panel
                    var  element    = document.getElementById(panel);
                    // @ts-ignore
                    var  parent      = element.parentNode;
                         // @ts-ignore
                         parent.removeChild(element);
                    var  div = document.createElement('div');
                         div.setAttribute('id', panel);
                         if (panel == 'RecommendedMoviesList') {
                            div.setAttribute('class', 'RecommendedMoviesRow')
                         }else if (panel == 'AllMoviesList') {
                            div.setAttribute('class', 'MoviesRow')
                         }
                         // @ts-ignore
                         parent.appendChild(div);
                    for (var x = 0; x < 4; x++) {
                        var peliculaID  = row[x];
                        if (peliculaID == -1) {
                            return;
                        }else{
                            // @ts-ignore
                            BoxDiv               = document.createElement('div');
                            // @ts-ignore
                            BoxDiv.className     = 'RowPoster';
                            // @ts-ignore
                            BoxPoster            = document.createElement('img');
                            // @ts-ignore
                            BoxTitle             = document.createElement('p');
                            // @ts-ignore
                            BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                            // @ts-ignore
                            BoxTitle.textContent = moviesList[peliculaID].TTLE;
                            // @ts-ignore
                            BoxTitle.style.visibility = 'hidden';
                            // @ts-ignore
                            BoxDiv.appendChild(BoxPoster);
                            // @ts-ignore
                            BoxDiv.appendChild(BoxTitle);
                            // @ts-ignore
                            document.getElementById(panel).appendChild(BoxDiv);
                        }
        
                }    
    } 
}
function getPositionFocusInPanelMovie(style, panelNodes){
    //Esta funcion recupera la posicion del boton en el panel de peliculas que tiene el focus dentro de su padre
   var position = -1;
   for (var x = 0; x < panelNodes.length; x++) {
       if (panelNodes[x].style.backgroundColor== style) {
       position=x;
   } 
   }
   return position;
}
function getPositionFocusInMenu(style, panelNodes){
    //Esta funcion recupera la posicion de un menu que tiene el focus dentro de su padre
   var position = -1;
   for (var x = 0; x < panelNodes.length; x++) {
       if (panelNodes[x].style.backgroundColor == style) {
       position=x;
   } 
   }
   return position;
}

function getPositionFocusInMenuFilter(style, panelNodes){
    //Esta funcion recupera la posicion de un menu que tiene el focus dentro de su padre
   var position = -1;
   for (var x = 0; x < panelNodes.length; x++) {
       if (panelNodes[x].style.backgroundColor == style) {
       position=x;
   } 
   }
   return position;
}

function refreshLanguages(){

    // PIDS = gSTB.GetAudioPIDs();
    // gSTB.SetAudioPID(1);
    // alert(PIDS.length);
    // [{pid:1, lang:["spa",""]},{pid:2, lang:["eng",""]}]
        // @ts-ignore
        for (var x = 0; x < numberOfLanguages; x++) {
            // @ts-ignore
            LanDiv              = document.createElement('div');
            // @ts-ignore
            LanDiv.className    = 'LanguageContainer';
            // @ts-ignore
            LanDiv.textContent  = PIDS[x];
            // @ts-ignore
            MenuLanguagePanel.appendChild(LanDiv);
            // @ts-ignore
            document.getElementById('MenuLanguagePanel').appendChild(LanDiv);
        }
    // var  str = AVMedia.GetProgramInfo(AVMedia.PROGRAM_INFO_SUBTITLE);
    // alert(str);
}
/*******************************************************************************
 * Funciones para controlar la navegacion dentro de un panel
 *******************************************************************************/
function SetFocusOnRecommendedMovies(Direction){
    RecommendedMoviesList           = document.getElementById('RecommendedMoviesList');
    // @ts-ignore
    RecommendedMoviesListNodes      = RecommendedMoviesList.childNodes,
    // @ts-ignore
    RecommendedMoviesListChildren   = RecommendedMoviesList.children;
    if (Direction == 'set') {
        CurrentFocus = 'RecommendedMovies';
        // @ts-ignore
        RecommendedMoviesListChildren[0].style.border = StyleFocusMovies;
    } else if (Direction == 'right') {
        var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
        if (position+1 >= RecommendedMoviesListNodes.length) {
            var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
            var rows = Math.ceil(MoviesList.length/4);
            var matrix = getMatrix(rows,MoviesList.length, 4);
            y = y+1;
            var row = matrix[y];
            if (row === undefined ) {
                y= y-1;
            }else{
                scrollRefresh(row, 'RecommendedMoviesList', MoviesList);
                RecommendedMoviesList           = document.getElementById('RecommendedMoviesList');
                // @ts-ignore
                RecommendedMoviesListChildren   = RecommendedMoviesList.children;
                if (RecommendedMoviesListChildren[position] === undefined) {
                    // @ts-ignore
                    RecommendedMoviesListChildren[0].style.border=StyleFocusMovies;
                } else{
                    // @ts-ignore
                    RecommendedMoviesListChildren[0].style.border=StyleFocusMovies;
                }
            }
            }else{
            // @ts-ignore
            RecommendedMoviesListChildren[position].style.border='';
            // @ts-ignore
            RecommendedMoviesListChildren[position+1].style.border=StyleFocusMovies;
            }
    } else if (Direction == 'left') {
        var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
        if (position-1 == -1 && y == 0) {
            CurrentFocus = 'Menu';
            // @ts-ignore
            RecommendedMoviesListChildren[0].style.border= '';
        }else if (position-1 == -1 && y!=0) {
            var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
            var rows = Math.ceil(MoviesList.length/4);
            var matrix = getMatrix(rows,MoviesList.length, 4);
            y = y-1;
            var row = matrix[y];
            if (row === undefined ) {
                y= 0;
            }else{
                scrollRefresh(row, 'RecommendedMoviesList', MoviesList);
                RecommendedMoviesList           = document.getElementById('RecommendedMoviesList');
                // @ts-ignore
                RecommendedMoviesListChildren   = RecommendedMoviesList.children;
                if (RecommendedMoviesListChildren[position] === undefined) {
                    // @ts-ignore
                    RecommendedMoviesListChildren[0].style.border=StyleFocusMovies;
                } else{
                    // @ts-ignore
                    RecommendedMoviesListChildren[3].style.border=StyleFocusMovies;
                }
            }
        }else{
            // @ts-ignore
            RecommendedMoviesListChildren[position].style.border='';
            // @ts-ignore
            RecommendedMoviesListChildren[position-1].style.border=StyleFocusMovies;
        }
    } else if (Direction == 'down') {
        CurrentFocus = 'AllMovies';
        y=0;
        var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
            AllMoviesList                   = document.getElementById('AllMoviesList'),
            // @ts-ignore
            AllMoviesListNodes              = AllMoviesList.childNodes,
            // @ts-ignore
            AllMoviesListChildren           = AllMoviesList.children;
            // @ts-ignore
            RecommendedMoviesListChildren[position].style.border='';
            // @ts-ignore
            AllMoviesListChildren[0].style.border= StyleFocusMovies;
            var rows = Math.ceil(MoviesList.length/4);
            var matrix = getMatrix(rows,MoviesList.length, 4);
            var row = matrix[y];
            scrollRefresh(row, 'RecommendedMoviesList', MoviesList);
    }
}
function SetFocusOnMoviePanel(Direction){
    MoviePanel                      = document.getElementById('MoviePanel'),
    // @ts-ignore
    MoviePanelNodes                 = MoviePanel.childNodes,
    // @ts-ignore
    MoviePanelChildren              = MoviePanel.children;
   if (Direction == 'right') {
       var position = getPositionFocusInPanelMovie(StyleFocusPanelMovie, MoviePanelChildren);
       if (position == 12) {
           // @ts-ignore
           MoviePanelChildren[position].style.backgroundColor = '';
           // @ts-ignore
           MoviePanelChildren[position-1].style.backgroundColor = StyleFocusPanelMovie;
       }else{
           // @ts-ignore
           MoviePanelChildren[position].style.backgroundColor = '';
           // @ts-ignore
           MoviePanelChildren[position+1].style.backgroundColor = StyleFocusPanelMovie;
       }
   }else if (Direction == 'left') {
       var position = getPositionFocusInPanelMovie(StyleFocusPanelMovie, MoviePanelChildren);
       if (position == 11) {
           // @ts-ignore
           MoviePanelChildren[position].style.backgroundColor = '';
           // @ts-ignore
           MoviePanelChildren[position+1].style.backgroundColor = StyleFocusPanelMovie;
       }else{
           // @ts-ignore
           MoviePanelChildren[position].style.backgroundColor = '';
           // @ts-ignore
           MoviePanelChildren[position-1].style.backgroundColor = StyleFocusPanelMovie;
       }
   }
}
function SetFocusOnHiddenMode(Direction){
    if(Direction == 'set'){
        CurrentFocus = 'HiddenMode';
        // @ts-ignore
        PlayingPanel.style.visibility = 'hidden';
    } else if(Direction == 'right'){
         SetSpeed('forward');
        // @ts-ignore
        Onforward.style.visibility= 'visible';
        setTimeout(HideOnforward, 3000);
    } else if (Direction == 'left') {
         SetSpeed('backward');
        // @ts-ignore
        OnBackward.style.visibility= 'visible';
        setTimeout(HideOnBackward, 3000);
    } else if (Direction == 'down') {
        // @ts-ignore
        PlayingPanel.style.visibility = 'visible';
        CurrentFocus = 'Playing';
    } else if (Direction == 'ok') {
        if (IsOnPlay == true) {
            IsOnPlay = false;
            // @ts-ignore
            OnPause.style.visibility= 'visible';
             SetSpeed('pause');
        }else{
            IsOnPlay = true;  
            // @ts-ignore
            OnPause.style.visibility= 'hidden';
            // @ts-ignore
            OnPlay.style.visibility= 'visible';
             SetSpeed('play');
            setTimeout(HideOnPlay, 3000);
        }
    }
}
function SetFocusOnAllMovies(Direction){
    AllMoviesList           = document.getElementById('AllMoviesList');
    // @ts-ignore
    AllMoviesListNodes      = AllMoviesList.childNodes,
    // @ts-ignore
    AllMoviesListChildren   = AllMoviesList.children;
    if (Direction == 'right') {
        var position = getPositionFocusInMovies(StyleFocusMovies, AllMoviesListChildren);  
        if (position+1 >= AllMoviesListNodes.length) {
            // @ts-ignore
            AllMoviesListChildren[position].style.border='';
            SetFocusOnAllMovies('down');
            // @ts-ignore
            AllMoviesListChildren[0].style.border=StyleFocusMovies;
            }else{
            // @ts-ignore
            AllMoviesListChildren[position].style.border='';
            // @ts-ignore
            AllMoviesListChildren[position+1].style.border=StyleFocusMovies;
            }        
    } else if (Direction == 'left') {
        var position = getPositionFocusInMovies(StyleFocusMovies, AllMoviesListChildren);  
        if (position-1 <0) {
            CurrentFocus = 'Menu';
            // @ts-ignore
            AllMoviesListChildren[0].style.border= '';
        }else{
            // @ts-ignore
            AllMoviesListChildren[position].style.border='';
            // @ts-ignore
            AllMoviesListChildren[position-1].style.border=StyleFocusMovies;
        }        
    } else if (Direction == 'down') {
        var position = getPositionFocusInMovies(StyleFocusMovies, AllMoviesListChildren);  
        var rows = Math.ceil(MoviesList.length/4);
        var matrix = getMatrix(rows,MoviesList.length, 4);
        y = y+1;
        var row = matrix[y];
        if (row === undefined ) {
            y= rows;
        }else{
            scrollRefresh(row, 'AllMoviesList', MoviesList);
            AllMoviesList           = document.getElementById('AllMoviesList');
            // @ts-ignore
            AllMoviesListChildren   = AllMoviesList.children;
            if (AllMoviesListChildren[position] === undefined) {
                // @ts-ignore
                AllMoviesListChildren[0].style.border=StyleFocusMovies;
            } else{
                // @ts-ignore
                AllMoviesListChildren[position].style.border=StyleFocusMovies;
            }
        }
    } else if (Direction == 'up') {
        var position = getPositionFocusInMovies(StyleFocusMovies, AllMoviesListChildren);  
        var rows = Math.ceil(MoviesList.length/4);
        var matrix = getMatrix(rows,MoviesList.length, 4);
        y = y-1;
        var row = matrix[y];
        if (row === undefined) {
            RecommendedMoviesList           = document.getElementById('RecommendedMoviesList');
            // @ts-ignore
            RecommendedMoviesListNodes      = RecommendedMoviesList.childNodes,
            // @ts-ignore
            RecommendedMoviesListChildren   = RecommendedMoviesList.children;
            y=0;
            CurrentFocus = 'RecommendedMovies';
            // @ts-ignore
            RecommendedMoviesListChildren[0].style.border = StyleFocusMovies;
            // @ts-ignore
            AllMoviesListChildren[position].style.border = '';
        }else {
            scrollRefresh(row, 'AllMoviesList', MoviesList);
            AllMoviesList           = document.getElementById('AllMoviesList');
            // @ts-ignore
            AllMoviesListChildren   = AllMoviesList.children;
            if (AllMoviesListChildren[position] === undefined) {
                // @ts-ignore
                AllMoviesListChildren[0].style.border=StyleFocusMovies;
            } else{
                // @ts-ignore
                AllMoviesListChildren[position].style.border=StyleFocusMovies;
            }
        }

    }    
}
function SetFocusOnMenuFilter(Direction){
    if (Direction == 'down') {
        FilterMovieCategoryList = document.getElementById('filterMovieCategory');
        // @ts-ignore
        FilterMovieCategoryListChildren = FilterMovieCategoryList.children;
        var positionFocus = getPositionFocusInMenuFilter(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        if (positionFocus+1 >= FilterMovieCategoryListChildren.length) {
            // @ts-ignore
            FilterMovieCategoryListChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            FilterMovieCategoryListChildren[0].style.backgroundColor = StyleFocusMenuFilter;
        }else{
            // @ts-ignore
            FilterMovieCategoryListChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            FilterMovieCategoryListChildren[positionFocus+1].style.backgroundColor = StyleFocusMenuFilter;
        }
        setFilterMovies(); 
    } else if (Direction == 'up') {
        FilterMovieCategoryList = document.getElementById('filterMovieCategory');
        // @ts-ignore
        FilterMovieCategoryListChildren = FilterMovieCategoryList.children;
        var positionFocus = getPositionFocusInMenuFilter(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        if (positionFocus == 0) {
            // @ts-ignore
            FilterMovieCategoryListChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            FilterMovieCategoryListChildren[(FilterMovieCategoryListChildren.length)-1].style.backgroundColor = StyleFocusMenuFilter;
        }else{
            // @ts-ignore
            FilterMovieCategoryListChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            FilterMovieCategoryListChildren[positionFocus-1].style.backgroundColor = StyleFocusMenuFilter;
        }
        setFilterMovies();  
    } else if (Direction == 'right') {
        var position = getPositionFocusInMenuFilter(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        switch (position) {
            case 0:
                SetFocusOnMenuByYear('set');
                break;
            case 1:
                // SetFocusOnMenuByGender('set');
                break;
            case 2:
                RecommendedMoviesList           = document.getElementById('RecommendedMoviesList'),
                // @ts-ignore
                RecommendedMoviesListChildren   = RecommendedMoviesList.children;
                CurrentFocus= 'RecommendedMovies';
                // @ts-ignore
                RecommendedMoviesListChildren[0].style.border = StyleFocusMovies;
                // @ts-ignore
                MenuFilters.style.visibility = 'hidden';
                // @ts-ignore
                FilterMovieCategoryListChildren[position].style = '';
                // @ts-ignore
                ListPanel.style.visibility = 'visible';
                IsMenuFilterSelected = false;
                break;
        }
    } else if (Direction == 'ok'){
        var position = getPositionFocusInMenuFilter(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        switch (position) {
            case 0:
                break;
            case 1:
                break;
            case 2:
        RecommendedMoviesList         = document.getElementById('RecommendedMoviesList'),
        // @ts-ignore
        RecommendedMoviesListChildren = RecommendedMoviesList.children;
        // @ts-ignore
        RecommendedMoviesListChildren[0].style.border = StyleFocusMovies;
        // @ts-ignore
        ListPanel.style.visibility = 'visible';
        // @ts-ignore
        PanelRight.style.visibility = 'visible';
        // @ts-ignore
        BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/BGMovies.PNG')";
        // @ts-ignore
        MenuFilters.style.visibility = 'hidden';
        break; 
        }
    }
      
}
function SetFocusOnMenuByYear(Direction){
    YearFilter                      = document.getElementById('yearfilter'),
    // @ts-ignore
    YearFilterNodes                 = YearFilter.childNodes,
    // @ts-ignore
    YearFilterChildren              = YearFilter.children;
    if (Direction == 'set') {
        CurrentFocus = 'SelectYear';
        // @ts-ignore
        YearFilterChildren[0].style.backgroundColor = StyleFocusMenuYearFilter;
        var positionFocus = getPositionFocusInMenuFilter(StyleFocusMenuYearFilter, YearFilterChildren);
        var movies = getMoviesByYear(positionFocus);
        refreshMoviesPrincipalList(movies, 'MoviesByYearList');
    } else if (Direction == 'down') {
        YearFilter = document.getElementById('yearfilter');
        // @ts-ignore
        YearFilterChildren = YearFilter.children;
        var positionFocus = getPositionFocusInMenuFilter(StyleFocusMenuYearFilter, YearFilterChildren);
        if (positionFocus+1 >= YearFilterChildren.length) {
            // YearFilterChildren[positionFocus].style = '';
            // YearFilterChildren[0].style = StyleFocusMenuYearFilter;
            return;
        }else{
            // @ts-ignore
            YearFilterChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            YearFilterChildren[positionFocus+1].style.backgroundColor = StyleFocusMenuYearFilter;
        }
        var movies = getMoviesByYear(positionFocus+1);
        refreshMoviesPrincipalList(movies, 'MoviesByYearList');
    } else if (Direction == 'up') {
        YearFilter = document.getElementById('yearfilter');
        // @ts-ignore
        YearFilterChildren = YearFilter.children;
        var positionFocus = getPositionFocusInMenuFilter(StyleFocusMenuYearFilter, YearFilterChildren);
        if (positionFocus == 0) {
            // YearFilterChildren[positionFocus].style = '';
            // YearFilterChildren[(YearFilterChildren.length)-1].style = StyleFocusMenuYearFilter;
            return;
        }else{
            // @ts-ignore
            YearFilterChildren[positionFocus].style.backgroundColor = '';
            // @ts-ignore
            YearFilterChildren[positionFocus-1].style.backgroundColor = StyleFocusMenuYearFilter;
        } 
        var movies = getMoviesByYear(positionFocus-1);
        refreshMoviesPrincipalList(movies, 'MoviesByYearList');
    } else if (Direction == 'right'){
        SetFocusOnMovieByYear('set');
    } else if (Direction == 'left'){
        YearFilter = document.getElementById('yearfilter');
        // @ts-ignore
        YearFilterChildren = YearFilter.children;
        var positionFocus = getPositionFocusInMenuFilter(StyleFocusMenuYearFilter, YearFilterChildren);
        // @ts-ignore
        YearFilterChildren[positionFocus].style.backgroundColor = '';
        CurrentFocus = "FilterMovies";
    }
}
function SetFocusOnMovieByYear(Direction){
    MoviesByYearList                = document.getElementById('MoviesByYearList'),
    // @ts-ignore
    MoviesByYearListNodes           = MoviesByYearList.childNodes,
    // @ts-ignore
    MoviesByYearListChildren        = MoviesByYearList.children;
    var MoviesByYearLenght          = MoviesByYearListChildren.length;  
    if (Direction == 'set') {
        CurrentFocus = 'SelectMovieByYear';
        // @ts-ignore
        MoviesByYearListChildren[0].style.border = StyleFocusMovies;
    } else if (Direction == 'right') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
        if (MoviesByYearListChildren[positionFocus+1] === undefined) {
            return;
            }else{
                // @ts-ignore
                MoviesByYearListChildren[positionFocus].style.border= '';
                // @ts-ignore
                MoviesByYearListChildren[positionFocus+1].style.border= StyleFocusMovies;
            }
    } else if (Direction == 'left') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
        if (positionFocus%4 == 0) {
            y=0;
            CurrentFocus = 'SelectYear';
            // @ts-ignore
            MoviesByYearListChildren[positionFocus].style.border = '';
            }else{
                // @ts-ignore
                MoviesByYearListChildren[positionFocus].style.border = '';
                // @ts-ignore
                MoviesByYearListChildren[positionFocus-1].style.border = StyleFocusMovies;
            }
    } else if (Direction == 'down') {
        if (MoviesByYearLenght <= 4) {
            return;
        }else{
            var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
            if (MoviesByYearListChildren[positionFocus+4] === undefined) {
                YearFilter                      = document.getElementById('yearfilter'),
                // @ts-ignore
                YearFilterNodes                 = YearFilter.childNodes,
                // @ts-ignore
                YearFilterChildren              = YearFilter.children;
                var positionYear = getPositionFocusInMenuFilter(StyleFocusMenuYearFilter, YearFilterChildren);
                var movies       = getMoviesByYear(positionYear);
                var rows = Math.ceil(movies.length/4);
                var matrix = getMatrix(rows, movies.length, 4);
                y = y+2;
                var row = matrix[y];
                if (row === undefined ) {
                    y= rows;
                }else{
                    scrollRefresh(y, 'MoviesByYearList', movies);
                    MoviesByYearList           = document.getElementById('MoviesByYearList');
                    // @ts-ignore
                    MoviesByYearListChildren   = MoviesByYearList.children;
                    if (MoviesByYearListChildren[positionFocus] === undefined) {
                        // @ts-ignore
                        MoviesByYearListChildren[0].style.border=StyleFocusMovies;
                    } else{
                        // @ts-ignore
                        MoviesByYearListChildren[positionFocus].style.border=StyleFocusMovies;
                    }
                }

            }else{
                // @ts-ignore
                MoviesByYearListChildren[positionFocus].style.border = '';
                // @ts-ignore
                MoviesByYearListChildren[positionFocus+4].style.border = StyleFocusMovies;
            } 
        }
    } else if (Direction == 'up') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
        if (positionFocus<4) {
            YearFilter                      = document.getElementById('yearfilter'),
            // @ts-ignore
            YearFilterNodes                 = YearFilter.childNodes,
            // @ts-ignore
            YearFilterChildren              = YearFilter.children;
            var positionYear = getPositionFocusInMenuFilter(StyleFocusMenuYearFilter, YearFilterChildren);
            var movies       = getMoviesByYear(positionYear);           
            var rows = Math.ceil(movies.length/4);
            var matrix = getMatrix(rows, movies.length, 4);
            y = y-2;
            var row = matrix[y];
            if (row === undefined) {
                y=0;
            }else {
                scrollRefresh(y, 'MoviesByYearList', movies);
                MoviesByYearList           = document.getElementById('MoviesByYearList');
                // @ts-ignore
                MoviesByYearListChildren   = MoviesByYearList.children;
                if (MoviesByYearListChildren[positionFocus] === undefined) {
                    // @ts-ignore
                    MoviesByYearListChildren[0].style.border=StyleFocusMovies;
                } else{
                    // @ts-ignore
                    MoviesByYearListChildren[positionFocus+4].style.border=StyleFocusMovies;
                }
            }
    

        }else{
            // @ts-ignore
            MoviesByYearListChildren[positionFocus].style.border = '';
            // @ts-ignore
            MoviesByYearListChildren[positionFocus-4].style.border = StyleFocusMovies;
}
    }
}
function SetFocusOnMenuLanguage(Direction){
    MenuLanguagePanel                 = document.getElementById('MenuLanguagePanel'),
    // @ts-ignore
    MenuLanguageNodes                 = MenuLanguagePanel.childNodes,
    // @ts-ignore
    MenuLanguageChildren              = MenuLanguagePanel.children;
    if (Direction == 'set') {
        CurrentFocus = 'SelectLanguage';
        // @ts-ignore
        MenuLanguageChildren[0].style.border = StyleFocusMenuLanguage;
        // @ts-ignore
        MenuLanguagePanel.style.visibility = 'visible';
    } else if (Direction == 'right') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMenuLanguage, MenuLanguageChildren);
        
        if (positionFocus+1 >= MenuLanguageChildren.length) {
            // @ts-ignore
            MenuLanguageChildren[positionFocus].style.border = '';
            // @ts-ignore
            MenuLanguageChildren[0].style.border = StyleFocusMenuLanguage;
        }else{
            // @ts-ignore
            MenuLanguageChildren[positionFocus].style.border = '';
            // @ts-ignore
            MenuLanguageChildren[positionFocus+1].style.border = StyleFocusMenuLanguage;
        }
    } else if (Direction == 'left') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMenuLanguage, MenuLanguageChildren);
        if (positionFocus == 0) {
            // @ts-ignore
            MenuLanguageChildren[positionFocus].style.border = '';
            // @ts-ignore
            MenuLanguageChildren[(MenuLanguageChildren.length)-1].style.border = StyleFocusMenuLanguage;
        }else{
            // @ts-ignore
            MenuLanguageChildren[positionFocus].style.border = '';
            // @ts-ignore
            MenuLanguageChildren[positionFocus-1].style.border = StyleFocusMenuLanguage;
        } 
    } else if (Direction == 'down'){
        var positionFocus = getPositionFocusInMovies(StyleFocusMenuLanguage, MenuLanguageChildren);
        // @ts-ignore
        MenuLanguageChildren[positionFocus].style.border = '';
        // @ts-ignore
        MenuLanguagePanel.style.visibility = 'hidden';
        CurrentFocus = 'HiddenMode';
    } else if (Direction == 'ok'){
        var positionFocus = getPositionFocusInMovies(StyleFocusMenuLanguage, MenuLanguageChildren);
        
        // @ts-ignore
        if (numberOfLanguages == 0) {
            return;
        }else{
            // @ts-ignore
            changeLanguage(positionFocus);
        }
    }
}
/*******************************************************************************
 * Funciones para acceder a un menu
 *******************************************************************************/
function SelectPlayOption(){
    //Controla las acciones del panel de detalles de pelicula
    var position = getPositionFocusInPanelMovie(StyleFocusPanelMovie, MoviePanelChildren);
    switch (position) {
        case 11:
            //Reproducir Pelicula
            PlayingMovie();
            break;
        case 12:
            //Salir
            ExitMoviePanel();
            // @ts-ignore
            MoviePanelChildren[12].style.backgroundColor = '';
            break;
    }
}
/*******************************************************************************
 * Funciones para rellenar paneles
 *******************************************************************************/
function ExitMoviePanel(){
        //Funcion que oculta el panel de detalles de la pelicula 
        if (IsMenuFilterSelected == true) {
            //Si la pelicula se abrio desde los menus de filtros 
            // @ts-ignore
            PanelYearFilter.style.visibility= 'visible';
            // @ts-ignore
            MenuFilters.style.visibility = "visible";
            // @ts-ignore
            MoviePanel.style.visibility = 'hidden'; 
            // @ts-ignore
            BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/BGMovies.PNG')";
            CurrentFocus = 'SelectMovieByYear';
        } else {
            //Si se abrio desde la pagina principal
            RecommendedMoviesList         = document.getElementById('RecommendedMoviesList'),
            // @ts-ignore
            RecommendedMoviesListChildren = RecommendedMoviesList.children;
            var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);
            if (position == -1) {
                CurrentFocus = 'AllMovies';
            }else{
                CurrentFocus = 'RecommendedMovies';
            }
            // @ts-ignore
            ListPanel.style.visibility = 'visible';
            // @ts-ignore
            PanelRight.style.visibility = 'visible';
            // @ts-ignore
            MoviePanel.style.visibility = 'hidden';
            // @ts-ignore
            BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/BGMovies.PNG')";
        }
            // //Si se abrio desde la pagina principal
            // RecommendedMoviesList         = document.getElementById('RecommendedMoviesList'),
            // RecommendedMoviesListChildren = RecommendedMoviesList.children;
            // var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);
            // if (position == -1) {
            //     CurrentFocus = 'AllMovies';
            // }else{
            //     CurrentFocus = 'RecommendedMovies';
            // }
            // ListPanel.style.visibility = 'visible';
            // PanelRight.style.visibility = 'visible';
            // MoviePanel.style.visibility = 'hidden';
            // BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/2542.jpg')";
}
function PlayingMovie(){
    CurrentFocus = 'Playing';
    // @ts-ignore
    PlayMovie(Libraries['MoviesSource'] + MoviesList[CurrentMovieID].FLDR + MoviesList[CurrentMovieID].FILE);
    // @ts-ignore
    PlayingVod = true;
    ClearMoviePanel();
    ShowPlayingPanel();
    // SetFocusPlaying('right');
    // @ts-ignore
    BackgroundPanel.style.visibility = 'hidden';
    // @ts-ignore
    PlayingOptionsChildren[2].style.border = StyleFocusPlayingMovie;
    setTimeout(refreshLanguages, 15000);
}
function HideOnforward (){
    // @ts-ignore
    Onforward.style.visibility='hidden';
}
function HideOnBackward (){
       // @ts-ignore
       OnBackward.style.visibility='hidden';
}
function HideOnPause (){
       // @ts-ignore
       OnPause.style.visibility='hidden';
}
function HideOnPlay (){
       // @ts-ignore
       OnPlay.style.visibility='hidden';
}
function FiltersList(){
    //Funcion que hace la carga inicial al abror el menu de filtros
    //Ocultando y abriendo paneles necesarios
    IsMenuFilterSelected = true;
    // @ts-ignore
    ListPanel.style.visibility = 'hidden';
    // @ts-ignore
    PanelRight.style.visibility= 'hidden';
    // PanelRight.style.visibility = 'hidden';
    CurrentFocus = "FilterMovies";
    // @ts-ignore
    MenuFilters.style.visibility = "visible";
    //Seleccionando filtro por años por default
    // @ts-ignore
    FilterMovieCategoryListChildren[0].style.backgroundColor = StyleFocusMenuFilter;
    LoadFilterByYearPanel();
}
function LoadFilterByYearPanel (){
    //Funcion que rellena el menu de filtros segun la cantidad de años que tenga la lista sacada de la base de datos
    // @ts-ignore
    PanelYearFilter.style.visibility= 'visible';
    var  element     = document.getElementById('yearfilter'),
         // @ts-ignore
         aux         = element.children;
    if (aux.length == 0 ) {
        for (var x = 0; x < FiltersByYear.length; x++) {
            // @ts-ignore
            div = document.createElement('div');
            // @ts-ignore
            div.innerHTML = FiltersByYear[x];
            // @ts-ignore
            div.className = 'yearOpts';
            // @ts-ignore
            document.getElementById('yearfilter').appendChild(div);
        }
    }else{
        // @ts-ignore
        while (element.firstChild){
            // @ts-ignore
            element.removeChild(element.firstChild);
          };
          for (var x = 0; x < FiltersByYear.length; x++) {
            // @ts-ignore
            div = document.createElement('div');
            // @ts-ignore
            div.innerHTML = FiltersByYear[x];
            // @ts-ignore
            div.className = 'yearOpts';
            // @ts-ignore
            document.getElementById('yearfilter').appendChild(div);
        }
    }

}
function setFilterMovies(){
    //Funcion que actualiza los paneles de peliculas segun la opcion de filtro sobre la que este seleccionado el focus
    var position = getPositionFocusInMenuFilter(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
    switch (position) {
        case 0:
            clearAllPanel();
            LoadFilterByYearPanel();
            break;
        case 1:
            // clearAllPanel();
            // LoadFilterByGenderPanel();
            break;
        case 2:
            clearAllPanel();
            // @ts-ignore
            PanelRight.style.visibility = 'visible';
            break;
    }
}
function clearAllPanel(){
    //Limpia paneles
    // @ts-ignore
    PanelRight.style.visibility = 'hidden';
    // @ts-ignore
    PanelYearFilter.style.visibility = 'hidden';
    // @ts-ignore
    PanelGenderFilter.style.visibility = 'hidden';
}
function getMoviesByYear(position){
    //Regresa las peliculas segun el año, se le pasa como argumento la posicion que tiene el menu de año
    var moviesByYear = [];
    for (var x = 0; x < MoviesList.length; x++) {
        if (MoviesList[x].YEAR == FiltersByYear[position]) {
            moviesByYear.push(MoviesList[x]);
        }
    }
    return moviesByYear;
}

