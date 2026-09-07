const sliderConsultas = document.querySelector(".slider-consultas");
const trackConsultas = document.getElementById("sliderTrack-consulta");
const slidesConsultas = document.querySelectorAll(".slide-servicios");
const totalSlidesConsultas = slidesConsultas.length;
let currentIndexConsultas = 0;

// Variables para el arrastre / drag

let isDraggingConsultas = false;
let startXConsultas = 0;
let startTranslateConsultas = 0;
let currentTranslateConsultas = 0;

// variables para el autoplay

let autoPlayIntervalConsultas = null;
let autoPlayDelayConsultas = 3000; // 3 secs

// obtener posicion actual

function obtenerPosicionActualConsultas() {
  return -currentIndexConsultas * sliderConsultas.clientWidth;
}

function irASlideConsultas(index) {
  currentIndexConsultas = index;
  currentTranslateConsultas = obtenerPosicionActualConsultas();
  trackConsultas.style.transform =
    "translateX(" + currentTranslateConsultas + "px)";
}

function siguienteConsultas() {
  let nuevoIndex = currentIndexConsultas + 1;
  if (nuevoIndex >= totalSlidesConsultas) {
    nuevoIndex = 0;
  }
  irASlideConsultas(nuevoIndex);
}

function anteriorConsultas() {
  let nuevoIndex = currentIndexConsultas - 1;
  if (nuevoIndex < 0) {
    nuevoIndex = totalSlidesConsultas - 1;
  }
  irASlideConsultas(nuevoIndex);
}

// autoplay

function iniciarAutoplayConsultas() {
  autoPlayIntervalConsultas = setInterval(
    siguienteConsultas,
    autoPlayDelayConsultas,
  );
}

function detenerAutoplayConsultas() {
  clearInterval(autoPlayIntervalConsultas);
}

function reiniciarAutoplayConsultas() {
  detenerAutoplayConsultas();
  iniciarAutoplayConsultas();
}

// arrastre / drag - mouse y touch */

function iniciarArrastreConsultas(x) {
  isDraggingConsultas = true;
  startXConsultas = x;
  startTranslateConsultas = obtenerPosicionActualConsultas();
  trackConsultas.classList.add("dragging");
  detenerAutoplayConsultas();
}

function moverArrastreConsultas(x) {
  if (!isDraggingConsultas) {
    return;
  }
  let diferencia = x - startXConsultas;
  currentTranslateConsultas = startTranslateConsultas + diferencia;
  trackConsultas.style.transform =
    "translateX(" + currentTranslateConsultas + "px)";
}

function finalizarArrastreConsultas() {
  if (!isDraggingConsultas) {
    return;
  }
  isDraggingConsultas = false;
  trackConsultas.classList.remove("dragging");

  let movimiento = currentTranslateConsultas - startTranslateConsultas;
  let umbral = sliderConsultas.clientWidth * 0.2; // 20% del ancho para cambiar de slide

  if (movimiento < -umbral) {
    siguienteConsultas();
  } else if (movimiento > umbral) {
    anteriorConsultas();
  } else {
    irASlideConsultas(currentIndexConsultas);
  }
  reiniciarAutoplayConsultas();
}

// eventos mouse

trackConsultas.addEventListener("mousedown", function (event) {
  event.preventDefault();
  iniciarArrastreConsultas(event.clientX);
});

window.addEventListener("mousemove", function (event) {
  moverArrastreConsultas(event.clientX);
});

window.addEventListener("mouseup", function () {
  finalizarArrastreConsultas();
});

// eventos touch - telefono/tablet

trackConsultas.addEventListener("touchstart", function (event) {
  iniciarArrastreConsultas(event.touches[0].clientX);
});

trackConsultas.addEventListener("touchmove", function (event) {
  moverArrastreConsultas(event.touches[0].clientX);
});

trackConsultas.addEventListener("touchend", function () {
  finalizarArrastreConsultas();
});

// botones

document
  .getElementById("btnNextConsultas")
  .addEventListener("click", function () {
    siguienteConsultas();
    reiniciarAutoplayConsultas();
  });

document
  .getElementById("btnPrevConsultas")
  .addEventListener("click", function () {
    anteriorConsultas();
    reiniciarAutoplayConsultas();
  });

// pausa autoplay cuando el mouse esta encima del slider

sliderConsultas.addEventListener("mouseenter", detenerAutoplayConsultas);
sliderConsultas.addEventListener("mouseleave", reiniciarAutoplayConsultas);

// recalculo de la posicion

window.addEventListener("resize", function () {
  irASlideConsultas(currentIndexConsultas);
});

iniciarAutoplayConsultas();
