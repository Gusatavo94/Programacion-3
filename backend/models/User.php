<?php

class User {
    public ?int $id;
    public string $username;
    public string $email;
    public ?string $password;
    public string $role;

    public function __construct(?int $id, string $username, string $email, ?string $password = null, string $role = "user") {
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;
    }
}
