// Declaraciones

// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
var currentTab = 0;
// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
let resetUltimo = false;
// Define una variable que almacene los nombres de los grupos  de botones radio procesados 
let gruposProcesados = [];
// Obtener el div con id="stepContainer"
var stepContainer = document.getElementById("stepContainer");
// Obtener todos los divs con la clase tab
var tabs = document.getElementsByClassName("tab");
// Obtener el boton nextBtn
var nextBtn = document.getElementById("nextBtn");
// Obtener todos los span con la clase step
var steps = document.getElementsByClassName("step");
// Obtener el div que se muestra u oculta según el tratamiento
var treatmentDiv = document.getElementById("applyTreatment");
// Obtener los radios que indican si se aplica tratamiento o no
var treatedYes = document.getElementById("grupo2_0");
var treatedNo = document.getElementById("grupo2_1");
// Obtener el botón, su bisabuelo y su siguiente hermano para hacer un toggler de divs
var btnToggler = document.getElementById('toggleBtn');
var grandparent = btnToggler.parentElement.parentElement.parentElement;
var nextSibling = grandparent.nextElementSibling;

// helpers

// Define una función para modificar los spans con la clase step según el número de divs con la clase tab
function updateSpans() {
	// Si el número de spans es menor que el número de divs, añadir los spans necesarios
	while(steps.length < tabs.length) {
		var newSpan = document.createElement("span");
		newSpan.className = "step";
		// Validamos que haya un span actual
		if (steps.length > 0) {
			var currentStep = steps[currentTab];
			currentStep.parentNode.insertBefore(newSpan, currentStep.nextSibling);
		} else {
			// Si no hay spans aún, append al final
			stepContainer.appendChild(newSpan);
		}
		steps.length++;
	}
	// Si el número de spans es mayor que el número de divs, remover los spans necesarios
	while(steps.length > tabs.length) {
		// Obtiene el siguiente span después del actual
		var nextSpan = steps[currentTab].nextSibling;
		// Si el siguiente span existe y es un span.step
		if (nextSpan && nextSpan.tagName == "SPAN" && nextSpan.classList.contains("step")) {
			// Elimina ese span
			nextSpan.parentNode.removeChild(nextSpan);
		}
		steps.length--;
	}
}

// Funciones para el manejo de pestañas

// Define una función que recibe un parámetro n que indica el índice de la pestaña a mostrar
function showTab(n) {
	// Recorre todos los steps y remueve la clase active
	for (const step of steps) {
		step.className = step.className.replace(" active", "");
	};
	// Agrega la clase active al step actual
	steps[n].className += " active";
	// Muestra el tab actual
	tabs[n].style.display = "block";
	// Muestra u oculta el botón prev según corresponda
	document.getElementById("prevBtn").style.visibility = n === 0 ? "hidden" : "visible";
	// Cambia el icono del botón next según corresponda
	if (n === tabs.length - 1) {
		nextBtn.setAttribute("class", "btn btn-1505c btn-lg fa-sharp fa-regular fa-paper-plane-top");
	} else {
		nextBtn.setAttribute("class", "btn btn-1505c btn-lg fa-solid fa-arrow-right");
	}
	// Actualiza los campos según la pestaña actual
	validarYActualizarInputs();
	deseleccionarTab();
}
// Define una función que recibe un parámetro n que indica si se avanza o retrocede una pestaña
function nextPrev(n) {
	// Si se avanza una pestaña y los campos de entrada no son válidos, termina la función
	if (n == 1 && !validarYActualizarInputs()) return false;
	// Llama a la función removeInputEvents para eliminar los eventos de entrada de los campos de entrada
	removeInputEvents();
	// Oculta el elemento con el índice currentTab
	tabs[currentTab].style.display = "none";
	// Actualiza el valor de currentTab sumando el valor de n
	currentTab = currentTab + n;
	// Si currentTab es mayor o igual al número de pestañas, envía el formulario y termina la función
	if (currentTab >= tabs.length) {
		document.getElementById("regForm").submit();
		return false;
	}
	// Llama a la función showTab para mostrar la nueva pestaña
	showTab(currentTab);
	updateSpans();
}
// Define una función que deselecciona la pestaña actual
function deseleccionarTab() {
	let tabVisible;
	for (let i = 0; i < tabs.length; i++) {
		if (tabs[i].style.display != 'none') {
			tabVisible = tabs[i];
			break; 
		}
	}
	var nombreTab = tabVisible.getAttribute('data-tabname');
	// Si el nombre del grupo no está en el arreglo llama a la funcion deseleccionar para procesar el grupo de botones radio
	if (!gruposProcesados.includes(nombreTab)) {
		deseleccionar(nombreTab);
	}
}

