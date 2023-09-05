/* @Creado por: Tania Maldonado
 * @Fecha: Noviembre 2020
 * @Tipo: Funciones para controlar el layout de contenido por carpeta 
 * @Secciones: 2
 * image1 [ImageLeft]
 */

/*******************************************************************************
 * Variables generales
 *******************************************************************************/

    var ImageLeft           = document.getElementById('ImageLeft'),
        SliderIntervalLeft  = '',
        ImagesLeft          = '',
        ImagesArrayLeft     = [],
        IndexLeft           = 0,
        MediaSourceLeft         = Libraries['MultimediaSource']+'PromoLeft/';

    var ImageRight           = document.getElementById('ImageRight'),
        SliderIntervalRight  = '',
        ImagesRight          = '',
        ImagesArrayRight     = [],
        IndexRight           = 1,
        MediaSourceRight     = Libraries['MultimediaSource']+'PromoRight/';

/*******************************************************************************
 * Contenido multimedia
 *******************************************************************************/

    function SetConstructor(){
       $.ajax({
            type: 'POST',
            async: false,
            url: ServerSource+'Core/Controllers/Template.php',
            data: { 
                Option : 'getMultimediaFolder',
                ModuleName : 'PromoLeft'
            },
            success: function (response){
                ImagesLeft = $.parseJSON(response);
                
                var Index = 0;
                
                /* Asigna la posicion en el arreglo a un ID */
                for(Index = 0; Index < ImagesLeft.length; Index++){
                    ImagesArrayLeft.push(ImagesLeft[Index]);
                }
                
                Index = null;
            }
        });
        
        $.ajax({
            type: 'POST',
            async: false,
            url: ServerSource+'Core/Controllers/Template.php',
            data: { 
                Option : 'getMultimediaFolder',
                ModuleName : 'PromoRight'
            },
            success: function (response){
                ImagesRight = $.parseJSON(response);
                
                var Index = 0,
                    Inner = '<ul>';
                
                /* Asigna la posicion en el arreglo a un ID */
                for(Index = 0; Index < ImagesRight.length; Index++){
                    ImagesArrayRight.push(ImagesRight[Index]);
                    Inner += '<li><img src="'+MediaSourceRight+ImagesRight[Index]+'"></li>';
                }
                
                Inner += '</ul>';
                
                ImageRight.innerHTML = Inner;
                
                Index = null;
            }
        });  
    }
       
    SetConstructor();
    
    function UpdateMultimedia(){
        SetConstructor();

        /* SLIDER 1 */   
        SetSliderLeft();
    }

/*******************************************************************************
 * SECCION 1: PANEL LEFT [Image]
 *******************************************************************************/

    function SliderLeft(){
        if(ImagesArrayLeft.length > 0){
    
                ImageLeft.src  = MediaSourceLeft+ImagesArrayLeft[IndexLeft];

                IndexLeft++;
                
                if(IndexLeft > ImagesArrayLeft.length - 1){ 
                    IndexLeft = 0; 
                }

        }
    }

    SliderLeft();

    SliderIntervalLeft = setInterval(SliderLeft,7000);


/*******************************************************************************
 * SECCION 2: PANEL RIGHT [Image]
 *******************************************************************************/

    function SliderRight() {
        
        $('#ImageRight').css('background-image', 'url('+ MediaSourceRight+ImagesArrayRight[IndexRight] +')');

        if(IndexRight < ImagesArrayRight.length -1){
            IndexRight++;
        } else {
            IndexRight = 0;
        }
        
        slideWidth = $('#ImageRight ul li').width();
        
        $('#ImageRight ul').animate({
            right: - slideWidth
        }, 3000, function (){
            $('#ImageRight ul li:first-child').appendTo('#ImageRight ul');
            $('#ImageRight ul').css('right', '');
        });
    };  
        
        
    SliderIntervalRight = setInterval(SliderRight,8000);