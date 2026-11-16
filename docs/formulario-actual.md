# Estado actual del formulario Erecman Plus

Esta descripción corresponde al resultado aprobado al 16 de noviembre de 2026. Los documentos y capturas anteriores conservan la evolución del trabajo; no representan necesariamente la interfaz actual.

- Un solo formulario modal, sin pasos ni panel lateral. Se abre desde los botones de compra, no automáticamente al entrar a la landing.
- Todos los campos aparecen desde la apertura, aunque todavía no se haya elegido una promoción o forma de envío. La ubicación se habilita según el envío.
- Dos opciones: Lima — Pago contraentrega y Envío por Shalom. No hay modalidades separadas de Lima Provincias ni resto del Perú.
- Lima fija departamento y provincia de Lima y permite elegir entre sus 43 distritos oficiales. Dirección exacta y referencia opcional. Sin adelanto.
- Shalom permite elegir departamento y provincia dependiente; no pide distrito. El campo se presenta como Dirección de entrega. Se informa del adelanto S/40, pendiente de coordinar; la diferencia del producto se paga al recoger y el costo/cobertura se confirma con el asesor.
- No hay casilla de aceptación del adelanto, bloque de precio/adelanto calculado ni resumen visible. Los cálculos se conservan en el mensaje de WhatsApp.
- Se conservan las dos promociones, precios e imágenes aprobados. El catálogo oficial se carga localmente y valida las relaciones geográficas.
- Cambiar de envío limpia la ubicación y dirección incompatibles y conserva nombre, celular y promoción.
- Los tres sellos de verificación quedan antes del botón final.
- Botón REGISTRAR PEDIDO: rojo #cc1337, ícono de caja, movimiento de campana ±4 grados cada 3,5 segundos con pausa y respeto por movimiento reducido. No tiene zoom.
- Se retiró WhatsApp flotante. El botón del formulario conserva el número 51970396146 y prepara el mensaje mediante encodeURIComponent; no envía el mensaje automáticamente ni procesa pagos.

## Referencias y verificaciones

- docs/formulario-tres-pasos.md conserva el flujo anterior y sus extractos de código.
- data/README.md documenta la procedencia del catálogo oficial y su actualización con scripts/build-ubigeos.cjs.
- qa/shipping-zones/no-checkbox.cjs verifica el estado funcional actual en 320, 390 y 1366 px; no-checkbox.json guarda 21 resultados.
- qa/single-page/button-motion.cjs verifica el movimiento ±4 grados, repetición infinita, contención y movimiento reducido en los mismos anchos.
- Los otros scripts y resultados de QA corresponden a iteraciones históricas que probaron otros flujos. No ejecutarlos como suite del estado actual.

La eliminación previa del archivo erecmanplus_version_final.zip no pertenece a estos ajustes y se mantiene fuera del commit.
