const sliderFormaciones = document.querySelector(".slider-formaciones");
const trackFormaciones = document.getElementById("sliderTrack-formaciones");
const slidesFormaciones = document.querySelectorAll(".slide-formacion");
const totalSlidesFormaciones = slidesFormaciones.length;
let currentIndexFormaciones = 0;

// Variables para el arrastre / drag

let isDraggingFormaciones = false;
let startYFormaciones = 0;
let startTranslateFormaciones = 0;
let currentTranslateFormaciones = 0;

// variables para el autoplay

let autoPlayIntervalFormaciones = null;
let autoPlayDelayFormaciones = 3000; // 3 secs

// obtener posicion actual

function obtenerPosicionActualFormaciones() {
  return -currentIndexFormaciones * sliderFormaciones.clientHeight;
}

function irASlideFormaciones(index) {
  currentIndexFormaciones = index;
  currentTranslateFormaciones = obtenerPosicionActualFormaciones();
  trackFormaciones.style.transform =
    "translate3d(0, " + currentTranslateFormaciones + "px, 0)";
}

function siguienteFormaciones() {
  let nuevoIndex = currentIndexFormaciones + 1;
  if (nuevoIndex >= totalSlidesFormaciones) {
    nuevoIndex = 0;
  }
  irASlideFormaciones(nuevoIndex);
}

function anteriorFormaciones() {
  let nuevoIndex = currentIndexFormaciones - 1;
  if (nuevoIndex < 0) {
    nuevoIndex = totalSlidesFormaciones - 1;
  }
  irASlideFormaciones(nuevoIndex);
}

// autoplay

function iniciarAutoplayFormaciones() {
  autoPlayIntervalFormaciones = setInterval(
    siguienteFormaciones,
    autoPlayDelayFormaciones,
  );
}

function detenerAutoplayFormaciones() {
  clearInterval(autoPlayIntervalFormaciones);
}

function reiniciarAutoplayFormaciones() {
  detenerAutoplayFormaciones();
  iniciarAutoplayFormaciones();
}

// arrastre / drag - mouse y touch (ahora en el eje Y)

let rafPendienteFormaciones = false; // evita pedir varios frames a la vez
let ultimaYFormaciones = 0; // guarda la ultima posicion recibida del mouse/dedo

function iniciarArrastreFormaciones(y) {
  isDraggingFormaciones = true;
  startYFormaciones = y;
  startTranslateFormaciones = obtenerPosicionActualFormaciones();
  trackFormaciones.classList.add("dragging");
  detenerAutoplayFormaciones();
}

function aplicarMovimientoFormaciones() {
  let diferencia = ultimaYFormaciones - startYFormaciones;
  currentTranslateFormaciones = startTranslateFormaciones + diferencia;
  trackFormaciones.style.transform =
    "translate3d(0, " + currentTranslateFormaciones + "px, 0)";
  rafPendienteFormaciones = false;
}

function moverArrastreFormaciones(y) {
  if (!isDraggingFormaciones) {
    return;
  }
  ultimaYFormaciones = y;

  // Si ya hay un frame pedido, no pedimos otro: dejamos que ese
  // frame use el valor mas reciente de "ultimaYFormaciones"
  if (!rafPendienteFormaciones) {
    rafPendienteFormaciones = true;
    requestAnimationFrame(aplicarMovimientoFormaciones);
  }
}

function finalizarArrastreFormaciones() {
  if (!isDraggingFormaciones) {
    return;
  }
  isDraggingFormaciones = false;
  trackFormaciones.classList.remove("dragging");

  let movimiento = currentTranslateFormaciones - startTranslateFormaciones;
  let umbral = sliderFormaciones.clientHeight * 0.2; // 20% del alto para cambiar de slide

  if (movimiento < -umbral) {
    siguienteFormaciones();
  } else if (movimiento > umbral) {
    anteriorFormaciones();
  } else {
    irASlideFormaciones(currentIndexFormaciones);
  }
  reiniciarAutoplayFormaciones();
}

// eventos mouse

trackFormaciones.addEventListener("mousedown", function (event) {
  event.preventDefault();
  iniciarArrastreFormaciones(event.clientY);
});

window.addEventListener("mousemove", function (event) {
  moverArrastreFormaciones(event.clientY);
});

window.addEventListener("mouseup", function () {
  finalizarArrastreFormaciones();
});

// eventos touch - telefono/tablet
// { passive: false } es necesario para que preventDefault() funcione en touch;
// los navegadores modernos tratan los listeners de touch como "passive" por
// defecto (para que el scroll nativo no se sienta lento), lo cual BLOQUEA
// preventDefault a menos que se lo desactivemos explicitamente aqui.

trackFormaciones.addEventListener(
  "touchstart",
  function (event) {
    iniciarArrastreFormaciones(event.touches[0].clientY);
  },
  { passive: false },
);

trackFormaciones.addEventListener(
  "touchmove",
  function (event) {
    // Le decimos al navegador "no hagas scroll de la pagina, este
    // movimiento lo estoy manejando yo" - esto es lo que elimina
    // el conflicto entre el scroll nativo y el drag del slider
    event.preventDefault();
    moverArrastreFormaciones(event.touches[0].clientY);
  },
  { passive: false },
);

trackFormaciones.addEventListener("touchend", function () {
  finalizarArrastreFormaciones();
});

// pausa autoplay cuando el mouse esta encima del slider

sliderFormaciones.addEventListener("mouseenter", detenerAutoplayFormaciones);
sliderFormaciones.addEventListener("mouseleave", reiniciarAutoplayFormaciones);

// recalculo de la posicion

window.addEventListener("resize", function () {
  irASlideFormaciones(currentIndexFormaciones);
});

iniciarAutoplayFormaciones();