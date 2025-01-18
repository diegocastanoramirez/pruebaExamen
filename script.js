// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAfOmzeGEXgTM3up4xuSKjEjYOMsqRfPMo",
    authDomain: "examenes-4ed52.firebaseapp.com",
    projectId: "examenes-4ed52",
    storageBucket: "examenes-4ed52.firebasestorage.app",
    messagingSenderId: "968053681379",
    appId: "1:968053681379:web:fefdcf650d43f0102269d6",
    measurementId: "G-4YE9ERP1FR"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let timeLeft = 30;
const timerElement = document.getElementById('timer');
const form = document.getElementById('form-preguntas');
const nombreInput = document.getElementById('nombre');
const respuestaInputs = document.querySelectorAll('input[type="radio"]');
const submitButton = form.querySelector('button[type="submit"]');
const resultadosDiv = document.getElementById('resultados');

// Temporizador
const interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(interval);
        bloquearFormulario();
        sendFormData(); // Envía los datos automáticamente si el usuario no ha enviado el formulario.
    }
}, 1000);

// Deshabilitar elementos del formulario
function bloquearFormulario() {
    const formElements = document.querySelectorAll('#form-preguntas input, #form-preguntas button');
    formElements.forEach(element => element.disabled = true);
    timerElement.textContent = '¡Tiempo terminado!';
    timerElement.style.color = 'gray';
}

// Verificar si el nombre está lleno para habilitar las respuestas
nombreInput.addEventListener('input', () => {
    const isNombreFilled = nombreInput.value.trim() !== '';
    respuestaInputs.forEach(input => input.disabled = !isNombreFilled);
    submitButton.disabled = !isNombreFilled; // Bloquea también el botón
});

// Enviar formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Deshabilitar inmediatamente el botón para evitar múltiples envíos
    submitButton.disabled = true;

    await sendFormData();
    bloquearFormulario();
    ocultarFormulario(); // Oculta el formulario
    timerElement.textContent = ''; // Limpia el temporizador
    timerElement.style.display = 'none'; // Oculta el temporizador
});

// Ocultar formulario
function ocultarFormulario() {
    form.style.display = 'none'; // Oculta todo el formulario
}

// Guardar datos en Firebase
async function sendFormData() {
    const data = {
        nombre: form.nombre.value || null,
    };

    const respuestas = document.querySelectorAll('input[type="radio"]:checked');
    respuestas.forEach((respuesta, index) => {
        data[`respuesta${index + 1}`] = respuesta.value;
        data[`respuesta${index + 1}_texto`] = respuesta.getAttribute('data-text');
        data[`respuesta${index + 1}_correcta`] = respuesta.getAttribute('data-correct') === "true";
    });

    try {
        await db.collection('respuestas').add(data);
        mostrarResultados(data); // Muestra los resultados después de guardar
    } catch (error) {
        console.error('Error al enviar respuestas:', error);
    }
}

// Mostrar resultados
function mostrarResultados(data) {
    const resultadoRespuestasDiv = document.getElementById('resultado-respuestas');
    let respuestasHtml = '';

    Object.keys(data).forEach((key) => {
        if (key.startsWith('respuesta') && key.includes('_texto')) {
            const respuestaCorrecta = data[key.replace('_texto', '_correcta')];
            respuestasHtml += `
                <p>
                    ${key.replace('_texto', '')}: ${data[key]} - 
                    <span class="${respuestaCorrecta ? 'correcta' : 'incorrecta'}">
                        ${respuestaCorrecta ? 'Correcta' : 'Incorrecta'}
                    </span>
                </p>
            `;
        }
    });

    resultadoRespuestasDiv.innerHTML = respuestasHtml;
    resultadosDiv.classList.remove('oculto'); // Asegura que los resultados sean visibles
}

// Inicialmente deshabilitar respuestas y botón
respuestaInputs.forEach(input => input.disabled = true);
submitButton.disabled = true;
