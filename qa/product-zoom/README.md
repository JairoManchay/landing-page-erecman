# Zoom automático de los frascos

Previsualización local: http://127.0.0.1:8080/qa/product-zoom/previsualizacion.html

Cambio de producción: solo 23 líneas en css/style.css. Selectores limitados al frasco principal, imágenes de promociones y miniatura dinámica del resumen. No se modificaron HTML, JavaScript, imágenes, precios ni condiciones comerciales.

Zoom de 5% en landing, 8% en Paso 1 y 3% en Paso 3. Ciclos CSS de 2,4 segundos ease-in-out, centro como origen y movimiento continuo sin pausa, al mismo ritmo que los botones. prefers-reduced-motion desactiva el efecto.

Validación en Chromium local: 128 comprobaciones en 375×812, 390×844, 768×1024, 1366×768 y 1920×1080. Se compararon reposo y máximo del zoom: tarjetas estables, imágenes cargadas, factor de escala correcto y sin nuevo desbordamiento horizontal. Recorrido por los tres pasos y movimiento reducido verificados. Resultados en results.json.

12 comprobaciones funcionales adicionales: campos obligatorios, celulares inválidos, aceptación del adelanto provincial, resumen e imagen de ambas promociones, retroceso conservando datos y generación del enlace WhatsApp con precio, comprador y adelanto pendiente. window.open se interceptó localmente para no contactar a nadie. Resultados en functional.json.

Grabaciones reales: landing.webm (8,4 s), paso-1.webm (8,5 s), paso-3.webm (8,6 s). Capturas consecutivas del navegador durante más de dos ciclos, codificadas a WebM; no son capturas estáticas de validación. La previsualización permite reproducirlas en bucle.

node --check js/main.js y git diff --check correctos. 

Ajuste adicional: último frasco de la sección de beneficios con zoom continuo 1 → 1,05 → 1, sin pausa, ciclo de 2,4 s. Usa scale independiente para conservar transform de ScrollReveal. Comprobado sin scroll horizontal en los cinco anchos. Video: ultimo-frasco.webm.

Botones de compra: zoom continuo del 9% en ciclos de 2,4 s. Paso 1: zoom del 8% limitado a las im?genes, sin filtros sobre el formulario.
