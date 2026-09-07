const slider = document.querySelector(".slider-productos");
const track = document.getElementById("sliderTrack");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
let currentIndex = 0;

// Variables para el arrastre / drag

let isDragging = false;
let startX = 0;
let startTranslate = 0;
let currentTranslate = 0;

// variables para el autoplay

let autoPlayInterval = null;
let autoPlayDelay = 3000; // 3 secs

// obtener posicion actual

function obtenerPosicionActual(){
    return - currentIndex * slider.clientWidth;
};

function irASlide(index){
    currentIndex = index;
    currentTranslate = obtenerPosicionActual();
    track.style.transform = "translateX(" + currentTranslate + "px)";
};

function siguiente(){
    let nuevoIndex = currentIndex + 1;
    if(nuevoIndex >= totalSlides){
        nuevoIndex = 0;
    }
    irASlide(nuevoIndex);
}

function anterior(){
    let nuevoIndex = currentIndex - 1;
    if(nuevoIndex < 0){
        nuevoIndex = totalSlides - 1;
    }
    irASlide(nuevoIndex);
};

// autoplay

function iniciarAutoplay(){
    autoPlayInterval = setInterval(siguiente, autoPlayDelay);
}

function detenerAutoplay(){
    clearInterval(autoPlayInterval);
};

function reiniciarAutoplay(){
    detenerAutoplay();
    iniciarAutoplay();
};

// arrastre / drag - mouse y touch */

function iniciarArrastre(x){
    isDragging = true;
    startX = x;
    startTranslate = obtenerPosicionActual();
    track.classList.add("dragging");
    detenerAutoplay();
};

function moverArrastre(x){
    if(!isDragging){
        return;
    };
    let diferencia = x - startX;
    currentTranslate = startTranslate + diferencia;
    track.style.transform = "translateX(" + currentTranslate + "px)";
};

function finalizarArrastre(){
    if(!isDragging){
        return;
    };
    isDragging = false;
    track.classList.remove("dragging");

    let movimiento = currentTranslate - startTranslate;
    let umbral = slider.clientWidth * 0.2; // 20% del ancho para cambiar de slide

    if(movimiento < - umbral){
        siguiente();
    } else if(movimiento > umbral){
        anterior();
    } else {
        irASlide(currentIndex);
    }
    reiniciarAutoplay();
};

// eventos mouse

track.addEventListener("mousedown", function (event){
    event.preventDefault();
    iniciarArrastre(event.clientX);
});

window.addEventListener("mousemove", function (event){
    moverArrastre(event.clientX);
});

window.addEventListener("mouseup", function(){
    finalizarArrastre();
});

// eventos touch - telefono/tablet

track.addEventListener("touchstart", function (event){
    iniciarArrastre(event.touches[0].clientX);
});

track.addEventListener("touchmove", function(event){
    moverArrastre(event.touches[0].clientX);
});

track.addEventListener("touchend", function(){
    finalizarArrastre();
});

// botones

// document.getElementById("btnNext").addEventListener("click", function(){
//     siguiente();
//     reiniciarAutoplay();
// });

// document.getElementById("btnPrev").addEventListener("click", function(){
//     anterior();
//     reiniciarAutoplay();
// });

// pausa autoplay cuando el mouse esta encima del slider

slider.addEventListener("mouseenter", detenerAutoplay);
slider.addEventListener("mouseleave", reiniciarAutoplay);

// recalculo de la posicion

window.addEventListener("resize", function(){
    irASlide(currentIndex);
});

iniciarAutoplay();