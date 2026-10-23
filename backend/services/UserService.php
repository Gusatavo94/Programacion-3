<?php
require_once __DIR__ . "/../repositories/UserRepository.php";
require_once __DIR__ . "/../models/User.php";

class UserService {
    private UserRepository $repository;

    public function __construct() {
        $this->repository = new UserRepository();
    }

    public function getAll(): array {
        return $this->repository->findAll();
    }

    public function getById(int $id): User {
        $user = $this->repository->findById($id);
        if (!$user) {
            throw new Exception("Usuario no encontrado");
        }
        unset($user->password);
        return $user;
    }

    public function getByEmail(string $email): ?User {
        $email = strtolower($email);
        $user = $this->repository->findByEmail($email);

        if (!$user) {
            return null;
        }

        unset($user->password);
        return $user;
    }

    public function getByUsername(string $username): ?User {
        $user = $this->repository->findByUsername($username);

        if (!$user) {
            return null;
        }

        unset($user->password);
        return $user;
    }

    public function register(array $data): User {
        if (empty($data["email"]) || empty($data["username"]) || empty($data["password"])) {
            throw new Exception("El email, username y password son obligatorios");
        }

        $email = strtolower($data["email"]);
        $username = $data["username"];
        $password = $data["password"];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("El correo electrónico no es válido");
        }

        if (strlen($password) < 6) {
            throw new Exception("La contraseña debe tener al menos 6 caracteres");
        }

        if ($this->getByEmail($email)) {
            throw new Exception("El correo electrónico ya está registrado");
        }

        if ($this->getByUsername($username)) {
            throw new Exception("El nombre de usuario ya está registrado");
        }

        if (empty($data["role"])) {
            $data["role"] = "user";
        }

        //esta es una f() password_hash nativa de php
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $user = new User(
            null,
            $username,
            $email,
            $hashedPassword,
            $data["role"]
        );

        $id = $this->repository->create($user);

        return $this->getById($id);
    }

    public function login(string $email, string $password): User {
        $email = strtolower($email);

        if (empty($email) || empty($password)) {
            throw new Exception("El email y password son obligatorios");
        }

        $user = $this->repository->findByEmail($email);
        if (!$user || !password_verify($password, $user->password)) {
            throw new Exception("Credenciales inválidas");
        }

        unset($user->password);
        return $user;
    }

    public function update(int $id, array $data): User {
        $user = $this->repository->findById($id);
        if (!$user) {
            throw new Exception("Usuario no encontrado");
        }

        if (!empty($data["email"])) {
            $email = strtolower($data["email"]);

            // esta es una f() filter_validate_email nativa de php
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("El correo electrónico no es válido");
            }
            $userWithEmail = $this->getByEmail($email);
            if ($userWithEmail && (int)$userWithEmail->id !== $id) {
                throw new Exception("El correo electrónico ya está registrado por otro usuario");
            }
            $user->email = $email;
        }

        if (!empty($data["username"])) {
            $username = $data["username"];
            $userWithUsername = $this->getByUsername($username);
            if ($userWithUsername && (int)$userWithUsername->id !== $id) {
                throw new Exception("El nombre de usuario ya está registrado por otro usuario");
            }
            $user->username = $username;
        }

        if (!empty($data["password"])) {
            if (strlen($data["password"]) < 6) {
                throw new Exception("La contraseña debe tener al menos 6 caracteres");
            }

            // esta es una f() password_hash nativa de php
            $user->password = password_hash($data["password"], PASSWORD_DEFAULT);
        }

        if (!empty($data["role"])) {
            $user->role = $data["role"];
        }

        $this->repository->update($user);
        return $this->getById($id);
    }

    public function delete(int $id): array {
        $this->getById($id);
        $this->repository->delete($id);
        return ["message" => "Usuario eliminado exitosamente"];
    }
}