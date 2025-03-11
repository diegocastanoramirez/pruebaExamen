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

// Temporizador
const interval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        // clearInterval(interval+10);
        // interval = timeLeft+10;
        timeLeft = 400;
        bloquearFormulario();
        const DivPregunta1 = document.getElementById('Pregunta1');
        const DivPregunta2 = document.getElementById('Pregunta2');
        const DivPregunta3 = document.getElementById('Pregunta3');
        const DivPregunta4 = document.getElementById('Pregunta4');
        const DivPregunta5 = document.getElementById('Pregunta5');

        // if (enviadoDesdeGuardar == 0){
        //     sendFormData(); // Envía los datos automáticamente si el usuario no ha enviado el formulario.
        // }
        if(contadorPreguntas==0){
            DivPregunta2.style.display = 'block'; 
            DivPregunta1.style.display = 'none'; 
    
            contadorPreguntas = contadorPreguntas+1
            DivPreguntas.style.display = 'block';


            
        }else if(contadorPreguntas==1){
            DivPregunta2.style.display = 'none'; 
            DivPregunta3.style.display = 'block'; 
            contadorPreguntas = contadorPreguntas+1
        } else if(contadorPreguntas==2){
            DivPregunta3.style.display = 'none'; 
            DivPregunta4.style.display = 'block'; 
            contadorPreguntas = contadorPreguntas+1
        }else if(contadorPreguntas==3){
            DivPregunta4.style.display = 'none'; 
            DivPregunta5.style.display = 'block'; 
            contadorPreguntas = contadorPreguntas+1
            submitButton.disabled = false;
            button.disabled = true;
            
        }else if (contadorPreguntas==4){
            DivPregunta5.style.display = 'none'
            sendFormData();
            clearInterval(interval);
            timerElement.textContent = '¡Terminado!';
            submitButton.disabled = true;
            ocultarFormulario()
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


                preguntas.forEach((pregunta, index) => {
                    const div = document.createElement("div");
                    div.id = `Pregunta${index + 1}`;
                    div.innerHTML = `<label>${index + 1}. ${pregunta.pregunta}</label>`;
            
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
                        return `<label>
                                    <input type="radio" name="respuesta${index + 1}" value="${respuesta}" data-correct="${correcta}" data-text="${respuesta}" data-preg="${pregunta.pregunta}">
                                    ${respuesta}
                                </label>`;
                    }).join("");
            
                    // Agregar las opciones al div de la pregunta
                    div.innerHTML += `<div class="radio-group">${opcionesHTML}</div>`;
                    contenedor.appendChild(div);
                });
            
                blockPreguntas();
            }
            
            // Función para mezclar un array
            function mezclarArray(array) {
                return array.sort(() => Math.random() - 0.5);
            }
            
            generarPreguntas();
        });



        const preguntas =[
            { pregunta: "comun",
         respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
         correcta: "common" },
            { pregunta: "common",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "comun" },
            { pregunta: "cada",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "each" },
            { pregunta: "each",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "cada" },
            { pregunta: "decir",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "say" },
            { pregunta: "say",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "decir" },
            { pregunta: "respuestas",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "answers" },
            { pregunta: "answers",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "respuestas" },
            { pregunta: "vamos",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "lets" },
            { pregunta: "lets",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "vamos" },
            { pregunta: "escuchar",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "listen" },
            { pregunta: "listen",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "escuchar" },
            { pregunta: "mirarObservar",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "watch" },
            { pregunta: "watch",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "mirarObservar" },
            { pregunta: "revisión",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "review" },
            { pregunta: "review",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "revisión" },
            { pregunta: "acerca de",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "about" },
            { pregunta: "about",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "acerca de" },
            { pregunta: "hablar",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "talk" },
            { pregunta: "talk",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "hablar" },
            { pregunta: "mirar",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "look" },
            { pregunta: "look",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "mirar" },
            { pregunta: "semanalmente",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "weekly" },
            { pregunta: "weekly",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "semanalmente" },
            { pregunta: "todos",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "everyone" },
            { pregunta: "everyone",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "todos" },
            { pregunta: "cómo",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "how to" },
            { pregunta: "how to",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "cómo" },
            { pregunta: "diversión",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "fun" },
            { pregunta: "fun",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "diversión" },
            { pregunta: "ha sido",
             respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "has been" },
            { pregunta: "has been",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "ha sido" },
            { pregunta: "viajeRecorrido",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "journey" },
            { pregunta: "journey",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "viajeRecorrido" },
            { pregunta: "genialExelente",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "great" },
            { pregunta: "great",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "genialExelente" },
            { pregunta: "doce",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "twelve" },
            { pregunta: "twelve",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "doce" },
            { pregunta: "trece",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "thirteen" },
            { pregunta: "thirteen",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "trece" },
            { pregunta: "veinte",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "twenty" },
            { pregunta: "twenty",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "veinte" },
            { pregunta: "treinta",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "thirty" },
            { pregunta: "thirty",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "treinta" },
            { pregunta: "vocales",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "vowels" },
            { pregunta: "vowels",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
        
         correcta: "vocales" },
            { pregunta: "lunes",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "monday" },
            { pregunta: "monday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "lunes" },
            { pregunta: "martes",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "tuesday" },
            { pregunta: "tuesday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "martes" },
            { pregunta: "miércoles",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "wednesday" },
            { pregunta: "wednesday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "miércoles" },
            { pregunta: "jueves",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "thursday" },
            { pregunta: "thursday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "jueves" },
            { pregunta: "viernes",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "friday" },
            { pregunta: "friday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "viernes" },
            { pregunta: "sábado",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "saturday" },
            { pregunta: "saturday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "sábado" },
            { pregunta: "domingo",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "sunday" },
            { pregunta: "sunday",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "domingo" },
            { pregunta: "grabar",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "record" },
            { pregunta: "record",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "grabar" },
            { pregunta: "muy bien",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "all right" },
            { pregunta: "all right",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "muy bien" },
            { pregunta: "chicos",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "guys" },
            { pregunta: "guys",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "chicos" },
            { pregunta: "emocionado",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "excited" },
            { pregunta: "excited",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "emocionado" },
            { pregunta: "nos tuvo tenido",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "had us" },
            { pregunta: "had us",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "nos tuvo tenido" },
            { pregunta: "yendo",
                 respuestas: ["common", "each", "say", "answers","lets", "listen", "watch", "review","about", "talk", "look", "weekly","everyone", "how to", "fun", "has been", "journey","great", "twelve", "thirteen", "twenty","thirty", "vowels", "monday", "tuesday","wednesday","thursday", "friday", "saturday", "sunday","record", "all right", "guys", "excited","had us","going"],
        
         correcta: "going" },
            { pregunta: "going",
                            respuestas: ["comun", "cada", "decir", "respuestas", "vamos", "escuchar", "mirarObservar", "revisión", "acerca de", "hablar", "mirar", "semanalmente", "todos", "cómo", "diversión", "ha sido", "viajeRecorrido", "genialExelente", "doce", "trece", "veinte", "treinta", "vocales", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "grabar", "muy bien", "chicos", "emocionado", "nos tuvo tenido", "yendo"],
         correcta: "yendo" }
        ];
        