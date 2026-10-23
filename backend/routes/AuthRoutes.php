<?php

require_once __DIR__ . "/../controllers/AuthController.php";

class AuthRoutes {
    private AuthController $controller;

    public function __construct() {
        $this->controller = new AuthController();
    }

    public function authRouter(string $method, string $path): bool {
        if ($path === "/api/auth/register" && $method === "POST") {
            $this->controller->register();
            return true;
        }

        if ($path === "/api/auth/login" && $method === "POST") {
            $this->controller->login();
            return true;
        }

        return false;
    }
}
