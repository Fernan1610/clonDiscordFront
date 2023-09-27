const userLocal = localStorage.getItem("user");
const userLogin = JSON.parse(userLocal);

function mostrarContenido(id) {
  document.getElementById("informacion").style.display = "none";
  document.getElementById("editarPerfil").style.display = "none";
  document.getElementById(id).style.display = "block";
}
document
  .getElementById("enlaceInformacion")
  .addEventListener("click", function () {
    mostrarContenido("informacion");
  });

document
  .getElementById("enlaceEditarPerfil")
  .addEventListener("click", function () {
    mostrarContenido("editarPerfil");
  });
mostrarContenido("informacion");

//setea los datos del usuario
const inputName = document.getElementById("inputName");
const inputApellido = document.getElementById("inputApellido");
const inputEmail = document.getElementById("inputEmail");
inputName.value = user.nombre;
inputApellido.value = user.apellido;
inputEmail.value = user.emailLogin;

// setea el sexo del usuario
const radioMasculino = document.getElementById("Masculino");
const radioFemenino = document.getElementById("Femenino");
if (user.sexo === "Masculino") {
  radioMasculino.checked = true;
} else if (sexoUsuario === "Femenino") {
  radioFemenino.checked = true;
}

//carga la lista de paises
fetch("http://127.0.0.1:5100/getListaPaises")
  .then(function (response) {
    if (!response.ok) {
      return returnError(response);
    }
    return response.json();
  })
  .then(function (dataPaises) {
    const selectPaises = document.getElementById("list-country-edit");
    dataPaises.forEach(function (country) {
      const option = document.createElement("option");
      if (user.pais === country.name_country) {
        option.selected = true;
        option.value = country.id;
      } else {
        option.value = country.name_country;
      }
      option.textContent = country.name_country;
      selectPaises.appendChild(option);
    });
  })
  .catch((error) => {
    mostrarError(error);
  });

// carga la imagen
document.addEventListener("DOMContentLoaded", function () {
  fetch("http://127.0.0.1:5100/get-foto-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idLogin: userLogin.idLogin}),
  })
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      return response.blob();
    })
    .then((blob) => {
      const imgElement = document.getElementById("avatarImage");
      if (!blob || blob.size <= 0) {
        imgElement.src = "../../../../static/assets/imgs/logoUsuario.png";
      } else {
        const blobUrl = window.URL.createObjectURL(blob);
        imgElement.src = blobUrl;
      }
    })
    .catch((error) => {
      mostrarError(error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("logoutLink");
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    fetch("http://127.0.0.1:5100/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return returnError(response);
        }
        return response.text();
      })
      .then((response) => {
        if (response === "True") {
          mostrarAlerta("Redirigiendo...", "   ", "success");
          localStorage.removeItem("user");
          setTimeout(function () {
            window.location.href =
              "../../../templates/public/modulo_login/Login_base.html";
          }, 1000);
        }
      })
      .catch((error) => {
        mostrarError(error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const formUpdateUser = document.getElementById("form-update-user");

  formUpdateUser.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(formUpdateUser);
    formData.append("idLogin", userLogin.idLogin);

    fetch("http://127.0.0.1:5100/actualizar-mi-perfil", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return returnError(response);
        }
        return response.text();
      })
      .then((response) => {
        if (response) {
          mostrarAlerta("Usuario actualizado", "Redirigiendo...", "success");
          localStorage.removeItem("user");
          localStorage.setItem("user", response);
          setTimeout(function () {
            window.location.href =
              "../../../templates/public/chat/chatinicio.html";
          }, 1000);
        }
      })
      .catch((error) => {
        mostrarError(error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("redirectInit");
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    setTimeout(function () {
      window.location.href = "../../../templates/public/chat/chatinicio.html";
    }, 500);
  });
});
