<?php

require_once __DIR__ . "/../controllers/PostController.php";
require_once __DIR__ . "/../middleware/AuthMiddleware.php";

class PostRoutes {
    private PostController $controller;
    private AuthMiddleware $authMiddleware;

    public function __construct() {
        $this->controller = new PostController();
        $this->authMiddleware = new AuthMiddleware();
    }

    public function postRouter(string $method, string $path): bool {

        // GET /api/posts
        if ($path === "/api/posts" && $method === "GET") {
            $this->controller->getAll();
            return true;
        }

        // POST /api/posts
        if ($path === "/api/posts" && $method === "POST") {
            $this->authMiddleware->isAdmin();
            $this->controller->create();
            return true;
        }

        // api/posts/{id}
        if (str_starts_with($path, "/api/posts/")) {
            $id = (int) str_replace("/api/posts/", "", $path);

            if ($method === "GET") {
                $this->controller->getById($id);
                return true;
            }

            if ($method === "PUT") {
                $this->authMiddleware->isAdmin();
                $this->controller->update($id);
                return true;
            }

            if ($method === "DELETE") {
                $this->authMiddleware->isAdmin();
                $this->controller->delete($id);
                return true;
            }
        }

        return false;
    }
}
