/* @Creado por: Tania Maldonado
 * @Fecha: Julio 2020
 * @Tipo: Funciones para controlar el layout de peliculas
 */
    //Variables Panel peliculas recomendadas
    var RecommendedMoviesList             = document.getElementById('RecommendedMoviesList'),
        RecommendedMoviesListNodes        = RecommendedMoviesList.childNodes,
        RecommendedMoviesListChildren     = RecommendedMoviesList.children;
    //Variables Panel peliculas recomendadas
    var AllMoviesList                     = document.getElementById('AllMoviesList'),
        AllMoviesListNodes                = AllMoviesList.childNodes,
        AllMoviesListChildren             = AllMoviesList.children,
        PanelRight                        = document.getElementById('PanelRight');
        //Variables Panel pelicula seleccionada
    var MoviePanel                        = document.getElementById('MoviePanel'),
        MoviePanelNodes                   = MoviePanel.childNodes,
        MoviePanelChildren                = MoviePanel.children;
    //Variables estilos
    var StyleFocusMovies                  = '3px solid rgb(255, 255, 255)',
        StyleFocusPanelMovie              = '3px solid rgb(0, 128, 255)',
        StyleFocusPlayingMovie            = '3px solid rgb(255, 255, 255)',
        StyleFocusMenuHeader              = '3px solid rgb(255, 255, 255)',
        StyleFocusMenuFilter              = '3px solid rgb(255, 255, 255)',
        StyleFocusMenuYearFilter          = '3px solid rgb(255, 255, 255)',
        StyleFocusMenuLanguage            = '3px solid rgb(255, 255, 255)';
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
        MenuHeaderNodes                   = MenuHeader.childNodes,
        MenuHeaderChildren                = MenuHeader.children;
        //Variebles Lista de filtros
    var FilterMovieCategoryList           = document.getElementById('filterMovieCategory'),
        PanelMenuFilters                  = document.getElementById('MenuFilters'),
        FilterMovieCategoryListNodes      = FilterMovieCategoryList.childNodes,
        FilterMovieCategoryListChildren   = FilterMovieCategoryList.children;
        //Variebles Panel filtro por año
    var PanelYearFilter                   = document.getElementById('PanelYearFilter'),
        YearFilter                        = document.getElementById('yearfilter'),
        YearFilterNodes                   = YearFilter.childNodes,
        YearFilterChildren                = YearFilter.children,
        MoviesByYearList                  = document.getElementById('MoviesByYearList'),
        MoviesByYearListNodes             = MoviesByYearList.childNodes,
        MoviesByYearListChildren          = MoviesByYearList.children;  
    //Variebles Panel filtro por genero
    var PanelGenderFilter                 = document.getElementById('PanelGenderFilter'),
        GenderFilter                      = document.getElementById('GenderFilter'),
        GenderFIlterNodes                 = GenderFilter.childNodes,
        GenderFilterChildren              = GenderFilter.children,
        PanelMoviesGenderFilter           = document.getElementById('MoviesByGenderList'),
        PanelMoviesGenderFilterNodes      = PanelMoviesGenderFilter.childNodes,
        PanelMoviesGenderFilterChildren   = PanelMoviesGenderFilter.children;
    //Variables menu para seleccionar idioma
    var MenuLanguagePanel                 = document.getElementById('MenuLanguagePanel'),
        MenuLanguageNodes                 = MenuLanguagePanel.childNodes,
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


var MenuOptionsNodes        = document.getElementById('MenuOptions').childNodes;
    //MenuNodesArray          = [1,3,5,7],
    MenuNodesArray          = [1],
    MenuFocus               = -1;


var CurrentFocus            = '';


var MoviesList              = [];


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
    MoviePanelNodes         = MoviePanel.childNodes;

var MoviePanelPlay          = document.getElementById('PlayPanel'),
    MoviePanelExit          = document.getElementById('ExitPanel'),
    MoviePanelFocus         = 'Play';
    

var PlayingPanel            = document.getElementById('PlayingPanel'),
    PlayingOptions          = document.getElementById('PlayingOptions'),
    PlayingOptionsChildren  = PlayingOptions.children,
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
$.ajax({
    type: 'POST',
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
        Option : 'GetYearsList'
    },
    success: function (response){
        FiltersByYear = $.parseJSON(response);
    }
}); 

$.ajax({
    type: 'POST',
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
        Option : 'GetGendersList'
    },
    success: function (response){
        FiltersByGender = $.parseJSON(response);
    }
}); 
}
/*******************************************************************************
* Navegacion header
*******************************************************************************/
function SetFocusHeader(Direction){
    if (Direction == 'set') {
        MenuHeaderChildren[0].style.border = StyleFocusMenuHeader;
    } else if (Direction == 'down') {
        MenuHeader = document.getElementById('MenuOptions');
        MenuHeaderChildren = MenuHeader.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuHeader, MenuHeaderChildren);
        if (positionFocus+1 >= MenuHeaderChildren.length) {
            MenuHeaderChildren[positionFocus].style.border = '';
            MenuHeaderChildren[0].style.border = StyleFocusMenuHeader;
        }else{
            MenuHeaderChildren[positionFocus].style.border = '';
            MenuHeaderChildren[positionFocus+1].style.border = StyleFocusMenuHeader;
        }
    } else if (Direction == 'up') {
        MenuHeader = document.getElementById('MenuOptions');
        MenuHeaderChildren = MenuHeader.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuHeader, MenuHeaderChildren);
        if (positionFocus == 0) {
            MenuHeaderChildren[positionFocus].style.border = '';
            MenuHeaderChildren[(MenuHeaderChildren.length)-1].style.border = StyleFocusMenuHeader;
        }else{
            MenuHeaderChildren[positionFocus].style.border = '';
            MenuHeaderChildren[positionFocus-1].style.border = StyleFocusMenuHeader;
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

for(IndexC = 0; IndexC < MenuNodesArray.length; IndexC++){
    MenuOptionsNodes[MenuNodesArray[IndexC]].classList.remove('OptionFocus');
}
}

