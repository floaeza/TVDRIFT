/* @Creado por: Tania Maldonado
 * @Fecha: Junio 2020
 * @Tipo: Funciones para controlar el layout de digital signage 1 
 * @Secciones: 3
 * PanelTop   [Imagen]
 * PanelFloat [Texto]
 * PanelRight [Video]
 * PanelLeft  [Imagen]
 */
/*******************************************************************************
 * Variables generales
 *******************************************************************************/

    var PanelTop   = document.getElementById('PanelTop'),  
        PanelFloat = document.getElementById('PanelFloat'),
        PanelRight = document.getElementById('PanelRight'),
        PanelLeft  = document.getElementById('PanelLeft');

    var PanelTopId   = 'PanelTop',
        PanelFloatId = 'PanelFloat',
        PanelRightId = 'PanelRight',
        PanelLeftId  = 'PanelLeft';

    var SliderInterval1 = '',
        SliderInterval2 = '',
        SliderInterval3 = '',
        SliderInterval4 = '';

    var Index1 = 0,
        Index2 = 0,
        Index3 = 0,
        Index4 = 0,
        Content = 0;

    var IntervalTop         = 0,
        TopContentLength    = 0,
        IntervalFloat       = 0,
        FloatContentLength  = 0,
        IntervalRight       = 0,
        RightContentLength  = 0,
        IntervalLeft        = 0,
        LeftContentLength   = 0;

    var TemplateList = '';
    
    var MediaSource = Libraries['MultimediaSource'] + CurrentModule.replace(/\s/g,'') + '/';

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
                    } else if(TemplateList[Index].seccion === 'PanelRight'){
                        PanelRightId = Index;
                    } else if(TemplateList[Index].seccion === 'PanelFloat'){
                        PanelFloatId = Index;
                    } else if(TemplateList[Index].seccion === 'PanelLeft'){
                        PanelLeftId = Index;
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
        
        SetSlider1();
        
        /* SLIDER 2 */
        clearInterval(SliderInterval2);
        
        SetSlider2();
        
        /* SLIDER 3 */   
        SetSlider3();
    }

/*******************************************************************************
 * SECCION 1: PANEL TOP [Imagen]
 *******************************************************************************/

    

    function Slider1(){
        if(TopContentLength > 0){
    
            PanelTop.src = MediaSource + TemplateList[PanelTopId][Content][Index1];
        
            Index1++;
            
            if(Index1 > TopContentLength - 1){ 
                Index1 = 0; 
            }

        }
    }

    function SetSlider1(){

        /* Asigna el tiempo en pantalla */

        IntervalTop = parseInt(TemplateList[PanelTopId].tiempo_pantalla,10) * 1000;
        SliderInterval1 = setInterval(Slider1,IntervalTop);

        /* Obtiene la longitud del contenido */
        TopContentLength = TemplateList[PanelTopId][Content].length;

        /* Carga inicial */
        Slider1();
    }
    
    SetSlider1();
   
/*******************************************************************************
 * SECCION 2: PANEL FLOAT [Texto]
 *******************************************************************************/

    

    function Slider2(){
        if(FloatContentLength > 0){
    
            PanelFloat.textContent = TemplateList[PanelFloatId][Content][Index2];
        
            Index2++;
            
            if(Index2 > FloatContentLength - 1){ 
                Index2 = 0; 
            }

        }
    }

    function SetSlider2(){
        /* Asigna el tiempo en pantalla */
    
        IntervalFloat = parseInt(TemplateList[PanelFloatId].tiempo_pantalla,10) * 1000;
        SliderInterval2 = setInterval(Slider2,IntervalFloat);

        /* Obtiene la longitud del contenido */
        FloatContentLength = TemplateList[PanelFloatId][Content].length;
        
        /* Carga inicial */
        Slider2();
    }

    SetSlider2();

/*******************************************************************************
 * SECCION 3: PANEL RIGHT [Video]
 *******************************************************************************/

    /* No asigna el tiempo en pantalla ya que son video y dependen de la duracion de cada video*/
    
    function Slider3(){
        if(RightContentLength > 0){
    
            PanelRight.src = MediaSource + TemplateList[PanelRightId][Content][Index3];
            PanelRight.muted = !PanelRight.muted;
            PanelRight.play();
                    
            Index3++;
            
            if(Index3 > RightContentLength - 1){ 
                Index3 = 0; 
            }

        }
    }

    function SetSlider3(){
        /* Obtiene la longitud del contenido */
        RightContentLength = TemplateList[PanelRightId][Content].length;
        
        /* Carga inicial */
        Slider3();
    }
    
    SetSlider3();
    
/*******************************************************************************
 * SECCION 4: PANEL LEFT [Imagen]
 *******************************************************************************/

    

    function Slider4(){
        if(LeftContentLength > 0){
    
            PanelLeft.src = MediaSource + TemplateList[PanelLeftId][Content][Index4];
        
            Index4++;
            
            if(Index4 > LeftContentLength - 1){ 
                Index4 = 0; 
            }

        }
    }

    function SetSlider4(){

        /* Asigna el tiempo en pantalla */

        IntervalLeft = parseInt(TemplateList[PanelLeftId].tiempo_pantalla,10) * 1000;
        SliderInterval4 = setInterval(Slider4,IntervalLeft);

        /* Obtiene la longitud del contenido */
        LeftContentLength = TemplateList[PanelLeftId][Content].length;

        /* Carga inicial */
        Slider4();
    }
    
    SetSlider4();

/*******************************************************************************
 * Manejador de eventos
 *******************************************************************************/

    PanelRight.onended = function() {
        Slider3();
    }; 