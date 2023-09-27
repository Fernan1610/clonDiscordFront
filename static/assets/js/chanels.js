const serverList = document.getElementById("server-list");
const channelList = document.getElementById("channel-list");
const servidorName = document.getElementById("nameServidor");
const showPopupButtonCanal = document.getElementById("show-popup_crear_canal");
const popupContainerCanal = document.getElementById("popup_crear_canal");
const closePopupButtonCanal = document.getElementById(
  "close-popup_crear_canal"
);
const chatContent = document.querySelector(".chat__content");
const chatForm = document.querySelector(".form-chat");
const btnCrear = document.querySelector(".btn-crear-canal");
let NameServidor = "";

showPopupButtonCanal.addEventListener("click", () => {
  popupContainerCanal.style.display = "block";
});

closePopupButtonCanal.addEventListener("click", () => {
  popupContainerCanal.style.display = "none";
});

popupContainerCanal.addEventListener("click", (event) => {
  if (event.target === popupContainerCanal) {
    popupContainerCanal.style.display = "none";
  }
});

//Trae los canales
document.addEventListener("DOMContentLoaded", function () {
  serverList.addEventListener("click", function (event) {
    const serverId = event.target.getAttribute("data-id");
    loadChannels(serverId);
    loadNameServidor(serverId);
  });
});

function loadNameServidor(serverId) {
  fetch(`http://127.0.0.1:5100/get_serverName/${serverId}`)
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      return response.json();
    })
    .then((data) => {
      NameServidor = data[0].nombre;
      servidorName.innerHTML = "";
      servidorName.textContent = NameServidor;
    })
    .catch((error) => {
      mostrarError(error);
    });
}

function loadChannels(serverId) {
  fetch(`http://127.0.0.1:5100/get_channels/${serverId}`)
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      return response.json();
    })
    .then((data) => {
      chatContent.innerHTML = "";
      chatForm.style.display = "none";
      btnCrear.style.display = "inline";
      const noChannelsMessage = document.createElement("li");
      if (data.length === 0) {
        channelList.innerHTML = "";
        noChannelsMessage.textContent = "El servidor no posee canales";
        channelList.appendChild(noChannelsMessage);
      } else {
        channelList.innerHTML = "";
        channelList.style.marginLeft = "1rem";
        crearListaDeCanales(data, serverId);
      }
    })
    .catch((error) => {
      mostrarError(error);
    });
}
// Función para eliminar el canal
function eliminarCanal(channelId, serverId) {
  fetch("http://127.0.0.1:5100/delete_channel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({channel_id: channelId, server_id: serverId}),
  })
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      popupContainerCanal.style.display = "none";
      mostrarAlerta("Exito", "Canal eliminado.", "success");
      return response.json();
    })
    .then((data) => {
      divContent.innerHTML = "";
      channelList.innerHTML = "";
      crearListaDeCanales(data, serverId);
    })
    .catch((error) => {
      mostrarError(error);
    });
}

function mostrarConfirmacionEliminar(channelId, serverId) {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas eliminar este canal?"
  );

  if (confirmacion) {
    eliminarCanal(channelId, serverId);
  }
}
//crea canal
document.addEventListener("DOMContentLoaded", function () {
  const crearServerForm = document.getElementById("crear-chanel-form");
  const inputNombreServidor = document.getElementById("dato_crear_canal");
  serverList.addEventListener("click", function (event) {
    const serverId = event.target.getAttribute("data-id");
    crearServerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const nombreServidor = inputNombreServidor.value;
      fetch("http://127.0.0.1:5100/createChanel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({nombre: nombreServidor, serverId: serverId}),
      })
        .then((response) => {
          if (!response.ok) {
            return returnError(response);
          }
          popupContainerCanal.style.display = "none";
          mostrarAlerta("Exito", "Canal creado.", "success");
          return response.json();
        })
        .then((data) => {
          channelList.innerHTML = "";
          crearListaDeCanales(data, serverId);
        })
        .catch((error) => {
          mostrarError(error);
        });
    });
  });
});

function crearListaDeCanales(data, serverId) {
  chatForm.style.display = "none";
  data.forEach((channel) => {
    const channelItem = document.createElement("li");
    channelItem.classList.add("channel");
    channelItem.setAttribute("data-id", channel.id);
    channelItem.textContent = channel.nombre;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button-canal");

    let svgString =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">';
    svgString +=
      '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>';
    svgString +=
      '<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/></svg>';

    deleteButton.innerHTML = svgString;
    deleteButton.title = "Eliminar Canal";
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      const channelId = channelItem.getAttribute("data-id");
      //
      mostrarPopupConfirmacionEliminar(function (confirmacion) {
        if (confirmacion) {
          eliminarCanal(channelId, serverId);
        }
      });
    });
    channelItem.appendChild(deleteButton);
    channelList.appendChild(channelItem);
  });
}

// trae los mensajes por el canal seleccionado
document.addEventListener("DOMContentLoaded", function () {
  channelList.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("channel")) {
      chatForm.style.display = "inline";
      const canalId = event.target.getAttribute("data-id");
      fetch(`http://127.0.0.1:5100/get_messages/${canalId}`)
        .then((response) => {
          if (!response.ok) {
            return returnError(response);
          }
          return response.json();
        })
        .then((messages) => {
          if (messages.length === 0) {
            chatContent.innerHTML = "";
            const noChannelsMessage = document.createElement("li");
            noChannelsMessage.textContent = "No posee mensajes en este canal.";
            chatContent.appendChild(noChannelsMessage);
          } else {
            const listaMesnsajes = crearHtmlMensajes(messages);
            chatContent.innerHTML = "";
            chatContent.innerHTML += listaMesnsajes;
            scroll_chat();
          }
        })
        .catch((error) => {
          mostrarError(error);
        });
    }
  });
});

function createListChat(messages) {
  const chatList = document.createElement("ul");
  chatList.classList.add("chat__list-messages");

  messages.forEach((mensaje, index) => {
    const li = document.createElement("li");
    const chatTime = document.createElement("div");
    chatTime.classList.add("chat__time");
    chatTime.textContent = mensaje.fecha_formateada;
    const chatBubble = document.createElement("div");
    chatBubble.classList.add("chat__bubble");
    if (index % 2 === 0) {
      chatTime.style.alignSelf = "end";
      chatBubble.classList.add("chat__bubble--you");
    } else {
      chatBubble.classList.add("chat__bubble--me");
    }
    chatBubble.textContent = mensaje.mensaje;
    li.appendChild(chatTime);
    li.appendChild(chatBubble);
    chatList.appendChild(li);
  });
  return chatList;
}
