const toast = document.querySelector(".toast_alert");
const closeIcon = document.querySelector(".close");
const progress = document.querySelector(".progress");

let timer1, timer2;

/***Validando que no muestre error cuando esta clase 'close' no exista  */
if (closeIcon != null) {
  timer1 = setTimeout(() => {
    toast.classList.remove("active");
  }, 10000); //1s = 1000 milliseconds

  timer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 5300);

  closeIcon.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
      progress.classList.remove("active");
    }, 300);

    clearTimeout(timer1);
    clearTimeout(timer2);
  });

  /*---------------------------*/
  function showSuccessAlert(message) {
    const successAlert = document.getElementById("success-alert");
    const successMessage = document.getElementById("success-message");

    successMessage.textContent = message;
    successAlert.classList.add("active");

    setTimeout(function () {
      successAlert.classList.remove("active");
    }, 5000); // Ocultar la alerta después de 5 segundos (puedes ajustar este tiempo)
  }

  function showErrorAlert(message) {
    const errorAlert = document.getElementById("error-alert");
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = message;
    errorAlert.classList.add("active");

    setTimeout(function () {
      errorAlert.classList.remove("active");
    }, 5000); // Ocultar la alerta después de 5 segundos (puedes ajustar este tiempo)
  }

  function closeAlert(alertId) {
    const alert = document.getElementById(alertId);
    alert.classList.remove("active");
  }
}
