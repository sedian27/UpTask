<?php
$accion = $_POST['accion'];
$tarea = isset($_POST['tarea']) ? $_POST['tarea'] : '';
$idProyecto = (int)isset($_POST['idProyecto']) ? $_POST['idProyecto'] : 0;
$estado = (int)isset($_POST['estado']) ? $_POST['estado'] : 0;
$id = (int)isset($_POST['id']) ? $_POST['id'] : 0;
if ($accion == 'crear') :
    // importar la conexión
    include '../functions/conexion.php';
    try {
        //Realizar la consulta a la bd
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES(?,?)");
        $stmt->bind_param('si', $tarea, $idProyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
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

if ($accion == 'actualizar') :
    // importar la conexión
    include '../functions/conexion.php';
    try {
        //Realizar la consulta a la bd
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? where id = ?");
        $stmt->bind_param('ii', $estado, $id);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
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

if ($accion == 'eliminar') :
    // importar la conexión
    include '../functions/conexion.php';
    try {
        //Realizar la consulta a la bd
        $stmt = $conn->prepare("DELETE FROM tareas where id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
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
