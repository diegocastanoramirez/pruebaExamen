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

let enviadoDesdeGuardar = 0;
let timeLeft = 30;
const timerElement = document.getElementById('timer');
const form = document.getElementById('form-preguntas');
const nombreInput = document.getElementById('nombre');
const respuestaInputs = document.querySelectorAll('input[type="radio"]');
const submitButton = form.querySelector('button[type="submit"]');
const resultadosDiv = document.getElementById('resultados');
const puntosDiv = document.getElementById('puntos'); // Contenedor de puntos

// Inicialmente ocultar los resultados y los puntos
resultadosDiv.style.display = 'none';
puntosDiv.style.display = 'none';

// Temporizador
const interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(interval);
        bloquearFormulario();
        if (enviadoDesdeGuardar == 0){
            sendFormData(); // Envía los datos automáticamente si el usuario no ha enviado el formulario.
        }
       
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
     // para no permitir que se envie de nuevo cuando se acaba el tiempo
    enviadoDesdeGuardar = 1
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
        mostrarPuntos(); // Muestra los puntos después de guardar
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
    resultadosDiv.style.display = 'block'; // Muestra los resultados solo después de enviar
}

async function mostrarPuntos() {
    const querySnapshot = await db.collection('respuestas').get(); // Obtiene todos los documentos
    const puntosPorUsuario = {}; // Objeto para almacenar los puntos por usuario

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        let puntos = 0;

        // Calculamos los puntos de este usuario
        Object.keys(data).forEach((key) => {
            if (key.startsWith('respuesta') && key.includes('_correcta')) {
                const respuestaCorrecta = data[key];
                if (respuestaCorrecta) {
                    puntos += 5; // 5 puntos por respuesta correcta
                }
            }
        });

        // Si el usuario ya existe, sumamos los puntos
        if (puntosPorUsuario[data.nombre]) {
            puntosPorUsuario[data.nombre] += puntos;
        } else {
            puntosPorUsuario[data.nombre] = puntos;
        }
    });

    // Crear un array con los puntos acumulados por usuario
    const puntosUsuarios = Object.keys(puntosPorUsuario).map((nombre) => ({
        nombre,
        puntos: puntosPorUsuario[nombre]
    }));

    // Mostrar los resultados
    console.log(puntosUsuarios);


    // Mostrar los puntos
    let puntosHtml = '<h3>Puntos de los usuarios:</h3>';

    // Ordena los usuarios de mayor a menor puntos
    puntosUsuarios.sort((a, b) => b.puntos - a.puntos);
    
    let contador = 0;
    // Luego, recorre los usuarios ya ordenados
    puntosUsuarios.forEach(usuario => {
    
    if(contador==0){
        puntosHtml += `
            <p><span class="nombre-grande-g">Crack: ${usuario.nombre}</span>: ${usuario.puntos} puntos</p>
        `;
        contador=contador+1;
    } else{
        puntosHtml += `
        <p><span class="nombre-grande">${usuario.nombre}</span>: ${usuario.puntos} puntos</p>
    `;
    }





    });
    

    puntosDiv.innerHTML = puntosHtml;
    puntosDiv.style.display = 'block'; // Muestra los puntos
}

// Inicialmente deshabilitar respuestas y botón
respuestaInputs.forEach(input => input.disabled = true);
submitButton.disabled = true;