// Funciones de validación

// Define una función que valida y actualiza los campos de entrada de la pestaña actual
function validarYActualizarInputs() {
	var i, valid = true;
	// Obtiene todos los elementos con la etiqueta "input" dentro de tabs y los asigna a una variable y
	var y = tabs[currentTab].getElementsByTagName("input");
	// Recorre todos los elementos de y y verifica su tipo y valor
	for (i = 0; i < y.length; i++) {
		switch (y[i].type) {
			case "email": // Si el tipo es "email"
				// Verificar si el valor está vacío
				if (y[i].value === '') {
					y[i].classList.toggle("invalid", true);
					valid = false;
					// Verificar validez si no está vacío
				} else if (!y[i].validity.valid) {
					y[i].classList.toggle("invalid", true);
					valid = false; // Asigna false a la variable valid
				} else { // Si se cumple elimina la clase "invalid" si está presente
					y[i].classList.toggle("invalid", false);
				}
				break;
			case "tel": // Si el tipo es "tel"
				// Asigna el valor a una variable tlf
				var tlf = y[i].value;
				// Si el valor está vacío, agrega la clase "invalid" al elemento
				if (tlf == "") {
					y[i].classList.toggle("invalid", true);
					valid = false; // Asigna false a la variable valid
				} else { // Si el valor no está vacío
					// Convierte el valor a un número y lo asigna a la variable tlf
					tlf = Number(tlf);
					// Verifica si el valor es un número válido
					var valido = !isNaN(tlf);
					// Si el valor no es un número válido, agrega la clase "invalid" al elemento
					if (!valido) {
						y[i].classList.toggle("invalid", true);
						valid = false; // Asigna false a la variable valid
					} else { // Si el valor es un número válido, elimina la clase "invalid" si está presente
						y[i].classList.toggle("invalid", false);
					}
				}
				break;
			case "radio": // Si el tipo es "radio"
				// Obtiene el elemento con el mismo nombre que esté seleccionado y lo asigna a una variable radio
				var radio = document.querySelector("input[name='" + y[i].name + "']:checked");
				// Si no hay ningún elemento seleccionado, agrega la clase "invalid" al elemento
				if (radio == null) {
					y[i].classList.toggle("invalid", true);
					valid = false; // Asigna false a la variable valid
				} else { // Si hay un elemento seleccionado, comprueba si es válido y cambia la clase "invalid" según corresponda
					y[i].classList.toggle("invalid", !radio.validity.valid);
				}
				break;
			default: // Si el tipo es otro
				// Si el valor está vacío, agrega la clase "invalid" al elemento
				if (y[i].value == "") {
					y[i].classList.toggle("invalid", true);
					valid = false;
				} else { // Si el valor no está vacío, elimina la clase "invalid" si está presente
					y[i].classList.toggle("invalid", false);
				}
				break;
		}
		// Si el elemento no tiene el atributo "data-input-event", se lo agrega y le añade un evento "input"
		if (!y[i].hasAttribute("data-input-event")) {
			y[i].setAttribute("data-input-event", true);
			// Usar una IIFE para crear una clausura que capture el valor de i
			(function(j) {
				y[j].addEventListener("input", function() {
					// Llama a la función validarYActualizarInputs cada vez que se cambia el valor del elemento
					validarYActualizarInputs();
				});
			})(i); // Pasar el valor de i como argumento a la IIFE
		}
	}
	// Si el valor de valid es true, hace toggle de la clase "finish" en el indicador de la pestaña actual
	if (valid) {
		steps[currentTab].classList.toggle("finish", true);
		nextBtn.classList.remove("disabled");
	} else {
		// Si el valor de valid es false, hace toggle de la clase "finish" en el indicador de la pestaña actual
		steps[currentTab].classList.toggle("finish", false);
		// Si el valor de valid es false, agrega la clase "disabled" al botón "Siguiente"
		nextBtn.classList.add("disabled");
	}
	// Devuelve el valor de valid
	return valid;
}
// Define una función que recibe un parámetro grupo que indica el nombre de un grupo de elementos de tipo "radio"
function deseleccionar(e) {
	// Obtiene todos los elementos con el nombre e y los guarda en un arreglo
	let elementos = document.getElementsByName(e);
	// Declara una variable para guardar el último elemento seleccionado
	let ultimo = null;
	// Crea un objeto que almacene las funciones que se deben ejecutar para cada grupo
	let funciones = {
		grupo2: handleTreatedClick,
		grupo3: function() {
			// Manejar el error del grupo3 al limpiar los botones radio cuando no existe
			if (resetUltimo == true && !this.checked) {
				ultimo = null;
				this.checked = false;
				resetUltimo = false;
			}
		}
	};
	for (let i = 0; i < elementos.length; i++) {
		// Obtiene el elemento actual
		let elemento = elementos[i];
		// Verifica si el elemento tiene el atributo data-haslistener
		if (!elemento.getAttribute("data-haslistener")) {
			// Si no lo tiene, se lo asigna con el valor "false"
			elemento.setAttribute("data-haslistener", "false");
		}
		// Verifica si el valor del atributo data-haslistener es "false" y lo cambia a true
		if (elemento.getAttribute("data-haslistener") == "false") {
			elemento.setAttribute("data-haslistener", "true");
			// Le añade el evento listener de tipo "click"
			elemento.addEventListener("click", function() {
				// Si el nombre del elemento coincide con alguna de las propiedades del objeto funciones
				if (funciones[elemento.name]) {
					// Ejecuta la función correspondiente
					funciones[elemento.name]();
				}
				// Si el elemento es el mismo que el último seleccionado y está marcado
				if (this.getAttribute("id") == ultimo && elemento.checked) {
					// Lo deselecciona y limpia ultimo
					elemento.checked = false;
					ultimo = null;
				} else {
					// Si no, asigna el elemento a ultimo y lo selecciona
					ultimo = this.getAttribute("id");
					elemento.checked = true;
				}
				// Valida y actualiza los campos de entrada de la pestaña actual
				validarYActualizarInputs(currentTab);
			});
		}
	}
	// Agrega el nombre del grupo al arreglo para no correr de nuevo esta misma funcion
	gruposProcesados.push(e);
}

