<?php

require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../services/UserService.php";

class UserController extends BaseController {
    private UserService $userService;

    public function __construct() {
        $this->userService = new UserService();
    }

    public function getAll(): void {
        try {
            $users = $this->userService->getAll();
            $this->jsonResponse($users, 200);
        } 
        catch (Exception $error) {
            $this->jsonResponse([
                "message" => "Error al obtener usuarios",
                "error"   => $error->getMessage()
            ], 500);
        }
    }

    public function getById(?int $id = null): void {
        $userId = $id ?? (int)($_GET["id"] ?? 0);

        try {
            $user = $this->userService->getById($userId);
            $this->jsonResponse($user, 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Usuario no encontrado") ? 404 : 500;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }

    public function create(?array $body = null): void {
        $data = $body ?? $this->getJsonBody();

        try {
            $user = $this->userService->register($data);
            $this->jsonResponse([
                "message" => "Usuario creado exitosamente",
                "user"    => $user
            ], 201);
        } 
        catch (Exception $error) {
            $this->jsonResponse(["message" => $error->getMessage()], 400);
        }
    }

    public function update(?int $id = null, ?array $body = null): void {
        $userId = $id ?? (int)($_GET["id"] ?? 0);
        $data = $body ?? $this->getJsonBody();

        try {
            $user = $this->userService->update($userId, $data);
            $this->jsonResponse([
                "message" => "Usuario actualizado exitosamente",
                "user"    => $user
            ], 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Usuario no encontrado") ? 404 : 400;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }

    public function delete(?int $id = null): void {
        $userId = $id ?? (int)($_GET["id"] ?? 0);

        try {
            $result = $this->userService->delete($userId);
            $this->jsonResponse($result, 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Usuario no encontrado") ? 404 : 500;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }
}
