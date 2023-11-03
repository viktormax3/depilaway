// Declaraciones
// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
let currentTab = 0;
// Define una variable que almacena el índice de la pestaña actual (inicialmente 0)
let resetUltimo = false;
// Define una variable que almacene los nombres de los grupos de botones radio procesados
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
	let ultimo;
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
		const hasListener = elemento.getAttribute('data-haslistener');
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


// Arrays de contenidos
const mini = [
  ['bozo','fa-solid fa-crown'],
  ['nariz','fa-solid fa-umbrella'],
  ['orejas','fa-solid fa-bell'],
  ['nudillos manos','fa-solid fa-gift'],
  ['nudillos pies','fa-solid fa-gift'] 
];

const peque = [
  ['axilas','fa-solid fa-coffee'],
  ['bikini','fa-solid fa-bicycle'],
  ['cuello','fa-solid fa-tree'],
  ['línea alba','fa-solid fa-cloud'],
  ['mejillas','fa-solid fa-fire'],
  ['mentón','fa-solid fa-moon']
];

const media = [
  ['abdomen','fa-solid fa-flag','línea alba'],
  ['antebrazo','fa-solid fa-paint-brush'],
  ['barba','fa-solid fa-phone','mejillas,mentón,bozo'],
  ['brasilero','fa-solid fa-calculator', 'bikini'],
  ['espalda alta','fa-solid fa-lightbulb'],
  ['espalda baja','fa-solid fa-magnet'], 
  ['glúteos','fa-solid fa-key'],
  ['hombros','fa-solid fa-lock'],
  ['media pierna','fa-solid fa-map'],
  ['muslos','fa-solid fa-compass']
];