// Funciones para eventos

// Define una función para manejar el evento de cambio de los radios de tratamiento
// Modificar esto para hacerlo reutilizable!!!!!!!!!!!!!!!
function handleTreatedClick() {
	// Obtener valor actual de treated para variar la clase tab segun sea el caso
	if (treatedYes.checked && !treatmentDiv.classList.contains("tab")) {
		treatmentDiv.classList.add("tab");
		resetUltimo = true;
	} else if (!treatedYes.checked && treatedNo.checked &&
		treatmentDiv.classList.contains("tab")) {
		treatmentDiv.classList.remove("tab");
		document.getElementById('applyTreatment').value = '0';
		clearRadioGroup('grupo3');
	} else if (treatedYes.checked && !treatedNo.checked &&
		treatmentDiv.classList.contains("tab")) {
		treatmentDiv.classList.remove("tab");
		document.getElementById('applyTreatment').value = '0';
		clearRadioGroup('grupo3');
	}
	updateSpans();
}
function clearRadioGroup(name) {
	// Obtener botones radio del grupo
	var radios = document.getElementsByName(name);
	// Deseleccionar todos
	for(var i = 0; i < radios.length; i++) {
		radios[i].checked = false;
	}
}
// Define una función que elimina los eventos de entrada de los campos de entrada de la pestaña actual
function removeInputEvents() {
	var i;
	// Obtiene todos los elementos con la etiqueta "input" dentro de tabs y los asigna a una variable y
	var y = tabs[currentTab].getElementsByTagName("input");
	// Recorre todos los elementos de y y verifica si tienen el atributo "data-input-event"
	for (i = 0; i < y.length; i++) {
		if (y[i].hasAttribute("data-input-event")) {
			// Si lo tienen, se lo elimina y también elimina el evento "input" asociado
			y[i].removeAttribute("data-input-event");
			// Usa una expresión de función invocada inmediatamente (IIFE) para crear un closure
			(function(index) {
				// Pasa i como index al closure
				y[index].removeEventListener("input", function() {
					// El evento "input" llama a la función validarYActualizarInputs cada vez que se cambia el valor del elemento
					validarYActualizarInputs();
				});
			})(i); // Invoca la IIFE con i como argumento
		}
	}
}

// Inicializadores y listener

// Llama a la función updateSpans al inicio para inicializar los spans
updateSpans();
// Llama a la función showTab para mostrar la primera pestaña
showTab(currentTab);
// Al hacer clic en btnToggler, llamar a la función toggleVisibility
btnToggler.addEventListener('click', () => {
	toggleVisibility(grandparent, nextSibling);
});
// La función toggleVisibility oculta el primer elemento y muestra el segundo
function toggleVisibility(elem1, elem2) {
	elem1.style.display = 'none';
	elem1.classList.remove("d-flex");
	elem2.style.display = 'block';
}