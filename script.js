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
const interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(interval);
        bloquearFormulario();
        sendFormData();
    }
}, 1000);

function bloquearFormulario() {
    const formElements = document.querySelectorAll('#form-preguntas input, #form-preguntas button');
    formElements.forEach(element => element.disabled = true);
    timerElement.textContent = '¡Tiempo terminado!';
    timerElement.style.color = 'gray';
}

const form = document.getElementById('form-preguntas');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendFormData();
    bloquearFormulario();
});

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
        mostrarResultados(data);
        form.reset();
    } catch (error) {
        console.error('Error al enviar respuestas:', error);
    }
}

function mostrarResultados(data) {
    const resultadosDiv = document.getElementById('resultados');
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
    resultadosDiv.classList.remove('oculto');
}
