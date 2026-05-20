# frtend-sum2C-Fernando-Olivares

Este proyecto contiene una landing page moderna para el restaurante y servicio de catering `BuenSabor`.

## Archivos principales

- `index.html`: página principal con navegación, hero, menú destacado, servicios de catering, chef, testimonios y formulario de reserva.
- `solicitud.html`: página de solicitud para reservar mesa o pedir catering.
- `style.css`: estilos modernos y responsivos con paleta cálida (bordó, dorado, crema, blanco).
- `java.js`: lógica de validación del formulario y mensaje de confirmación.

## Cambios recientes
- Se agregó un logo en el hero de `index.html` sobre el texto "Restaurante y catering para tus mejores momentos".
- Se actualizó la imagen del tiramisú en la sección de menú.
- Se agregó la imagen proporcionada para la tarjeta de "Casamientos y fiestas de 15 años" en la sección de catering.
- Se agregó la imagen proporcionada para la tarjeta de "Eventos corporativos" en la sección de catering.
- Se agregó la imagen proporcionada para la tarjeta de "Cumpleaños y celebraciones familiares" en la sección de catering.
- Se agregó la imagen proporcionada para la tarjeta de "Desayunos y coffee breaks" en la sección de catering.
- Se reemplazó el avatar de Chef Julieta Montoya por la imagen proporcionada.
- Se reemplazó el avatar de Sous Chef Ricardo por la imagen proporcionada.
- Se documentó que el formulario debe estar dividido en cuatro secciones visuales con títulos claros:
  - Sección A: Tipo de solicitud y datos del evento, con radio buttons para reserva en salón o catering externo y campos condicionales según la opción.
  - Sección B: Datos de los comensales, con cantidad de adultos/menores, restricciones alimentarias, texto adicional para "Otras" y opción de menú infantil.
  - Sección C: Datos del cliente y preferencias, con nombre, correo, confirmación de correo, teléfono, tipo de menú, bebidas, servicio de mozos y mobiliario (solo catering externo), y origen del contacto.
  - Sección D: Observaciones y confirmación, con textarea de pedidos especiales, aceptaciones obligatorias de contacto, términos y condiciones y política de privacidad.
  - Botones de acción: "Enviar solicitud" destacado, "Limpiar" reset, y enlace de "Volver al inicio" a `index.html`.
  - Estilo y accesibilidad: campos con foco visual definido, clases `campo-error` y `campo-ok` preparadas, formulario centrado con ancho máximo de 750px, diseño responsive, etiquetas `label` correctamente asociadas, y `fieldset`/`legend` para grupos de opciones.
- Se implementó el formulario avanzado en `solicitud.html` con cuatro secciones, campos condicionales para catering, opciones de restricciones y bebidas, contadores de caracteres, confirmación de correo, botones de enviar/limpiar y enlace a `index.html`.
- Se añadió `validaciones.js` para validar el formulario de `solicitud.html` según las reglas de Sección A-D, mostrar retroalimentación visual inmediata, sumarizar errores y presentar una pantalla de confirmación con número de solicitud.

