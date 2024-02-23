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

export default Cita;