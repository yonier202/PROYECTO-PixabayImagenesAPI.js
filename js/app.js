const resultado = document.querySelector('#resultado');

const formulario = document.querySelector('#formulario');

const paginadorDiv = document.querySelector('#paginacion');

const registrosxPagina = 40;

let totalPaginas;

let iterador;

let paginaActual;

document.addEventListener('DOMContentLoaded', () => {

    formulario.addEventListener('submit', validarFormulario);
});

function validarFormulario(e) {
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === "") {
        mostrarAlerta('Debe ingresar un termino de búsqueda');
        return;
    }
    buscarImagenes();
}

function mostrarAlerta(mj) {

    const existe = document.querySelector('.text-red-700');
    if (!existe) {
        const alerta = document.createElement('p');
        alerta.textContent = mj;
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
        'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML =  `
            <strong class="font-bold">Error!</strong>;
            <span class="block sm:inline">${mj}</span>
        `;
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
}

async function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = "44197226-b56be9c489395806e07834fc8";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosxPagina}&page=${paginaActual}`;
    
   
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        console.log(resultado);
        totalPaginas = CalcularPagina(resultado.totalHits);
        console.log(totalPaginas);
        mostrarImagenes(resultado.hits);
    } catch (error) {
        console.log(error);
    }
}

function mostrarImagenes(imagenes) {
    console.log(imagenes);
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre el arreglo de imagenes y contruir el HTML
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                </div>
                <div class="p-4 bg-white">
                    <p class="font-bold">Likes: ${likes}</p>
                    <p class="font-bold">Views: ${views}</p> 
                    
                    <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ver Imagen Grande</a>
                </div>    
            </div>
        `;
    });

    iterador = crearPaginador(totalPaginas);
    while(paginadorDiv.firstChild){
        paginadorDiv.removeChild(paginadorDiv.firstChild)
    }

    imprimirPaginador()
}

//geenador que va a registrar la cantidad de elementos de acuerdo  las paginas
function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const {value, done} = iterador.next();
        if (done) {
            return
        }
        // Caso contario, generar un boton cada elemento en el generador 
        const boton = document.createElement('a');
        boton.href = '#';
        boton.textContent = value;
        boton.classList.add('inline-block', 'px-4', 'py-2', 'rounded-full', 'text-black-500', 'hover:bg-yellow-500', 'hover:text-black', 'font-bold');
        boton.dataset.pagina = value;
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();

        }
        paginadorDiv.appendChild(boton);
    }

}

function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
        
    }
}

function CalcularPagina(total) {
    return parseInt(Math.ceil(total / registrosxPagina));

}