eventListener();
function eventListener() {
  document
    .querySelector("#formulario")
    .addEventListener("submit", validarRegistro);
}

function validarRegistro(e) {
  e.preventDefault();
  let usuario = document.querySelector("#usuario").value,
    password = document.querySelector("#password").value,
    tipo = document.querySelector("#tipo").value;

  if (usuario == "" || password == "") {
    // La validación fallo!
    swal({
      type: "error",
      title: "Error!",
      text: "Ambos campos son obligatorios!",
    });
  } else {
    // Ambos campos tiene algo son correctos ejecutar Ajax:
    // Datos que se envian al servidor:
    let datos = new FormData();
    datos.append("usuario", usuario);
    datos.append("password", password);
    datos.append("accion", tipo);

    // Crear llamado a ajax:
    let xhr = new XMLHttpRequest();

    // Abrir la conexión.
    xhr.open("POST", "inc/modelos/modelo-admin.php", true);
    // Cargar.
    xhr.onload = function () {
      if (this.status == 200) {
        let respuesta = JSON.parse(xhr.responseText);
        console.log(respuesta);
        if (respuesta.respuesta == "correcto") {
          // Si es un nuevo usuario
          if (respuesta.tipo == "crear") {
            swal({
              type: "success",
              title: "Usuario creado!",
              text: "El usuario se creó correctamente!",
            });
          } else if (respuesta.tipo == "login") {
            swal({
              type: "success",
              title: "Login Correcto!",
              text: "Presiona OK para abrir el dashboard!",
            }).then((result) => {
              if (result.value) {
                window.location.href = "index.php";
              }
            });
          }
        } else {
          swal({
            type: "error",
            title: "Error",
            text: "Hubo un error",
          });
        }
      }
    };
    // enviar petición.
    xhr.send(datos);
  }
}
