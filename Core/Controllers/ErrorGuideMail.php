<?php


require '../Models/PHPMailer/PHPMailer.php';
require '../Models/PHPMailer/SMTP.php';
require '../Models/PHPMailer/Exception.php';
require '../Models/PHPMailer/OAuth.php';
require '../Models/PHPMailer/POP3.php';
date_default_timezone_set('America/Mazatlan');
$Client = !empty($_POST['Client']) ? $_POST['Client'] : '';
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
//require 'vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'esalazar@bbinco.com';                     //SMTP username
    $mail->Password   = 'Bbinco1.0';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('esalazar@bbinco.com', 'SOPORTE BBINCO CANALES');
    $mail->addAddress('esalazar@bbinco.com', 'Emilio Salazar');
    //$mail->addAddress('floaeza@bbinco.com', 'Fabian Loaeza');
    //$mail->addAddress('tmaldonado@bbinco.com', 'Tania Maldonado');     //Add a recipient
    //$mail->addAddress('ellen@example.com');               //Name is optional
    //$mail->addReplyTo('info@example.com', 'Information');
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');

    //Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = ' GUIA NO GENERADA ';
    $mail->Body    = 'Se ha detectado un fallo en la guia de programacion de '.$Client.' el '. date('Y/m/d h:i:sa');
    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
