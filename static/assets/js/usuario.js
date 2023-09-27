const dataLogin = JSON.parse(localStorage.getItem("user"));
if (!dataLogin) {
  window.location.href =
    "../../../templates/public/modulo_login/Login_base.html";
}
//nombre del usuario en chat
const chatMemberName = document.querySelector(".chat-member__name");
if (chatMemberName) {
  chatMemberName.textContent = dataLogin.nombre + " " + dataLogin.apellido;
}

const imgElement = document.getElementById("avatarImage");
if (imgElement) {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:5100/get-foto-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({idLogin: dataLogin.idLogin}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener la imagen");
        }
        return response.blob();
      })
      .then((blob) => {
        if (blob.size <= 0) {
          imgElement.src = "../../../../static/assets/imgs/logoUsuario.png";
        } else {
          const blobUrl = window.URL.createObjectURL(blob);
          imgElement.src = blobUrl;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