function SelectMenuOption(){
    var position = getPositionFocusInMenu(StyleFocusMenuHeader, MenuHeaderChildren);
    switch (position) {
        case 0:
            //Filtros
            FiltersList();
            break;
        case 1:
            //Salir al menu principal
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
$.ajax({
    type: 'POST',
    async: false,
    url: 'Core/Controllers/VideoOnDemand.php',
    data: { 
        Option : 'GetMoviesList'
    },
    success: function (response){
        MoviesList = $.parseJSON(response);
    }
}); 
}

function SetMoviesList(){
    StopVideo();
    refreshMoviesPrincipalList(MoviesList, 'RecommendedMoviesList');
    refreshMoviesPrincipalList(MoviesList, 'AllMoviesList');
    BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/black.png')";
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
    
    MovieBox = PanelRightNodes[PanelRightNodesArray[MovieRowFocus]].childNodes[MovieFocus];
} 

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
            PanelYearFilter.style.visibility= 'hidden';
            PanelMenuFilters.style.visibility = 'hidden';
            var moviesArrayElement    = document.getElementById(moviesContainer);
            var movieSelectedPosition = getPositionFocusInMovies(StyleFocusMovies, moviesArrayElement.children);
            var moviesArray           = moviesArrayElement.children;
            var movieTagP             = moviesArray[movieSelectedPosition].getElementsByTagName('p');
            var movieName             = movieTagP[0].innerHTML;
            var buttonPlay            = document.getElementById('PlayPanel'); 
                buttonPlay.style.border = StyleFocusPanelMovie;
            CurrentFocus = 'MoviePanel';
            ListPanel.style.visibility = 'hidden';
            MoviePanel.style.visibility = 'visible';
            PanelRight.style.visibility = 'hidden';
            var Movie = [];
            for (var x = 0; x < MoviesList.length; x++) {      
                if (MoviesList[x].TTLE == movieName) {
                    Movie.push(MoviesList[x]);
                    CurrentMovieID = x;
                }
            }
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
            BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + Movie[0].FLDR + 'preview.png' + "')";
            PlayingVod = false;
        } else {
            var moviesArrayElement    = document.getElementById(moviesContainer);
            var movieSelectedPosition = getPositionFocusInMovies(StyleFocusMovies, moviesArrayElement.children);
            var moviesArray           = moviesArrayElement.children;
            var movieTagP             = moviesArray[movieSelectedPosition].getElementsByTagName('p');
            var movieName             = movieTagP[0].innerHTML;
            var buttonPlay            = document.getElementById('PlayPanel'); 
                buttonPlay.style.border = StyleFocusPanelMovie;
            CurrentFocus = 'MoviePanel';
            ListPanel.style.visibility = 'hidden';
            MoviePanel.style.visibility = 'visible';
            PanelRight.style.visibility = 'hidden';
            var Movie = [];
            for (var x = 0; x < MoviesList.length; x++) {      
                if (MoviesList[x].TTLE == movieName) {
                    Movie.push(MoviesList[x]);
                    CurrentMovieID = x;
                }
            }
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
            BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + Movie[0].FLDR + 'preview.png' + "')";
            PlayingVod = false;
        }

    } else if (movieOnPlay != undefined) {
        //Carga normalmente los datos de la pelicula
        if(MenuFilters.style.visibility == "visible"){
            MenuFilters.style.visibility = "hidden"; 
        }
        // var moviesArrayElement    = document.getElementById(moviesContainer);
        // var movieSelectedPosition = getPositionFocusInMovies(StyleFocusMovies, moviesArrayElement.children);
        // var moviesArray           = moviesArrayElement.children;
        // var movieTagP             = moviesArray[movieSelectedPosition].getElementsByTagName('p');
        var movieName                = movieOnPlay;
        var buttonPlay               = document.getElementById('PlayPanel'); 
            buttonPlay.style.border  = StyleFocusPanelMovie;
        CurrentFocus = 'MoviePanel';
        ListPanel.style.visibility   = 'hidden';
        MoviePanel.style.visibility  = 'visible';
        PanelRight.style.visibility  = 'hidden';
        var Movie = [];
        for (var x = 0; x < MoviesList.length; x++) {      
            if (MoviesList[x].TTLE == movieName) {
                Movie.push(MoviesList[x]);
            }
        }
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
        BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + Movie[0].FLDR + 'preview.png' + "')";
        PlayingVod = false;
    }
}

