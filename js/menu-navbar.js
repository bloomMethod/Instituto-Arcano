function activarMenu() {
  const menu = document.getElementById("menu-hamburguesa");
  const cerrar = document.getElementById("cerrar");
  const listaServicios = document.querySelector(".no-menu");

  menu.addEventListener("click", function () {
    listaServicios.classList.toggle("si-menu");
  });

  cerrar.addEventListener("click", function () {
    listaServicios.classList.toggle("si-menu");
  });
}
activarMenu();
