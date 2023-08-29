var currentTab = 0; 
showTab(currentTab); 

function showTab(n) { 
  var x = document.getElementsByClassName("tab"); 
  x[n].style.display = "block"; 
  if (n == 0) { 
    document.getElementById("prevBtn").style.display = "none"; 
  } else { 
    document.getElementById("prevBtn").style.display = "inline"; 
  }
  if (n == (x.length - 1)) { 
    document.getElementById("nextBtn").setAttribute("class", "fa-sharp fa-regular fa-paper-plane-top"); 
  } else { 

    document.getElementById("nextBtn").setAttribute("class", "fa-solid fa-arrow-right"); 
  }
  fixStepIndicator(n); 
  validarYActualizarInputs(); 
}

function nextPrev(n) { 
  var x = document.getElementsByClassName("tab"); 
  if (n == 1 && !validarYActualizarInputs()) return false; 
  removeInputEvents(); 
  x[currentTab].style.display = "none"; 
  currentTab = currentTab + n; 
  deseleccionarTab(); 
  if (currentTab >= x.length) { 
    document.getElementById("regForm").submit(); 
    return false; 
  }
  showTab(currentTab); 
}

function validarYActualizarInputs() { 
  var x, y, i, valid = true; 
  x = document.getElementsByClassName("tab"); 
  y = x[currentTab].getElementsByTagName("input"); 
  for (i = 0; i < y.length; i++) { 
    switch (y[i].type) { 
      case "email": 
        var regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; 
        if (!regexCorreo.test(y[i].value)) { 
          if (!y[i].classList.contains("invalid")) { 
            y[i].classList.add("invalid"); 
          }
          valid = false; 
        } else { 
          if (y[i].classList.contains("invalid")) { 
            y[i].classList.remove("invalid"); 
          }
        }
        break; 
      case "tel": 
        var tlf = y[i].value; 
        if (tlf == "") { 
          if (!y[i].classList.contains("invalid")) { 
            y[i].classList.add("invalid"); 
          }
          valid = false; 
        } else { 
          tlf = Number(tlf); 
          var valido = !isNaN(tlf); 
          if (!valido) { 
            if (!y[i].classList.contains("invalid")) { 
              y[i].classList.add("invalid"); 
            }
            valid = false; 
          } else { 
            if (y[i].classList.contains("invalid")) { 
              y[i].classList.remove("invalid"); 
            }
          }
        }
        break; 
      case "radio": 
        var radio = document.querySelector("input[name='" + y[i].name + "']:checked"); 
        if (radio == null) { 
          if (!y[i].classList.contains("invalid")) { 
            y[i].classList.add("invalid"); 
          }
          valid = false; 
        } else { 
          if (y[i].classList.contains("invalid")) { 
            y[i].classList.remove("invalid"); 
          }
        }
        break; 
      default: 
        if (y[i].value == "") { 
          if (!y[i].classList.contains("invalid")) { 
            y[i].classList.add("invalid"); 
          }
          valid = false; 
        } else { 
          if (y[i].classList.contains("invalid")) { 
            y[i].classList.remove("invalid"); 
          }
        }
    }

    if (!y[i].hasAttribute("data-input-event")) { 
      y[i].setAttribute("data-input-event", true); 
      y[i].addEventListener("input", function() { 
        validarYActualizarInputs(); 
      });
    }
  }
  if (valid) { 
    document.getElementsByClassName("step")[currentTab].className += " finish"; 
    document.getElementById("nextBtn").disabled = false; 
  } else { 
    document.getElementById("nextBtn").disabled = true; 
  }
  return valid; 
}

function fixStepIndicator(n) { 
  var i, x = document.getElementsByClassName("step"); 
  for (i = 0; i < x.length; i++) { 
    x[i].className = x[i].className.replace(" active", ""); 
  }
  x[n].className += " active"; 
}

function deseleccionar(grupo) { 
  var radios = document.getElementsByName(grupo); 
  var lastChecked = null; 
  for (var i = 0; i < radios.length; i++) { 
    radios[i].addEventListener("click", function() { 
      if (this === lastChecked) { 
        this.checked = false; 
        lastChecked = null; 
      } else { 
        lastChecked = this; 
      }
      validarYActualizarInputs(currentTab); 
    });
  }
}
function deseleccionarTab() { 
  var cadena = ""; 
  cadena = "grupo" + currentTab; 
  deseleccionar(cadena); 
}

function removeInputEvents() { 
  var x, y, i;
  x = document.getElementsByClassName("tab"); 
  y = x[currentTab].getElementsByTagName("input"); 
  for (i = 0; i < y.length; i++) { 
    if (y[i].hasAttribute("data-input-event")) { 
      y[i].removeAttribute("data-input-event"); 
      y[i].removeEventListener("input", function() { 
        validarYActualizarInputs(); 
      });
    }
  }
}

deseleccionarTab();
removeInputEvents(); 
