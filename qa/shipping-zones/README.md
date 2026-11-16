# Zonas de envío y retirada del WhatsApp flotante

Se aplica el adjunto recibido con la excepción indicada por el usuario: mantener exactamente la animación actual del botón. Se conserva el texto REGISTRAR PEDIDO, caja SVG, verde, oscilación de ±2 grados, período de 3,5 segundos y pausa ya aprobados. No se modifica el CSS del botón. Se retira el enlace flotante exterior y su código de posicionamiento; el botón del formulario sigue preparando WhatsApp.

## Zonas y catálogo

- Lima Metropolitana: departamento Lima (15), provincia Lima (1501), 43 distritos oficiales. Contraentrega sin adelanto. Cobertura y delivery por confirmar.
- Lima Provincias: departamento Lima fijo; exactamente Barranca, Cajatambo, Canta, Cañete, Huaral, Huarochirí, Huaura, Oyón y Yauyos. Se excluye Lima 1501. Distritos dependientes de la provincia. Agencia Shalom, adelanto S/40 pendiente y diferencia al recoger.
- Resto del Perú: 24 departamentos excluyendo Lima, provincias y distritos dependientes; Shalom con la misma condición de adelanto.
- El catálogo completo de distritos se deriva del CSV oficial ya conservado. No se mantienen listas parciales. Los alias Lima (Cercado de Lima) y Lurigancho (Chosica) solo mejoran la etiqueta, conservando sus códigos oficiales.
- Buscador de distritos sin distinción de tildes o mayúsculas. Las opciones siguen siendo del ámbito geográfico seleccionado.
- Cambiar modalidad limpia ubicación, dirección/agencia, referencia y adelanto; conserva nombre, celular y promoción. Cambiar departamento limpia provincia/distrito/agencia; cambiar provincia limpia distrito/agencia.
- Mensaje dinámico UTF-8 con encabezado, producto, cantidad, precio, modalidad, datos, distrito y condiciones correctas. Se mantienen encodeURIComponent y el número original. No se envían mensajes automáticamente.

## Validación

120 comprobaciones correctas en 320, 375, 390, 768, 1366 y 1920 px. Incluyen listados completos, búsqueda por alias, relaciones geográficas, rechazo de combinación forzada, limpieza de datos, mensajes por modalidad, cuentas S/110 y S/229.90, aceptación requerida, contención, ausencia del flotante, movimiento original, clic y movimiento reducido. window.open se interceptó; no se enviaron pedidos.

Capturas de móvil/escritorio para las tres zonas y video real timbre-actual.webm de más de dos ciclos. Pruebas sobre archivos locales, bloqueando fuentes y analítica externas solo en QA. No se modifican precios, imágenes originales ni secciones de la landing. No se añaden dependencias.

Vista: http://127.0.0.1:8080/qa/shipping-zones/previsualizacion.html

Sin commit, push, merge ni despliegue.

Ajuste posterior: retirada la casilla de aceptación del adelanto y el panel del cálculo económico visible. Se mantiene el aviso informativo de S/40 y la lógica del mensaje, con estado pendiente. El campo de recojo y su etiqueta en WhatsApp pasan a Shalom o courier. 27 comprobaciones actuales verifican envío sin casilla en las tres modalidades, cálculos, etiqueta y ausencia del panel; ver no-checkbox.json.
