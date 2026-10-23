<?php

require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../services/UserService.php";

class AuthController extends BaseController {
    private UserService $userService;

    public function __construct() {
        $this->userService = new UserService();
    }

    public function register(?array $body = null): void {
        $data = $body ?? $this->getJsonBody();

        try {
            $user = $this->userService->register($data);
            $token = bin2hex(random_bytes(32));

            $this->jsonResponse([
                "message" => "Usuario registrado exitosamente",
                "user"    => $user,
                "token"   => $token
            ], 201);
        } 
        catch (Exception $error) {
            $this->jsonResponse(["message" => $error->getMessage()], 400);
        }
    }

    public function login(?array $body = null): void {
        $data = $body ?? $this->getJsonBody();
        $email = $data["email"] ?? "";
        $password = $data["password"] ?? "";

        try {
            $user = $this->userService->login($email, $password);
            $token = bin2hex(random_bytes(32));

            $this->jsonResponse([
                "message" => "Inicio de sesión exitoso",
                "user"    => $user,
                "token"   => $token
            ], 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Credenciales inválidas") ? 401 : 400;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }
}
