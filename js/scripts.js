// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
var currentTab = 0;
// Llama a la función showTab para mostrar la primera pestaña
showTab(currentTab);

// Define una función que recibe un parámetro n que indica el índice de la pestaña a mostrar
function showTab(n) {
	// Obtiene todos los elementos con la clase "tab"
	var x = document.getElementsByClassName("tab");
	// Muestra el elemento con el índice n
	x[n].style.display = "block";
	// Si n es 0, oculta el botón "Anterior"
	if (n == 0) {
		document.getElementById("prevBtn").style.display = "none";
	} else {
		// Si no, muestra el botón "Anterior"
		document.getElementById("prevBtn").style.display = "inline";
	}
	// Si n es igual al número de pestañas menos uno, cambia el botón "Siguiente" a un icono de avión de papel
	if (n == (x.length - 1)) {
		document.getElementById("nextBtn").setAttribute("class", "btn btn-152c btn-lg fa-sharp fa-regular fa-paper-plane-top");
	} else {
		// Si no, cambia el botón "Siguiente" a un icono de flecha derecha
		document.getElementById("nextBtn").setAttribute("class", "btn btn-152c btn-lg fa-solid fa-arrow-right");
	}
	// Llama a la función fixStepIndicator para resaltar el indicador de la pestaña actual
	fixStepIndicator(n);
	// Llama a la función validarYActualizarInputs para validar y actualizar los campos de entrada de la pestaña actual
	validarYActualizarInputs();
}

// Define una función que recibe un parámetro n que indica si se avanza o retrocede una pestaña
function nextPrev(n) {
	// Obtiene todos los elementos con la clase "tab"
	var x = document.getElementsByClassName("tab");
	// Si se avanza una pestaña y los campos de entrada no son válidos, termina la función
	if (n == 1 && !validarYActualizarInputs()) return false;
	// Llama a la función removeInputEvents para eliminar los eventos de entrada de los campos de entrada
	removeInputEvents();
	// Oculta el elemento con el índice currentTab
	x[currentTab].style.display = "none";
	// Actualiza el valor de currentTab sumando el valor de n
	currentTab = currentTab + n;
	// Llama a la función deseleccionarTab para deseleccionar la pestaña anterior
	deseleccionarTab();
	// Si currentTab es mayor o igual al número de pestañas, envía el formulario y termina la función
	if (currentTab >= x.length) {
		document.getElementById("regForm").submit();
		return false;
	}
	// Llama a la función showTab para mostrar la nueva pestaña
	showTab(currentTab);
}

