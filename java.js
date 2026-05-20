document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('requestForm') || document.getElementById('bookingForm');
  const formMessage = document.getElementById('formMessage');

  if (!form || !formMessage) {
    return;
  }

  if (form.id === 'bookingForm' && !document.getElementById('requestForm')) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const nombre = form.querySelector('[name="nombre"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const fechaInput = form.querySelector('[name="fecha"]');
      const tipoSelect = form.querySelector('[name="tipo"]');
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
    return;
  }

  const solicitudRadios = Array.from(form.querySelectorAll('[name="solicitudTipo"]'));
  const cateringFields = Array.from(form.querySelectorAll('.catering-dependent'));
  const eventoTipo = form.querySelector('#eventoTipo');
  const eventoTipoOtroGroup = form.querySelector('#eventoTipoOtroGroup');
  const restriccionesOtrasCheckbox = form.querySelector('#restriccionesOtras');
  const otrasRestriccionesGroup = form.querySelector('#otrasRestriccionesGroup');
  const otrasRestriccionesInput = form.querySelector('#otrasRestricciones');
  const menuInfantilCheckbox = form.querySelector('#menuInfantil');
  const menuInfantilCantidadGroup = form.querySelector('#menuInfantilCantidadGroup');
  const observacionesTextarea = form.querySelector('#observaciones');
  const observacionesCount = form.querySelector('#observacionesCount');

  function updateCateringFields() {
    const selectedOption = form.querySelector('[name="solicitudTipo"]:checked');
    const showCatering = selectedOption && selectedOption.value === 'catering';
    cateringFields.forEach((element) => {
      element.classList.toggle('hidden', !showCatering);
    });
    if (!showCatering) {
      const eventoNombre = form.querySelector('#eventoNombre');
      const eventoTipoInput = form.querySelector('#eventoTipo');
      const eventoTipoOtroInput = form.querySelector('#eventoTipoOtro');
      const lugarEvento = form.querySelector('#lugarEvento');
      const servicioMozos = form.querySelector('#servicioMozos');
      const mobiliario = form.querySelector('#mobiliario');

      if (eventoNombre) eventoNombre.value = '';
      if (eventoTipoInput) eventoTipoInput.value = 'Casamiento';
      if (eventoTipoOtroInput) eventoTipoOtroInput.value = '';
      if (lugarEvento) lugarEvento.value = '';
      if (eventoTipoOtroGroup) eventoTipoOtroGroup.classList.add('hidden');
      if (servicioMozos) servicioMozos.checked = false;
      if (mobiliario) mobiliario.checked = false;
    }
  }

  function updateEventoTipoOtro() {
    const value = eventoTipo ? eventoTipo.value : '';
    if (eventoTipoOtroGroup) {
      eventoTipoOtroGroup.classList.toggle('hidden', value !== 'Otro');
    }
  }

  function updateOtrasRestricciones() {
    if (restriccionesOtrasCheckbox && restriccionesOtrasCheckbox.checked) {
      otrasRestriccionesGroup.classList.remove('hidden');
    } else {
      otrasRestriccionesGroup.classList.add('hidden');
      if (otrasRestriccionesInput) {
        otrasRestriccionesInput.value = '';
        updateCharCount(otrasRestriccionesInput, form.querySelector('#otrasRestriccionesCount'), 200);
      }
    }
  }

  function updateMenuInfantilCantidad() {
    if (menuInfantilCheckbox && menuInfantilCheckbox.checked) {
      menuInfantilCantidadGroup.classList.remove('hidden');
    } else {
      menuInfantilCantidadGroup.classList.add('hidden');
      const cantidadInput = form.querySelector('#menuInfantilCantidad');
      if (cantidadInput) cantidadInput.value = '1';
    }
  }

  function updateCharCount(textarea, countEl, maxLength) {
    if (!textarea || !countEl) return;
    const length = textarea.value.length;
    countEl.textContent = length;
    countEl.classList.toggle('text-danger', length > maxLength);
  }

  function setFieldState(element, valid) {
    if (!element) return;
    element.classList.remove('campo-error', 'campo-ok');
    element.classList.add(valid ? 'campo-ok' : 'campo-error');
  }

  function clearFieldStates() {
    const fields = form.querySelectorAll('.campo-error, .campo-ok');
    fields.forEach((field) => field.classList.remove('campo-error', 'campo-ok'));
  }

  solicitudRadios.forEach((radio) => radio.addEventListener('change', updateCateringFields));
  if (eventoTipo) eventoTipo.addEventListener('change', updateEventoTipoOtro);
  if (restriccionesOtrasCheckbox) restriccionesOtrasCheckbox.addEventListener('change', updateOtrasRestricciones);
  if (otrasRestriccionesInput) {
    otrasRestriccionesInput.addEventListener('input', function () {
      updateCharCount(otrasRestriccionesInput, form.querySelector('#otrasRestriccionesCount'), 200);
    });
  }
  if (observacionesTextarea) {
    observacionesTextarea.addEventListener('input', function () {
      updateCharCount(observacionesTextarea, observacionesCount, 350);
    });
  }
  if (menuInfantilCheckbox) menuInfantilCheckbox.addEventListener('change', updateMenuInfantilCantidad);

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      updateCateringFields();
      updateEventoTipoOtro();
      updateOtrasRestricciones();
      updateMenuInfantilCantidad();
      updateCharCount(otrasRestriccionesInput, form.querySelector('#otrasRestriccionesCount'), 200);
      updateCharCount(observacionesTextarea, observacionesCount, 350);
      clearFieldStates();
      formMessage.textContent = '';
    }, 0);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFieldStates();
    formMessage.textContent = '';

    const solicitudTipo = form.querySelector('[name="solicitudTipo"]:checked');
    const fecha = form.querySelector('#fecha');
    const hora = form.querySelector('#hora');
    const adultos = form.querySelector('#adultos');
    const nombre = form.querySelector('#nombre');
    const email = form.querySelector('#email');
    const confirmEmail = form.querySelector('#confirmEmail');
    const telefono = form.querySelector('#telefono');
    const eventoNombre = form.querySelector('#eventoNombre');
    const eventoTipoValue = form.querySelector('#eventoTipo');
    const eventoTipoOtro = form.querySelector('#eventoTipoOtro');
    const lugarEvento = form.querySelector('#lugarEvento');
    const bebidas = Array.from(form.querySelectorAll('[name="bebidas"]:checked'));
    const aceptaContacto = form.querySelector('#aceptaContacto');
    const aceptaTerminos = form.querySelector('#aceptaTerminos');
    const aceptaPrivacidad = form.querySelector('#aceptaPrivacidad');

    let valid = true;
    let message = '';

    if (!solicitudTipo) {
      valid = false;
      message = 'Selecciona el tipo de solicitud.';
    }
    if (!fecha.value) {
      valid = false;
      setFieldState(fecha, false);
      message = 'Selecciona la fecha del evento.';
    } else {
      setFieldState(fecha, true);
    }
    if (!hora.value) {
      valid = false;
      setFieldState(hora, false);
      message = 'Selecciona la hora de inicio.';
    } else {
      setFieldState(hora, true);
    }
    if (!adultos.value || Number(adultos.value) < 1) {
      valid = false;
      setFieldState(adultos, false);
      message = 'Indica la cantidad de adultos (mínimo 1).';
    } else {
      setFieldState(adultos, true);
    }
    if (!nombre.value.trim()) {
      valid = false;
      setFieldState(nombre, false);
      message = 'Ingresa el nombre completo.';
    } else {
      setFieldState(nombre, true);
    }
    if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      valid = false;
      setFieldState(email, false);
      message = 'Ingresa un correo electrónico válido.';
    } else {
      setFieldState(email, true);
    }
    if (!confirmEmail.value.trim() || email.value.trim() !== confirmEmail.value.trim()) {
      valid = false;
      setFieldState(confirmEmail, false);
      message = 'Los correos deben coincidir.';
    } else {
      setFieldState(confirmEmail, true);
    }
    if (!telefono.value.trim()) {
      valid = false;
      setFieldState(telefono, false);
      message = 'Ingresa un teléfono de contacto.';
    } else {
      setFieldState(telefono, true);
    }
    if (cateringFields.length > 0 && !cateringFields[0].classList.contains('hidden')) {
      if (!eventoNombre.value.trim()) {
        valid = false;
        setFieldState(eventoNombre, false);
        message = 'Ingresa el nombre o descripción del evento para catering.';
      } else {
        setFieldState(eventoNombre, true);
      }
      if (eventoTipoValue && eventoTipoValue.value === 'Otro') {
        if (!eventoTipoOtro.value.trim()) {
          valid = false;
          setFieldState(eventoTipoOtro, false);
          message = 'Describe el tipo de evento cuando eliges Otro.';
        } else {
          setFieldState(eventoTipoOtro, true);
        }
      }
      if (!lugarEvento.value.trim()) {
        valid = false;
        setFieldState(lugarEvento, false);
        message = 'Indica el lugar del evento para catering.';
      } else {
        setFieldState(lugarEvento, true);
      }
    }
    if (bebidas.length === 0) {
      valid = false;
      message = 'Selecciona al menos una bebida incluida.';
    }
    if (!aceptaContacto.checked) {
      valid = false;
      message = 'Debes aceptar que BuenSabor se contacte para confirmar disponibilidad.';
    }
    if (!aceptaTerminos.checked) {
      valid = false;
      message = 'Debes aceptar los términos y condiciones.';
    }
    if (!aceptaPrivacidad.checked) {
      valid = false;
      message = 'Debes aceptar la política de privacidad.';
    }

    if (!valid) {
      formMessage.textContent = message;
      formMessage.classList.add('form-message-error');
      return;
    }

    formMessage.textContent = '¡Gracias! Tu solicitud ha sido enviada. Nuestro equipo se pondrá en contacto contigo pronto.';
    formMessage.classList.remove('form-message-error');
    form.reset();
    updateCateringFields();
    updateEventoTipoOtro();
    updateOtrasRestricciones();
    updateMenuInfantilCantidad();
    updateCharCount(otrasRestriccionesInput, form.querySelector('#otrasRestriccionesCount'), 200);
    updateCharCount(observacionesTextarea, observacionesCount, 350);
  });

  updateCateringFields();
  updateEventoTipoOtro();
});
