<?php

require_once __DIR__ . "/../repositories/PostRepository.php";
require_once __DIR__ . "/../models/Post.php";

class PostService {
    private PostRepository $repository;
    private const CATEGORIES = ["Novedad", "Tecnologia", "Programas"];

    public function __construct() {
        $this->repository = new PostRepository();
    }

    public function getAll(): array {
        return $this->repository->findAll();
    }

    public function getById(int $id): Post {
        $post = $this->repository->findById($id);

        if (!$post) {
            throw new Exception("Post no encontrado");
        }
        return $post;
    }

    public function create(array $data): Post {
        if (empty($data["user_id"])) {
            throw new Exception("El id de usuario es obligatorio");
        }
        if (empty($data["title"])) {
            throw new Exception("El titulo es obligatorio");
        }
        if (strlen($data["title"]) > 60) {
            throw new Exception("El titulo no puede superar los 60 caracteres");
        }
        if (empty($data["content"])) {
            throw new Exception("El contenido es obligatorio");
        }
        if (empty($data["image"])) {
            throw new Exception("La imagen es obligatoria");
        }
        if (empty($data["category"])) {
            throw new Exception("La categoria es obligatoria");
        }
        if (!in_array($data["category"], self::CATEGORIES, true)) {
            throw new Exception("Categoria no valida");
        }

        $post = new Post(
            null,
            (int) $data["user_id"],
            $data["title"],
            $data["content"],
            $data["image"],
            $data["category"]
        );

        $id = $this->repository->create($post);
        return $this->getById($id);
    }

    public function update(int $id, array $data): Post {
        $post = $this->getById($id);

        if (!empty($data["user_id"])) {
            $post->user_id = (int) $data["user_id"];
        }
        if (!empty($data["title"])) {
            $post->title = $data["title"];
        }
        if (!empty($data["content"])) {
            $post->content = $data["content"];
        }
        if (!empty($data["image"])) {
            $post->image = $data["image"];
        }
        if (!empty($data["category"])) {
            $post->category = $data["category"];
        }

        $this->repository->update($post);
        return $post;
    }

    public function delete(int $id): array {
        $this->getById($id);
        $this->repository->delete($id);
        return ["message" => "Post eliminado"];
    }
}
