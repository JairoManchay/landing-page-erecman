# Erecman Plus — presentación final

[Ver presentación visual](presentacion.html)

## Ajustes realizados

- Solo se modificaron estilos del modal en este ajuste. No se cambiaron la landing, HTML, JavaScript ni imágenes originales.
- Miniaturas de promociones: 60 × 80 → 72 × 96 px en escritorio; 50 × 65 → 60 × 78 px hasta 700 px de ancho. Aumento del 20%, con `object-fit: contain`, sin deformación ni escalado artificial.
- La columna de imagen acompaña el aumento. Radio, nombre, cantidad y precio mantienen su orden; el radio marcado identifica la selección además del borde rojo.
- Miniatura del resumen: 68 × 92 px en escritorio y 56 × 76 px en móvil.
- Nombres de promociones a 16 px, precios a 20 px, textos secundarios a 14 px, labels y condiciones a 15 px, errores a 14 px y botones a 15 px. Encabezados de sección a 18 px.
- Campos de al menos 46 px y bordes más visibles. Cierre de 44 × 44 px. Opciones de entrega y destino con etiquetas de al menos 44 px de alto; se mantienen estados de foco existentes.
- Verde de WhatsApp más oscuro para mejorar el contraste con el texto blanco. No cambia la acción del botón.
- Se mantienen los breakpoints, scroll interno, panel rojo original y navegación aprobados.

## Pruebas

- 39 casos responsive: tres pasos en las doce resoluciones solicitadas previamente más 390 × 460 como viewport reducido por teclado. Sin desbordamiento horizontal, panel visual contenido, scroll hasta el final y footer dentro del modal.
- 24 comprobaciones funcionales y de zoom correctas. Celular de ocho dígitos y celular que no empieza con 9 rechazados; nueve dígitos comenzando con 9 aceptados.
- Provincia muestra S/40 y exige aceptación. Ambos productos conservan importes, saldos, imagen correcta y datos al retroceder.
- Se interceptó la apertura de WhatsApp para comprobar número y mensaje; no se envió ningún mensaje ni se contactó a terceros.
- Zoom real del navegador verificado mediante `chrome.tabs.setZoom` y `getZoom`: 100%, 125% y 150%; los tres pasos correctos en cada nivel. El helper es una extensión exclusivamente local de QA, no una dependencia del producto.
- Sin caracteres corruptos en el contenido del formulario. Sintaxis JavaScript y `git diff --check` correctos.
- El teclado se simuló reduciendo el viewport. Sigue pendiente una comprobación con teclado físico de dispositivo Android/iOS.

| Viewport | Pasos | Resultado |
| --- | --- | --- |
| 375 × 812 | 1, 2 y 3 | Correcto |
| 390 × 844 | 1, 2 y 3 | Correcto |
| 599 × 800 | 1, 2 y 3 | Correcto |
| 600 × 800 | 1, 2 y 3 | Correcto |
| 700 × 600 | 1, 2 y 3 | Correcto |
| 768 × 600 | 1, 2 y 3 | Correcto |
| 1024 × 768 | 1, 2 y 3 | Correcto |
| 1224 × 768 | 1, 2 y 3 | Correcto |
| 1225 × 768 | 1, 2 y 3 | Correcto |
| 1366 × 768 | 1, 2 y 3 | Correcto |
| 1440 × 900 | 1, 2 y 3 | Correcto |
| 1920 × 1080 | 1, 2 y 3 | Correcto |
| 390 × 460 | 1, 2 y 3 | Correcto |

## Capturas reales

La presentación reúne los tres pasos en escritorio y móvil. Cada paso incluye la captura inicial y vistas central/inferior del cuerpo desplazable para revisar los campos y el resumen completo sin simular imágenes.

| Paso | Escritorio | Móvil |
| --- | --- | --- |
| 1. Datos principales | [Captura](presentacion-1440x900-step1.png) | [Captura](presentacion-390x844-step1.png) |
| 2. Ubicación y entrega | [Captura](presentacion-1440x900-step2.png) | [Captura](presentacion-390x844-step2.png) |
| 3. Resumen del pedido | [Captura](presentacion-1440x900-step3.png) | [Captura](presentacion-390x844-step3.png) |

[Resultados de geometría](final.json) · [Pruebas funcionales y zoom](functional.json)

Rama: feature/campana-navidena. Sin commit, push, merge ni despliegue.