// Define una función que valida y actualiza los campos de entrada de la pestaña actual
function validarYActualizarInputs() {
	var x, y, i, valid = true;
	// Obtiene el elemento con la clase "tab" y el índice currentTab y lo asigna a una variable x
	x = document.getElementsByClassName("tab");
	// Obtiene todos los elementos con la etiqueta "input" dentro de x y los asigna a una variable y
	y = x[currentTab].getElementsByTagName("input");
	// Recorre todos los elementos de y y verifica su tipo y valor
	for (i = 0; i < y.length; i++) {
		switch (y[i].type) {
			case "email": // Si el tipo es "email"
				// Define una expresión regular para validar el formato del correo electrónico
				var regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
				// Si el valor no cumple con la expresión regular, agrega la clase "invalid" al elemento
				if (!regexCorreo.test(y[i].value)) {
					if (!y[i].classList.contains("invalid")) {
						y[i].classList.add("invalid");
					}
					valid = false; // Asigna false a la variable valid
				} else { // Si el valor cumple con la expresión regular, elimina la clase "invalid" si está presente
					if (y[i].classList.contains("invalid")) {
						y[i].classList.remove("invalid");
					}
				}
				break;
			case "tel": // Si el tipo es "tel"
				// Asigna el valor a una variable tlf
				var tlf = y[i].value;
				// Si el valor está vacío, agrega la clase "invalid" al elemento
				if (tlf == "") {
					if (!y[i].classList.contains("invalid")) {
						y[i].classList.add("invalid");
					}
					valid = false; // Asigna false a la variable valid
				} else { // Si el valor no está vacío
					// Convierte el valor a un número y lo asigna a la variable tlf
					tlf = Number(tlf);
					// Verifica si el valor es un número válido
					var valido = !isNaN(tlf);
					// Si el valor no es un número válido, agrega la clase "invalid" al elemento
					if (!valido) {
						if (!y[i].classList.contains("invalid")) {
							y[i].classList.add("invalid");
						}
						valid = false; // Asigna false a la variable valid
					} else { // Si el valor es un número válido, elimina la clase "invalid" si está presente
						if (y[i].classList.contains("invalid")) {
							y[i].classList.remove("invalid");
						}
					}
				}
				break;
			case "radio": // Si el tipo es "radio"
				// Obtiene el elemento con el mismo nombre que esté seleccionado y lo asigna a una variable radio
				var radio = document.querySelector("input[name='" + y[i].name + "']:checked");
				// Si no hay ningún elemento seleccionado, agrega la clase "invalid" al elemento
				if (radio == null) {
					if (!y[i].classList.contains("invalid")) {
						y[i].classList.add("invalid");
					}
					valid = false; // Asigna false a la variable valid
				} else { // Si hay un elemento seleccionado, elimina la clase "invalid" si está presente
					if (y[i].classList.contains("invalid")) {
						y[i].classList.remove("invalid");
					}
				}
				break;
			default: // Si el tipo es otro
				// Si el valor está vacío, agrega la clase "invalid" al elemento
				if (y[i].value == "") {
					if (!y[i].classList.contains("invalid")) {
						y[i].classList.add("invalid");
					}
					valid = false; // Asigna false a la variable valid
				} else { // Si el valor no está vacío, elimina la clase "invalid" si está presente
					if (y[i].classList.contains("invalid")) {
						y[i].classList.remove("invalid");
					}
				}
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
	// Si el valor de valid es true, agrega la clase "finish" al indicador de la pestaña actual y habilita el botón "Siguiente"
	if (valid) {
		document.getElementsByClassName("step")[currentTab].className += " finish";
		document.getElementById("nextBtn").classList.remove("disabled");
	} else { // Si el valor de valid es false, agrega la clase "disabled" al elemento con el id "nextBtn"
		document.getElementById("nextBtn").classList.add("disabled");
	}
	// Devuelve el valor de valid
	return valid;
}

// Define una función que recibe un parámetro n que indica el índice de la pestaña actual
function fixStepIndicator(n) {
	var i, x = document.getElementsByClassName("step"); // Obtiene todos los elementos con la clase "step"
	for (i = 0; i < x.length; i++) { // Recorre todos los elementos de x
		x[i].className = x[i].className.replace(" active", ""); // Elimina la clase "active" de todos ellos
	}
	x[n].className += " active"; // Agrega la clase "active" al elemento con el índice n
}

// Define una función que recibe un parámetro grupo que indica el nombre de un grupo de elementos de tipo "radio"
function deseleccionar(grupo) {
	// Obtiene todos los elementos con el mismo nombre que grupo y los asigna a una variable radios
	var radios = document.getElementsByName(grupo);
	// Define una variable lastChecked que almacena el último elemento seleccionado (inicialmente null)
	var lastChecked = null;
	// Recorre todos los elementos de radios y les añade un evento "click" que hace lo siguiente:
	for (var i = 0; i < radios.length; i++) {
		// Usa una expresión de función invocada inmediatamente (IIFE) para crear un closure
		(function(index) {
			// Pasa i como index al closure
			radios[index].addEventListener("click", function() {
				// Si el elemento es el mismo que el último seleccionado, lo deselecciona y asigna null a lastChecked
				if (this === lastChecked) {
					this.checked = false;
					lastChecked = null;
				} else {
					// Si no, asigna el elemento a lastChecked
					lastChecked = this;
				}
				// Llama a la función validarYActualizarInputs para validar y actualizar los campos de entrada de la pestaña actual
				validarYActualizarInputs(currentTab);
			});
		})(i); // Invoca la IIFE con i como argumento
	}
}

// Define una función que deselecciona la pestaña actual
function deseleccionarTab() {
	// Define una variable cadena que almacena el nombre del grupo de elementos de tipo "radio" de la pestaña actual
	var cadena = "";
	cadena = "grupo" + currentTab;
	// Llama a la función deseleccionar con el parámetro cadena
	deseleccionar(cadena);
}

// Define una función que elimina los eventos de entrada de los campos de entrada de la pestaña actual
function removeInputEvents() {
	var x, y, i;
	// Obtiene todos los elementos con la clase "tab" y asigna el elemento con el índice currentTab a una variable x
	x = document.getElementsByClassName("tab");
	// Obtiene todos los elementos con la etiqueta "input" dentro de x y los asigna a una variable y
	y = x[currentTab].getElementsByTagName("input");
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

// Llama a la función deseleccionarTab para deseleccionar la pestaña actual
deseleccionarTab();
// Llama a la función removeInputEvents para eliminar los eventos de entrada de los campos de entrada de la pestaña actual
removeInputEvents();

const boton = document.getElementById('boton');
const revealer = document.getElementById('revealer');
const revealed = document.getElementById('revealed');
// Agregar manejador de eventos al botón
boton.addEventListener('click', toggleVisibility);
// Función para alternar la visibilidad de los elementos
function toggleVisibility() {
	// Reemplazar el elemento a ocultar con el elemento a mostrar
	revealer.parentNode.replaceChild(revealed, revealer);
	// Mostrar el elemento revelado
	revealed.style.display = 'block';
}