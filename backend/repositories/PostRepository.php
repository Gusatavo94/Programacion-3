<?php

require_once __DIR__ . "/../config/Database.php";
require_once __DIR__ . "/../models/Post.php";

class PostRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(): array {
        $query = $this->db->query("SELECT * FROM posts ORDER BY id DESC");
        $rows = $query->fetchAll();

        $posts = [];
        foreach ($rows as $row) {
            $posts[] = new Post(
                (int) $row["id"],
                (int) $row["user_id"],
                $row["title"],
                $row["content"],
                $row["image"],
                $row["category"]
            );
        }
        return $posts;
    }

    public function findById(int $id): ?Post {
        $query = $this->db->prepare("SELECT * FROM posts WHERE id = :id");
        $query->execute(["id" => $id]);
        $row = $query->fetch();

        if (!$row) {
            return null;
        }

        return new Post(
            (int) $row["id"],
            (int) $row["user_id"],
            $row["title"],
            $row["content"],
            $row["image"],
            $row["category"]
        );
    }

    public function create(Post $post): int {
        $sql = "INSERT INTO posts (user_id, title, content, image, category) 
                VALUES (:user_id, :title, :content, :image, :category)";
        $query = $this->db->prepare($sql);
        $query->execute([
            "user_id"  => $post->user_id,
            "title"    => $post->title,
            "content"  => $post->content,
            "image"    => $post->image,
            "category" => $post->category
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(Post $post): bool {
        $sql = "UPDATE posts 
                SET user_id = :user_id, title = :title, content = :content, image = :image, category = :category 
                WHERE id = :id";
        $query = $this->db->prepare($sql);
        
        return $query->execute([
            "id"       => $post->id,
            "user_id"  => $post->user_id,
            "title"    => $post->title,
            "content"  => $post->content,
            "image"    => $post->image,
            "category" => $post->category
        ]);
    }

    public function delete(int $id): bool {
        $query = $this->db->prepare("DELETE FROM posts WHERE id = :id");
        return $query->execute(["id" => $id]);
    }
}