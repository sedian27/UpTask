<?php
$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if ($accion == 'crear') :
    // importar la conexión
    include '../functions/conexion.php';
    try {
        //Realizar la consulta a la bd
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES(?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_proyecto' => $stmt->insert_id,
                'tipo' => $accion,
                'proyecto' => $proyecto
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
