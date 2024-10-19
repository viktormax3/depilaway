// Definición de medidas fijas para todas las imágenes
const medidas = [
  { max: 575, archivo: '50' },
  { min: 576, max: 991, archivo: '75' },
  { min: 992, archivo: '100' }
];

// Array con la información de las imágenes
const imagenes = [
  { id: 1, nombre: 'Slideshow 1', titulo: 'Titulo 1', descripcion: 'Imagen referencial 1' },
  { id: 2, nombre: 'Slideshow 2', titulo: 'Titulo 2', descripcion: 'Imagen referencial 2' },
  { id: 3, nombre: 'Slideshow 3', titulo: 'Titulo 3', descripcion: 'Imagen referencial 3' },
  { id: 4, nombre: 'Slideshow 4', titulo: 'Titulo 4', descripcion: 'Imagen referencial 4' },
  { id: 5, nombre: 'Slideshow 5', titulo: 'Titulo 5', descripcion: 'Imagen referencial 5' }
];

// Función para generar el HTML de los items del carousel
function generarItemsHTML() {
  return imagenes.map((img, index) => `
    <div class="carousel-item${index === 0 ? ' active' : ''}" data-bs-interval="4000">
      <picture>
        ${medidas.map(medida => {
          let media = [];
          if (medida.min) media.push(`(min-width: ${medida.min}px)`);
          if (medida.max) media.push(`(max-width: ${medida.max}px)`);
          return `<source srcset="images/${img.id}.${medida.archivo}.png" media="${media.join(' and ')}">`;
        }).join('\n        ')}
        <img src="images/${img.id}.${medidas[0].archivo}.png" class="img-fluid w-100" alt="${img.nombre}" draggable="false">
      </picture>
      <!-- <div class="carousel-caption">
        <h5>${img.titulo}</h5>
        <p>${img.descripcion}</p>
      </div> -->
    </div>
  `).join('\n\n');
}
// Función para generar el HTML de los indicadores
function generarIndicadoresHTML() {
  return imagenes.map((_, index) => `
    <button type="button" data-bs-target="#carousel-1" data-bs-slide-to="${index}"
      ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}">
    </button>
  `).join('\n');
}
// Función para insertar el HTML generado en el DOM
function insertarCarouselContent() {
  const carousel = document.querySelector('#carousel-1');
  if (carousel) {
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    const innerContainer = carousel.querySelector('.carousel-inner');
    if (indicatorsContainer && innerContainer) {
      indicatorsContainer.innerHTML = generarIndicadoresHTML();
      innerContainer.innerHTML = generarItemsHTML();
    } else {
      console.error('No se encontraron los contenedores de indicadores o items del carousel');
    }
  } else {
    console.error('No se encontró el elemento del carousel');
  }
}
insertarCarouselContent();