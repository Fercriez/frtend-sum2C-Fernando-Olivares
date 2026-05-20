document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('requestForm');
  if (!form) {
    return;
  }

  const validationSummary = document.getElementById('validationSummary');
  const confirmationSection = document.getElementById('confirmationSection');
  const confirmTipo = document.getElementById('confirmTipo');
  const confirmNombre = document.getElementById('confirmNombre');
  const confirmFechaHora = document.getElementById('confirmFechaHora');
  const confirmComensales = document.getElementById('confirmComensales');
  const confirmNumero = document.getElementById('confirmNumero');
  const newRequestBtn = document.getElementById('newRequestBtn');

  const solicitudRadios = Array.from(form.querySelectorAll('[name="solicitudTipo"]'));
  const cateringFields = Array.from(form.querySelectorAll('.catering-dependent'));
  const eventoTipo = form.querySelector('#eventoTipo');
  const eventoTipoOtroGroup = form.querySelector('#eventoTipoOtroGroup');
  const restriccionesOtrasCheckbox = form.querySelector('#restriccionesOtras');
  const otrasRestriccionesGroup = document.getElementById('otrasRestriccionesGroup');
  const otrasRestriccionesInput = document.getElementById('otrasRestricciones');
  const menuInfantilCheckbox = document.getElementById('menuInfantil');
  const menuInfantilCantidadGroup = document.getElementById('menuInfantilCantidadGroup');
  const observacionesTextarea = document.getElementById('observaciones');
  const observacionesCount = document.getElementById('observacionesCount');

  function isVisible(element) {
    return element && element.offsetParent !== null;
  }

  function clearError(element) {
    if (!element) return;
    element.classList.remove('campo-error');
    element.classList.add('campo-ok');
    const message = element.parentNode.querySelector('.error-text');
    if (message) {
      message.remove();
    }
  }

  function setError(element, message) {
    if (!element) return;
    element.classList.remove('campo-ok');
    element.classList.add('campo-error');
    const parent = element.parentNode;
    let textNode = parent.querySelector('.error-text');
    if (!textNode) {
      textNode = document.createElement('div');
      textNode.className = 'error-text';
      parent.appendChild(textNode);
    }
    textNode.textContent = message;
  }

  function clearFieldState(element) {
    if (!element) return;
    element.classList.remove('campo-error', 'campo-ok');
    const error = element.parentNode.querySelector('.error-text');
    if (error) {
      error.remove();
    }
  }

  function resetHiddenField(element) {
    if (!element) return;
    if (element.type === 'checkbox' || element.type === 'radio') {
      element.checked = false;
    } else {
      element.value = '';
    }
    clearFieldState(element);
  }

  function updateValidationSummary(errors) {
    if (!validationSummary) return;
    if (errors.length === 0) {
      validationSummary.classList.add('hidden');
      validationSummary.innerHTML = '';
      return;
    }

    validationSummary.classList.remove('hidden');
    validationSummary.innerHTML = `<strong>Se encontraron ${errors.length} ${errors.length === 1 ? 'error' : 'errores'}:</strong> ${errors[0].message}`;
  }

  function updateCharCount(textarea, countEl, maxLength) {
    if (!textarea || !countEl) return;
    const length = textarea.value.length;
    countEl.textContent = length;
    countEl.classList.remove('text-warning', 'text-danger');
    if (length >= maxLength) {
      countEl.classList.add('text-danger');
    } else if (length >= maxLength * 0.8) {
      countEl.classList.add('text-warning');
    }
  }

  function updateCateringFields() {
    const selectedOption = form.querySelector('[name="solicitudTipo"]:checked');
    const isCatering = selectedOption && selectedOption.value === 'catering';
    cateringFields.forEach((field) => {
      field.classList.toggle('hidden', !isCatering);
      if (!isCatering) {
        const inputs = field.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => resetHiddenField(input));
      }
    });
  }

  function updateEventoTipoOtro() {
    if (!eventoTipo || !eventoTipoOtroGroup) return;
    const showOther = eventoTipo.value === 'Otro';
    eventoTipoOtroGroup.classList.toggle('hidden', !showOther);
    if (!showOther) {
      const extraInput = eventoTipoOtroGroup.querySelector('input');
      if (extraInput) resetHiddenField(extraInput);
    }
  }

  function updateOtrasRestricciones() {
    if (!restriccionesOtrasCheckbox || !otrasRestriccionesGroup) return;
    const show = restriccionesOtrasCheckbox.checked;
    otrasRestriccionesGroup.classList.toggle('hidden', !show);
    if (!show && otrasRestriccionesInput) {
      otrasRestriccionesInput.value = '';
      clearFieldState(otrasRestriccionesInput);
      updateCharCount(otrasRestriccionesInput, document.getElementById('otrasRestriccionesCount'), 200);
    }
  }

  function updateMenuInfantilCantidad() {
    if (!menuInfantilCheckbox || !menuInfantilCantidadGroup) return;
    const show = menuInfantilCheckbox.checked;
    menuInfantilCantidadGroup.classList.toggle('hidden', !show);
    if (!show) {
      const input = menuInfantilCantidadGroup.querySelector('input');
      if (input) resetHiddenField(input);
    }
  }

  function validateDateRule(selectedDate, isCatering) {
    if (!selectedDate) {
      return 'Selecciona la fecha del evento.';
    }

    const today = new Date();
    const eventDate = new Date(selectedDate + 'T00:00:00');
    const minDays = isCatering ? 7 : 2;
    const minMs = minDays * 24 * 60 * 60 * 1000;
    const limit = new Date(today.getTime() + minMs);
    limit.setHours(0, 0, 0, 0);

    if (eventDate < limit) {
      return isCatering
        ? 'Para catering externo la fecha debe ser al menos 7 días desde ahora.'
        : 'Para reserva de salón la fecha debe ser al menos 48 horas desde ahora.';
    }
    return '';
  }

  function validateTimeRule(timeValue, isCatering) {
    if (!timeValue) {
      return 'Selecciona la hora de inicio.';
    }

    if (!isCatering) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      if (hours < 12 || (hours === 23 && minutes > 0) || hours > 23) {
        return 'Para reservas de salón la hora debe ser entre 12:00 y 23:00.';
      }
    }
    return '';
  }

  function showConfirmation(values) {
    if (!confirmationSection) return;
    form.classList.add('hidden');
    confirmationSection.classList.remove('hidden');
    confirmTipo.textContent = values.tipo;
    confirmNombre.textContent = values.nombre;
    confirmFechaHora.textContent = `${values.fecha} ${values.hora}`;
    confirmComensales.textContent = values.comensales;
    confirmNumero.textContent = values.numero;
  }

  function hideConfirmation() {
    if (!confirmationSection) return;
    form.classList.remove('hidden');
    confirmationSection.classList.add('hidden');
  }

  function scrollToFirstError() {
    const firstError = form.querySelector('.campo-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function validateForm() {
    const errors = [];

    const solicitudTipo = form.querySelector('[name="solicitudTipo"]:checked');
    const fecha = document.getElementById('fecha');
    const hora = document.getElementById('hora');
    const duracion = document.getElementById('duracion');
    const eventoNombre = document.getElementById('eventoNombre');
    const eventoTipoInput = document.getElementById('eventoTipo');
    const eventoTipoOtro = document.getElementById('eventoTipoOtro');
    const lugarEvento = document.getElementById('lugarEvento');
    const adultos = document.getElementById('adultos');
    const menores = document.getElementById('menores');
    const bebidas = Array.from(form.querySelectorAll('[name="bebidas"]:checked'));
    const menuPreferido = document.getElementById('menuPreferido');
    const aceptaContacto = document.getElementById('aceptaContacto');
    const aceptaTerminos = document.getElementById('aceptaTerminos');
    const aceptaPrivacidad = document.getElementById('aceptaPrivacidad');
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const confirmEmail = document.getElementById('confirmEmail');
    const telefono = document.getElementById('telefono');

    if (!solicitudTipo) {
      errors.push({ field: form.querySelector('fieldset'), message: 'Selecciona el tipo de solicitud.' });
    }

    const isCatering = solicitudTipo && solicitudTipo.value === 'catering';

    if (!fecha || !fecha.value) {
      errors.push({ field: fecha, message: 'Selecciona la fecha del evento.' });
    } else {
      const dateError = validateDateRule(fecha.value, isCatering);
      if (dateError) {
        errors.push({ field: fecha, message: dateError });
      }
    }

    if (!hora || !hora.value) {
      errors.push({ field: hora, message: 'Selecciona la hora de inicio.' });
    } else {
      const timeError = validateTimeRule(hora.value, isCatering);
      if (timeError) {
        errors.push({ field: hora, message: timeError });
      }
    }

    if (isVisible(eventoNombre)) {
      if (!eventoNombre.value.trim() || eventoNombre.value.trim().length < 5) {
        errors.push({ field: eventoNombre, message: 'El nombre del evento debe tener al menos 5 caracteres.' });
      }
    }

    if (isVisible(eventoTipoInput)) {
      if (!eventoTipoInput.value) {
        errors.push({ field: eventoTipoInput, message: 'Selecciona un tipo de evento válido.' });
      }
      if (eventoTipoInput.value === 'Otro' && isVisible(eventoTipoOtro)) {
        if (!eventoTipoOtro.value.trim()) {
          errors.push({ field: eventoTipoOtro, message: 'Describe el evento cuando se elige Otro.' });
        }
      }
    }

    if (isVisible(lugarEvento)) {
      if (!lugarEvento.value.trim() || lugarEvento.value.trim().length < 10) {
        errors.push({ field: lugarEvento, message: 'El lugar del evento debe tener al menos 10 caracteres.' });
      }
    }

    if (!adultos || !adultos.value || !Number.isInteger(Number(adultos.value)) || Number(adultos.value) < 1) {
      errors.push({ field: adultos, message: 'Cantidad de adultos mínima 1.' });
    } else {
      const adultCount = Number(adultos.value);
      const maxAdults = isCatering ? 200 : 20;
      if (adultCount > maxAdults) {
        errors.push({ field: adultos, message: `Cantidad máxima de adultos es ${maxAdults}.` });
      }
    }

    if (menores) {
      const minorCount = Number(menores.value);
      const adultCount = Number(adultos.value) || 0;
      if (!Number.isInteger(Number(menores.value)) || minorCount < 0 || minorCount > 50) {
        errors.push({ field: menores, message: 'Cantidad de menores debe estar entre 0 y 50.' });
      } else if (minorCount > adultCount) {
        errors.push({ field: menores, message: 'Los menores no pueden superar la cantidad de adultos.' });
      }
    }

    if (restriccionesOtrasCheckbox && restriccionesOtrasCheckbox.checked) {
      if (!otrasRestriccionesInput.value.trim()) {
        errors.push({ field: otrasRestriccionesInput, message: 'Describe las otras restricciones.' });
      } else if (otrasRestriccionesInput.value.trim().length > 200) {
        errors.push({ field: otrasRestriccionesInput, message: 'El detalle no puede superar 200 caracteres.' });
      }
    }

    if (menuInfantilCheckbox && menuInfantilCheckbox.checked) {
      const menuInfantilCantidad = form.querySelector('#menuInfantilCantidad');
      const minorCount = Number(menores.value) || 0;
      if (!menuInfantilCantidad || !menuInfantilCantidad.value || !Number.isInteger(Number(menuInfantilCantidad.value)) || Number(menuInfantilCantidad.value) < 1) {
        errors.push({ field: menuInfantilCantidad, message: 'Ingresa la cantidad de menús infantiles.' });
      } else if (Number(menuInfantilCantidad.value) > minorCount) {
        errors.push({ field: menuInfantilCantidad, message: 'La cantidad de menús infantiles no puede superar la cantidad de menores.' });
      }
    }

    if (!nombre.value.trim() || nombre.value.trim().length < 5 || nombre.value.trim().length > 80 || !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(nombre.value.trim())) {
      errors.push({ field: nombre, message: 'Nombre completo válido (solo letras y espacios, 5-80 caracteres).' });
    }

    if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      errors.push({ field: email, message: 'Correo electrónico no válido.' });
    }

    if (!confirmEmail.value.trim() || confirmEmail.value.trim() !== email.value.trim()) {
      errors.push({ field: confirmEmail, message: 'El correo de confirmación debe coincidir.' });
    }

    if (!telefono.value.trim() || !/^[0-9+\-\s]+$/.test(telefono.value.trim()) || (telefono.value.replace(/[^0-9]/g, '').length < 8)) {
      errors.push({ field: telefono, message: 'Teléfono válido con al menos 8 dígitos numéricos.' });
    }

    if (bebidas.length === 0) {
      const bebidasField = form.querySelector('[name="bebidas"]');
      errors.push({ field: bebidasField, message: 'Selecciona al menos una bebida incluida.' });
    }

    if (!menuPreferido || !menuPreferido.value) {
      errors.push({ field: menuPreferido, message: 'Selecciona el tipo de menú preferido.' });
    }

    if (observacionesTextarea && observacionesTextarea.value.length > 350) {
      errors.push({ field: observacionesTextarea, message: 'Las observaciones no pueden superar 350 caracteres.' });
    }

    if (!aceptaContacto || !aceptaContacto.checked) {
      errors.push({ field: aceptaContacto, message: 'Debes aceptar que BuenSabor se contacte para confirmar disponibilidad.' });
    }
    if (!aceptaTerminos || !aceptaTerminos.checked) {
      errors.push({ field: aceptaTerminos, message: 'Debes aceptar los Términos y Condiciones.' });
    }
    if (!aceptaPrivacidad || !aceptaPrivacidad.checked) {
      errors.push({ field: aceptaPrivacidad, message: 'Debes aceptar la Política de Privacidad.' });
    }

    return errors;
  }

  function applyValidation() {
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(clearFieldState);
    updateValidationSummary([]);

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(({ field, message }) => {
        if (field) {
          if (field.type === 'checkbox' || field.type === 'radio') {
            const target = field.closest('fieldset') || field.parentNode;
            if (target) {
              setError(target, message);
            }
          } else {
            setError(field, message);
          }
        }
      });
      updateValidationSummary(errors);
      scrollToFirstError();
      return false;
    }

    updateValidationSummary([]);
    return true;
  }

  solicitudRadios.forEach((radio) => radio.addEventListener('change', () => {
    updateCateringFields();
    updateValidationSummary([]);
  }));

  if (eventoTipo) {
    eventoTipo.addEventListener('change', updateEventoTipoOtro);
  }
  if (restriccionesOtrasCheckbox) {
    restriccionesOtrasCheckbox.addEventListener('change', updateOtrasRestricciones);
  }
  if (otrasRestriccionesInput && observacionesCount) {
    otrasRestriccionesInput.addEventListener('input', () => updateCharCount(otrasRestriccionesInput, document.getElementById('otrasRestriccionesCount'), 200));
  }
  if (observacionesTextarea && observacionesCount) {
    observacionesTextarea.addEventListener('input', () => updateCharCount(observacionesTextarea, observacionesCount, 350));
  }
  if (menuInfantilCheckbox) {
    menuInfantilCheckbox.addEventListener('change', updateMenuInfantilCantidad);
  }

  form.addEventListener('reset', function () {
    window.setTimeout(() => {
      updateCateringFields();
      updateEventoTipoOtro();
      updateOtrasRestricciones();
      updateMenuInfantilCantidad();
      updateCharCount(otrasRestriccionesInput, document.getElementById('otrasRestriccionesCount'), 200);
      updateCharCount(observacionesTextarea, observacionesCount, 350);
      updateValidationSummary([]);
    }, 0);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const valid = applyValidation();
    if (!valid) {
      return;
    }

    const solicitudTipo = form.querySelector('[name="solicitudTipo"]:checked').value;
    const nombre = document.getElementById('nombre').value.trim();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const adultos = Number(document.getElementById('adultos').value) || 0;
    const menores = Number(document.getElementById('menores').value) || 0;
    const numero = Math.floor(Math.random() * 90000) + 10000;

    showConfirmation({
      tipo: solicitudTipo === 'mesa' ? 'Reserva de mesa en el salón' : 'Servicio de catering externo',
      nombre,
      fecha,
      hora,
      comensales: adultos + menores,
      numero,
    });
  });

  if (newRequestBtn) {
    newRequestBtn.addEventListener('click', function () {
      form.reset();
      hideConfirmation();
      updateCateringFields();
      updateEventoTipoOtro();
      updateOtrasRestricciones();
      updateMenuInfantilCantidad();
      updateValidationSummary([]);
      updateCharCount(otrasRestriccionesInput, document.getElementById('otrasRestriccionesCount'), 200);
      updateCharCount(observacionesTextarea, observacionesCount, 350);
    });
  }

  updateCateringFields();
  updateEventoTipoOtro();
  updateOtrasRestricciones();
  updateMenuInfantilCantidad();
  updateCharCount(otrasRestriccionesInput, document.getElementById('otrasRestriccionesCount'), 200);
  updateCharCount(observacionesTextarea, observacionesCount, 350);
});