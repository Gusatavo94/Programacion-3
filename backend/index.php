<?php

// Encabezados globales CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Responder a peticiones preflight OPTIONS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/routes/AuthRoutes.php";
require_once __DIR__ . "/routes/UserRoutes.php";
require_once __DIR__ . "/routes/PostRoutes.php";

// Obtener ruta y método HTTP
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER["REQUEST_METHOD"];

$authRoutes = new AuthRoutes();
$userRoutes = new UserRoutes();
$postRoutes = new PostRoutes();

if ($authRoutes->authRouter($method, $path)) {
    exit;
}
if ($userRoutes->userRouter($method, $path)) {
    exit;
}
if ($postRoutes->postRouter($method, $path)) {
    exit;
}