// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Julio 2020
 * @Tipo: Funciones para controlar el layout de peliculas
 */

/*******************************************************************************
 * Variables generales
 *******************************************************************************/


var FilterContainer         = document.getElementById('Filter'),
    ListFilters             = document.getElementById('ListFilters'),
    ListFiltersNodes        = ListFilters.childNodes;


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
    ExitPlaying             = document.getElementById('ExitPlaying'),
    PlayingTitle            = document.getElementById('PlayingTitle');

var BarTimer                = '',
    BarUpdate               = '',
    DurationAsset           = 0,
    PositionAsset           = 0,
    PercentagePosition      = 0;

/*******************************************************************************
* Carga inicial
*******************************************************************************/
window.history.forward(1);
function Init(){
GetFiltersList();

SetFocusHeader('up');

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
if(MenuFocus >= 0){
    MenuOptionsNodes[MenuNodesArray[MenuFocus]].classList.remove('OptionFocus');
}

//(Direction === 'right') ? MenuFocus++: MenuFocus--;

if(Direction === 'down' ){
    MenuFocus++;
    
    if(MenuFocus === 2) {
        MenuFocus++;
    }
} else {
    MenuFocus--;
    
    if(MenuFocus === 2) {
        MenuFocus--;
    }
}

if(MenuFocus >= MenuNodesArray.length){
    MenuFocus = (MenuNodesArray.length -1 );
} else if(MenuFocus < 0){
    MenuFocus = 0;
}

MenuOptionsNodes[MenuNodesArray[MenuFocus]].classList.add('OptionFocus');
}

function ClearFocusHeader(){
var IndexC = 0;

for(IndexC = 0; IndexC < MenuNodesArray.length; IndexC++){
    MenuOptionsNodes[MenuNodesArray[IndexC]].classList.remove('OptionFocus');
}
}

function SelectMenuOption(){

switch (MenuNodesArray[MenuFocus]) {
    case 1:
        // Lista de todas las peliculas
        GoPage('menu.php', Device['MenuId'], 'Menu');
    break;
    
    case 3:
        // Selecciona los filtros
    break;
    
    case 5:
        // Search (aun no esta activo)
    break;
    
    case 7:
        // Regresa a la television
        
    break;
}
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

var IndexR = 0,
    IndexM = 0,
    IndexB = 0;

var BoxPoster = '',
    BoxTitle  = '',
    BoxDiv    = '';

StopVideo(); 

for(IndexR= 0; IndexR < MoviesRowLength; IndexR++){
    
    for(IndexM= 0; IndexM < MoviesBoxLength; IndexM++){
            
        if(IndexB > (MoviesList.length-1)){
            IndexM = MoviesBoxLength;
            IndexR = MoviesRowLength;
        } else {
            BoxDiv    = document.createElement('div');
            BoxPoster = document.createElement('img');
            BoxTitle  = document.createElement('h3');
            
            BoxDiv.setAttribute('class', 'RowPoster');
            BoxDiv.setAttribute('id', IndexB);
            
            BoxPoster.src = FolderSource + MoviesList[IndexB].FLDR + MoviesList[IndexB].PSTR;
            BoxTitle.textContent = MoviesList[IndexB].TTLE;
            
            BoxDiv.appendChild(BoxPoster);
            BoxDiv.appendChild(BoxTitle);
            
            
            PanelRightNodes[PanelRightNodesArray[IndexR]].appendChild(BoxDiv);
            
            IndexB++;
            
        }
    }
}

BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/2542.jpg')";


PlayingVod = false;
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

function LoadMoviePanel(){
CurrentFocus = 'MoviePanel';

ListPanel.style.visibility = 'hidden';
MoviePanel.style.visibility = 'visible';

//MoviePanelNodes[1].src = FolderSource + MoviesList[MovieBox.id].FLDR + 'HD'+MoviesList[MovieBox.id].PSTR;
MoviePanelNodes[1].src = FolderSource + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].PSTR;
MoviePanelNodes[3].textContent  = MoviesList[MovieBox.id].TTLE;
MoviePanelNodes[5].textContent  = MoviesList[MovieBox.id].SCOR;
MoviePanelNodes[9].textContent  = MoviesList[MovieBox.id].DRTN;
MoviePanelNodes[11].textContent = MoviesList[MovieBox.id].GNDR;
MoviePanelNodes[13].textContent = MoviesList[MovieBox.id].YEAR;
MoviePanelNodes[15].textContent = MoviesList[MovieBox.id].RTNG;
MoviePanelNodes[17].textContent = MoviesList[MovieBox.id].DSCR;
MoviePanelNodes[19].textContent = MoviesList[MovieBox.id].DRTR;
MoviePanelNodes[21].textContent = 'Casting: '+MoviesList[MovieBox.id].CAST;

BackgroundPanel.style.backgroundImage = "url('"+ FolderSource + MoviesList[MovieBox.id].FLDR + 'preview.png' + "')";

MoviePanelFocus = 'Play';
SetFocusOnMoviePanel();


PlayingFocus = -1;

PlayingVod = false;
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
    
    BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/2542.jpg')";
} else {
    CurrentFocus = 'Playing';
   
    Debug(Libraries['MoviesSource']);
    Debug(MoviesList[MovieBox.id].FLDR );
    Debug(MoviesList[MovieBox.id].FILE);
    
   
    PlayVideo(Libraries['MoviesSource'] + MoviesList[MovieBox.id].FLDR + MoviesList[MovieBox.id].FILE);
    
   


    PlayingVod = true;
    
    ClearMoviePanel();

    Debug('ExecOptionMoviePanel ShowPlayingPanel()');
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
Debug('VodOk---> ShowPlayingPanel');
PlayinPanelActive = true;
Debug('VodOk---> change PlayinPanelActive = true');
if(OptionText !== 'pause'){
    clearTimeout(PlayingPanelTimer);
    
    /* Contador para ocultar contenedor principal con la informacion*/
    PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
} else {
    clearTimeout(PlayingPanelTimer);
}

PlayingTitle.textContent = MoviesList[MovieBox.id].TTLE;
Debug('VodOk---> UpdateBarStatus()');   
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
if(PlayinPanelActive === true){

    if(PlayingFocus >= 0 && PlayingFocus < PlayingNodesArray.length){
        PlayingOptionsNodes[PlayingNodesArray[PlayingFocus]].classList.remove('ButtonFocus');
    }

    (Direction === 'right') ? PlayingFocus++: PlayingFocus--;


    if(PlayingFocus >= PlayingNodesArray.length){
        PlayingFocus = (PlayingNodesArray.length -1 );
    } else if(PlayingFocus < 0){
        PlayingFocus = 0;
    }

    PlayingOptionsNodes[PlayingNodesArray[PlayingFocus]].classList.add('ButtonFocus');

/* */
    clearTimeout(PlayingPanelTimer);

    PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
    
}
}


