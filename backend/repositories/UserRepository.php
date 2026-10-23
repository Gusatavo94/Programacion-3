<?php
require_once __DIR__ . "/../config/Database.php";
require_once __DIR__ . "/../models/User.php";

class UserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(): array {
        $query = $this->db->query("SELECT id, username, email, role FROM users ORDER BY id DESC");
        $rows = $query->fetchAll();

        $users = [];
        foreach ($rows as $row) {
            $users[] = new User(
                (int) $row["id"],
                $row["username"],
                $row["email"],
                null,
                $row["role"]
            );
        }
        return $users;
    }

    public function findById(int $id): ?User {
        $query = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $query->execute(["id" => $id]);
        $row = $query->fetch();

        if (!$row) {
            return null;
        }

        return new User(
            (int) $row["id"],
            $row["username"],
            $row["email"],
            $row["password"],
            $row["role"]
        );
    }

    public function findByEmail(string $email): ?User {
        $query = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $query->execute(["email" => $email]);
        $row = $query->fetch();

        if (!$row) {
            return null;
        }

        return new User(
            (int) $row["id"],
            $row["username"],
            $row["email"],
            $row["password"],
            $row["role"]
        );
    }

    public function findByUsername(string $username): ?User {
        $query = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $query->execute(["username" => $username]);
        $row = $query->fetch();

        if (!$row) {
            return null;
        }

        return new User(
            (int) $row["id"],
            $row["username"],
            $row["email"],
            $row["password"],
            $row["role"]
        );
    }

    public function create(User $user): int {
        $sql = "INSERT INTO users (username, email, password, role) VALUES (:username, :email, :password, :role)";
        $query = $this->db->prepare($sql);
        $query->execute([
            "username" => $user->username,
            "email"    => $user->email,
            "password" => $user->password,
            "role"     => $user->role
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(User $user): bool {
        $sql = "UPDATE users 
                SET username = :username, email = :email, password = :password, role = :role 
                WHERE id = :id";
        $query = $this->db->prepare($sql);

        return $query->execute([
            "id"       => $user->id,
            "username" => $user->username,
            "email"    => $user->email,
            "password" => $user->password,
            "role"     => $user->role
        ]);
    }

    public function delete(int $id): bool {
        $query = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $query->execute(["id" => $id]);
    }
}