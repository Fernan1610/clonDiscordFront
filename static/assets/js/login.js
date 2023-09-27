document.addEventListener("DOMContentLoaded", function () {
  let select = document.getElementById("countrySelect");
  if (select) {
    dataPaises.forEach((country) => {
      let option = document.createElement("option");
      option.value = country.id;
      option.text = country.name_country;
      select.appendChild(option);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRegisterClient");
  const sendButton = document.getElementById("sendForm");

  sendButton.addEventListener("click", function (event) {
    event.preventDefault();
    const password = form.querySelector('[name="password"]').value;
    const repite_password = form.querySelector(
      '[name="repite_password"]'
    ).value;
    if (password !== repite_password) {
      mostrarAlerta("Error", "Las constraseñas no son iguales", "error");
      return;
    }
    const nombre = form.querySelector('[name="nombre"]').value;
    const apellido = form.querySelector('[name="apellido"]').value;
    const email = form.querySelector('[name="email"]').value;
    const sexo = form.querySelector('[name="sexo"]').value;
    const fecha_nacimiento = form.querySelector(
      '[name="fecha_nacimiento"]'
    ).value;
    const pais_id = form.querySelector('[name="pais_id"]').value;

    const formData = {
      nombre,
      apellido,
      email,
      password,
      repite_password,
      sexo,
      fecha_nacimiento,
      pais_id,
    };

    const cajaLogin = document.querySelector(".cajaLogin");
    const formRegisterUser = document.querySelector(".formRegisterUser");

    fetch("http://127.0.0.1:5100/registro-usuario", {
      method: "POST",
      body: JSON.stringify(formData),
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
      .then(function (data) {
        if (data === "Cuenta creada correctamente!") {
          mostrarAlerta("Exito", data, "success");
          cajaLogin.style.display = "block";
          formRegisterUser.style.display = "none";
        } else {
          mostrarAlerta("Error", data, "error");
        }
      })
      .catch((error) => {
        mostrarError(error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.querySelector('input[name="password"]').value;

    fetch("http://127.0.0.1:5100/login_user", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return returnError(response);
        }
        return response.json();
      })
      .then(function (data) {
        if (data) {
          mostrarAlerta("Redirigiendo...", "   ", "success");
          localStorage.setItem("user", JSON.stringify(data));
          setTimeout(function () {
            window.location.href =
              "../../../templates/public/chat/chatinicio.html";
          }, 2000);
        } else {
          mostrarAlerta("Error", data, "error");
        }
      })
      .catch((error) => {
        mostrarError(error);
      });
  });
});
