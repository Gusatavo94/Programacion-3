CREATE DATABASE IF NOT EXISTS hermes 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hermes;

-- tabla de users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- tabla de post
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    titulo VARCHAR(60) NOT NULL,
    contenido TEXT NOT NULL,
    img VARCHAR(255) NOT NULL,
    categoria ENUM('Novedad', 'Tecnologia', 'Programas') NOT NULL
);
