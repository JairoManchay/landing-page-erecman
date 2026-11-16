# Formulario Erecman Plus de una sola página

## Conservación de la versión anterior

Antes de editar el formulario se creó docs/formulario-tres-pasos.md. Describe el recorrido aprobado y conserva su HTML, lógica de formulario y cascada CSS final. Incluye el botón rojo local REALIZAR PEDIDO, que todavía no estaba en un commit. El prompt recibido se conserva en docs/solicitud-formulario-una-pagina.md.

La eliminación previa de erecmanplus_version_final.zip se encontró al iniciar la tarea y no fue modificada.

## Cambios de producción

- index.html: el mismo modal, panel rojo e imágenes; se reemplaza la navegación entre pantallas por secciones continuas. Orden: encabezado, promociones, método de envío, información, resumen y WhatsApp. Se elimina ERECMAN PLUS del encabezado blanco para no repetir la marca del panel rojo. Se elimina el indicador de pasos y SIGUIENTE/VOLVER/EDITAR.
- css/order-form.css: reglas del nuevo formulario, delimitadas por .order-modal--single. Panel estable en escritorio, cabecera compacta en móvil, un único contenedor desplazable, campos de 52 px, texto de 16 px, imágenes de promociones 20% mayores (72×94 móvil; 86×114 escritorio), estados de selección y errores visibles. Sin dependencias añadidas.
- js/main.js: se reutilizan promociones, cálculo económico, normalización del celular, resumen, logos y constructor de mensaje. Se elimina el estado de pasos y se valida todo al enviar; los errores aparecen junto al campo y se enfoca el primero. El resumen cambia con promoción, destino, método y datos introducidos.

Las secciones de portada, ingredientes, médico, testimonios y garantías de la landing no se modifican. css/style.css conserva el cambio local anterior del botón rojo; el nuevo formulario aplica su botón verde mediante la hoja específica.

## Condiciones preservadas

Pide Especial: S/150. Especial Pack: S/269.90, antes S/299. Provincia: adelanto S/40 pendiente, descontado una sola vez del saldo estimado del producto; no se afirma un pago recibido. Domicilio solo en Lima. Agencia Shalom disponible; Olva Courier para Provincia, como en el flujo previo. En Lima no se exige adelanto.

WhatsApp: 51970396146, enlace wa.me con encodeURIComponent. Solo prepara el mensaje; el comprador lo envía desde WhatsApp. No procesa pagos ni confirma una compra automáticamente. Se conservan los sellos originales y el logo de la agencia elegida; no se añade decoración navideña.

## Validación

248 comprobaciones correctas en Chromium local para 320×740, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1366×900 y 1920×1080.

- Cinco disparadores existentes reutilizados; el pack abre con Especial Pack seleccionado.
- Secciones visibles en un único formulario, sin pasos ni navegación oculta.
- Resumen dinámico de ambas promociones, Shalom y Olva, cambio Lima/Provincia y datos conservados.
- Nombre y campos obligatorios; celulares incompletos, que empiezan con 8, texto y prefijo largo rechazados. +51 aceptado y normalizado.
- Adelanto requerido y aceptación obligatoria para Provincia; no se exige en Lima.
- Se rechaza domicilio forzado en Provincia aun alterando el radio desde el navegador.
- Mensaje WhatsApp con precio, saldo, adelanto pendiente, método y datos completos. window.open interceptado; ningún pedido enviado.
- Sin desbordamiento horizontal del modal, panel contenido, textos de entrada de al menos 16 px y controles principales de al menos 44 px.
- Botón final accesible al llegar al final del scroll; WhatsApp flotante oculto con modal abierto.
- Movimiento reducido, foco dentro del modal, Escape y restauración del foco al disparador; datos conservados al reabrir.
- node --check js/main.js y git diff --check correctos.

Los servicios de fuentes y analítica externos se bloquearon únicamente en las sesiones automatizadas. La landing conserva sus enlaces e integraciones.

## Capturas y límites

Previsualización: http://127.0.0.1:8080/qa/single-page/previsualizacion.html

Se incluyen vistas del modal real en los ocho anchos y capturas de cada sección en 390 y 1366 px. Para las dos capturas de contenido completo se levanta temporalmente el límite de altura solo en el navegador de QA y se captura el contenido derecho; se restaura inmediatamente. El código de producción mantiene scroll interno. Las capturas de viewport muestran también el panel rojo original.

No se recibió una imagen adjunta de la referencia buystoreperu.com; se siguieron la organización y los criterios detallados en el texto. El importe del delivery, alcance de cobertura y condiciones finales del adelanto siguen por confirmar con el asesor; no se inventaron valores.

Los scripts de tres pasos dentro de otros directorios qa son documentación histórica y ya no se aplican al flujo nuevo.

Sin commit, push, merge ni despliegue para esta tarea.

## Ajuste final del botón

Texto REGISTRAR PEDIDO con caja SVG. Fondo verde conservado y movimiento lateral continuo de -2 a 2 px, cada 3,5 segundos, sin zoom. Respeta movimiento reducido. La acción sigue preparando el pedido en WhatsApp. Capturas actualizadas; 248 comprobaciones correctas y verificación adicional de movimiento lateral sin cambio de dimensiones en 320, 390 y 1366 px (button-motion.json).

## Retirada del panel lateral

Por solicitud posterior se retiró el panel rojo con imagen y beneficios del modal. El formulario queda centrado en una sola columna exterior, con ancho máximo de 820 px; las promociones y campos conservan sus columnas internas en escritorio. Se actualizaron capturas y las 248 comprobaciones pasaron nuevamente. Las imágenes de promociones y resumen se mantienen.

Último ajuste: el botón REGISTRAR PEDIDO cambia del desplazamiento lateral a un balanceo de campana de ±2 grados, con dos oscilaciones y pausa cada 3,5 segundos, repetido infinitamente. Sin zoom. Verificado en 320, 390 y 1366 px, incluida la preferencia de movimiento reducido.

## Retirada del resumen visible

Por solicitud posterior se elimina la sección Resumen de tu pedido, su miniatura y los cuadros económico y de entrega. Se conservan los tres sellos antes del botón REGISTRAR PEDIDO. Se retira la función de renderizado y sus llamadas; los cálculos y el constructor de mensaje WhatsApp permanecen. 21 comprobaciones actuales en 320, 390 y 1366 px verifican validaciones, adelanto, promoción, Shalom/Olva, mensaje completo y ajuste de sellos y botón. Ver no-summary.json. Las capturas completas y results.json de 248 comprobaciones corresponden a la iteración anterior con resumen; la previsualización usa las capturas actuales sellos-boton.
