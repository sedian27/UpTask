eventListeners();
// lista de proyectos
let listaProyectos = document.querySelector("ul#proyectos");

function eventListeners() {
  // Document Ready
  document.addEventListener("DOMContentLoaded", function () {
    actualizarProgreso();
  });

  // boton para crear proyecto
  document
    .querySelector(".crear-proyecto a")
    .addEventListener("click", nuevoProyecto);

  // boton para una nueva tarea
  document
    .querySelector(".nueva-tarea")
    .addEventListener("click", agregarTarea);

  // botones para las acciones de las tareas
  document
    .querySelector(".listado-pendientes")
    .addEventListener("click", accionesTareas);
}

function nuevoProyecto(e) {
  e.preventDefault();
  console.log("presionaste en nuevo proyecto");

  // crea un input para el nombre del nuevo proyecto
  let nuevoProyecto = document.createElement("li");
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);

  // seleccionar el ID con el nuevoProyecto
  let inputNuevoProyecto = document.querySelector("#nuevo-proyecto");

  // Al presionar enter crea el proyecto
  inputNuevoProyecto.addEventListener("keypress", function (e) {
    let tecla = e.which || e.keyCode;
    if (tecla == 13) {
      guardarProyectoDB(inputNuevoProyecto.value);
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto) {
  // Crear llamado a ajax
  let xhr = new XMLHttpRequest();
  // enviar datos por formdata
  let datos = new FormData();
  datos.append("proyecto", nombreProyecto);
  datos.append("accion", "crear");
  //Abrir la conexión
  xhr.open("POST", "inc/modelos/modelo-proyecto.php", true);
  // Carga
  xhr.onload = function () {
    if (this.status == 200) {
      let respuesta = JSON.parse(xhr.responseText),
        proyecto = respuesta.proyecto,
        id_proyecto = respuesta.id_proyecto,
        tipo = respuesta.tipo,
        resultado = respuesta.respuesta;

      // comprobar la inserción
      if (resultado == "correcto") {
        //fue exitoso
        if (tipo == "crear") {
          // se creo un nuevo proyecto
          // inyectar html
          let nuevoProyecto = document.createElement("li");
          nuevoProyecto.innerHTML = `
                <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                    ${proyecto}
                </a>`;
          listaProyectos.appendChild(nuevoProyecto);
          // enviar alerta
          swal({
            type: "success",
            title: "Proyecto creado!",
            text: `El proyecto: ${proyecto} se creó correctamente!`,
          }).then((result) => {
            if (result.value) {
              // redireccionar a la nueva URL
              window.location.href = `index.php?id_proyecto=${id_proyecto}`;
            }
          });
        } else {
          // se actualizo o elimino
        }
      } else {
        // hubo un error
        swal({
          type: "error",
          title: "Error!",
          text: "Hubo un error!",
        });
      }
    }
  };
  // Enviar
  xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
  e.preventDefault();
  let nombreTarea = document.querySelector(".nombre-tarea").value;
  if (nombreTarea == "") {
    swal({
      title: "Error",
      text: "Una tarea no puede ir vacía!",
      type: "error",
    });
  } else {
    // la tarea tiene algo insertar en php
    // crear llamado a ajax
    let xhr = new XMLHttpRequest();
    // crear formdata
    let datos = new FormData();
    datos.append("tarea", nombreTarea);
    datos.append("accion", "crear");
    datos.append("idProyecto", document.querySelector("#id_proyecto").value);
    // abrir la conexión
    xhr.open("POST", "inc/modelos/modelo-tarea.php", true);
    // ejecutar
    xhr.onload = function () {
      if (this.status == 200) {
        // todo correcto
        let respuesta = JSON.parse(xhr.responseText);
        // asignar valores
        let resultado = respuesta.respuesta,
          tarea = respuesta.tarea,
          idInsertado = respuesta.id_insertado,
          tipo = respuesta.tipo;
        if (respuesta.respuesta == "correcto") {
          // se agrego correctamente
          if (tipo == "crear") {
            actualizarProgreso();
            swal({
              title: "Tarea creada",
              text: `La tarea: ${tarea} se creo correctamente!`,
              type: "success",
            });
            // Seleccionar el parrafo con la lista vacía
            let parrafoListaVacia = document.querySelectorAll(".lista-vacia");
            if (parrafoListaVacia.length > 0) {
              document.querySelector(".lista-vacia").remove();
            }
            // construir el template
            let nuevaTarea = document.createElement("li");
            // Agregamos el id
            nuevaTarea.id = `tarea:${idInsertado}`;
            // Agregamos la tarea
            nuevaTarea.classList.add("tarea");
            // construir el html
            nuevaTarea.innerHTML = `
                <p>${tarea}</p>
                <div class="acciones">
                    <i class="far fa-check-circle"></i>
                    <i class="fas fa-trash"></i>
                </div>
            `;
            // Agregarlo al HTML
            let listado = document.querySelector(".listado-pendientes ul");
            listado.appendChild(nuevaTarea);

            // limpiar el formulario;
            document.querySelector(".agregar-tarea").reset();
          }
        } else {
          // hubo un error
          swal({
            title: "Error",
            text: "Hubo un error!",
            type: "error",
          });
        }
      }
    };
    // enviar
    xhr.send(datos);
  }
}

// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
  e.preventDefault();
  if (e.target.classList.contains("fa-check-circle")) {
    if (e.target.classList.contains("completo")) {
      e.target.classList.remove("completo");
      cambiarEstadoTarea(e.target, 0);
    } else {
      e.target.classList.add("completo");
      cambiarEstadoTarea(e.target, 1);
    }
  }
  if (e.target.classList.contains("fa-trash")) {
    swal({
      title: "¿Seguro(a)?",
      text: "Esta accion no se puede deshacer",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      if (resultado.value) {
        let tareaEliminar = e.target.parentElement.parentElement;
        // borrar de la base de datos
        eliminarTareaBD(tareaEliminar);
        // borrar del html
        tareaEliminar.remove();

        swal({
          title: "Eliminado!",
          text: "La tarea fue eliminada!.",
          type: "success",
        });
      }
    });
  }
}

// Completa o descompleta la tarea
function cambiarEstadoTarea(tarea, estado) {
  let idTarea = tarea.parentElement.parentElement.id.split(":")[1];

  // crear llamado a ajax
  let xhr = new XMLHttpRequest();
  //información
  let datos = new FormData();
  datos.append("id", idTarea);
  datos.append("accion", "actualizar");
  datos.append("estado", estado);
  // abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-tarea.php", true);
  // on load
  xhr.onload = function () {
    if (this.status == 200) {
      let respuesta = JSON.parse(xhr.responseText);
      actualizarProgreso();
    }
  };
  // enviar
  xhr.send(datos);
}

// eliminar tarea
function eliminarTareaBD(tarea) {
  let idTarea = tarea.id.split(":")[1];

  // crear llamado a ajax
  let xhr = new XMLHttpRequest();
  //información
  let datos = new FormData();
  datos.append("id", idTarea);
  datos.append("accion", "eliminar");
  // abrir la conexion
  xhr.open("POST", "inc/modelos/modelo-tarea.php", true);
  // on load
  xhr.onload = function () {
    if (this.status == 200) {
      let respuesta = JSON.parse(xhr.responseText);
      actualizarProgreso();
      // comprobar que existan tareas
      let listaTareasRestantes = document.querySelectorAll("li.tarea");
      if (listaTareasRestantes.length == 0) {
        document.querySelector(".listado-pendientes ul").innerHTML =
          "<p class='lista-vacia'> No hay tareas en este proyecto </p>";
      }
    }
  };
  // enviar
  xhr.send(datos);
}

// Actualiza el avance del proyecto
function actualizarProgreso() {
  // obtener todas las tareas
  const tareas = document.querySelectorAll("li.tarea");
  // obetener las tareas completadas
  const tareasCompletadas = document.querySelectorAll("i.completo");
  // Determinar el avance
  const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
  // asignar el avance a la barra
  const porcentaje = document.querySelector("#porcentaje");
  porcentaje.style.width = avance + "%";

  // Mostrar una alerta al completar
  if (avance == 100) {
    swal({
      title: "Proyecto terminado",
      text: "Ya no tienes tareas pendientes!",
      type: "success",
    });
  }
}
