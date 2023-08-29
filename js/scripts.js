var currentTab = 0; // Creo una variable global para guardar el índice de la pestaña actual
showTab(currentTab); // Llamo a la función showTab con el valor inicial de currentTab

function showTab(n) {
  var x = document.getElementsByClassName("tab"); // Obtengo todos los elementos con la clase tab
  x[n].style.display = "block"; // Muestro el elemento con el índice n
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none"; // Si n es 0, oculto el botón previo
  } else {
    document.getElementById("prevBtn").style.display = "inline"; // Si no, muestro el botón previo
  }
  if (n == (x.length - 1)) {
    // document.getElementById("nextBtn").innerHTML = "Enviar";
    document.getElementById("nextBtn").setAttribute("class", "fa-sharp fa-regular fa-paper-plane-top"); // Si n es el último índice, cambio el texto del botón siguiente a Submit
  } else {

    document.getElementById("nextBtn").setAttribute("class", "fa-solid fa-arrow-right");
    // document.getElementById("nextBtn").innerHTML = "Siguiente"; // Si no, mantengo el texto del botón siguiente como Next
  }
  fixStepIndicator(n) // Llamo a la función fixStepIndicator con el valor de n
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab"); // Obtengo todos los elementos con la clase tab
  if (n == 1 && !validateForm()) return false; // Si n es 1 y el formulario no es válido, salgo de la función
  x[currentTab].style.display = "none"; // Oculto el elemento con el índice currentTab
  currentTab = currentTab + n; // Sumo n al valor de currentTab
  deseleccionarTab(); // Llamo a la función deseleccionarTab para deseleccionar los botones de radio de la pestaña actual
  if (currentTab >= x.length) {
    document.getElementById("regForm").submit(); // Si currentTab es mayor o igual que el número de elementos, envío el formulario
    return false; // Salgo de la función
  }
  showTab(currentTab); // Llamo a la función showTab con el valor de currentTab
}

function validateForm() {
  var x, y, i, valid = true; // Creo algunas variables locales
  x = document.getElementsByClassName("tab"); // Obtengo todos los elementos con la clase tab
  y = x[currentTab].getElementsByTagName("input"); // Obtengo todos los elementos input dentro del elemento con el índice currentTab
  for (i = 0; i < y.length; i++) { // Recorro todos los elementos input
    switch (y[i].type) {
      case "email": // Si el tipo de input es email
        var regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Creo la expresión regular para validar el correo
        if (!regexCorreo.test(y[i].value)) { // Si el valor del input no cumple con la expresión regular
          y[i].className += " invalid"; // Añado la clase invalid al elemento
          valid = false; // Pongo la variable valid a false
        }
        break;
      case "tel": // Si el tipo de input es teléfono
        var tlf = y[i].value; // Obtengo el valor del input
        if (tlf == "") { // Si el valor del input es una cadena vacía
          y[i].className += " invalid"; // Añado la clase invalid al elemento
          valid = false; // Pongo la variable valid a false
        } else { // Si el valor del input no es una cadena vacía
          tlf = Number(tlf); // Convierto el valor del input a número
          var valido = !isNaN(tlf); // Compruebo si es un número
          if (!valido) { // Si no es un número
            y[i].className += " invalid"; // Añado la clase invalid al elemento
            valid = false; // Pongo la variable valid a false
          }
        }
        break;
      case "radio": // Si el tipo de input es radio
        var radio = document.querySelector("input[name='" + y[i].name + "']:checked"); // Obtengo el primer elemento input con el mismo nombre y el estado checked
        if (radio == null) { // Si no hay ningún elemento que coincida con el selector
          y[i].className += " invalid"; // Añado la clase invalid al elemento
          valid = false; // Pongo la variable valid a false
        }
        break;
      default: // Si el tipo de input es otro
        if (y[i].value == "") { // Si el valor del elemento es vacío
          y[i].className += " invalid"; // Añado la clase invalid al elemento
          valid = false; // Pongo la variable valid a false
        }
    }
  }
  if (valid) { // Si la variable valid es true
    document.getElementsByClassName("step")[currentTab].className += " finish"; // Añado la clase finish al elemento con la clase step y el índice currentTab
  }
  return valid; // Devuelvo el valor de la variable valid
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step"); // Creo algunas variables locales
  for (i = 0; i < x.length; i++) { // Recorro todos los elementos con la clase step
    x[i].className = x[i].className.replace(" active", ""); // Elimino la clase active de cada elemento
  }
  x[n].className += " active"; // Añado la clase active al elemento con el índice n
}

// Defino la función deseleccionar fuera de cualquier otra función
function deseleccionar(grupo) {
  var radios = document.getElementsByName(grupo); // Obtengo todos los botones de radio con el nombre del grupo
  var lastChecked = null; // Creo una variable para guardar el último botón seleccionado
  for (var i = 0; i < radios.length; i++) { // Recorro todos los botones de radio
    radios[i].addEventListener("click", function() { // Asigno un evento click a cada botón
      if (this === lastChecked) { // Si el botón que se ha pulsado es el mismo que estaba seleccionado
        this.checked = false; // Lo deselecciono
		console.log(lastChecked);
        lastChecked = null; // Pongo la variable lastChecked a null
      } else { // Si no
        lastChecked = this; // Guardo el botón que se ha pulsado en la variable lastChecked
      }
    });
  }
}
function deseleccionarTab() {
  var cadena = ""; // Creo una variable local para guardar la cadena que le pasaré a la función deseleccionar
  cadena = "grupo" + currentTab; // Concateno la palabra grupo con el valor de currentTab
  deseleccionar(cadena); // Llamo a la función deseleccionar con el valor de cadena
}
deseleccionarTab(); // Llamo a la función deseleccionarTab para deseleccionar los botones de radio de la pestaña actual
