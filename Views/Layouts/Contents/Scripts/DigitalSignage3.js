/* @Creado por: Tania Maldonado
 * @Fecha: Junio 2020
 * @Tipo: Funciones para controlar el layout de digital signage 2 
 * @Secciones: 1
 * PanelLeftTop [Imagen]
 */

/*******************************************************************************
 * Variables generales
 *******************************************************************************/

    var PanelLeftTop        = document.getElementById('PanelLeftTop'),
        PanelLeftTopId      = 'PanelLeftTop',
        PanelLeftBottom     = document.getElementById('PanelLeftBottom'),
        PanelLeftBottomId   = 'PanelLeftBottom',
        PanelRight          = document.getElementById('PanelRight'),
        PanelRightId        = 'PanelRight',
        SliderInterval1     = '',
        SliderInterval2     = '',
        SliderInterval3     = '',
        Index1              = 0,
        Index2              = 0,
        Index3              = 0,
        Content             = 0,
        IntervalLeftTop      = 0,
        LeftTopContentLength = 0,
        IntervalLeftBottom      = 0,
        LeftBottomContentLength = 0,
        IntervalRight      = 0,
        RightContentLength = 0,
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
                    if(TemplateList[Index].seccion === 'PanelLeftTop'){
                        PanelLeftTopId = Index;
                    } else if(TemplateList[Index].seccion === 'PanelLeftBottom'){
                        PanelLeftBottomId = Index;
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
    
            PanelLeftTop.src = MediaSource + TemplateList[PanelLeftTopId][Content][Index1];
        
            Index1++;
            
            if(Index1 > LeftTopContentLength - 1){ 
                Index1 = 0; 
            }

        }
    }

    function SetSlider1(){

        /* Asigna el tiempo en pantalla */

        IntervalLeftTop = parseInt(TemplateList[PanelLeftTopId].tiempo_pantalla,10) * 1000;
       // SliderInterval1 = setInterval(Slider1,IntervalLeftTop);

        /* Obtiene la longitud del contenido */
        LeftTopContentLength = TemplateList[PanelLeftTopId][Content].length;

        /* Carga inicial */
        Slider1();
    }
    
    SetSlider1();
 
 
 
 /*******************************************************************************
 * SECCION 2: PANEL LEFT BOTTOM [Imagen]
 *******************************************************************************/

    

    function Slider2(){
        if(LeftBottomContentLength > 0){
    
            PanelLeftBottom.src = MediaSource + TemplateList[PanelLeftBottomId][Content][Index2];
        
            Index2++;
            
            if(Index2 > LeftBottomContentLength - 1){ 
                Index2 = 0; 
            }

        }
    }

    function SetSlider2(){

        /* Asigna el tiempo en pantalla */

        IntervalLeftBottom = parseInt(TemplateList[PanelLeftBottomId].tiempo_pantalla,10) * 1000;
        SliderInterval2 = setInterval(Slider2,IntervalLeftBottom);

        /* Obtiene la longitud del contenido */
        LeftBottomContentLength = TemplateList[PanelLeftBottomId][Content].length;

        /* Carga inicial */
        Slider2();
    }
    
    SetSlider2();
    
    
/*******************************************************************************
 * SECCION 3: PANEL RIGHT [Imagen]
 *******************************************************************************/

    

    function Slider3(){
        if(RightContentLength > 0){
    
            PanelRight.src = MediaSource + TemplateList[PanelRightId][Content][Index3];
        
            Index3++;
            
            if(Index3 > RightContentLength - 1){ 
                Index3 = 0; 
            }

        }
    }

    function SetSlider3(){

        /* Asigna el tiempo en pantalla */

        IntervalRight = parseInt(TemplateList[PanelRightId].tiempo_pantalla,10) * 1000;
        SliderInterval3 = setInterval(Slider3,IntervalRight);

        /* Obtiene la longitud del contenido */
        RightContentLength = TemplateList[PanelRightId][Content].length;

        /* Carga inicial */
        Slider3();
    }
    
    SetSlider3();