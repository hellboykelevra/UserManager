👥 Sistema de Gestión de Usuarios (CRUD)

Una aplicación web completa (Full-Stack) y ligera para gestionar un registro de usuarios. Permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) de forma asíncrona y fluida, ofreciendo una experiencia de usuario moderna sin necesidad de recargar la página.

✨ Características Principales

Operaciones CRUD completas: Añade, visualiza, edita y elimina usuarios fácilmente.

Interfaz Moderna y Responsiva: Diseño limpio adaptado a móviles, tablets y escritorio gracias a Tailwind CSS.

Validación Integrada: Formularios con campos requeridos y prevención de DNI duplicados.

Peticiones Asíncronas (AJAX): Comunicación con el servidor mediante la API fetch de JavaScript.

Notificaciones Toast: Alertas visuales no intrusivas para el feedback de las acciones del usuario (éxito, errores).

Modo de Simulación (Mock DB): Si la aplicación no detecta un servidor PHP activo, utiliza automáticamente el localStorage del navegador para simular el funcionamiento. ¡Ideal para demostraciones rápidas!

🛠️ Tecnologías Utilizadas

Frontend:

HTML5

CSS3 (Framework: Tailwind CSS vía CDN)

Vanilla JavaScript (ES6+)

Backend:

PHP (Uso de PDO para mayor seguridad y prevención de inyecciones SQL)

MySQL / MariaDB

📂 Estructura del Proyecto

El proyecto consta de tres archivos principales:

index.html - Contiene la interfaz de usuario, los estilos y toda la lógica del cliente (JavaScript).

api.php - El controlador del backend que recibe las peticiones HTTP, se conecta a la base de datos y devuelve respuestas en formato JSON.

database.sql - Script SQL para generar la base de datos y la tabla necesaria.

🚀 Guía de Instalación y Despliegue

Para ejecutar esta aplicación en un entorno real con persistencia de datos, necesitas un servidor web (como Apache o Nginx) con soporte para PHP y MySQL (puedes usar XAMPP, WAMP, o un hosting gratuito/de pago).

Paso 1: Configurar la Base de Datos

Abre tu gestor de base de datos MySQL (por ejemplo, phpMyAdmin).

Ejecuta el contenido del archivo database.sql o crea una base de datos llamada empresa_db y ejecuta el siguiente comando:

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido1 VARCHAR(50) NOT NULL,
    apellido2 VARCHAR(50) DEFAULT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Paso 2: Configurar la Conexión en PHP

Abre el archivo api.php con un editor de texto y busca la sección de "Configuración de la Base de Datos". Actualiza las credenciales según tu entorno de servidor:

$host = "localhost"; // O el host de tu base de datos
$db_name = "empresa_db"; // El nombre de tu base de datos
$username = "root"; // Tu usuario de MySQL
$password = ""; // Tu contraseña de MySQL


Paso 3: Despliegue

Mueve los archivos index.html y api.php a la carpeta pública de tu servidor web (generalmente htdocs, www o public_html).

Abre tu navegador web y accede a la ruta correspondiente (ej. http://localhost/gestor-usuarios/).

💡 Uso de la Aplicación

Añadir Usuario: Rellena los datos en el panel izquierdo y haz clic en "Guardar Datos".

Editar Usuario: Haz clic en el icono azul del lápiz (✏️) en la tabla correspondiente al usuario. Los datos se cargarán en el formulario; haz los cambios y pulsa "Guardar Datos".

Eliminar Usuario: Haz clic en el icono rojo de la papelera (🗑️) junto al usuario que deseas borrar.

Refrescar: Utiliza el botón "Refrescar" encima de la tabla para forzar una recarga de los datos desde el servidor.

Desarrollado como proyecto de demostración Full-Stack.
