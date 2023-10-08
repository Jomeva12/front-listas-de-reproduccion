$(function () {
    abrirInputCrearLista()
    abrirInputCrearCancion()
    addLista()
    obtenerListasDeReproduccion();
    crearCancion()
    listarCanciones()
    opcionesModal()
    agregarCancionAlista()
    buscarLista()
})

function abrirInputCrearLista() {
    $("#mostrarInputCrearLista").on('click', function (e) {
        e.preventDefault()
        $("#inputContainer").css("display", "block");
        $("#mostrarInputCrearLista").hide()

    })
}
function abrirInputCrearCancion() {
    $("#mostrarInputCrearCanciones").on('click', function (e) {
        e.preventDefault()
        $("#inputContainerCancion").css("display", "block");
        $("#mostrarInputCrearCanciones").hide()

    })
}
function addLista() {
    $("#btnAgregarLista").on('click', function (e) {
        e.preventDefault();
        $("#inputContainer").css("display", "none");
        $("#mostrarInputCrearLista").show();

        // Obtener el nombre de la lista desde el input
        var nombreLista = $("#nombreLista").val();

        // Crear un objeto con los datos de la nueva lista
        var nuevaLista = {
            nombre: nombreLista
        };

        // Realizar una solicitud POST a la API para crear la lista
        fetch('http://localhost:8080/lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaLista),

        })
            .then(response => {
                if (response.ok) {
                    // La lista se creó con éxito
                    alert('Lista creada con éxito');
                    obtenerListasDeReproduccion();
                } else {
                    // Hubo un error al crear la lista
                    console.error('Error al crear la lista');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    });
}
function obtenerListasDeReproduccion() {
    // Realizar una solicitud GET a la API para obtener la lista de reproducción
    fetch('http://localhost:8080/lists', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.ok) {
                // Parsear la respuesta JSON
                return response.json();
            } else {
                // Hubo un error al obtener la lista de reproducción
                console.error('Error al obtener la lista de reproducción');
                return [];
            }
        })
        .then(data => {
            // Llamar a una función para mostrar las listas en la tabla
            mostrarListasEnTabla(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function mostrarListasEnTabla(listas) {
    // Obtener la tabla donde se mostrarán las listas

    var plantilla = ""
    // Recorrer las listas y agregarlas a la tabla
    listas.forEach(lista => {
        plantilla += `
        <tr>    
           <td style="display: none;">${lista.id}</td>
           <td>${lista.nombre}</td>
           <td>
           
                <button class="btn btn-primary agregarCancion" > agregar cancion</button>
                <button class="btn btn-success btnVerDetralleLista" data-id="1"> ver canciones</button>
                 <button class="btn btn-light btn-borrar" data-id="1">
                       <img src="./assets/img/delete.png" alt="" srcset="">
                  </button>
            </td>
         </tr>        
        `
    });
    $("#tablaLista").html(plantilla)
}

function opcionesModal() {
    $("#tablaLista").on('click', '.btn-borrar', function () {
        // Obtén el nombre del elemento que deseas eliminar desde el atributo
        var nombreLista = $(this).closest('tr').find('td:eq(1)').text();
        console.log(nombreLista)
        // Envía una solicitud DELETE al backend para eliminar el elemento con el ID específico
        eliminarListaDeReproduccionPorNombre(nombreLista)
    });

    $("#tablaLista").on('click', '.agregarCancion', function () {
        // Obtén el nombre de la lista desde la celda de la columna 1 (segunda columna)
        var nombreLista = $(this).closest('tr').find('td:eq(1)').text();
        var id = $(this).closest('tr').find('td:eq(0)').text();
        // Muestra el nombre de la lista en el elemento con el ID "nombreLista"
        $(".nombreLista").html(nombreLista);
        $(".idListaReproduccion").val(id);
        console.log(id)
        listarCancionesModal()
        // Muestra el modal
        $("#exampleModalLong").modal('show');
    });

    $("#tablaLista").on('click', '.btnVerDetralleLista', function () {
        // Obtén el nombre de la lista desde la celda de la columna 1 (segunda columna)
        var nombreLista = $(this).closest('tr').find('td:eq(1)').text();
        var id = $(this).closest('tr').find('td:eq(0)').text();
        // Muestra el nombre de la lista en el elemento con el ID "nombreLista"
        $(".nombreLista").html(nombreLista);
        $(".idListaReproduccion").val(id);
        console.log(id)
        listarCancionesModalDetalleLista(nombreLista)
        // Muestra el modal
        $("#modalDetalleLista").modal('show');
    });

    $(".closeModal").on('click', function () {
        // Obtén el ID del elemento que deseas eliminar desde el atributo "data-id"
        var nombreLista = $(this).closest('tr').find('td:eq(1)').text();
        $("#modalDetalleLista").modal('hide');
        $("#exampleModalLong").modal('hide');
        console.log("dsad")
    });

}



function eliminarListaDeReproduccionPorNombre(nombre) {
    // Realizar una solicitud DELETE a la API para eliminar la lista de reproducción por nombre
    console.log("eliminar->" + nombre)
    fetch(`http://localhost:8080/lists/delete/${nombre}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                // La lista se eliminó con éxito
                alert(`Lista "${nombre}" eliminada con éxito`);
                // Volver a cargar las listas después de eliminar
                obtenerListasDeReproduccion();
            } else {
                // Hubo un error al eliminar la lista
                console.error('Error al eliminar la lista');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function crearCancion() {
    $("#btnAgregarCancion").on('click', function (e) {
        e.preventDefault();

        $("#inputContainerCancion").css("display", "none");
        $("#mostrarInputCrearCanciones").show()

        // Obtener los valores de los inputs
        var titulo = $("#titulo").val();
        var artista = $("#artista").val();
        var album = $("#album").val();
        var anno = $("#anno").val();

        // Crear un objeto con los datos de la nueva canción
        var nuevaCancion = {
            titulo: titulo,
            artista: artista,
            album: album,
            anno: anno
        };

        // Realizar una solicitud POST a la API para crear la canción
        fetch('http://localhost:8080/canciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaCancion)
        })
            .then(response => {
                if (response.ok) {
                    // La canción se creó con éxito
                    console.log('Canción creada con éxito');
                    listarCanciones()
                } else {
                    // Hubo un error al crear la canción
                    console.error('Error al crear la canción');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    });

}

function listarCanciones() {
    // Realizar una solicitud GET a la API para obtener todas las canciones
    fetch('http://localhost:8080/canciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Llamar a una función para mostrar las canciones en la tabla
            mostrarCancionesEnTabla(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

// Función para mostrar las canciones en la tabla
function mostrarCancionesEnTabla(canciones) {
    var plantilla = "";
    // Recorrer las canciones y agregarlas a la tabla
    canciones.forEach(cancion => {
        plantilla += `
        <tr>
           
            <td>${cancion.titulo}</td>
            <td>${cancion.artista}</td>
            
        </tr>
        `;
    });
    // Agregar la plantilla a la tabla de canciones
    $("#tablaCanciones").html(plantilla);
}

function listarCancionesModal() {
    // Realizar una solicitud GET a la API para obtener todas las canciones
    fetch('http://localhost:8080/canciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            // Llamar a una función para mostrar las canciones en la tabla
            mostrarCancionesEnModal(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

// Función para mostrar las canciones en la tabla
function mostrarCancionesEnModal(canciones) {
    var plantilla = "";
    // Recorrer las canciones y agregarlas a la tabla
    canciones.forEach(cancion => {
        plantilla += `
        <tr>
        <td>${cancion.id}</td>
            <td>${cancion.titulo}</td>
            <td>${cancion.artista}</td>
            <td>${cancion.album}</td>
            <td>${cancion.anno}</td>

            <td><button class="btn btn-primary agregarCancionAlista" > agregar</button></td>
        </tr>
        `;
    });
    $("#tablaCancionesModal").html(plantilla);
}
function agregarCancionAlista() {
    $("#tablaCancionesModal").on('click', '.agregarCancionAlista', function () {
        // Obtén el ID del elemento que deseas eliminar desde el atributo "data-id"
        var id = $(this).closest('tr').find('td:eq(0)').text();
        var nombreCancion = $(this).closest('tr').find('td:eq(1)').text();
        var artista = $(this).closest('tr').find('td:eq(2)').text();
        var album = $(this).closest('tr').find('td:eq(3)').text();
        var anno = $(this).closest('tr').find('td:eq(4)').text();
        var idListaReproduccion = $(".idListaReproduccion").val()
        console.log("idListaReproduccion: ->" + idListaReproduccion);
        console.log("ID de la canción: " + id);
        console.log("Nombre de la canción: " + nombreCancion);
        console.log("Artista: " + artista);
        console.log("Álbum: " + album);
        console.log("Año: " + anno);

        var cancion = {
            id: id, // El ID de la canción (cambia según tu necesidad)
            nombre: "Nombre de la canción",
            artista: "Nombre del artista",
            album: "Nombre del álbum",
            anno: 2023 // Año de la canción (cambia según tu necesidad)
        };
        var requestOptions = {
            method: 'PUT',  // Cambia 'POST' a 'PUT' aquí
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cancion)
        };
        // Realiza la solicitud POST
        fetch("http://localhost:8080/lists/add/" + idListaReproduccion, requestOptions)
            .then(response => {
                if (response.ok) {
                    console.log("Canción agregada con éxito a la lista.");
                    $(this).hide();
                    // Actualiza la interfaz de usuario u realiza otras acciones necesarias.
                } else {
                    console.error("Error al agregar la canción a la lista:", response.statusText);
                }
            })
            .catch(error => {
                console.error("Error al realizar la solicitud:", error);
            });
    });
}

function buscarLista() {
    $("#btnBuscarLista").on('click', function () {

        var datoBuscar = $("#buscarLista").val()
        console.log("->" + datoBuscar)
        if (datoBuscar.trim() !== '') {
            fetch(`http://localhost:8080/lists/get/${datoBuscar}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    // Manipula los datos obtenidos y actualiza la tabla en el frontend
                    // Verifica si la respuesta contiene datos válidos

                    // Manipula los datos obtenidos y actualiza la tabla en el frontend
                    mostrarListasEnTablaBuscar(data);

                })
                .catch(error => {
                    alert("La lista no existe")
                    console.error('Error en la solicitud:', error);
                });

        } else {
            // Maneja el caso en el que el campo de búsqueda está vacío
            alert('Por favor, ingrese un nombre para buscar.');
        }
    }
    )

}
function mostrarListasEnTablaBuscar(listas) {
    var plantilla = "";

    plantilla = `
        <tr>    
          
           <td>${listas.nombre}</td>
           <td>
           <button class="btn btn-primary agregarCancion" > agregar cancion</button>
           <button class="btn btn-success btnVerDetralleLista" data-id="1" > ver canciones</button>
            <button class="btn btn-light btn-borrar" data-id="1">
                  <img src="./assets/img/delete.png" alt="" srcset="">
             </button>
       </td>
         </tr>        
        `;


    $("#tablaLista").html(plantilla);
}
function listarCancionesModalDetalleLista(nombreLista) {
    // Realizar una solicitud GET a la API para obtener todas las canciones
    console.log("->>>>" + nombreLista)
    fetch('http://localhost:8080/lists/get/' + nombreLista, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data && Array.isArray(data.canciones)) {
                // Aquí puedes estar seguro de que data.canciones existe y es un arreglo
                mostrarCancionesdetalleLista(data.canciones);
            } else {
                console.error('No se encontraron canciones válidas en el objeto "data".');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
function mostrarCancionesdetalleLista(canciones) {
    var plantilla = "";
    // Recorrer las canciones y agregarlas a la tabla
    canciones.forEach(cancion => {
        plantilla += `
        <tr>
        <td>${cancion.id}</td>
            <td>${cancion.titulo}</td>
            <td>${cancion.artista}</td>
            <td>${cancion.album}</td>
            <td>${cancion.anno}</td>

           
        </tr>
        `;
    });
    $("#tablaCancionesDeLista").html(plantilla);
}


