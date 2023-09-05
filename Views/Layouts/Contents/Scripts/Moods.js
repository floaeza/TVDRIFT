/* @Creado por: Tania Maldonado
 * @Fecha: Julio 2020
 * @Tipo: Funciones para controlar el layout de contenido por carpeta 
 * @Secciones: 2
 * image1 [Imagen]
 * video1 [Video]
 */


window.history.forward(1);
/*******************************************************************************
 * Variables generales
 *******************************************************************************/
    var MoodsContainer  = document.getElementById('MoodsList'),
        MoodsList       = MoodsContainer.childNodes,
        MoodsListActive = true,
        MoodsNodes      = [1,3,5,7],
        MoodsVideos     = ['Fireplace.mp4','Rain.mp4','Forest.mp4','Waterfall.mp4'],
        IndexMood       = -1,
        MediaSource     = Libraries['ServerRoot']+'MULTIMEDIA_VPL/Moods/';

    var VideoScreen     = document.getElementById('video1');
        VideoScreen.style.display = 'none';

    var LoopVideo = true;

MoodsList[1].src = MediaSource + 'Fireplace.jpg';
MoodsList[3].src = MediaSource + 'Rain.jpg';
MoodsList[5].src = MediaSource + 'Forest.jpg';
MoodsList[7].src = MediaSource + 'Waterfall.jpg';

/*******************************************************************************
 * Contenido multimedia
 *******************************************************************************/

    function HideMoodsPanel(){
        MoodsListActive = false;
        
        MoodsContainer.style.visibility = 'hidden';

        if(localStorage.getItem('Id') === null) {

            VideoScreen.style.display = 'inline';

            VideoScreen.src = MediaSource + MoodsVideos[IndexMood];

            VideoScreen.play();
        } else {

            VideoScreen.style.display = 'none';

            PlayVideo(MediaSource + MoodsVideos[IndexMood]);
        }
    }
    
    function ShowMoodsPanel(){
        MoodsListActive = true;
        
        MoodsContainer.style.visibility = 'visible';

        if(localStorage.getItem('Id') === null) {
            VideoScreen.style.display = 'none';

            VideoScreen.pause();
        } else {
            StopVideo();
        }
    }


    function SetFocus(Direction){
        if(IndexMood >= 0){
            MoodsList[MoodsNodes[IndexMood]].classList.remove('Selected');
        }
        
        (Direction === 'right') ? IndexMood++: IndexMood--;
        
        if(IndexMood >= MoodsNodes.length){
            IndexMood = 0;
        } else if(IndexMood < 0){
            IndexMood = (MoodsNodes.length -1 );
        }

        MoodsList[MoodsNodes[IndexMood]].classList.add('Selected');
    }
    
    SetFocus('right');
/*******************************************************************************
 * Manejador de eventos
 *******************************************************************************/

    VideoScreen.onended = function() {
        VideoScreen.src = MediaSource + MoodsVideos[IndexMood];

        VideoScreen.play();
    };

    function LoopMedia(){
        PlayVideo(MediaSource + MoodsVideos[IndexMood]);
    }

/*******************************************************************************
 * Control 
 *******************************************************************************/

    function MoodsRight(){
        if(MoodsListActive === true){
            SetFocus('right');
        }
    }
    
    function MoodsLeft(){
        if(MoodsListActive === true){
            SetFocus('left');
        }
    }
    
    function MoodsOk(){
        if(MoodsListActive === true){
            HideMoodsPanel();
        }
    }
    
    function MoodsClose(){
        if(MoodsListActive === true){
            GoPage('menu.php', Device['MenuId'], 'Menu');
        } else {
            ShowMoodsPanel();
        }
    }
