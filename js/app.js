// Variables y Selectores
// Seleccionando los elementos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCita = document.querySelector('#citas');

// Variable para controlar si se está editando una cita
let editando;

// Event Listeners
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);

    document.addEventListener('DOMContentLoaded', () => {
        ui.imprimirCitas(administrarCita);
    });
}

// Clases
class Cita {
    constructor() {
        this.citas = JSON.parse(localStorage.getItem('citas')) || [];
    }

    // Método para agregar una cita
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        this.actualizarLocalStorage();
    }

    // Método para eliminar una cita
    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.actualizarLocalStorage();
    }

    // Método para editar una cita
    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.actualizarLocalStorage();
    }

    actualizarLocalStorage() {
        localStorage.setItem('citas', JSON.stringify(this.citas));
    }
}

class UI {
    // Método para imprimir una alerta
    imprimirAlerta(mensaje, tipo) {
        // Eliminar la alerta existente, si hay alguna
        const alertaPrevia = document.querySelector('.alert');
        if(alertaPrevia) {
            alertaPrevia.remove();
        }

        // Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al HTML
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta después de 2 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }

    // Método para imprimir las citas
    imprimirCitas({citas}) {
        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('DIV');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('H2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('P');
            propietarioParrafo.innerHTML = `<span class = "font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('P');
            telefonoParrafo.innerHTML = `<span class = "font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('P');
            fechaParrafo.innerHTML = `<span class = "font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('P');
            horaParrafo.innerHTML = `<span class = "font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('P');
            sintomasParrafo.innerHTML = `<span class = "font-weight-bolder">Síntomas: </span> ${sintomas}`;

            // Botón para eliminar esta cita
            const btnEliminar = document.createElement('BUTTON');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>';
            btnEliminar.addEventListener('click', () => {
                eliminarCita(id);
            });

            // Añade un botón para editar cada cita
            const btnEditar = document.createElement('BUTTON');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>';
            btnEditar.addEventListener('click', () => {
                editarCita(cita);
            });

            // Agregar los párrafos y botones al divCita
            divCita.append(mascotaParrafo);
            divCita.append(propietarioParrafo);
            divCita.append(telefonoParrafo);
            divCita.append(fechaParrafo);
            divCita.append(horaParrafo);
            divCita.append(sintomasParrafo);
            divCita.append(btnEliminar);
            divCita.append(btnEditar);

            // Agregar el divCita al HTML
            contenedorCita.append(divCita);
        });
    }

    // Método para limpiar el HTML
    limpiarHTML() {
        while(contenedorCita.firstChild) {
            contenedorCita.removeChild(contenedorCita.firstChild);
        }
    }
}

// Instanciar
const administrarCita = new Cita();
const ui = new UI();

// Objeto CitaObj
// Objeto para almacenar los datos de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Asignamos un min en el campo fecha
const fechaActual = new Date().toISOString().split('T')[0];
console.log(fechaActual);
fechaInput.min = fechaActual;

// Funciones
// Función para almacenar los datos de la cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value.trim();
}

// Función para crear una nueva cita
function nuevaCita(e) {
    e.preventDefault();

    // Extraer la información del objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    // Validar que el teléfono sea solo números, comience con 9 y tenga 9 dígitos
    const regexTelefono = /^9\d{8}$/;
    if(!regexTelefono.test(telefono)) {
        ui.imprimirAlerta('Teléfono no válido', 'error');
        return;
    }

    if(editando) {
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edición
        administrarCita.editarCita({...citaObj});

        // Regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Quitar modo edición
        editando = false;
    } else {
        // Generar un ID único
        citaObj.id = Date.now();
    
        // Creando una nueva cita
        administrarCita.agregarCita({...citaObj});

        // Mensaje de agregado correctamente
        ui.imprimirAlerta('Agregado correctamente');
    }

    // Reiniciar el objeto para la validación
    reiniciarObjeto();

    // Reiniciar el formulario
    formulario.reset();

    // Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCita);
}

// Función para reiniciar el objeto de la cita
function reiniciarObjeto() {
    Object.keys(citaObj).forEach(key => {
        citaObj[key] = '';
    });
}

// Función para eliminar una cita
function eliminarCita(id) {
    // Eliminar la cita
    administrarCita.eliminarCita(id);
    
    // Muestra un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Refrescar las citas
    ui.imprimirCitas(administrarCita);
}

// Función para editar una cita
function editarCita(cita) {
    // Carga los datos y el modo edición
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Llenar los inputs con los valores que se van actualizar
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    // Modo Edición
    editando = true;
}