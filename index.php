<?php
include 'inc/functions/sesiones.php';
include 'inc/templates/header.php';
include 'inc/templates/barra.php';
// Obtener el id de la URL
$idProyecto = null;
if (isset($_GET['id_proyecto'])) :
    $idProyecto = $_GET['id_proyecto'];
endif;
?>


<div class="contenedor">
    <?php
    include 'inc/templates/sidebar.php';
    ?>

    <main class="contenido-principal">
        <?php
        $proyecto = obtenerNombreProyecto($idProyecto);
        if ($proyecto) :
        ?>
            <h1>Proyecto Actual:
                <?php foreach ($proyecto as $nombre) : ?>
                    <span><?php echo $nombre['nombre']; ?></span>
                <?php endforeach; ?>
            </h1>

            <form action="#" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea">
                </div>
                <div class="campo enviar">
                    <input type="hidden" id="id_proyecto" value="<?php echo $idProyecto; ?>">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>
        <?php
        else :
            // Si no hay Proyectos seleccionados
            echo "<p>Selecciona un proyecto a trabajar</p>";
        endif; ?>



        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
                <?php
                // obtiene las tareas del proyecto actual
                $tareas = obtenerTareasProyecto($idProyecto);
                if ($tareas->num_rows > 0) :
                    foreach ($tareas as $tarea) : ?>
                        <li id="tarea:<?php echo $tarea['id']; ?>" class="tarea">
                            <p><?php echo $tarea['nombre']; ?></p>
                            <div class="acciones">
                                <i class="far fa-check-circle <?php echo ($tarea['estado'] == 1 ? 'completo' : '') ?>"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        </li>
                <?php endforeach;
                else :
                    echo "<p class='lista-vacia'> No hay tareas en este proyecto </p>";
                endif;
                ?>
            </ul>
        </div>
        <div class="avance">
            <h2>Avance del Proyecto:</h2>
            <div id="barra-avance" class="barra-avance">
                <div id="porcentaje" class="porcentaje"> </div>
            </div>
        </div>
    </main>
</div>
<!--.contenedor-->
<?php include 'inc/templates/footer.php'; ?>