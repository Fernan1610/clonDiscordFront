// POPUP
const showPopupButton = document.getElementById("show-popup_crear_Server");
const popupContainer = document.getElementById("popup_crear_Server");
const closePopupButton = document.getElementById("close-popup_crear_Server");
const confirmPopUp = document.getElementById("pop-up_create_confirm");
const listServer = document.getElementById("server-list");
const servidoresPanel = document.querySelector(".chat__content");
const userUserLogin = localStorage.getItem("user");
const userJson = JSON.parse(userUserLogin);

showPopupButton.addEventListener("click", () => {
  popupContainer.style.display = "block";
});

closePopupButton.addEventListener("click", () => {
  popupContainer.style.display = "none";
});

popupContainer.addEventListener("click", (event) => {
  if (event.target === popupContainer) {
    popupContainer.style.display = "none";
  }
});
// GET SERVIDORES POR USUARIO
document.addEventListener("DOMContentLoaded", function () {
  fetch(`http://127.0.0.1:5100/getServidoresByUsuario/${userJson.idLogin}`)
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      return response.json();
    })
    .then((data) => {
      crearListaServidores(data);
    })
    .catch((error) => {
      mostrarError(error);
    });
});

//CREAR SERVIDORES
document.addEventListener("DOMContentLoaded", function () {
  const crearServerForm = document.getElementById("crear-server-form");
  const inputNombreServidor = document.getElementById("dato_crear_Server");
  // const inputImagen = document.getElementById("imagen_crear");

  crearServerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nombreServidor = inputNombreServidor.value;
    // const imagen = inputImagen.files[0];

    const formData = new FormData();
    formData.append("nombre", nombreServidor);
    formData.append("idLogin", userJson.idLogin);
    // formData.append("imagen", imagen);

    fetch("http://127.0.0.1:5100/createServer", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return returnError(response);
        }
        popupContainer.style.display = "none";
        mostrarAlerta("Exito", "Servidor creado.", "success");
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          crearListaServidores(data);
        }
      })
      .catch((error) => {
        mostrarError(error);
      });
  });
});

function crearListaServidores(data) {
  listServer.innerHTML = "";
  data.forEach((server) => {
    const listItem = document.createElement("li");
    listItem.classList.add("server");
    listItem.setAttribute("data-id", server.id);
    if (server.avatar != null) {
      listItem.textContent = server.avatar;
    } else {
      const iniciales = obtenerIniciales(server.nombre);
      listItem.textContent = iniciales;
      listItem.style.textAlign = "center";
    }
    listItem.style.width = "5rem";
    listItem.style.height = "3.5rem";
    listItem.style.borderRadius = "1rem";
    listItem.style.marginLeft = "0.5rem";
    listItem.style.border = "0.1rem solid";
    listItem.style.marginBottom = "1rem";
    listItem.style.display = "flex";
    listItem.style.flexDirection = "row";
    listItem.style.alignItems = "center";
    listItem.style.flexWrap = "nowrap";
    listItem.style.justifyContent = "space-between";
    listItem.style.backgroundColor = "#2f3136";
    listItem.style.paddingLeft = "1rem";
    // Agregar el tooltip con el nombre del servidor
    listItem.setAttribute("title", server.nombre);

    // Agregar evento de clic para darle foco al elemento seleccionado
    listItem.addEventListener("click", () => {
      listItem.focus(); // Darle foco al elemento haciendo clic
    });
    // Agregar estilos al hacer hover
    listItem.addEventListener("mouseenter", () => {
      listItem.style.backgroundColor = "#396df1"; // Cambia el color de fondo al hacer hover
      listItem.style.borderRadius = "1rem"; // Cambia el radio del borde al hacer hover
    });

    // Restablecer los estilos al dejar de hacer hover
    listItem.addEventListener("mouseleave", () => {
      listItem.style.backgroundColor = "#2f3136"; // Restablece el color de fondo
      listItem.style.borderRadius = "2rem"; // Restablece el radio del borde
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button-server");
    let svgString =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">';
    svgString +=
      '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>';
    svgString +=
      '<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>';
    deleteButton.innerHTML = svgString;
    deleteButton.title = "Eliminar Servidor";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "0";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.borderRadius = "50%";
    deleteButton.style.width = "20px";
    deleteButton.style.height = "20px";
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      mostrarPopupConfirmacionEliminar(function (conf) {
        if (conf) {
          deleteServer(server.id);
        }
      });
    });
    listItem.appendChild(deleteButton);

    listServer.classList.add("list-container");
    listServer.appendChild(listItem);
  });
}
function deleteServer(serverId) {
  fetch("http://127.0.0.1:5100/eliminarServidor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({server_id: serverId, idLogin: userJson.idLogin}),
  })
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      popupContainerCanal.style.display = "none";
      mostrarAlerta("Exito", "Servidor eliminado.", "success");
      return response.json();
    })
    .then((data) => {
      channelList.innerHTML = "";
      divContent.innerHTML = "";
      crearListaServidores(data);
    })
    .catch((error) => {
      mostrarError(error);
    });
}
function obtenerIniciales(cadena) {
  // Dividimos la cadena en palabras
  const palabras = cadena.split(" ");
  // Inicializamos una variable para almacenar las iniciales
  let iniciales = "";

  // Recorremos cada palabra y obtenemos la primera letra en mayúscula
  for (const palabra of palabras) {
    iniciales += palabra.charAt(0).toUpperCase();
  }

  return iniciales;
}

