<?php

    $link = mssql_connect('192.168.10.14\MSSQLSERVER', 'bbinco', 'bincotv12');
    if(!$link) { 
            // echo'Could not connect';
            // OBTIENE EL NOMBRE DEL MIEMBRO DE LA BASE DE DATOS DE BBINCO
            $Content->set('Member', $MemberTitle." ".$MemberName." ".$MemberLast); 
    }
    //echo'Database connected OK'; 
    // PASA AL SIGUIENTE IF


    //$selected = mssql_select_db('DELMAM-JonasDataMart', $link)or die("Cannot select DB");
    $selected = mssql_select_db('DELMAM-JonasDataMart', $link);    
    if(!$selected) {
        //echo'Could not connect';
        // OBTIENE EL NOMBRE DEL MIEMBRO DE LA BASE DE DATOS DE BBINCO
        $Content->set('Member', $MemberTitle." ".$MemberName." ".$MemberLast);
    }

    $query = "SELECT * FROM view_Hotel_Checked_In WHERE HotelRoomCode = '$LocationCode'";

    $resultado = mssql_query($query,$link); 

    if(!mssql_num_rows($resultado)){
        //echo "No records found";
        //MANTIENE EL NOMBRE DE LA BASE DE DATOS DE BBINCO
        $Content->set('Member', $MemberTitle." ".$MemberName." ".$MemberLast);

    } else {
        //OBTIENE EL DE JONAS Y LO COMPARA CON EL DE LA BD DE BBINCO
        while($Member= mssql_fetch_array($resultado)){
            //echo $Chit['ClubMemberCode']." - ".$Chit['LastName']." ".$Chit['FirstName']." - ".$Chit['HotelRoomCode'];
            $MemberCodeJonas = $Member['ClubMemberCode'];
            if($MemberCodeJonas !== $MemberCode){
             //MUESTRA DATOS DEL RENTISTA
            $Content->set('Member', $Member['FirstName']." ".$Member['LastName']);
            } else {
            $Content->set('Member', $MemberTitle." ".$MemberName." ".$MemberLast);
            }
        }
    }
