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
const auth = firebase.auth()
let enviadoDesdeGuardar = 0;
let timeLeft = 400;
const timerElement = document.getElementById('timer');
const form = document.getElementById('form-preguntas');
const nombreInput = document.getElementById('nombre');
const respuestaInputs = document.querySelectorAll('input[type="radio"]');
const submitButton = form.querySelector('button[type="submit"]');
const resultadosDiv = document.getElementById('resultados');
const puntosDiv = document.getElementById('puntos'); // Contenedor de puntos
let contadorPreguntas = 0;

const button = document.getElementById('disableButton');

const DivPreguntas = document.getElementById('preguntas-container');

const correcto = document.getElementById('mensaje-correcto');
const incorrecto = document.getElementById('mensaje-incorrecto');

// Inicialmente ocultar los resultados y los puntos
resultadosDiv.style.display = 'none';
puntosDiv.style.display = 'none';

DivPreguntas.style.display = 'none';

auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirige si el usuario no está autenticado
    }
});


function speak(text,isSlow = false) {
    const synth = window.speechSynthesis;

    // Lista de palabras en español
    const palabrasEspanol =  ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"];

    // Determinar idioma
    const lang = palabrasEspanol.includes(text.toLowerCase()) ? "es-ES" : "en-US";

    // Cancelar cualquier audio en curso
    synth.cancel();

    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; // Configura el idioma
        utterance.rate = isSlow ? 0.15 : 1; // Velocidad lenta o normal (1 es normal, 0.6 es más lenta)

        utterance.onend = () => synth.cancel(); // Evitar repeticiones

        synth.speak(utterance);
    }, 100);
}




// Temporizador
const interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        // clearInterval(interval+10);
        console.log('prueba2');
        incorrecto.style.display = 'none'
        correcto.style.display = 'none'

        timeLeft = 400;
        if(contadorPreguntas==0){
            contadorPreguntas = contadorPreguntas+1
            DivPreguntas.style.display = 'block';
    
            // quita el actual
            let id = `Pregunta${contadorPreguntas}`;   
            let DivPregunta = document.getElementById(id);
            DivPregunta.style.display = 'none';


        const respuestas = document.querySelectorAll('input[type="radio"]:checked');
        respuestas.forEach((respuesta, index) => {
                // Obtener la respuesta correcta
                const preguntaId = `Pregunta${index + 1}`;
                const respuestaCorrecta = document.querySelector(`#${preguntaId} input[data-correct="true"]`);

                // Comparar si la respuesta seleccionada es la correcta
                if (respuesta.value === respuestaCorrecta.value &&  preguntaId ==id){
                        correcto.style.display = 'block'
                } else if( preguntaId ==id) {
                        incorrecto.style.display = 'block'
                }
            });

            // pone el siguiente
            let id2 = `Pregunta${contadorPreguntas + 1}`;     
            let DivPregunta2 = document.getElementById(id2);
            DivPregunta2.style.display = 'block';
    
        }else{
            

            // quita el actual
            let id = `Pregunta${contadorPreguntas + 1}`;   
            let DivPregunta = document.getElementById(id);
            DivPregunta.style.display = 'none';



            const respuestas = document.querySelectorAll('input[type="radio"]:checked');
                respuestas.forEach((respuesta, index) => {
                // Obtener la respuesta correcta
                const preguntaId = `Pregunta${index + 1}`;
                const respuestaCorrecta = document.querySelector(`#${preguntaId} input[data-correct="true"]`);
        
                console.log(respuestaCorrecta.value)
                console.log(respuesta.value )
                // Comparar si la respuesta seleccionada es la correcta
                if (respuesta.value === respuestaCorrecta.value &&  preguntaId ==id) {
                        correcto.style.display = 'block'
                } else if( preguntaId ==id){
                        incorrecto.style.display = 'block'
            }
        });



            // pone el siguiente
            let id2 = `Pregunta${contadorPreguntas + 2}`;     
            let DivPregunta2 = document.getElementById(id2);
            DivPregunta2.style.display = 'block';

            if (preguntas.length==contadorPreguntas + 2){
                submitButton.disabled = false;
                button.disabled = true;

            }
            contadorPreguntas = contadorPreguntas+1
        }


    }
}, 1000);

