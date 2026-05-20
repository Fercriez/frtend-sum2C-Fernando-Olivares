document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm');
  const formMessage = form ? form.querySelector('#formMessage') : null;

  if (!form || !formMessage) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const fechaInput = form.querySelector('[name="fecha"]');
    const personasInput = form.querySelector('[name="personas"]');

    const fecha = fechaInput ? fechaInput.value : '';
    const personas = personasInput ? personasInput.value : '';

    if (!nombre || !email || !fecha || !personas) {
      formMessage.textContent = 'Por favor completa todos los campos obligatorios.';
      formMessage.classList.add('form-message-error');
      return;
    }

    formMessage.textContent = '¡Gracias! Tu solicitud ha sido enviada. Nuestro equipo se pondrá en contacto contigo pronto.';
    formMessage.classList.remove('form-message-error');
    form.reset();
  });
});
