// @ts-nocheck
/* @Creado por: Tania Maldonado
 * @Fecha: Julio 2020
 * @Tipo: Funciones para controlar el layout de contenido por carpeta 
 * @Secciones: 2
 * image1 [Imagen]
 * video1 [Video]
 */
/*******************************************************************************
 * Variables generales
 *******************************************************************************/
    var ImgSection3     = document.getElementById('image1'),
        VideoScreen     = document.getElementById('video1'),
        LoadingDiv    = document.getElementById('loadingg'),
        SliderInterval3 = '',
        Images          = '',
        Images3         = [],
        Index3          = 0,
        MediaSource     = Libraries['MultimediaSource']+ CurrentModule.replace(/\s/g, '') + '/';

    var LoopVideo = true;


    window.history.forward(1);
/*******************************************************************************
 * Contenido multimedia
 *******************************************************************************/
    function SetConstructor(){
       $.ajax({
            type: 'POST',
            async: false,
            url: ServerSource + 'Core/Controllers/Template.php',
            data: { 
                Option : 'getMultimediaFolder',
                ModuleName : CurrentModule
            },
            success: function (response){
                Images = $.parseJSON(response);
                
                var Index = 0;
                
                /* Asigna la posicion en el arreglo a un ID */
                for(Index = 0; Index < Images.length; Index++){
                    Images3.push(Images[Index]);
                }
                
                Index = null;
            }
        });    
        SliderInterval3 = setInterval(Slider3,7000);
        Slider3();
    }
       
    SetConstructor();
    
    function UpdateMultimedia(){
        SetConstructor();
    }

/*******************************************************************************
 * SECCION 1: PANEL CENTER [Video]
 *******************************************************************************/

    function Slider3(){
        //var padre = LoadingDiv.parentNode;
		//padre.removeChild(imagen);
        //padre = null;
        if(Images3.length > 0){
    
            var FileType = Images3[Index3].split('.')[1];
            
            if(FileType === 'mp4' || FileType === 'mov'){
                if (SliderInterval3 != ''){
                    clearInterval(SliderInterval3);
                    SliderInterval3 = '';
                }
                LoadingDiv.style.display = 'none';
                ImgSection3.src = '';

                if(localStorage.getItem('Id') === null) {
                    //alert('NULL');
                    VideoScreen.style.display = 'inline';

                    VideoScreen.src = MediaSource + Images3[Index3];

                    VideoScreen.play();
                } else {
                    //alert('DEF');
                    LoadingDiv.style.display = 'none';
                    VideoScreen.style.display = 'none';

                    ImgSection3.style.visibility = 'hidden';

                    PlayVideo(MediaSource + Images3[Index3]);
                    
                }

                Debug('2- VideoScreen::::::::: ' + MediaSource + Images3[Index3]);

                Index3++;

                if (Index3 > Images3.length - 1) {
                    Index3 = 0;
                }
            } else {
                //alert("ELSE ");
                LoadingDiv.style.display = 'none';
                VideoScreen.style.display = 'none';
    
                ImgSection3.src = MediaSource+Images3[Index3];

                ImgSection3.style.visibility = 'visible';

                Index3++;

                if(Index3 > Images3.length - 1){
                Index3 = 0;
                }
            }
        }
    }
/*******************************************************************************
 * Manejador de eventos
 *******************************************************************************/

    VideoScreen.onended = function() {

        VideoScreen.style.display = 'none';

        Slider3();

        SliderInterval3 = setInterval(Slider3,7000);
    };

    function LoopMedia(){
        Slider3();

        SliderInterval3 = setInterval(Slider3,7000);
    }