document.addEventListener("DOMContentLoaded", function () {
  const cargarServidoresBtn = document.getElementById("show-servers-free");
  cargarServidoresBtn.addEventListener("click", function () {
    fetchGetServidores();
  });
});

function fetchGetServidores() {
  fetch(`http://127.0.0.1:5100/getListServers/${userJson.idLogin}`)
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      return response.json();
    })
    .then((listaServidores) => {
      channelList.innerHTML = "";
      btnCrear.style.display = "none";

      if (listaServidores.length === 0) {
        servidoresPanel.innerHTML = "";
        const noServersMessage = document.createElement("div");
        noServersMessage.textContent = "No hay servidores";
        noServersMessage.classList.add("no-servers-message");
        servidoresPanel.appendChild(noServersMessage);
      } else {
        servidoresPanel.innerHTML = "";
        chatForm.style.display = "none";

        // Crear el campo de búsqueda dinámicamente
        const searchInputFilter = document.createElement("input");
        searchInputFilter.type = "text";
        searchInputFilter.id = "searchInputFilter";
        searchInputFilter.placeholder = "Buscar servidor por nombre";

        // Agregar un evento input al campo de búsqueda para realizar la búsqueda en tiempo real
        searchInputFilter.addEventListener("input", function () {
          const divServer = document.querySelector(".server-list-container");
          const filteredServers = listaServidores.filter((servidor) =>
            servidor.nombre
              .toLowerCase()
              .includes(searchInputFilter.value.toLowerCase())
          );
          if (divServer) {
            divServer.remove();
          }
          createListServer(filteredServers);
        });
        servidoresPanel.appendChild(
          searchInputFilter,
          servidoresPanel.firstChild
        );
        createListServer(listaServidores);
      }
    })
    .catch((error) => {
      mostrarError(error);
    });
}

function createListServer(listaServidores) {
  const serverListContainer = document.createElement("div");
  serverListContainer.classList.add("server-list-container");
  listaServidores.forEach((servidor) => {
    const servidorElement = document.createElement("div");
    servidorElement.classList.add("server-item");

    // Imagen del servidor (con imagen por defecto)
    const imagenServidor = document.createElement("img");
    imagenServidor.classList.add("server-image");

    if (servidor.avatar) {
      // Crear una URL de objeto a partir del Blob
      const blobUrl = URL.createObjectURL(servidor.avatar);
      imagenServidor.src = blobUrl;
    } else {
      // Si no hay imagen, utiliza el código SVG de los servidores
      const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" fill="#ffffff" class="bi bi-hdd-rack" viewBox="0 0 16 16">
              <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm2 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-2.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
              <path d="M2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v2H2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1V7h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm0 7v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-3-4v2H4V7h8z"/>
            </svg>`;
      imagenServidor.src = `data:image/svg+xml;base64,${btoa(svgCode)}`;
      imagenServidor.alt = "Tres servidores";
    }

    servidorElement.appendChild(imagenServidor);

    const tituloServidor = document.createElement("div");
    tituloServidor.textContent =
      servidor.nombre + " (" + servidor.numero_usuarios + ")";
    servidorElement.appendChild(tituloServidor);

    const botonUnirse = document.createElement("button");
    botonUnirse.textContent = "Unirse";
    botonUnirse.classList.add("join-button");

    // Asigna el id del servidor al botón
    botonUnirse.setAttribute("data-servidor-id", servidor.id);

    botonUnirse.addEventListener("click", function () {
      const servidorId = this.getAttribute("data-servidor-id");
      mostrarConfirmacion(servidorId);
    });

    servidorElement.appendChild(botonUnirse);
    serverListContainer.appendChild(servidorElement);
  });
  servidoresPanel.appendChild(serverListContainer);
}

// Función para mostrar el cuadro de diálogo modal de confirmación
function mostrarConfirmacion(servidorId) {
  const modal = document.getElementById("modal");
  const confirmarBtn = document.getElementById("confirm-join");
  const cancelarBtn = document.getElementById("cancel-join");

  modal.style.display = "block";

  confirmarBtn.addEventListener("click", function () {
    modal.style.display = "none";
    unirseAServidor(servidorId);
  });

  cancelarBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

// Función para unirse al servidor
function unirseAServidor(servidorId) {
  fetch(`http://127.0.0.1:5100/unirseServidor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({serverId: servidorId, idLogin: userJson.idLogin}),
  })
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      mostrarAlerta("Exito", "Servidor creado.", "success");
      return response.json();
    })
    .then((data) => {
      crearListaServidores(data);
      fetchGetServidores();
    })
    .catch((error) => {
      mostrarError(error);
    });
}

const a = document.getElementById("server-list");
a.addEventListener("click", function (e) {
  if (e.target.tagName === "li") {
    e.target.style.backgroundColor = "#396df1";
  }
});
