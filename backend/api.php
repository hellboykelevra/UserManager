<?php
// Configuración de cabeceras para permitir peticiones AJAX y retornar JSON
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Configuración de la Base de Datos
$host = "localhost";
$db_name = "empresa_db";
$username = "root"; // Cambia por tu usuario de MySQL
$password = "";     // Cambia por tu contraseña de MySQL

// Conexión mediante PDO
try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $exception->getMessage()]);
    exit;
}

// Obtener la acción solicitada
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Obtener los datos enviados (formato JSON)
$data = json_decode(file_get_contents("php://input"));

switch ($action) {
    
    // LEER USUARIOS
    case 'read':
        try {
            $query = "SELECT * FROM usuarios ORDER BY id DESC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(["success" => true, "data" => $users]);
        } catch(PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error al obtener datos."]);
        }
        break;

    // CREAR USUARIO
    case 'create':
        if(!empty($data->nombre) && !empty($data->apellido1) && !empty($data->dni) && !empty($data->correo)) {
            try {
                $query = "INSERT INTO usuarios (nombre, apellido1, apellido2, dni, correo) 
                          VALUES (:nombre, :apellido1, :apellido2, :dni, :correo)";
                
                $stmt = $conn->prepare($query);
                
                // Limpiar datos
                $nombre = htmlspecialchars(strip_tags($data->nombre));
                $apellido1 = htmlspecialchars(strip_tags($data->apellido1));
                $apellido2 = htmlspecialchars(strip_tags($data->apellido2 ?? ''));
                $dni = htmlspecialchars(strip_tags($data->dni));
                $correo = htmlspecialchars(strip_tags($data->correo));

                // Vincular parámetros
                $stmt->bindParam(":nombre", $nombre);
                $stmt->bindParam(":apellido1", $apellido1);
                $stmt->bindParam(":apellido2", $apellido2);
                $stmt->bindParam(":dni", $dni);
                $stmt->bindParam(":correo", $correo);

                if($stmt->execute()) {
                    echo json_encode(["success" => true, "message" => "Usuario creado exitosamente."]);
                }
            } catch(PDOException $e) {
                // Código 23000 es violación de restricción (ej. DNI duplicado)
                $msg = ($e->getCode() == 23000) ? "El DNI o Correo ya está registrado." : "Error al crear usuario.";
                echo json_encode(["success" => false, "message" => $msg]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        }
        break;

    // ACTUALIZAR USUARIO
    case 'update':
        if(!empty($data->id) && !empty($data->nombre) && !empty($data->dni)) {
            try {
                $query = "UPDATE usuarios 
                          SET nombre = :nombre, apellido1 = :apellido1, apellido2 = :apellido2, 
                              dni = :dni, correo = :correo 
                          WHERE id = :id";
                
                $stmt = $conn->prepare($query);
                
                $stmt->bindParam(":id", $data->id);
                $stmt->bindParam(":nombre", $data->nombre);
                $stmt->bindParam(":apellido1", $data->apellido1);
                $stmt->bindParam(":apellido2", $data->apellido2);
                $stmt->bindParam(":dni", $data->dni);
                $stmt->bindParam(":correo", $data->correo);

                if($stmt->execute()) {
                    echo json_encode(["success" => true, "message" => "Usuario actualizado."]);
                }
            } catch(PDOException $e) {
                $msg = ($e->getCode() == 23000) ? "El DNI ya pertenece a otro usuario." : "Error al actualizar.";
                echo json_encode(["success" => false, "message" => $msg]);
            }
        }
        break;

    // ELIMINAR USUARIO
    case 'delete':
        if(!empty($data->id)) {
            try {
                $query = "DELETE FROM usuarios WHERE id = :id";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(":id", $data->id);
                
                if($stmt->execute()) {
                    echo json_encode(["success" => true, "message" => "Usuario eliminado."]);
                }
            } catch(PDOException $e) {
                echo json_encode(["success" => false, "message" => "Error al eliminar usuario."]);
            }
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Acción no válida."]);
        break;
}
?>