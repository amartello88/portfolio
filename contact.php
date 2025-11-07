<?php
// contact.php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 1) Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Método no permitido');
}

// 2) Honeypot básico
if (!empty($_POST['website'])) {
  http_response_code(200);
  exit('OK');
}

// 3) Sanitizar / validar
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  exit('Datos inválidos');
}

// 4) Enviar por Gmail con PHPMailer
$mail = new PHPMailer(true);

try {
  // Configuración SMTP de Gmail
  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'lunafreelancerr@gmail.com';      // 👈 tu Gmail
  $mail->Password   = 'rsdw qlom czww rdyt ';          // 👈 la clave de aplicación, no tu contraseña real
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  // Configurar el correo
  $mail->setFrom('lunafreelancerr@gmail.com', 'Contacto Portfolio Luna');
  $mail->addReplyTo($email, $name);
  $mail->addReplyTo($email, $name);

  $mail->isHTML(true);
  $mail->Subject = "Nuevo mensaje desde tu portfolio - $name";
  $mail->Body    = "
    <h2>Nuevo mensaje desde tu portfolio</h2>
    <p><strong>Nombre:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Mensaje:</strong><br>$message</p>
  ";

  // Enviar
  $mail->send();
  echo "Mensaje enviado correctamente ✅";
} catch (Exception $e) {
  http_response_code(500);
  echo "Error al enviar el mensaje: {$mail->ErrorInfo}";
}
