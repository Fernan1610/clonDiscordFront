function mostrarAlerta(title, msjAlert, tipo) {
  if (title && msjAlert) {
    const toastAlert = document.createElement("div");
    toastAlert.classList.add("toast_alert", "active");

    const alertContent = `
    <div class=${
      tipo == "error" ? "toast_alert-content-error" : "toast_alert-content"
    }>
      <i class="bi bi-check check"></i>
      <div class="message">
        <span class="text text-1">${title}</span>
        <span class="text text-2">${msjAlert}</span>
      </div>
    </div>
    <i class="bi bi-x close"></i>
    <div class="progress active"></div>
  `;

    toastAlert.innerHTML = alertContent;

    const alertContainer = document.getElementById("alertContainer");
    if (alertContainer) alertContainer.appendChild(toastAlert);

    setTimeout(() => {
      toastAlert.remove();
    }, 3000);
  }
}

function returnError(response) {
  if (response) {
    return response.json().then((customError) => {
      throw customError;
    });
  }
}
function mostrarError(error) {
  if (error) {
    let descripcion = "";
    let name = "";
    if (
      error.error &&
      error.error.description &&
      typeof error.error.description === "string"
    ) {
      descripcion = error.error.description;
    } else if (error.error && error.error.description) {
      descripcion = error.error.descripcion[0];
    }
    if (error.error && error.error.name) {
      name = error.error.name;
    }
    mostrarAlerta(name, descripcion, "error");
  }
}

function mostrarPopupConfirmacionEliminar(callback) {
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-confirm");
  const popup = document.createElement("div");
  popup.classList.add("popup-confirm-overlay");
  document.body.classList.add("popup-opened");
  popupContainer.style.display = "block";
  const mensaje = document.createElement("p");
  mensaje.textContent = "¿Estás seguro de que deseas eliminar?";
  const botonSi = document.createElement("button");
  botonSi.textContent = "Sí";
  const botonNo = document.createElement("button");
  botonNo.textContent = "No";

  popup.appendChild(mensaje);
  popup.appendChild(botonSi);
  popup.appendChild(botonNo);
  popupContainer.appendChild(popup);
  document.getElementById("alertContainer").appendChild(popupContainer);

  popup.style.display = "block";

  botonSi.addEventListener("click", function () {
    closeConfirm();
    callback(true);
  });

  botonNo.addEventListener("click", function () {
    closeConfirm();
    callback(false);
  });
}
function closeConfirm() {
  const popupContainer = document.querySelector(".popup-confirm");
  document.body.classList.remove("popup-opened");
  popupContainer.remove();
}