const grande = [
  ['brazos completos','fa-solid fa-clock','nudillos manos,antebrazo'],
  ['espalda completa','fa-solid fa-clock','espalda alta,espalda baja'],
  ['pecho completo','fa-solid fa-thermometer','abdomen,línea alba'],
  ['piernas completas','fa-solid fa-medal','muslos,media pierna,nudillos pies'],
  ['rostro completo','fa-solid fa-trophy','mejillas,mentón,bozo,nariz,orejas,cuello,barba'] 
];
let grupo = 10; // esta es la variable global que almacena el número de grupo 
// Generar inputs
// Creamos un arreglo que contiene los arreglos de las categorías y sus nombres
const categorias = [
	[mini, 'mini', 'checkbox'],
	[peque, 'peque', 'checkbox'],
	[media, 'media', 'checkbox'],
	[grande, 'grande', 'checkbox']
];
// Hacemos un forEach para llamar a la función generateInputs con cada subarreglo
categorias.forEach(categoria => {
	// La función recibe el subarreglo como argumento
	// Usamos la desestructuración de arreglos para asignar los valores a las variables
	let [contents, containerName, type] = categoria;
	// Llamamos a la función generateInputs con las variables
	generateInputs(contents, containerName, type);
});
// Función para asignar atributos 
function generateInputs(contents, containerName, type) {
	const container = document.getElementById(containerName);
	contents.forEach((content, index) => {
		// Crear input
		const input = document.createElement('input');
		const inputConfig = {
			type: type,
			class: 'btn-check',
			id: `grupo${grupo}_${index}`, // usamos el número de grupo y el índice para crear el id
			'data-label': content[0],
			'data-covered-by': content[2]
		};
		if (type == 'radio') {
			input.name = `grupo${grupo}`;
		}
		setAttributes(input, inputConfig);
		// Crear label
		const label = document.createElement('label');
		const labelConfig = {
			for: input.id,
			class: 'btn btn-outline-1505c btn-lg box-shadow px-2'
		};
		setAttributes(label, labelConfig);
		if (content[1]) {
		// Crear i
		const i = document.createElement('i');
		const iConfig = {
			class: content[1],
		};
		setAttributes(i, iConfig);
		// Agregar i al label
		label.appendChild(i);
	}
		// Crear span
		const span = document.createElement('span');
		span.textContent = content[0]; // Asignamos el texto del span
		// Agregar span al label
		label.appendChild(span);
		container.appendChild(input);
		container.appendChild(label);
	});
	grupo++; // incrementamos el número de grupo cada vez que se llama a la función
}
// Función para asignar atributos 
function setAttributes(element, attributes) {
	Object.keys(attributes).forEach(attr => {
		element.setAttribute(attr, attributes[attr]);
	});
}
// Crea una clase para manejar los checkboxes
class CheckboxesManager {
	constructor() {
		// Selecciona todos los elementos <input> por su tipo
		this.checkboxes = document.querySelectorAll('.btn-check[type="checkbox"]');
		// Selecciona el elemento <div> por su id
		this.contentsContainer = document.querySelector('#contents-container');
		// Selecciona el elemento <div> con la clase alert
		this.alert = document.querySelector('.alert');
	}
	init() {
		// Recorre los elementos <input>
		this.checkboxes.forEach(checkbox => {
			// Añade un evento change a cada elemento <input> para que se ejecute una función cuando cambie su estado
			checkbox.addEventListener('change', () => {
				this.handleChange(checkbox);
			});
		});
	}
	handleChange(checkbox) {
		// Obtiene el valor del elemento <input>
		const value = checkbox.dataset.label;
		let span = this.contentsContainer.querySelector(`[data-value="${value}"]`);
		const checked = checkbox.checked;
		const covered = checkbox.dataset.coveredBy;
		let disabled = [];
		// Si no hay un elemento <span> con el mismo valor
		if (!span && checkbox.checked) {
			// Crea un nuevo elemento <span> con el valor del elemento <input>
			span = this.createSpan(value);
			// Añade el nuevo elemento <span> al elemento <div> que contiene los contenidos
			this.contentsContainer.appendChild(span);
			// Añade un evento click al elemento <span> para que se ejecute una función cuando se haga clic en él
			span.addEventListener('click', () => {
				this.updateAlert()
				this.contentsContainer.removeChild(span);
				checkbox.checked = false;
				this.toggleLabels(covered, false, disabled);
			})
		} else if (span && !checkbox.checked) {
			// Elimina el elemento <span> existente
			this.contentsContainer.removeChild(span);
		}
		this.updateAlert();
		if (covered){
			this.toggleLabels(covered, checked, disabled);
			if (disabled.length) {
				// Eliminar spans
				disabled.forEach(chk => {
					const span = document.querySelector(`[data-value="${chk.dataset.label}"]`);
					if (span) {
						this.contentsContainer.removeChild(span);
					}
				});
			}
		}
	}
	toggleLabels(covered, enable,disabled) {
		// Convertir el covered-by a array
		const zones = covered.split(',');
		// Iterar cada zona
		zones.forEach(zone => {
			// Encontrar inputs con data-label igual a la zona
			const inputs = document.querySelectorAll(`[data-label="${zone}"]`);
			// Iterar los inputs
			inputs.forEach(input => {
				// Obtener el id del input
				const inputId = input.id;
				// Encontrar el label por el id
				const label = document.querySelector(`label[for="${inputId}"]`);
				label.classList.toggle('disabled', enable)
				// Habilitar/deshabilitar según enable
				if (enable) {
					console.log('entre a deseleccionar');
					input.checked = false;
					disabled.push(input);
				}
			});
		});
		return disabled;
	}
	createSpan(value) {
		// Crea un nuevo elemento <span>
		const span = document.createElement('span');
		// Define los atributos del elemento <span>
		const attributes = {
			'data-value': value,
			class: 'badge-pill-primary me-1 mb-1',
			'data-bs-theme': 'dark'
		};
		// Asigna los atributos al elemento <span>
		setAttributes(span, attributes);
		// Asigna el valor del elemento <input> como el texto del elemento <span>
		span.textContent = value;
		// Crea un nuevo elemento <button>
		const button = document.createElement('button');
		// Define los atributos del elemento <button>
		button.type = 'button';
		button.classList.add('btn-close');
		button.setAttribute('aria-label', 'Close');
		// Añade el elemento <button> al elemento <span> como hijo
		span.appendChild(button);
		// Devuelve el elemento <span> creado
		return span;
	}
	updateAlert() {
		// Obtiene el número total de elementos <span> en el elemento <div> que contiene los contenidos
		const totalcontents = this.contentsContainer.querySelectorAll('span').length;
		// Si hay más de un interés seleccionado
		if (totalcontents > 1) {
			// Muestra el elemento <div> con la clase alert
			this.alert.style.display = 'block';
		} else {
			// Oculta el elemento <div> con la clase alert
			this.alert.style.display = 'none';
		}
	}
}
// Crea una función para asignar varios atributos a un elemento
function setAttributes(element, attributes) {
	// Recorre las claves del objeto attributes
	Object.keys(attributes).forEach(attr => {
		// Asigna cada atributo y su valor al elemento
		element.setAttribute(attr, attributes[attr]);
	});
}
// Crea una instancia de la clase CheckboxesManager
const manager = new CheckboxesManager();
// Inicializa la instancia
manager.init();