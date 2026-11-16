# Visibilidad de botones Erecman Plus

Previsualización: http://127.0.0.1:8080/qa/button-visibility/previsualizacion.html

- Cinco botones con texto COMPRAR AHORA, carrito SVG, rojo corporativo y bordes redondeados. Texto de al menos 16 px.
- Botones de compra: zoom CSS continuo e infinito del 4%, ciclo de 3,5 segundos sin pausa. WhatsApp conserva una pausa entre pulsaciones. Se elimina el brillo animado de los botones de compra para reducir el movimiento simultáneo.
- WhatsApp flotante: SVG, color verde, sombra y diámetro de 96 px frente a los aproximadamente 86 px anteriores (+11,6%). Zoom del 4% aplicado solo al SVG, desfasado 0,6 segundos respecto a los botones de compra.
- Márgenes compatibles con zonas seguras. El botón flotante se oculta al abrir el formulario o al coincidir con acciones, precios, títulos o controles importantes durante el scroll.
- Corregido el cierre HTML del contenedor del modal: antes el navegador interpretaba el enlace flotante como hijo del modal oculto.
- Se preservan campos, promociones, precios, validaciones, condiciones comerciales, número y enlaces WhatsApp y flujo de tres pasos.
- prefers-reduced-motion desactiva las nuevas animaciones.

Validación: 150 comprobaciones en 375, 390, 768, 1366 y 1920 px. Los cinco botones abren el formulario en cada ancho; el flotante desaparece mientras el modal está abierto. Se comprueban escala máxima, pausa, tamaño estable, contención horizontal de los botones y movimiento reducido. Resultados: results.json.

Grabaciones reales de más de ocho segundos en 1366×768 y 390×844: escritorio.webm y movil.webm. Incluyen los botones de compra y WhatsApp. Las fuentes y analítica externas se bloquearon solo durante las pruebas locales para evitar demoras y tráfico de analítica de prueba; la landing conserva sus integraciones.

Sin commit, push ni despliegue para esta tarea.

Pruebas funcionales: 15 comprobaciones correctas de validaciones, adelanto provincial, resumen de ambas promociones, retroceso conservando datos y enlace WhatsApp. La apertura externa se interceptó sin enviar pedidos. Ver functional.json.
