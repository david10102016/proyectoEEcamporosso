// Preguntas matemáticas
const preguntas = [
  { pregunta: "5 + 3", respuesta: "8" },
  { pregunta: "10 - 4", respuesta: "6" },
  { pregunta: "7 x 2", respuesta: "14" },
  { pregunta: "12 ÷ 3", respuesta: "4" },
  { pregunta: "9 + 6", respuesta: "15" },
  { pregunta: "8 x 3", respuesta: "24" },
  { pregunta: "20 - 9", respuesta: "11" },
  { pregunta: "15 ÷ 5", respuesta: "3" }
];

let mario = document.getElementById("mario");
let escenario = document.getElementById("escenario");
let preguntaBox = document.getElementById("preguntaBox");
let preguntaTexto = document.getElementById("preguntaTexto");
let mensaje = document.getElementById("mensaje");

let velocidad = 20;
let saltando = false;
let marioY = 48;
let gravedad = 0;
let jugando = false;
let preguntaActual = null;
let escenarioX = 0;

let animationFrameId;

// Jugador
let jugador = null;
let puntos = 0;
let record = 0;
let nivel = 1;
const nivelMax = 20;

// ---------------- REGISTRO ----------------
function registrarJugador() {
  let nombre = document.getElementById("nombreJugador").value.trim();
  if (nombre === "") {
    alert("Por favor escribe tu nombre.");
    return;
  }

  jugador = nombre;
  let recordGuardado = localStorage.getItem("record_" + jugador);
  record = recordGuardado ? parseInt(recordGuardado) : 0;

  document.getElementById("saludo").textContent = "👋 Hola, " + jugador;
  document.getElementById("record").textContent = record;
  document.getElementById("puntos").textContent = puntos;
  document.getElementById("nivel").textContent = nivel;
  document.getElementById("infoJugador").classList.remove("oculto");
}

// ---------------- EMPEZAR ----------------
function empezarJuego() {
  puntos = 0;
  nivel = 1;
  marioY = 48;
  saltando = false;
  gravedad = 0;
  jugando = true;
  escenarioX = 0;

  document.getElementById("puntos").textContent = puntos;
  document.getElementById("nivel").textContent = nivel;

  document.getElementById("pantallaInicio").classList.add("oculto");
  document.getElementById("infoJugador").classList.add("oculto");
  document.getElementById("contenedorJuego").classList.remove("oculto");

  escenario.innerHTML = '<div id="suelo"></div><div id="mario"></div>';
  mario = document.getElementById("mario");

  generarBloques();

  mario.style.bottom = marioY + "px";

  cancelAnimationFrame(animationFrameId);
  actualizar();
  document.getElementById("musicaFondo").play();
}

// ---------------- GENERAR BLOQUES ----------------
function generarBloques() {
  for (let i = 0; i < 10; i++) {
    let bloque = document.createElement("div");
    bloque.classList.add("bloque");
    bloque.style.left = (300 + i * 200) + "px";
    bloque.style.top = "200px";
    escenario.appendChild(bloque);
  }
}

// ---------------- CONTROLES ----------------
document.addEventListener("keydown", (e) => {
  if (!jugando) return;

  if (e.key === "ArrowRight") {
    escenarioX -= velocidad;
    escenario.style.left = escenarioX + "px";
    mario.classList.add("caminar");
  }

  if (e.key === "ArrowLeft") {
    escenarioX += velocidad;
    escenario.style.left = escenarioX + "px";
    mario.classList.add("caminar");
  }

  if ((e.key === " " || e.key === "ArrowUp") && !saltando) {
    saltando = true;
    gravedad = 20;
  }
});

document.addEventListener("keyup", () => {
  mario.classList.remove("caminar");
});

// ---------------- PREGUNTAS ----------------
function mostrarPregunta() {
  jugando = false;
  preguntaActual = preguntas[Math.floor(Math.random() * preguntas.length)];
  preguntaTexto.textContent = "Nivel " + nivel + ": " + preguntaActual.pregunta;
  document.getElementById("inputRespuesta").value = "";
  preguntaBox.classList.remove("oculto");
}

function verificar() {
  let input = document.getElementById("inputRespuesta").value;

  if (input === preguntaActual.respuesta) {
    puntos += 10;
    document.getElementById("puntos").textContent = puntos;

    if (puntos > record) {
      record = puntos;
      localStorage.setItem("record_" + jugador, record);
      document.getElementById("record").textContent = record;
    }

    if (nivel < nivelMax) {
      nivel++;
      document.getElementById("nivel").textContent = nivel;
      mostrarMensaje("✅ CORRECTO! Avanzas al nivel " + nivel, true);
    } else {
      mostrarMensaje("🎉 ¡Felicidades " + jugador + "! Completaste los 20 niveles", true);
      jugando = false;
      return;
    }

    preguntaBox.classList.add("oculto");
    jugando = true;
    actualizar();
  } else {
    mostrarMensaje("❌ INCORRECTO. Perdiste.", false);
    perderJuego();
  }
}

// ---------------- GAME OVER ----------------
function perderJuego() {
  jugando = false;
  preguntaBox.classList.add("oculto");

  mensaje.textContent = "💀 GAME OVER";
  mensaje.classList.remove("correcto");
  mensaje.classList.add("incorrecto");
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
    empezarJuego();
  }, 2000);
}

// ---------------- MENSAJES ----------------
function mostrarMensaje(texto, esCorrecto) {
  mensaje.textContent = texto;
  mensaje.classList.remove("correcto", "incorrecto");

  if (esCorrecto) {
    mensaje.classList.add("correcto");
  } else {
    mensaje.classList.add("incorrecto");
  }

  mensaje.style.display = "block";
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 2500);
}

// ---------------- BOTÓN JUGAR ----------------
document.getElementById("btnJugar").addEventListener("click", () => {
  empezarJuego();
});

// ---------------- ACTUALIZAR ----------------
function actualizar() {
  if (saltando) {
    marioY += gravedad;
    gravedad -= 1;
    if (marioY <= 48) {
      marioY = 48;
      saltando = false;
    }
    mario.style.bottom = marioY + "px";
  }

  // 🔥 Detectar golpe desde abajo contra bloques
  let bloques = document.querySelectorAll(".bloque");
  let marioRect = mario.getBoundingClientRect();

  bloques.forEach(bloque => {
    let bloqueRect = bloque.getBoundingClientRect();

    // Mario golpea el bloque desde ABAJO
    if (
      marioRect.top <= bloqueRect.bottom &&     // cabeza toca parte inferior del bloque
      marioRect.bottom > bloqueRect.bottom &&   // Mario está debajo del bloque
      marioRect.left < bloqueRect.right &&
      marioRect.right > bloqueRect.left
    ) {
      if (!bloque.usado) {
        bloque.usado = true;
        bloque.style.background; // bloque gris al usar
        mostrarPregunta();
      }
    }
  });

  if (jugando) {
    animationFrameId = requestAnimationFrame(actualizar);
  }
}
