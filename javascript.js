document.addEventListener('DOMContentLoaded', () => {
    // Referencias a la Modal
    const modal = document.getElementById('modalSettings');
    const btnSettings = document.getElementById('btnSettings');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnGuardarConfig = document.getElementById('btnGuardarConfig');

    // Pickers de color
    const inputColorHeader = document.getElementById('colorHeader');
    const inputColorButtons = document.getElementById('colorButtons');

    // Abrir modal
    btnSettings.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Cerrar modal con la 'X'
    btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar modal si hace clic fuera de ella
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Aplicar cambios de color al guardar
    btnGuardarConfig.addEventListener('click', () => {
        const colorHeader = inputColorHeader.value;
        const colorButtons = inputColorButtons.value;

        // Cambia las variables CSS globales
        document.documentElement.style.setProperty('--header-bg', colorHeader);
        document.documentElement.style.setProperty('--btn-bg', colorButtons);

        // Cierra la modal
        modal.style.display = 'none';
    });
});