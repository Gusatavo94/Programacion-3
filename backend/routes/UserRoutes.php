<?php

require_once __DIR__ . "/../controllers/UserController.php";

class UserRoutes {
    private UserController $controller;

    public function __construct() {
        $this->controller = new UserController();
    }

    public function userRouter(string $method, string $path): bool {
        // GET /api/users
        if ($path === "/api/users" && $method === "GET") {
            $this->controller->getAll();
            return true;
        }

        // POST /api/users
        if ($path === "/api/users" && $method === "POST") {
            $this->controller->create();
            return true;
        }

        // /api/users/{id}
        if (str_starts_with($path, "/api/users/")) {
            $id = (int) str_replace("/api/users/", "", $path);

            if ($method === "GET") {
                $this->controller->getById($id);
                return true;
            }

            if ($method === "PUT") {
                $this->controller->update($id);
                return true;
            }

            if ($method === "DELETE") {
                $this->controller->delete($id);
                return true;
            }
        }

        return false;
    }
}