function ClearMoviePanel(){
MoviePanel.style.visibility = 'hidden';

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
    MoviePanelPlay.classList.add('MovieOption');
    MoviePanelExit.classList.remove('MovieOption');
    MoviePanelFocus = 'Exit';
} else {
    MoviePanelPlay.classList.remove('MovieOption');
    MoviePanelExit.classList.add('MovieOption');
    MoviePanelFocus = 'Play';
}
}

function ClearFocusMovieList(){
PanelRightNodes[PanelRightNodesArray[MovieRowFocus]].childNodes[MovieFocus].style.border = '3px solid transparent';
MovieFocus--;
}

function ExecOptionMoviePanel(){
if(MoviePanelFocus === 'Play'){
    ListPanel.style.visibility  = 'visible';
    MoviePanel.style.visibility = 'hidden';
    
    CurrentFocus = 'Movies';
    
    BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/black.png')";
} else {
    CurrentFocus = 'Playing';
    
    PlayVideo(Libraries['MoviesSource'] + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].FILE);
    
    PlayingVod = true;
    
    ClearMoviePanel();
    
    ShowPlayingPanel();
    
    SetFocusPlaying('right');
    
    BackgroundPanel.style.visibility = 'hidden';
}
}

/*******************************************************************************
* 
*******************************************************************************/

