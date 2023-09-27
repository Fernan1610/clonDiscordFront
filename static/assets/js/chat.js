const channelListA = document.getElementById("channel-list");
const mensajeInput = document.querySelector("#mensaje");
const form_chat = document.querySelector("#formulario_chat");
const divContent = document.querySelector(".chat__content");
const userLocal = localStorage.getItem("user");
const user = JSON.parse(userLocal);

let channel_id = null;
document.addEventListener("DOMContentLoaded", function () {
  channelListA.addEventListener("click", function (event) {
    channel_id = event.target.getAttribute("data-id");
  });
});

/**
 * Asignando el focus por defecto al input con id mensaje
 */
if (mensajeInput) {
  mensajeInput.focus();
}

/**
 * Inicializando SocketIO
 */
const socket = io();

//Escuchando connect
socket.on("connect", function () {
  console.log("Socket Activo y escuchando.!");
});

//Escuchando disconnect
socket.on("disconnect", function () {
  localStorage.removeItem("user");
  console.log("Socket Desconectado.!");
});

if (form_chat) {
  form_chat.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (mensajeInput && mensajeInput.value.trim() === "") {
      mensajeInput.style.border = "1px solid #ffb2a0";
      return;
    }
    mensajeInput.style.border = "";
    socket.emit("mensaje_chat", {
      mensaje: mensajeInput.value,
      canal_id: channel_id,
    });
    mensajeInput.value = "";
  });
}

/**
 * Escuchando el evento "mensaje_chat" en el cliente JavaScript y recibiendo el mensaje enviado desde el servidor
 */
socket.on("mensaje_chat", (mensajes) => {
  try {
    const listaMensajes = JSON.parse(mensajes);
    const html = crearHtmlMensajes(listaMensajes);
    divContent.innerHTML = "";
    divContent.innerHTML += html;
    scroll_chat();
  } catch (error) {
    mostrarError(error);
  }
});

socket.on("delete_mensaje", (mensajes) => {
  try {
    const listaMensajes = JSON.parse(mensajes);
    const html = crearHtmlMensajes(listaMensajes);
    divContent.innerHTML = "";
    divContent.innerHTML += html;
    scroll_chat();
  } catch (error) {
    mostrarError(error);
  }
});

socket.on("update_mensaje", (mensajes) => {
  try {
    const listaMensajes = JSON.parse(mensajes);
    const html = crearHtmlMensajes(listaMensajes);
    divContent.innerHTML = "";
    divContent.innerHTML += html;
    scroll_chat();
  } catch (error) {
    mostrarError(error);
  }
});

/**
 * Manipular el scroll cuando existe un nuevo mensaje
 */
const scroll_chat = () => {
  const scrollHeight = divContent.scrollHeight;
  const scrollToBottom = () => {
    const scrollOptions = {
      top: scrollHeight,
      behavior: "smooth",
    };
    divContent.scrollTo(scrollOptions);
  };
  setTimeout(scrollToBottom, 100); // Ajusta el valor del retraso según sea necesario
};

//elimina mensajes
function deleteMensaje(messageId, canal_id) {
  try {
    socket.emit("delete_mensaje", {
      message_id: messageId,
      canal_id: canal_id,
    });
  } catch (error) {
    mostrarError(error);
  }
}

//comportamiento botones
function editarMensaje(button) {
  const messageId = button.getAttribute("data-message-id");
  const textarea = document.querySelector(
    `textarea[data-message-id="${messageId}"]`
  );
  const saveButton = document.querySelector(
    `.save-button[data-message-id="${messageId}"]`
  );
  textarea.style.display = "block";
  saveButton.style.display = "inline";
  button.style.display = "none";
}

//actualiza los mensajes
function guardarCambios(button) {
  try {
    const messageId = button.getAttribute("data-message-id");
    const textarea = document.querySelector(
      `textarea[data-message-id="${messageId}"]`
    );
    const nuevoMensaje = textarea.value;
    socket.emit("update_mensaje", {
      mensaje_id: messageId,
      mensaje: nuevoMensaje,
      channel_id: channel_id,
    });
  } catch (error) {
    mostrarError(error);
  }
}

//crear html con mensajes
function crearHtmlMensajes(listaMensajes) {
  let html = [];

  if (listaMensajes && listaMensajes.length > 0) {
    html.push('<ul class="chat__list-messages">');
    for (let i = 0; i < listaMensajes.length; i++) {
      let mensaje = listaMensajes[i];
      html.push("<li>");
      const esPar = i % 2 === 0;
      html.push(
        `<div class="chat__time" ${!esPar ? 'style="align-self: end"' : null}>${
          mensaje.fecha_formateada
        }</div>`
      );
      html.push(
        `<div class="chat__bubble ${
          !esPar ? "chat__bubble--you" : "chat__bubble--me"
        }">${mensaje.mensaje}</div>`
      );
      if (mensaje.usuario_id == user.idLogin) {
        html.push(
          `<button class="delete-button" data-message-id="${mensaje.id}" onclick="deleteMensaje('${mensaje.id}','${mensaje.canal_id}')">Eliminar</button>`
        );
        html.push(
          `<button class="edit-button" data-message-id="${mensaje.id}" onclick="editarMensaje(this)">Editar</button>`
        );
        html.push(
          `<textarea class="edit-textarea" data-message-id="${mensaje.id}" style="display:none;">${mensaje.mensaje}</textarea>`
        );
        html.push(
          `<button class="save-button" data-message-id="${mensaje.id}" data-channel-id="${mensaje.canal_id}" onclick="guardarCambios(this)" style="display:none;">Guardar</button>`
        );
      }
      html.push("</li>");
    }
    html.push("</ul>");
  }
  return html.join("");
}

// document.addEventListener("DOMContentLoaded", function () {
//   const botonConfig = document.querySelector(".botonConfig");

//   botonConfig.addEventListener("click", function (e) {
//     e.preventDefault();
//     setTimeout(function () {
//       window.location.href = "../../../templates/public/dashboard/home.html";
//     }, 500);
//   });
// });
