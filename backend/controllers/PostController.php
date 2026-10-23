<?php

require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../services/PostService.php";

class PostController extends BaseController {
    private PostService $postService;

    public function __construct() {
        $this->postService = new PostService();
    }

    public function getAll(): void {
        try {
            $posts = $this->postService->getAll();
            $this->jsonResponse($posts, 200);
        } 
        catch (Exception $error) {
            $this->jsonResponse([
                "message" => "Error al obtener las publicaciones",
                "error"   => $error->getMessage()
            ], 500);
        }
    }

    public function getById(?int $id = null): void {
        $postId = $id ?? (int)($_GET["id"] ?? 0);

        try {
            $post = $this->postService->getById($postId);
            $this->jsonResponse($post, 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Post no encontrado") ? 404 : 500;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }

    public function create(?array $body = null): void {
        $data = $body ?? $this->getJsonBody();

        try {
            $post = $this->postService->create($data);
            $this->jsonResponse([
                "message" => "Post creado exitosamente",
                "post"    => $post
            ], 201);
        } 
        catch (Exception $error) {
            $this->jsonResponse(["message" => $error->getMessage()], 400);
        }
    }

    public function update(?int $id = null, ?array $body = null): void {
        $postId = $id ?? (int)($_GET["id"] ?? 0);
        $data = $body ?? $this->getJsonBody();

        try {
            $post = $this->postService->update($postId, $data);
            $this->jsonResponse([
                "message" => "Post actualizado exitosamente",
                "post"    => $post
            ], 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Post no encontrado") ? 404 : 400;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }

    public function delete(?int $id = null): void {
        $postId = $id ?? (int)($_GET["id"] ?? 0);

        try {
            $result = $this->postService->delete($postId);
            $this->jsonResponse($result, 200);
        } 
        catch (Exception $error) {
            $statusCode = ($error->getMessage() === "Post no encontrado") ? 404 : 500;
            $this->jsonResponse(["message" => $error->getMessage()], $statusCode);
        }
    }
}
