// Declaraciones
// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
let currentTab = 0;
// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
let resetUltimo = false;
// Define una variable que almacene los nombres de los grupos  de botones radio procesados
let gruposProcesados = [];
// Obtener el div con id="stepContainer"
const stepContainer = document.getElementById('stepContainer');
// Obtener todos los divs con la clase tab
const tabs = document.getElementsByClassName('tab');
// Obtener el boton nextBtn
const nextBtn = document.getElementById('nextBtn');
// Obtener todos los span con la clase step
const steps = document.getElementsByClassName('step');
// Obtener el div que se muestra u oculta según el tratamiento
const treatmentDiv = document.getElementById('applyTreatment');
// Obtener los radios que indican si se aplica tratamiento o no
const treatedYes = document.getElementById('grupo2_0');
const treatedNo = document.getElementById('grupo2_1');
// Obtener el botón, su bisabuelo y su siguiente hermano para hacer un toggler de divs
const btnToggler = document.getElementById('toggleBtn');
const grandparent = btnToggler.parentElement.parentElement.parentElement;
const nextSibling = grandparent.nextElementSibling;
// helpers
// Define una función para modificar los spans con la clase step según el número de divs con la clase tab
function updateSpans() {
	// Si el número de spans es menor que el número de divs, añadir los spans necesarios
	while (steps.length < tabs.length) {
		var newSpan = document.createElement('span');
		newSpan.className = 'step';
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
	while (steps.length > tabs.length) {
		// Obtiene el siguiente span después del actual
		var nextSpan = steps[currentTab].nextSibling;
		// Si el siguiente span existe y es un span.step
		if (
			nextSpan &&
			nextSpan.tagName == 'SPAN' &&
			nextSpan.classList.contains('step')
		) {
			// Elimina ese span
			nextSpan.parentNode.removeChild(nextSpan);
		}
		steps.length--;
	}
}
// Funciones para el manejo de pestañas
// Define una función que recibe un parámetro n que indica el índice de la pestaña a mostrar
function showTab(n) {
	// Agrega la clase active al step actual
	steps[n].className += ' active';
	// Muestra el tab actual
	tabs[n].style.display = 'block';
	// Muestra u oculta el botón prev según corresponda
	document.getElementById('prevBtn').style.visibility =
		n === 0 ? 'hidden' : 'visible';
	// Cambia el icono del botón next según corresponda
	nextBtn.className =
		'btn btn-1505c btn-lg ' +
		(n === tabs.length - 1
			? 'fa-sharp fa-regular fa-paper-plane-top'
			: 'fa-solid fa-arrow-right');
	// Si el elemento no tiene el atributo "data-input-event", se lo agrega y le añade un evento "input"
	const inputs = tabs[n].getElementsByTagName('input');
	for (let i = 0; i < inputs.length; i++) {
		const inputEvent = inputs[i].getAttribute('data-input-event') === 'true';
		if (!inputEvent) {
			inputs[i].setAttribute('data-input-event', true);
			// Llama a la función validarYActualizarInputs cada vez que se cambia el valor del elemento
			inputs[i].addEventListener('input', function () {
				validarYActualizarInputs();
			});
		}
	}
	validarYActualizarInputs();
	deseleccionarTab();
}
// Define una función que recibe un parámetro n que indica si se avanza o retrocede una pestaña
function nextPrev(n) {
	// Si currentTab es mayor o igual al número de pestañas, envía el formulario y termina la función
	if (currentTab + n >= tabs.length) {
		document.getElementById('regForm').submit();
		return false;
	} else {
		// Oculta el elemento con el índice currentTab
		tabs[currentTab].style.display = 'none';
		steps[currentTab].className = steps[currentTab].className.replace(
			' active',
			'',
		);
		// Actualiza el valor de currentTab sumando el valor de n
		currentTab += n;
	}
	// Llama a la función showTab para mostrar la nueva pestaña
	showTab(currentTab);
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
	let valid = true;
	// Obtiene todos los elementos con la etiqueta "input" dentro de tabs y los asigna a una variable y
	const inputs = tabs[currentTab].getElementsByTagName('input');
	// Recorre todos los elementos de inputs y verifica su tipo y valor
	for (let i = 0; i < inputs.length; i++) {
		switch (inputs[i].type) {
			case 'email': // Si el tipo es "email"
				// Verifica validez con validity.valid o si está vacío
				inputs[i].classList.toggle(
					'invalid',
					!inputs[i].validity.valid || inputs[i].value === '',
				);
				break;
			case 'tel': // Si el tipo es "tel"
				// Comprueba vacío y NaN
				inputs[i].classList.toggle(
					'invalid',
					inputs[i].value === '' || Number.isNaN(Number(inputs[i].value)),
				);
				break;
			case 'radio': // Si el tipo es "radio"
				// Si no hay ningún elemento seleccionado, agrega la clase "invalid" al elemento
				inputs[i].classList.toggle('invalid', !document.querySelector( "input[name='" + inputs[i].name + "']:checked", ));
				break;
			default: // Si el tipo es otro
				// Si el valor está vacío, agrega la clase "invalid" al elemento
				inputs[i].classList.toggle('invalid', inputs[i].value == '');
				break;
		}
	// Actualiza valid
	valid = valid && !inputs[i].classList.contains('invalid');
	}
	// Basado en valor de valid se hacen un toggle a 2 clases
	steps[currentTab].classList.toggle('finish', valid);
	// Deshabilita nextBtn si valid es false
	nextBtn.classList.toggle('disabled', !valid);
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
		grupo3: function () {
			// Manejar el error del grupo3 al limpiar los botones radio cuando no existe
			if (resetUltimo && !this.checked) {
				ultimo = null;
				resetUltimo = false;
			}
		},
	};
	for (let i = 0; i < elementos.length; i++) {
		// Obtiene el elemento actual
		let elemento = elementos[i];
		// Verifica si el elemento tiene el atributo data-haslistener
		const hasListener = elemento.getAttribute('data-haslistener') === 'true';
		if (!hasListener) {
			elemento.setAttribute('data-haslistener', 'true');
			// Le añade el evento listener de tipo "click"
			elemento.addEventListener('click', function () {
				// Si el nombre del elemento coincide con alguna de las propiedades del objeto funciones
				if (funciones[elemento.name]) {
					// Ejecuta la función correspondiente
					funciones[elemento.name]();
				}
				// Si el elemento es el mismo que el último seleccionado y está marcado
				if (this.getAttribute('id') == ultimo) {
					// Lo deselecciona y limpia ultimo
					elemento.checked = false;
					ultimo = null;
					// procesa el cambio y lo valida
					validarYActualizarInputs();
				} else {
					// Si no, asigna el elemento a ultimo y lo selecciona
					ultimo = this.getAttribute('id');
					elemento.checked = true;
				}
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
	if (treatedYes.checked && !treatmentDiv.classList.contains('tab')) {
		resetUltimo = true;
	} else if (
		treatedYes.checked ^ treatedNo.checked &&
		treatmentDiv.classList.contains('tab')
	) {
		resetUltimo = false;
		treatmentDiv.value = '0';
		clearRadioGroup('grupo3');
	}
	treatmentDiv.classList.toggle('tab', resetUltimo);
	updateSpans();
}
function clearRadioGroup(name) {
	// Obtener botones radio del grupo y los deselecciona todos
	document.getElementsByName(name).forEach((radio) => {
		radio.checked = false;
	});
}
// Inicializadores y listener
// Llama a la función updateSpans al inicio para inicializar los spans
updateSpans();
// Llama a la función showTab para mostrar la primera pestaña
showTab(currentTab);
// Al hacer clic en btnToggler, llamar a la función toggleVisibility
btnToggler.addEventListener('click', function () {
	toggleVisibility(grandparent, nextSibling);
});
// La función toggleVisibility oculta el primer elemento y muestra el segundo
function toggleVisibility(elem1, elem2) {
	elem1.style.display = 'none';
	elem1.classList.remove('d-flex');
	elem2.style.display = 'block';
}