// Deshabilitar elementos del formulario
function bloquearFormulario() {
    // const formElements = document.querySelectorAll('#form-preguntas input, #form-preguntas button');
    // formElements.forEach(element => element.disabled = true);
    timerElement.textContent = '¡Siguiente pregunta!';
    
    // timerElement.style.color = 'gray';
}
// // Deshabilitar tiempo
// function bloquearTiempo() {
//     timerElement.textContent = '¡Terminado!';
    
 
// }

// Verificar si el nombre está lleno para habilitar las respuestas
nombreInput.addEventListener('input', () => {
    const isNombreFilled = nombreInput.value.trim() !== '';
    const DivPregunta1 = document.getElementById('Pregunta1');
    respuestaInputs.forEach(input => input.disabled = !isNombreFilled);
    // submitButton.disabled = !isNombreFilled; // Bloquea también el botón
    button.disabled = false;
    DivPregunta1.style.display = 'block';
    DivPreguntas.style.display = 'block';
    timeLeft = 400;

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
button.addEventListener('click', () => {
    console.log('prueba');
    incorrecto.style.display = 'none'
    correcto.style.display = 'none'

    timeLeft = 400;
    if(contadorPreguntas==0){
        contadorPreguntas = contadorPreguntas+1
        DivPreguntas.style.display = 'block';
  
        // quita el actual
        let id = `Pregunta${contadorPreguntas}`;   
        let DivPregunta = document.getElementById(id);
        DivPregunta.style.display = 'none';


       const respuestas = document.querySelectorAll('input[type="radio"]:checked');
       respuestas.forEach((respuesta, index) => {
            // Obtener la respuesta correcta
            const preguntaId = `Pregunta${index + 1}`;
            const respuestaCorrecta = document.querySelector(`#${preguntaId} input[data-correct="true"]`);

            // Comparar si la respuesta seleccionada es la correcta
            if (respuesta.value === respuestaCorrecta.value &&  preguntaId ==id){
                    correcto.style.display = 'block'
            } else if( preguntaId ==id) {
                    incorrecto.style.display = 'block'
            }
        });

        // pone el siguiente
        let id2 = `Pregunta${contadorPreguntas + 1}`;     
        let DivPregunta2 = document.getElementById(id2);
        DivPregunta2.style.display = 'block';
 
    }else{
        

        // quita el actual
        let id = `Pregunta${contadorPreguntas + 1}`;   
        let DivPregunta = document.getElementById(id);
        DivPregunta.style.display = 'none';



        const respuestas = document.querySelectorAll('input[type="radio"]:checked');
            respuestas.forEach((respuesta, index) => {
            // Obtener la respuesta correcta
            const preguntaId = `Pregunta${index + 1}`;
            const respuestaCorrecta = document.querySelector(`#${preguntaId} input[data-correct="true"]`);
    
            console.log(respuestaCorrecta.value)
            console.log(respuesta.value )
            // Comparar si la respuesta seleccionada es la correcta
            if (respuesta.value === respuestaCorrecta.value &&  preguntaId ==id) {
                    correcto.style.display = 'block'
            } else if( preguntaId ==id){
                    incorrecto.style.display = 'block'
         }
     });



        // pone el siguiente
        let id2 = `Pregunta${contadorPreguntas + 2}`;     
        let DivPregunta2 = document.getElementById(id2);
        DivPregunta2.style.display = 'block';

        if (preguntas.length==contadorPreguntas + 2){
            submitButton.disabled = false;
            button.disabled = true;

        }
        contadorPreguntas = contadorPreguntas+1
    }


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
        data[`pregunta${index + 1}_texto`] = respuesta.getAttribute('data-preg');
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
            const index = key.match(/\d+/)[0]; // Extrae el número de la respuesta
            const preguntaTexto = data[`pregunta${index}_texto`]; // Recupera la pregunta
            const respuestaCorrecta = data[`respuesta${index}_correcta`];

            respuestasHtml += `
                <p>
                    <strong>Pregunta:</strong> ${preguntaTexto} <br>
                    <strong>Tu respuesta:</strong> ${data[key]} - 
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
            <p><span class="nombre-grande-g">Crack: </span><span class="nombre-grande">${usuario.nombre}</span>: ${usuario.puntos} puntos</p>
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
button.disabled = true;




        document.addEventListener("DOMContentLoaded", function () {
          
            
            

            function mezclarArray(array) {
                return array.sort(() => Math.random() - 0.5);
            }
            function blockPreguntas() {


                preguntas.forEach((pregunta, index) => {
                    const div = document.createElement("div");
                    let id = `Pregunta${index + 1}`;
                    
                    let DivPregunta = document.getElementById(id);
                    DivPregunta.style.display = 'none';
                });

            }

            function generarPreguntas() {
                console.log('Generando preguntas...');
                const contenedor = document.getElementById("preguntas-container");
                contenedor.innerHTML = "";
            

            // Función para mezclar el array aleatoriamente
            function mezclarPreguntas(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
                }
            }

            // Mezclar las preguntas
            mezclarPreguntas(preguntas);

            const palabrasEspanol =  ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"];
                preguntas.forEach((pregunta, index) => {
                    const div = document.createElement("div");


                   
                    const disabled = palabrasEspanol.includes(pregunta.pregunta.toLowerCase()) ? 'id="desh"' : "";

                    div.id = `Pregunta${index + 1}`;
                    div.innerHTML = `<label>${index + 1}. ${pregunta.pregunta}
                                      <button type="button" class="speak-btn" data-text="${pregunta.pregunta}" ${disabled}>🔊</button>
                                      <button type="button" class="slow-btn" data-text="${pregunta.pregunta}" ${disabled}>🔊</button>
                                    </label>`;
            
                    // Seleccionar 3 respuestas aleatorias de las 20 disponibles
                    let respuestasAleatorias = [...pregunta.respuestas]
                        .filter(resp => resp !== pregunta.correcta) // Excluir la respuesta correcta temporalmente
                        .sort(() => Math.random() - 0.5) // Mezclar
                        .slice(0, 3); // Tomar solo 3 respuestas
            
                    // Agregar la respuesta correcta y mezclar de nuevo
                    respuestasAleatorias.push(pregunta.correcta);
                    respuestasAleatorias = mezclarArray(respuestasAleatorias);
            
                    // Crear las opciones de respuesta
                    const opcionesHTML = respuestasAleatorias.map((respuesta) => {
                        const correcta = respuesta === pregunta.correcta ? "true" : "false";    

                        // Determinar idioma
                        const disabled = palabrasEspanol.includes(respuesta.toLowerCase()) ? 'id="desh"' : "";
                        return `<label>
                                    <input type="radio" name="respuesta${index + 1}" value="${respuesta}" data-correct="${correcta}" data-text="${respuesta}" data-preg="${pregunta.pregunta}">
                                    ${respuesta}
                                       <button type="button" class="speak-btn" data-text="${respuesta}" ${disabled}>🔊</button>
                                       <button type="button" class="slow-btn" data-text="${respuesta}" ${disabled}>🔊</button>
                                </label>`;
                    }).join("");

      

                    // Agregar las opciones al div de la pregunta
                    div.innerHTML += `<div class="radio-group">${opcionesHTML}</div>`;
                    contenedor.appendChild(div);

  
                    // Delegación de eventos para todos los botones con clase "speak-btn"
                    document.addEventListener("click", function(event) {
                        if (event.target.classList.contains("speak-btn")) {
                            const text = event.target.getAttribute("data-text"); // Obtener texto del atributo data-text
                            speak(text);
                        }
                    });

                    // Delegación de eventos para todos los botones con clase "speak-btn"
                    document.addEventListener("click", function(event) {
                    if (event.target.classList.contains("slow-btn")) {
                        const text = event.target.getAttribute("data-text"); // Obtener texto del atributo data-text
                        speak(text,true);
                    }
                });

                });
            
                blockPreguntas();
            }
            
     // Función para mezclar un array
     function mezclarArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    
    generarPreguntas();
});


        