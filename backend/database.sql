-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS empresa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE empresa_db;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50) DEFAULT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar un par de datos de prueba (opcional)
INSERT INTO usuarios (nombre, apellido1, apellido2, dni, correo) VALUES 
('Ana', 'García', 'López', '12345678A', 'ana.garcia@email.com'),
('Carlos', 'Martínez', 'Ruiz', '87654321B', 'carlos.m@email.com');