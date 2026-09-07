const sliderReservas = document.querySelector(".slider-reservas");
const trackReservas = document.getElementById("sliderTrack-reservas");
const slidesReservas = document.querySelectorAll(".slide-reserva");
const totalSlidesReservas = slidesReservas.length;
let currentIndexReservas = 0;

// Variables para el arrastre / drag

let isDraggingReservas = false;
let startYReservas = 0;
let startTranslateReservas = 0;
let currentTranslateReservas = 0;

// variables para el autoplay

let autoPlayIntervalReservas = null;
let autoPlayDelayReservas = 3000; // 3 secs

// obtener posicion actual

function obtenerPosicionActualReservas() {
  const alturaSlide = slidesReservas[0].getBoundingClientRect().height;
  return -currentIndexReservas * alturaSlide;
}

function irASlideReservas(index) {
  currentIndexReservas = index;
  currentTranslateReservas = obtenerPosicionActualReservas();
  trackReservas.style.transform =
    "translate3d(0, " + currentTranslateReservas + "px, 0)";
}

function siguienteReservas() {
  let nuevoIndex = currentIndexReservas + 1;
  if (nuevoIndex >= totalSlidesReservas) {
    nuevoIndex = 0;
  }
  irASlideReservas(nuevoIndex);
}

function anteriorReservas() {
  let nuevoIndex = currentIndexReservas - 1;
  if (nuevoIndex < 0) {
    nuevoIndex = totalSlidesReservas - 1;
  }
  irASlideReservas(nuevoIndex);
}

// autoplay

function iniciarAutoplayReservas() {
  autoPlayIntervalReservas = setInterval(
    siguienteReservas,
    autoPlayDelayReservas,
  );
}

function detenerAutoplayReservas() {
  clearInterval(autoPlayIntervalReservas);
}

function reiniciarAutoplayReservas() {
  detenerAutoplayReservas();
  iniciarAutoplayReservas();
}

// arrastre / drag - mouse y touch (ahora en el eje Y)

let rafPendienteReservas = false; // evita pedir varios frames a la vez
let ultimaYReservas = 0; // guarda la ultima posicion recibida del mouse/dedo

function iniciarArrastreReservas(y) {
  isDraggingReservas = true;
  startYReservas = y;
  ultimaYReservas = y; // <-- añadir
  startTranslateReservas = obtenerPosicionActualReservas();
  currentTranslateReservas = startTranslateReservas;
  trackReservas.classList.add("dragging");
  detenerAutoplayReservas();
}

function aplicarMovimientoReservas() {
  let diferencia = ultimaYReservas - startYReservas;
  currentTranslateReservas = startTranslateReservas + diferencia;
  trackReservas.style.transform =
    "translate3d(0, " + currentTranslateReservas + "px, 0)";
  rafPendienteReservas = false;
}

function moverArrastreReservas(y) {
  if (!isDraggingReservas) {
    return;
  }
  ultimaYReservas = y;

  // Si ya hay un frame pedido, no pedimos otro: dejamos que ese
  // frame use el valor mas reciente de "ultimaYFormaciones"
  if (!rafPendienteReservas) {
    rafPendienteReservas = true;
    requestAnimationFrame(aplicarMovimientoReservas);
  }
}

function finalizarArrastreReservas() {
  if (!isDraggingReservas) {
    return;
  }
  isDraggingReservas = false;
  trackReservas.classList.remove("dragging");

  let movimiento = currentTranslateReservas - startTranslateReservas;
  let umbral = sliderReservas.clientHeight * 0.2; // 20% del alto para cambiar de slide

  if (movimiento < -umbral) {
    siguienteReservas();
  } else if (movimiento > umbral) {
    anteriorReservas();
  } else {
    irASlideReservas(currentIndexReservas);
  }
  reiniciarAutoplayReservas();
}

// eventos mouse

trackReservas.addEventListener("mousedown", function (event) {
  event.preventDefault();
  iniciarArrastreReservas(event.clientY);
});

window.addEventListener("mousemove", function (event) {
  moverArrastreReservas(event.clientY);
});

window.addEventListener("mouseup", function () {
  finalizarArrastreReservas();
});

// eventos touch - telefono/tablet
// { passive: false } es necesario para que preventDefault() funcione en touch;
// los navegadores modernos tratan los listeners de touch como "passive" por
// defecto (para que el scroll nativo no se sienta lento), lo cual BLOQUEA
// preventDefault a menos que se lo desactivemos explicitamente aqui.

trackReservas.addEventListener(
  "touchstart",
  function (event) {
    iniciarArrastreReservas(event.touches[0].clientY);
  },
  { passive: false },
);

trackReservas.addEventListener(
  "touchmove",
  function (event) {
    // Le decimos al navegador "no hagas scroll de la pagina, este
    // movimiento lo estoy manejando yo" - esto es lo que elimina
    // el conflicto entre el scroll nativo y el drag del slider
    event.preventDefault();
    moverArrastreReservas(event.touches[0].clientY);
  },
  { passive: false },
);

trackReservas.addEventListener("touchend", function () {
  finalizarArrastreReservas();
});

// pausa autoplay cuando el mouse esta encima del slider

sliderReservas.addEventListener("mouseenter", detenerAutoplayReservas);
sliderReservas.addEventListener("mouseleave", reiniciarAutoplayReservas);

// recalculo de la posicion

window.addEventListener("resize", function () {
  irASlideReservas(currentIndexReservas);
});

iniciarAutoplayReservas();