function ClearFocusPlaying(){
var IndexC = 0;

for(IndexC = 0; IndexC < PlayingNodesArray.length; IndexC++){
    PlayingOptionsNodes[PlayingNodesArray[IndexC]].classList.remove('ButtonFocus');
}
}

function SelectPlayingOption(){
Debug('VodOk---> SelectPlayingOption');

if(PlayinPanelActive === true){
    
    Debug('VodOk---> PlayinPanelActive === true');
    switch (PlayingNodesArray[PlayingFocus]) {
        case 1:
            // Backward
            Debug('VodOk---> SelectPlayingOption 1');
            SetSpeed('backward');
        break;

        case 3:
            // Play
            Debug('VodOk---> SelectPlayingOption 3');
            //SetSpeed('play');
            
            ResumeVideo();
        break;

        case 5:
            // Pause
            Debug('VodOk---> SelectPlayingOption 5');
            //SetSpeed('pause');
            
            PauseVideo();
        break;

        case 7:
            // Forward
            Debug('VodOk---> SelectPlayingOption 7');
            SetSpeed('forward');
        break;
        
        case 8:
            // close
            Debug('VodOk---> SelectPlayingOption 8');
            StopVideo();

        break;
    }
    
    if(OptionText !== 'pause'){
        clearTimeout(PlayingPanelTimer);

        /* Contador para ocultar contenedor principal con la informacion*/
        PlayingPanelTimer = setTimeout(HidePlayingPanel,7000);
    } else {
        clearTimeout(PlayingPanelTimer);
    }
}
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
    ResumeVideo();
}

OptionText = Option;
}

function UpdateBarStatus(){
Debug('UpdateBarStatus-> '+MoviesList[MovieBox.id].MNTS);
AssetStatus(MoviesList[MovieBox.id].MNTS);

BarPosition.style.width = PercentagePosition +'%';
InfoPosition.textContent = SecondsToTime(PositionAsset) + ' / '+MoviesList[MovieBox.id].DRTN;
PlayingSpeed.textContent = SpeedText;

Debug('UpdateBarStatus-> PercentagePosition = '+PercentagePosition);
}


/*******************************************************************************
* 
*******************************************************************************/

function StopCloseMovie(){

HidePlayingPanel();

StopVideo();

ListPanel.style.visibility  = 'visible';
MoviePanel.style.visibility = 'hidden';
BackgroundPanel.style.visibility = 'visible';

CurrentFocus = 'Movies';

BackgroundPanel.style.backgroundImage = "url('"+FolderSource + "bg/2542.jpg')";

PlayingVod = false;
}

/*******************************************************************************
* Navegacion 
*******************************************************************************/

function VodRight(){
if(CurrentFocus === 'Menu'){
    //
    CurrentFocus = 'Movies';
    
    ClearFocusHeader();
    
    SetFocusMovie('set');
    
} else if(CurrentFocus === 'Movies'){
    SetFocusMovie('right');
} else if(CurrentFocus === 'MoviePanel'){
    SetFocusOnMoviePanel();
} else if(CurrentFocus === 'Playing'){
    SetFocusPlaying('right');
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
    SetFocusOnMoviePanel();
} else if(CurrentFocus === 'Playing'){
    SetFocusPlaying('left');
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
    SetFocusClose();
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
} else if(CurrentFocus === 'Playing'){
    Debug('VodOk---> Playing');
    SelectPlayingOption();
} else if(CurrentFocus === 'StopPlaying'){
    StopCloseMovie();
}
}

function VodInfo(){
if(CurrentFocus === 'Playing' || CurrentFocus === 'StopPlaying'){
    ShowPlayingPanel();
    Debug('VodInfo---> ShowPlayingPanel');
}
}

