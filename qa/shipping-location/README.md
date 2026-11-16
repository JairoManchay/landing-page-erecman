# Lógica condicional de ubicación: Lima contraentrega y Shalom

## Alcance

Ajuste sobre el formulario existente de una página. No cambia portada, imágenes, precios, número de WhatsApp, botón REGISTRAR PEDIDO ni sellos. No se restaura el resumen completo retirado: el aviso de envío muestra el cálculo económico activo.

Archivos: index.html, js/main.js y ajustes mínimos de css/order-form.css para campos bloqueados, ayuda y cálculo. Se incorpora el catálogo local js/ubigeos-inei.js, su CSV fuente data/ubigeos-inei.csv y el generador scripts/build-ubigeos.cjs. Se actualizan versiones de recursos para evitar que una copia de JavaScript anterior se use con los controles nuevos.

## Catálogo oficial

Fuente: https://www.datosabiertos.gob.pe/dataset/datos-de-registros-de-nacidos-vivos/resource/573f433b-0d44-46e2-932e-14abb9757860

CSV publicado: https://www.datosabiertos.gob.pe/sites/default/files/Lista_Ubigeos_INEI.csv

Descargado directamente de la fuente oficial. 1892 filas; se derivan 25 departamentos, 196 provincias y los 43 distritos cuyo código comienza con 1501 (provincia de Lima). El catálogo no está escrito a mano. Ver data/README.md para hash, procedencia y actualización. Los nombres se muestran con capitalización legible, conservando la grafía del CSV.

El script se sirve localmente antes de main.js. No requiere API remota, librerías ni una petición a un servicio externo durante la compra. También funciona al abrir la landing como archivo local.

## Comportamiento

- Lima: departamento 15 y provincia 1501 preseleccionados y deshabilitados. Distrito obligatorio, solo los 43 del catálogo de esa provincia. Dirección exacta y referencia opcional. Pago contraentrega, sin adelanto.
- Shalom: departamento elegible y provincia filtrada. No se solicita distrito ni se conserva su valor. Agencia Shalom o lugar de recojo obligatorio. Adelanto S/40, aceptación requerida, pendiente de coordinar. Diferencia del producto por pagar al recoger. Se advierte que la ciudad seleccionada no garantiza agencia ni cobertura.
- Cambiar de modalidad limpia departamento, provincia, distrito, dirección, referencia y aceptación anterior, y establece los nuevos valores permitidos. Conserva nombre, celular y promoción.
- Cambiar departamento limpia provincia, agencia y referencia. Cambiar provincia limpia agencia/referencia. Cambiar distrito de Lima limpia la dirección/referencia anterior.
- Los códigos se validan contra el catálogo, incluidas las relaciones departamento/provincia. No se confía en opciones añadidas manualmente desde el navegador.
- El aviso económico se actualiza con la promoción y modalidad. Pack: S/269.90, adelanto S/40 y diferencia S/229.90 para Shalom; individual: S/150 y S/110. Lima mantiene el precio completo contraentrega.

## Mensaje de WhatsApp

Se conserva el número 51970396146 y encodeURIComponent. Ambos mensajes incluyen producto, cantidad, precio, nombre y celular. Lima incorpora departamento/provincia Lima, distrito, dirección y Pago contraentrega. Shalom incorpora departamento, ciudad/provincia, agencia, adelanto requerido, diferencia y estado pendiente; no contiene distrito ni datos de Lima ocultos. Referencia opcional y costo de envío/cobertura por confirmar. UTF-8 y emojis verificados. El pedido solo se prepara, sin envío ni cobro automático.

## Pruebas

184 comprobaciones correctas en 320, 375, 390, 430, 768, 1024, 1366 y 1920 px. Se verifican catálogo completo, relaciones geográficas, campos bloqueados/ocultos, limpieza de datos incompatible, persistencia de identidad, aceptación obligatoria, cuentas, enlaces y mensajes UTF-8 de ambas promociones. Se rechaza una provincia ajena al departamento aun agregando la opción manualmente.

Se verifican contención responsive, sellos conservados, flotante oculto y botón final accesible. Las sesiones automatizadas bloquearon servicios externos y usaron los archivos locales, con el catálogo cargado desde el mismo proyecto. La landing local continúa disponible por HTTP. window.open se interceptó: no se enviaron pedidos.

Capturas de Lima y Shalom en móvil y escritorio. Para capturar el contenido completo se retira temporalmente el límite de altura solo en el navegador de QA; la producción conserva su scroll interno.

Previsualización: http://127.0.0.1:8080/qa/shipping-location/previsualizacion.html

node --check js/main.js, node --check js/ubigeos-inei.js y git diff --check correctos. La eliminación anterior de erecmanplus_version_final.zip se conserva sin intervenir.

Sin commit, push ni despliegue.
