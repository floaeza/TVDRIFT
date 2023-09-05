/* @Creado por: Tania Maldonado
 * @Fecha: Noviembre 2020
 * @Tipo: Funciones para controlar el layout de digital signage 2 
 * @Secciones: 1
 * PanelTop [Imagen]
 */

/*******************************************************************************
 * Variables generales
 *******************************************************************************/

    var PanelTop        = document.getElementById('PanelTop'),
        PanelTopId      = 'PanelTop',
        PanelLeft     = document.getElementById('PanelLeft'),
        PanelLeftId   = 'PanelLeft',
        PanelMiddle          = document.getElementById('PanelMiddle'),
        PanelMiddleId        = 'PanelMiddle',
        PanelRight          = document.getElementById('PanelRight'),
        PanelRightId        = 'PanelRight',
        SliderInterval1     = '',
        SliderInterval2     = '',
        SliderInterval3     = '',
        SliderInterval4     = '',
        Index1              = 0,
        Index2              = 0,
        Index3              = 0,
        Index4              = 0,
        Content             = 0,
        IntervalLeftTop      = 0,
        LeftTopContentLength = 0,
        IntervalLeftBottom      = 0,
        LeftBottomContentLength = 0,
        IntervalRightTop      = 0,
        RightTopContentLength = 0,
        IntervalRightBottom      = 0,
        RightBottomContentLength = 0,
        TemplateList        = '',
        MediaSource         = Libraries['MultimediaSource'] + CurrentModule.replace(/\s/g,'') + '/';

/*******************************************************************************
 * Contenido multimedia
 *******************************************************************************/

    function SetConstructor(){
       $.ajax({
            type: 'POST',
            async: false,
            url: ServerSource+'Core/Controllers/Template.php',
            data: { 
                Option : 'getDetailTemplate',
                Option2 : ModuleId
            },
            success: function (response){
                TemplateList = $.parseJSON(response);
                
                var Index = 0;
                
                /* Asigna la posicion en el arreglo a un ID */
                for(Index = 0; Index < TemplateList.length; Index++){
                    if(TemplateList[Index].seccion === 'PanelTop'){
                        PanelTopId = Index;
                    } else if(TemplateList[Index].seccion === 'PanelLeft'){
                        PanelLeftId = Index;
                    } else if(TemplateList[Index].seccion === 'PanelMiddle'){
                        PanelMiddleId = Index;
                    } else if(TemplateList[Index].seccion === 'PanelRight'){
                        PanelRightId = Index;
                    }
                }
                
                Index = null;
            }
        });    
    }
       
    SetConstructor();
    
    
    function UpdateMultimedia(){
        SetConstructor();
        
        /* SLIDER 1 */
        clearInterval(SliderInterval1);
        
        //SetSlider1();
    }

/*******************************************************************************
 * SECCION 1: PANEL LEFT TOP [Imagen]
 *******************************************************************************/

    

    function Slider1(){
        if(LeftTopContentLength > 0){
    
            PanelTop.src = MediaSource + TemplateList[PanelTopId][Content][Index1];
        
            Index1++;
            
            if(Index1 > LeftTopContentLength - 1){ 
                Index1 = 0; 
            }

        }
    }

    function SetSlider1(){

        /* Asigna el tiempo en pantalla */

        IntervalLeftTop = parseInt(TemplateList[PanelTopId].tiempo_pantalla,10) * 1000;
        SliderInterval1 = setInterval(Slider1,IntervalLeftTop);

        /* Obtiene la longitud del contenido */
        LeftTopContentLength = TemplateList[PanelTopId][Content].length;

        /* Carga inicial */
        Slider1();
    }
    
    SetSlider1();
 
 
 
 /*******************************************************************************
 * SECCION 2: PANEL LEFT BOTTOM [Imagen]
 *******************************************************************************/

    

    function Slider2(){
        if(LeftBottomContentLength > 0){
    
            PanelLeft.src = MediaSource + TemplateList[PanelLeftId][Content][Index2];
        
            Index2++;
            
            if(Index2 > LeftBottomContentLength - 1){ 
                Index2 = 0; 
            }

        }
    }

    function SetSlider2(){

        /* Asigna el tiempo en pantalla */

        IntervalLeftBottom = parseInt(TemplateList[PanelLeftId].tiempo_pantalla,10) * 1000;
        SliderInterval2 = setInterval(Slider2,IntervalLeftBottom);

        /* Obtiene la longitud del contenido */
        LeftBottomContentLength = TemplateList[PanelLeftId][Content].length;

        /* Carga inicial */
        Slider2();
    }
    
    SetSlider2();
    
    
/*******************************************************************************
 * SECCION 3: PANEL RIGHT [Imagen]
 *******************************************************************************/

    

    function Slider3(){
        if(RightTopContentLength > 0){
    
            PanelMiddle.src = MediaSource + TemplateList[PanelMiddleId][Content][Index3];
        
            Index3++;
            
            if(Index3 > RightTopContentLength - 1){ 
                Index3 = 0; 
            }

        }
    }

    function SetSlider3(){

        /* Asigna el tiempo en pantalla */

        IntervalRightTop = parseInt(TemplateList[PanelMiddleId].tiempo_pantalla,10) * 1000;
        SliderInterval3 = setInterval(Slider3,IntervalRightTop);

        /* Obtiene la longitud del contenido */
        RightTopContentLength = TemplateList[PanelMiddleId][Content].length;

        /* Carga inicial */
        Slider3();
    }
    
    SetSlider3();
    
/*******************************************************************************
 * SECCION 4: PANEL RIGHT [Imagen]
 *******************************************************************************/

    

    function Slider4(){
        if(RightBottomContentLength > 0){
    
            PanelRight.src = MediaSource + TemplateList[PanelRightId][Content][Index4];
        
            Index4++;
            
            if(Index4 > RightBottomContentLength - 1){ 
                Index4 = 0; 
            }

        }
    }

    function SetSlider4(){

        /* Asigna el tiempo en pantalla */

        IntervalRightBottom = parseInt(TemplateList[PanelRightId].tiempo_pantalla,10) * 1000;
        SliderInterval4 = setInterval(Slider4,IntervalRightBottom);

        /* Obtiene la longitud del contenido */
        RightBottomContentLength = TemplateList[PanelRightId][Content].length;

        /* Carga inicial */
        Slider4();
    }
    
    SetSlider4();