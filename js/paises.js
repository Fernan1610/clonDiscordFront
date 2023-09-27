const selectElement = document.getElementById("list-paises");

// carga los paises
function cargarPaisesDesdeAPI() {
  fetch("http://127.0.0.1:5100/getListaPaises")
    .then((response) => {
      if (!response.ok) {
        return returnError(response);
      }
      return response.json();
    })
    .then((data) => {
      selectElement.innerHTML = "";
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.id;
        option.textContent = country.name_country;
        selectElement.appendChild(option);
      });
    })
    .catch((error) => {
      mostrarError(error);
    });
}

if (selectElement) {
  window.addEventListener("load", cargarPaisesDesdeAPI);
}
