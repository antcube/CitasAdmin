import Cita from './clases/Cita.js';
import UI from './clases/UI.js';
import {mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario} from './selectores.js';

// Instanciar
export const administrarCita = new Cita();
export const ui = new UI();

// Variable para controlar si se está editando una cita
let editando;

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
fechaInput.min = fechaActual;


// Funciones
// Función para almacenar los datos de la cita
export function datosCita(e) {
    citaObj[e.target.name] = e.target.value.trim();
}

// Función para crear una nueva cita
export function nuevaCita(e) {
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
export function reiniciarObjeto() {
    Object.keys(citaObj).forEach(key => {
        citaObj[key] = '';
    });
}

// Función para eliminar una cita
export function eliminarCita(id) {
    // Eliminar la cita
    administrarCita.eliminarCita(id);
    
    // Muestra un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Refrescar las citas
    ui.imprimirCitas(administrarCita);
}

// Función para editar una cita
export function editarCita(cita) {
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