function ShowPlayingPanel(){
    PlayingPanel.style.visibility = 'visible';
    PlayingOptionsChildren[2].style.border = StyleFocusPlayingMovie;
// PlayinPanelActive = true;

// if(OptionText !== 'pause'){
//     clearTimeout(PlayingPanelTimer);
    
//     /* Contador para ocultar contenedor principal con la informacion*/
//     PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
// } else {
//     clearTimeout(PlayingPanelTimer);
// }

PlayingTitle.textContent = MoviesList[CurrentMovieID].TTLE;
   
UpdateBarStatus();

clearTimeout(BarUpdate);

BarUpdate = setInterval(UpdateBarStatus,1000);

//SetFocusPlaying('right');
}
function HidePlayingPanel(){
if(PlayinPanelActive === true){
    PlayingPanel.style.visibility = 'hidden';

    PlayinPanelActive = false;

    clearTimeout(PlayingPanelTimer);

    clearTimeout(BarUpdate);
    
    ExitPlaying.classList.remove('ButtonFocus');
}
}
function SetFocusPlaying(Direction){
    PlayingOptions                  = document.getElementById('PlayingOptions'),
    PlayingOptionsNodes             = PlayingOptions.childNodes,
    PlayingOptionsChildren          = PlayingOptions.children;
    if (Direction == 'right') {
        var positionFocus = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
        if (positionFocus+1 >= PlayingOptionsChildren.length) {
             PlayingOptionsChildren[positionFocus].style.border = '';
             PlayingOptionsChildren[0].style.border = StyleFocusPlayingMovie;
        }else{
            PlayingOptionsChildren[positionFocus].style.border = '';
            PlayingOptionsChildren[positionFocus+1].style.border = StyleFocusPlayingMovie;
        }
    } else if (Direction == 'left') {
        var positionFocus = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
        if (positionFocus == 0) {
            PlayingOptionsChildren[positionFocus].style.border = '';
            PlayingOptionsChildren[(PlayingOptionsChildren.length)-1].style.border = StyleFocusPlayingMovie;
        }else{
            PlayingOptionsChildren[positionFocus].style.border = '';
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
            SetSpeed('play');
            Debug('VodOk---> SelectPlayingOption SetSpeed play');  
            break;
        case 3:
            //Pausa
            SetSpeed('pause');
            Debug('VodOk---> SelectPlayingOption SetSpeed pause');  
            break;
        case 4:
            SetSpeed('forward');
            Debug('VodOk---> SelectPlayingOption SetSpeed forward');  
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
 
ExitPlaying.classList.add('ButtonFocus');

PlayingFocus++;

CurrentFocus = 'StopPlaying';

clearTimeout(PlayingPanelTimer);

PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
}
function UnsetFocusClose(){
ExitPlaying.classList.remove('ButtonFocus');

SetFocusPlaying('left');

CurrentFocus = 'Playing';
}
/*******************************************************************************
* Opciones reproduccion
*******************************************************************************/
function SetSpeed(Option){
Debug('VodOk---> SetSpeed: '+Option);
if(Option === 'forward'){
    Debug('VodOk---> UpdatePosition: add');
    UpdatePosition('add');
} else if(Option === 'backward'){
    UpdatePosition('subtract');
} else if(Option === 'pause'){
    PauseVideo();
} else if(Option === 'play'){
    Debug('VodOk---> entro al reproductor: ');
    ResumeVideo();
}

OptionText = Option;
}

function UpdateBarStatus(){
Debug('UpdateBarStatus-> '+MoviesList[CurrentMovieID].MNTS);
AssetStatus(MoviesList[CurrentMovieID].MNTS);

BarPosition.style.width = PercentagePosition +'%';
InfoPosition.textContent = SecondsToTime(PositionAsset) + ' / '+MoviesList[CurrentMovieID].DRTN;
PlayingSpeed.textContent = SpeedText;

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
    BackgroundPanel.style.visibility='visible';
    HidePlayingPanel();
    StopVideo();
    clearInterval(BarUpdate);
    LoadMoviePanel(undefined, MoviesList[CurrentMovieID].TTLE);
    CurrentFocus = 'MoviePanel';
    CurrentMovie = MoviesList[CurrentMovieID].TTLE;
    SetMoviesStatistics();
    PlayingVod = false;
    var position = getPositionFocusInMenu(StyleFocusPlayingMovie, PlayingOptionsChildren);
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
        var  parent      = element.parentNode;
                parent.removeChild(element);
        var  div = document.createElement('div');
            div.setAttribute('id', panel);
            if (panel == 'MoviesByYearList') {
                div.setAttribute('class', 'MoviesByYearRow')
            }
            parent.appendChild(div);
        var rows = Math.ceil(moviesList.length/4);
        var matrix = getMatrix(rows,moviesList.length, 4);
        for (var Y = 0; Y < 2; Y++) {
            for (var X = 0; X < 4; X++) {
                var peliculaID = matrix[Y][X];
                if (peliculaID == -1) {
                    return;
                }else{
                    BoxDiv               = document.createElement('div');
                    BoxDiv.className     = 'RowMovieByYearPoster';
                    BoxPoster            = document.createElement('img');
                    BoxTitle             = document.createElement('p');
                    BoxTitle.style.visibility = 'hidden';
                    BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                    BoxTitle.textContent = moviesList[peliculaID].TTLE;
                    BoxDiv.appendChild(BoxPoster);
                    BoxDiv.appendChild(BoxTitle);
                    document.getElementById(panel).appendChild(BoxDiv);
                }
            }
        }
    }else{
        var element = document.getElementById(panel);
        var parent  = element.parentNode;
            parent.removeChild(element);
        var div = document.createElement('div');
            div.setAttribute('id', panel);
            if (panel == 'RecommendedMoviesList') {
                div.setAttribute('class', 'RecommendedMoviesRow');
            } else if (panel == 'AllMoviesList'){
                div.setAttribute('class', 'MoviesRow');
            }
            parent.appendChild(div);
        var rows   = Math.ceil(moviesList.length/4);
        var matrix = getMatrix(rows, moviesList.length, 4);
                for (var x = 0; x < 4; x++) {
                        var peliculaID  = matrix[0][x];
                        if (peliculaID == -1) {
                            return;
                        }else{
                                BoxDiv               = document.createElement('div');
                                BoxDiv.className     = 'RowPoster';
                                BoxPoster            = document.createElement('img');
                                BoxTitle             = document.createElement('p');
                                BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                                BoxTitle.textContent = moviesList[peliculaID].TTLE;
                                BoxTitle.style.visibility = 'hidden';
                                BoxDiv.appendChild(BoxPoster);
                                BoxDiv.appendChild(BoxTitle);
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
        var  parent      = element.parentNode;
             parent.removeChild(element);
        var  div = document.createElement('div');
             div.setAttribute('id', panel);
             if (panel == 'MoviesByYearList') {
                div.setAttribute('class', 'MoviesByYearRow')
            }
            parent.appendChild(div);
            var rows = Math.ceil(moviesList.length/4);
            var matrix = getMatrix(rows,moviesList.length, 4); 
        for (Y = row; Y < row+2; Y++) {
            for (var X = 0; X < 4; X++) {
                var peliculaID  = matrix[Y][X];
                if (peliculaID == -1) {
                    return;
                }else{
                    BoxDiv               = document.createElement('div');
                    BoxDiv.className     = 'RowMovieByYearPoster';
                    BoxPoster            = document.createElement('img');
                    BoxTitle             = document.createElement('p');
                    BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                    BoxTitle.textContent = moviesList[peliculaID].TTLE;
                    BoxTitle.style.visibility = 'hidden';
                    BoxDiv.appendChild(BoxPoster);
                    BoxDiv.appendChild(BoxTitle);
                    document.getElementById(panel).appendChild(BoxDiv);
                }
        } 
        }
 
    }else{
                    //Eliminando peliculas del panel
                    var  element    = document.getElementById(panel);
                    var  parent      = element.parentNode;
                         parent.removeChild(element);
                    var  div = document.createElement('div');
                         div.setAttribute('id', panel);
                         if (panel == 'RecommendedMoviesList') {
                            div.setAttribute('class', 'RecommendedMoviesRow')
                         }else if (panel == 'AllMoviesList') {
                            div.setAttribute('class', 'MoviesRow')
                         }
                         parent.appendChild(div);
                    for (var x = 0; x < 4; x++) {
                        var peliculaID  = row[x];
                        if (peliculaID == -1) {
                            return;
                        }else{
                            BoxDiv               = document.createElement('div');
                            BoxDiv.className     = 'RowPoster';
                            BoxPoster            = document.createElement('img');
                            BoxTitle             = document.createElement('p');
                            BoxPoster.src        = getimageMovie(moviesList[peliculaID]);
                            BoxTitle.textContent = moviesList[peliculaID].TTLE;
                            BoxTitle.style.visibility = 'hidden';
                            BoxDiv.appendChild(BoxPoster);
                            BoxDiv.appendChild(BoxTitle);
                            document.getElementById(panel).appendChild(BoxDiv);
                        }
        
                }    
    } 
}
function getPositionFocusInPanelMovie(style, panelNodes){
    //Esta funcion recupera la posicion del boton en el panel de peliculas que tiene el focus dentro de su padre
   var position = -1;
   for (var x = 0; x < panelNodes.length; x++) {
       if (panelNodes[x].style.border == style) {
       position=x;
   } 
   }
   return position;
}
function getPositionFocusInMenu(style, panelNodes){
    //Esta funcion recupera la posicion de un menu que tiene el focus dentro de su padre
   var position = -1;
   for (var x = 0; x < panelNodes.length; x++) {
       if (panelNodes[x].style.border == style) {
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
        for (var x = 0; x < numberOfLanguages; x++) {
            LanDiv              = document.createElement('div');
            LanDiv.className    = 'LanguageContainer';
            LanDiv.textContent  = PIDS[x];
            MenuLanguagePanel.appendChild(LanDiv);
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
    RecommendedMoviesListNodes      = RecommendedMoviesList.childNodes,
    RecommendedMoviesListChildren   = RecommendedMoviesList.children;
    if (Direction == 'set') {
        CurrentFocus = 'RecommendedMovies';
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
                y= rows;
            }else{
                scrollRefresh(row, 'RecommendedMoviesList', MoviesList);
                RecommendedMoviesList           = document.getElementById('RecommendedMoviesList');
                RecommendedMoviesListChildren   = RecommendedMoviesList.children;
                if (RecommendedMoviesListChildren[position] === undefined) {
                    RecommendedMoviesListChildren[0].style.border=StyleFocusMovies;
                } else{
                    RecommendedMoviesListChildren[0].style.border=StyleFocusMovies;
                }
            }
            }else{
            RecommendedMoviesListChildren[position].style.border='';
            RecommendedMoviesListChildren[position+1].style.border=StyleFocusMovies;
            }
    } else if (Direction == 'left') {
        var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
        if (position-1 == -1 && y == 0) {
            CurrentFocus = 'Menu';
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
                RecommendedMoviesListChildren   = RecommendedMoviesList.children;
                if (RecommendedMoviesListChildren[position] === undefined) {
                    RecommendedMoviesListChildren[0].style.border=StyleFocusMovies;
                } else{
                    RecommendedMoviesListChildren[3].style.border=StyleFocusMovies;
                }
            }
        }else{
            RecommendedMoviesListChildren[position].style.border='';
            RecommendedMoviesListChildren[position-1].style.border=StyleFocusMovies;
        }
    } else if (Direction == 'down') {
        CurrentFocus = 'AllMovies';
        y=0;
        var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);  
            AllMoviesList                   = document.getElementById('AllMoviesList'),
            AllMoviesListNodes              = AllMoviesList.childNodes,
            AllMoviesListChildren           = AllMoviesList.children;
            RecommendedMoviesListChildren[position].style.border='';
            AllMoviesListChildren[0].style.border= StyleFocusMovies;
            var rows = Math.ceil(MoviesList.length/4);
            var matrix = getMatrix(rows,MoviesList.length, 4);
            var row = matrix[y];
            scrollRefresh(row, 'RecommendedMoviesList', MoviesList);
    }
}
function SetFocusOnMoviePanel(Direction){
    MoviePanel                      = document.getElementById('MoviePanel'),
    MoviePanelNodes                 = MoviePanel.childNodes,
    MoviePanelChildren              = MoviePanel.children;
   if (Direction == 'right') {
       var position = getPositionFocusInPanelMovie(StyleFocusPanelMovie, MoviePanelChildren);
       if (position == 12) {
           MoviePanelChildren[position].style.border = '';
           MoviePanelChildren[position-1].style.border = StyleFocusPanelMovie;
       }else{
           MoviePanelChildren[position].style.border = '';
           MoviePanelChildren[position+1].style.border = StyleFocusPanelMovie;
       }
   }else if (Direction == 'left') {
       var position = getPositionFocusInPanelMovie(StyleFocusPanelMovie, MoviePanelChildren);
       if (position == 11) {
           MoviePanelChildren[position].style.border = '';
           MoviePanelChildren[position+1].style.border = StyleFocusPanelMovie;
       }else{
           MoviePanelChildren[position].style.border = '';
           MoviePanelChildren[position-1].style.border = StyleFocusPanelMovie;
       }
   }
}
function SetFocusOnHiddenMode(Direction){
    if(Direction == 'set'){
        CurrentFocus = 'HiddenMode';
        PlayingPanel.style.visibility = 'hidden';
    } else if(Direction == 'right'){
         SetSpeed('forward');
        Onforward.style.visibility= 'visible';
        setTimeout(HideOnforward, 3000);
    } else if (Direction == 'left') {
         SetSpeed('backward');
        OnBackward.style.visibility= 'visible';
        setTimeout(HideOnBackward, 3000);
    } else if (Direction == 'down') {
        PlayingPanel.style.visibility = 'visible';
        CurrentFocus = 'Playing';
    } else if (Direction == 'ok') {
        if (IsOnPlay == true) {
            IsOnPlay = false;
            OnPause.style.visibility= 'visible';
             SetSpeed('pause');
        }else{
            IsOnPlay = true;  
            OnPause.style.visibility= 'hidden';
            OnPlay.style.visibility= 'visible';
             SetSpeed('play');
            setTimeout(HideOnPlay, 3000);
        }
    }
}
function SetFocusOnAllMovies(Direction){
    AllMoviesList           = document.getElementById('AllMoviesList');
    AllMoviesListNodes      = AllMoviesList.childNodes,
    AllMoviesListChildren   = AllMoviesList.children;
    if (Direction == 'right') {
        var position = getPositionFocusInMovies(StyleFocusMovies, AllMoviesListChildren);  
        if (position+1 >= AllMoviesListNodes.length) {
            AllMoviesListChildren[position].style.border='';
            SetFocusOnAllMovies('down');
            AllMoviesListChildren[0].style.border=StyleFocusMovies;
            }else{
            AllMoviesListChildren[position].style.border='';
            AllMoviesListChildren[position+1].style.border=StyleFocusMovies;
            }        
    } else if (Direction == 'left') {
        var position = getPositionFocusInMovies(StyleFocusMovies, AllMoviesListChildren);  
        if (position-1 <0) {
            CurrentFocus = 'Menu';
            AllMoviesListChildren[0].style.border= '';
        }else{
            AllMoviesListChildren[position].style.border='';
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
            AllMoviesListChildren   = AllMoviesList.children;
            if (AllMoviesListChildren[position] === undefined) {
                AllMoviesListChildren[0].style.border=StyleFocusMovies;
            } else{
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
            RecommendedMoviesListNodes      = RecommendedMoviesList.childNodes,
            RecommendedMoviesListChildren   = RecommendedMoviesList.children;
            y=0;
            CurrentFocus = 'RecommendedMovies';
            RecommendedMoviesListChildren[0].style.border = StyleFocusMovies;
            AllMoviesListChildren[position].style.border = '';
        }else {
            scrollRefresh(row, 'AllMoviesList', MoviesList);
            AllMoviesList           = document.getElementById('AllMoviesList');
            AllMoviesListChildren   = AllMoviesList.children;
            if (AllMoviesListChildren[position] === undefined) {
                AllMoviesListChildren[0].style.border=StyleFocusMovies;
            } else{
                AllMoviesListChildren[position].style.border=StyleFocusMovies;
            }
        }

    }    
}
function SetFocusOnMenuFilter(Direction){
    if (Direction == 'down') {
        FilterMovieCategoryList = document.getElementById('filterMovieCategory');
        FilterMovieCategoryListChildren = FilterMovieCategoryList.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        if (positionFocus+1 >= FilterMovieCategoryListChildren.length) {
            FilterMovieCategoryListChildren[positionFocus].style.border = '';
            FilterMovieCategoryListChildren[0].style.border = StyleFocusMenuFilter;
        }else{
            FilterMovieCategoryListChildren[positionFocus].style.border = '';
            FilterMovieCategoryListChildren[positionFocus+1].style.border = StyleFocusMenuFilter;
        }
        setFilterMovies(); 
    } else if (Direction == 'up') {
        FilterMovieCategoryList = document.getElementById('filterMovieCategory');
        FilterMovieCategoryListChildren = FilterMovieCategoryList.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        if (positionFocus == 0) {
            FilterMovieCategoryListChildren[positionFocus].style.border = '';
            FilterMovieCategoryListChildren[(FilterMovieCategoryListChildren.length)-1].style.border = StyleFocusMenuFilter;
        }else{
            FilterMovieCategoryListChildren[positionFocus].style.border = '';
            FilterMovieCategoryListChildren[positionFocus-1].style.border = StyleFocusMenuFilter;
        }
        setFilterMovies();  
    } else if (Direction == 'right') {
        var position = getPositionFocusInMenu(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
        switch (position) {
            case 0:
                SetFocusOnMenuByYear('set');
                break;
            case 1:
                // SetFocusOnMenuByGender('set');
                break;
            case 2:
                RecommendedMoviesList           = document.getElementById('RecommendedMoviesList'),
                RecommendedMoviesListChildren   = RecommendedMoviesList.children;
                CurrentFocus= 'RecommendedMovies';
                RecommendedMoviesListChildren[0].style.border = StyleFocusMovies;
                MenuFilters.style.visibility = 'hidden';
                FilterMovieCategoryListChildren[position].style = '';
                ListPanel.style.visibility = 'visible';
                IsMenuFilterSelected = false;
                break;
        }
    }
}
function SetFocusOnMenuByYear(Direction){
    YearFilter                      = document.getElementById('yearfilter'),
    YearFilterNodes                 = YearFilter.childNodes,
    YearFilterChildren              = YearFilter.children;
    if (Direction == 'set') {
        CurrentFocus = 'SelectYear';
        YearFilterChildren[0].style.border = StyleFocusMenuYearFilter;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuYearFilter, YearFilterChildren);
        var movies = getMoviesByYear(positionFocus);
        refreshMoviesPrincipalList(movies, 'MoviesByYearList');
    } else if (Direction == 'down') {
        YearFilter = document.getElementById('yearfilter');
        YearFilterChildren = YearFilter.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuYearFilter, YearFilterChildren);
        if (positionFocus+1 >= YearFilterChildren.length) {
            // YearFilterChildren[positionFocus].style = '';
            // YearFilterChildren[0].style = StyleFocusMenuYearFilter;
            return;
        }else{
            YearFilterChildren[positionFocus].style.border = '';
            YearFilterChildren[positionFocus+1].style.border = StyleFocusMenuYearFilter;
        }
        var movies = getMoviesByYear(positionFocus+1);
        refreshMoviesPrincipalList(movies, 'MoviesByYearList');
    } else if (Direction == 'up') {
        YearFilter = document.getElementById('yearfilter');
        YearFilterChildren = YearFilter.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuYearFilter, YearFilterChildren);
        if (positionFocus == 0) {
            // YearFilterChildren[positionFocus].style = '';
            // YearFilterChildren[(YearFilterChildren.length)-1].style = StyleFocusMenuYearFilter;
            return;
        }else{
            YearFilterChildren[positionFocus].style.border = '';
            YearFilterChildren[positionFocus-1].style.border = StyleFocusMenuYearFilter;
        } 
        var movies = getMoviesByYear(positionFocus-1);
        refreshMoviesPrincipalList(movies, 'MoviesByYearList');
    } else if (Direction == 'right'){
        SetFocusOnMovieByYear('set');
    } else if (Direction == 'left'){
        YearFilter = document.getElementById('yearfilter');
        YearFilterChildren = YearFilter.children;
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuYearFilter, YearFilterChildren);
        YearFilterChildren[positionFocus].style.border = '';
        CurrentFocus = "FilterMovies";
    }
}
function SetFocusOnMovieByYear(Direction){
    MoviesByYearList                = document.getElementById('MoviesByYearList'),
    MoviesByYearListNodes           = MoviesByYearList.childNodes,
    MoviesByYearListChildren        = MoviesByYearList.children;
    var MoviesByYearLenght          = MoviesByYearListChildren.length;  
    if (Direction == 'set') {
        CurrentFocus = 'SelectMovieByYear';
        MoviesByYearListChildren[0].style.border = StyleFocusMovies;
    } else if (Direction == 'right') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
        if (MoviesByYearListChildren[positionFocus+1] === undefined) {
            return;
            }else{
                MoviesByYearListChildren[positionFocus].style.border= '';
                MoviesByYearListChildren[positionFocus+1].style.border= StyleFocusMovies;
            }
    } else if (Direction == 'left') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
        if (positionFocus%4 == 0) {
            y=0;
            CurrentFocus = 'SelectYear';
            MoviesByYearListChildren[positionFocus].style.border = '';
            }else{
                MoviesByYearListChildren[positionFocus].style.border = '';
                MoviesByYearListChildren[positionFocus-1].style.border = StyleFocusMovies;
            }
    } else if (Direction == 'down') {
        if (MoviesByYearLenght <= 4) {
            return;
        }else{
            var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
            if (MoviesByYearListChildren[positionFocus+4] === undefined) {
                YearFilter                      = document.getElementById('yearfilter'),
                YearFilterNodes                 = YearFilter.childNodes,
                YearFilterChildren              = YearFilter.children;
                var positionYear = getPositionFocusInMenu(StyleFocusMenuYearFilter, YearFilterChildren);
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
                    MoviesByYearListChildren   = MoviesByYearList.children;
                    if (MoviesByYearListChildren[positionFocus] === undefined) {
                        MoviesByYearListChildren[0].style.border=StyleFocusMovies;
                    } else{
                        MoviesByYearListChildren[positionFocus].style.border=StyleFocusMovies;
                    }
                }

            }else{
                MoviesByYearListChildren[positionFocus].style.border = '';
                MoviesByYearListChildren[positionFocus+4].style.border = StyleFocusMovies;
            } 
        }
    } else if (Direction == 'up') {
        var positionFocus = getPositionFocusInMovies(StyleFocusMovies, MoviesByYearListChildren);
        if (positionFocus<4) {
            YearFilter                      = document.getElementById('yearfilter'),
            YearFilterNodes                 = YearFilter.childNodes,
            YearFilterChildren              = YearFilter.children;
            var positionYear = getPositionFocusInMenu(StyleFocusMenuYearFilter, YearFilterChildren);
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
                MoviesByYearListChildren   = MoviesByYearList.children;
                if (MoviesByYearListChildren[positionFocus] === undefined) {
                    MoviesByYearListChildren[0].style.border=StyleFocusMovies;
                } else{
                    MoviesByYearListChildren[positionFocus+4].style.border=StyleFocusMovies;
                }
            }
    

        }else{
            MoviesByYearListChildren[positionFocus].style.border = '';
            MoviesByYearListChildren[positionFocus-4].style.border = StyleFocusMovies;
}
    }
}
function SetFocusOnMenuLanguage(Direction){
    MenuLanguagePanel                 = document.getElementById('MenuLanguagePanel'),
    MenuLanguageNodes                 = MenuLanguagePanel.childNodes,
    MenuLanguageChildren              = MenuLanguagePanel.children;
    if (Direction == 'set') {
        CurrentFocus = 'SelectLanguage';
        MenuLanguageChildren[0].style.border = StyleFocusMenuLanguage;
        MenuLanguagePanel.style.visibility = 'visible';
    } else if (Direction == 'right') {
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuLanguage, MenuLanguageChildren);
        if (positionFocus+1 >= MenuLanguageChildren.length) {
            MenuLanguageChildren[positionFocus].style.border = '';
            MenuLanguageChildren[0].style.border = StyleFocusMenuLanguage;
        }else{
            MenuLanguageChildren[positionFocus].style.border = '';
            MenuLanguageChildren[positionFocus+1].style.border = StyleFocusMenuLanguage;
        }
    } else if (Direction == 'left') {
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuLanguage, MenuLanguageChildren);
        if (positionFocus == 0) {
            MenuLanguageChildren[positionFocus].style.border = '';
            MenuLanguageChildren[(MenuLanguageChildren.length)-1].style.border = StyleFocusMenuLanguage;
        }else{
            MenuLanguageChildren[positionFocus].style.border = '';
            MenuLanguageChildren[positionFocus-1].style.border = StyleFocusMenuLanguage;
        } 
    } else if (Direction == 'down'){
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuLanguage, MenuLanguageChildren);
        MenuLanguageChildren[positionFocus].style.border = '';
        MenuLanguagePanel.style.visibility = 'hidden';
        CurrentFocus = 'HiddenMode';
    } else if (Direction == 'ok'){
        var positionFocus = getPositionFocusInMenu(StyleFocusMenuLanguage, MenuLanguageChildren);
        
        if (numberOfLanguages == 0) {
            return;
        }else{
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
            MoviePanelChildren[12].style.border = '';
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
            PanelYearFilter.style.visibility= 'visible';
            MenuFilters.style.visibility = "visible";
            MoviePanel.style.visibility = 'hidden'; 
            BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/black.png')";
            CurrentFocus = 'SelectMovieByYear';
        } else {
            //Si se abrio desde la pagina principal
            RecommendedMoviesList         = document.getElementById('RecommendedMoviesList'),
            RecommendedMoviesListChildren = RecommendedMoviesList.children;
            var position = getPositionFocusInMovies(StyleFocusMovies, RecommendedMoviesListChildren);
            if (position == -1) {
                CurrentFocus = 'AllMovies';
            }else{
                CurrentFocus = 'RecommendedMovies';
            }
            ListPanel.style.visibility = 'visible';
            PanelRight.style.visibility = 'visible';
            MoviePanel.style.visibility = 'hidden';
            BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/black.png')";
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
    PlayVideo(Libraries['MoviesSource'] + MoviesList[CurrentMovieID].FLDR + MoviesList[CurrentMovieID].FILE);
    PlayingVod = true;
    ClearMoviePanel();
    ShowPlayingPanel();
    // SetFocusPlaying('right');
    BackgroundPanel.style.visibility = 'hidden';
    PlayingOptionsChildren[2].style.border = StyleFocusPlayingMovie;
    setTimeout(refreshLanguages, 15000);
}
function HideOnforward (){
    Onforward.style.visibility='hidden';
}
function HideOnBackward (){
       OnBackward.style.visibility='hidden';
}
function HideOnPause (){
       OnPause.style.visibility='hidden';
}
function HideOnPlay (){
       OnPlay.style.visibility='hidden';
}
function FiltersList(){
    //Funcion que hace la carga inicial al abror el menu de filtros
    //Ocultando y abriendo paneles necesarios
    IsMenuFilterSelected = true;
    ListPanel.style.visibility = 'hidden';
    PanelRight.style.visibility= 'hidden';
    // PanelRight.style.visibility = 'hidden';
    CurrentFocus = "FilterMovies";
    MenuFilters.style.visibility = "visible";
    //Seleccionando filtro por años por default
    FilterMovieCategoryListChildren[0].style.border = StyleFocusMenuFilter;
    LoadFilterByYearPanel();
}
function LoadFilterByYearPanel (){
    //Funcion que rellena el menu de filtros segun la cantidad de años que tenga la lista sacada de la base de datos
    PanelYearFilter.style.visibility= 'visible';
    var  element     = document.getElementById('yearfilter'),
         aux         = element.children;
    if (aux.length == 0 ) {
        for (var x = 0; x < FiltersByYear.length; x++) {
            div = document.createElement('div');
            div.innerHTML = FiltersByYear[x];
            div.className = 'yearOpts';
            document.getElementById('yearfilter').appendChild(div);
        }
    }else{
        while (element.firstChild){
            element.removeChild(element.firstChild);
          };
          for (var x = 0; x < FiltersByYear.length; x++) {
            div = document.createElement('div');
            div.innerHTML = FiltersByYear[x];
            div.className = 'yearOpts';
            document.getElementById('yearfilter').appendChild(div);
        }
    }

}
function setFilterMovies(){
    //Funcion que actualiza los paneles de peliculas segun la opcion de filtro sobre la que este seleccionado el focus
    var position = getPositionFocusInMenu(StyleFocusMenuFilter, FilterMovieCategoryListChildren);
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
            PanelRight.style.visibility = 'visible';
            break;
    }
}
function clearAllPanel(){
    //Limpia paneles
    PanelRight.style.visibility = 'hidden';
    PanelYearFilter.style.visibility = 'hidden';
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