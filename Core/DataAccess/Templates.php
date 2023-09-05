<?php
/* Creado por: ALberto Chavez
 * Fecha: Mayo 2020
 * Tipo: DAO
 */
class Templates extends Database {
    private $Templates = array();
    private $Templates1 = array();
    
    public function __construct($MacAddress, $CurrentModule) {
        $this->ClassFile = 'Templates';
        $this->Device = $MacAddress;
        $this->Module = $CurrentModule;
        $this->Function = '';
    }
    
    
    
     function getDetailTemplate($ModuleId) {
          
            $this->Function = 'getDetailTemplate';
            $this->connect();
            
            $NumberDay = date('N');
            $this->select('modulos','repetir_contenido','','','','','id_modulo = '.$ModuleId);
            $res =  $this->getResult();
             foreach ($res as $Row):
                 $bandera = $Row[repetir_contenido];
             endforeach;
             
            if($bandera === '1'){
                $NumberDay = 8;
            }
                    
            
             $sql ="select distinct  
                   b.nombre_seccion as seccion, 
                   c.tiempo_pantalla as tiempo_pantalla
                   from cat_tipo_seccion a,
                   secciones b,
                   cat_tiempo_pantalla c,
                   cat_template d,
                   modulo_contenido e,
                   cat_dias_contenido f,
                   modulos g
                   where a.id_tipo_seccion = b.id_tipo_seccion
                   and b.id_tiempo_pantalla = c.id_tiempo_pantalla
                   and d.id_template = b.id_template
                   and e.id_seccion = b.id_seccion
                   and e.id_dia_contenido = f.id_dia_contenido
                   and g.id_modulo = e.id_modulo
                   and g.id_template = d.id_template
                   and g.id_modulo = ".$ModuleId."
                   and e.id_dia_contenido = ".$NumberDay."
                   order by nombre_seccion";  
            
            $this->sql1($sql);                                 
            $Result = $this->getResult();
           
            foreach ($Result as $Row):    
                
                $sq2 ="select
                   e.valor_contenido as valor_contenido
                   from cat_tipo_seccion a,
                   secciones b,
                   cat_tiempo_pantalla c,
                   cat_template d,
                   modulo_contenido e,
                   cat_dias_contenido f,
                   modulos g
                   where a.id_tipo_seccion = b.id_tipo_seccion
                   and b.id_tiempo_pantalla = c.id_tiempo_pantalla
                   and d.id_template = b.id_template
                   and e.id_seccion = b.id_seccion
                   and e.id_dia_contenido = f.id_dia_contenido
                   and g.id_modulo = e.id_modulo
                   and g.id_template = d.id_template
                   and g.id_modulo = ".$ModuleId."
                   and e.id_dia_contenido = ".$NumberDay."
                   and b.nombre_seccion = '".$Row['seccion']."'
                   and c.tiempo_pantalla =".$Row['tiempo_pantalla']." 
                   order by  valor_contenido";  
            
                  $this->sql1($sq2);            
            
                  $Result2 = $this->getResult();
                          
                foreach ($Result2 as $Row2):    
                     array_push($this->Templates1,$Row2['valor_contenido']);
                endforeach;
                array_push($this->Templates,  array('seccion' =>  $Row['seccion'],
                                                        'tiempo_pantalla' => $Row['tiempo_pantalla'], $this->Templates1 ));
           
                $this->Templates1 = array();;
            endforeach;
            //print_r($this->Templates);        
            $this->disconnect(); 
            return $this->Templates;
           
    }

    
}
