document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm') || document.getElementById('requestForm');
  const formMessage = document.getElementById('formMessage');

  if (!form || !formMessage) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const fechaInput = form.querySelector('[name="fecha"]');
    const tipoSelect = form.querySelector('[name="tipo"]');
    const personasInput = form.querySelector('[name="personas"]');
    const mensajeInput = form.querySelector('[name="mensaje"]');

    const tipo = tipoSelect ? tipoSelect.value : 'Reserva';
    const fecha = fechaInput ? fechaInput.value : '';
    const personas = personasInput ? personasInput.value : '';
    const mensaje = mensajeInput ? mensajeInput.value.trim() : '';

    if (!nombre || !email || !fecha || !personas) {
      formMessage.textContent = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    formMessage.textContent = '¡Gracias! Tu solicitud ha sido enviada. Nuestro equipo se pondrá en contacto contigo pronto.';
    form.reset();
  });
});
