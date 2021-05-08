<?php
$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if ($accion == 'crear') :
    // Codigo para crear los administradores
    //hashear passwords
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    // importar la conexión
    include '../functions/conexion.php';
    try {
        //Realizar la consulta a la bd
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES(?,?)");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // En caso de un error, tomar la exepción
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
endif;

if ($accion == 'login') :
    // Codigo que loguee a los administradores
    include '../functions/conexion.php';
    try {
        //Realizar la consulta a la bd
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
        $stmt->fetch();
        if ($nombre_usuario) {
            // El usuario existe verificar password
            if (password_verify($password, $pass_usuario)) {
                //Iniciar la sesión
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                $respuesta = array(
                    'resultado' => 'Contraseña incorrecta'
                );
            }
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // En caso de un error, tomar la exepción
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
endif;
