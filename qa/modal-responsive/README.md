# Ajuste responsive del modal Erecman Plus

## Diagnostico y correcciones

- Las alturas fijas de 438 px (intermedias) y hasta 820 px (escritorio) se sustituyeron por altura natural, limitada por el viewport. Se retiraron las declaraciones de distribucion que entraban en conflicto en los bloques anteriores.
- `.order-modal__dialog`: conserva el ancho de hasta 1080 px y la proporcion 28/72 en escritorio; usa Grid y filas con minimo cero para que el contenido pueda reducirse dentro del limite.
- `.order-modal__content`, `#order-form`, `.order-step`: distribucion flex con `min-height: 0`; encabezado y acciones separados del cuerpo desplazable.
- `.order-fieldset`: scroll interno real, sin alturas calculadas duplicadas. El footer no se superpone al contenido.
- Menos de 600 px: margen de 8 px, panel superior en Grid, beneficios en dos columnas, frasco contenido, promociones y campos apilados.
- De 600 a 1224 px: limite de `min(90dvh, 800px)`. Hasta 899 px se usa panel superior para dar anchura suficiente al formulario.
- Mas de 1224 px: altura natural con limite de `min(86dvh, 760px)`. En 1440 x 900 el paso 1 pasa de 810 a aproximadamente 548 px de alto.
- Se eliminan los huecos reservados a errores vacios y se compacta la distancia hasta SIGUIENTE. Los errores siguen apareciendo cuando la validacion los genera.
- Se respeta el area segura inferior; el widget flotante se oculta mientras el modal esta abierto. No se usa escalado para dimensionar el modal.

## Verificacion

Chromium local mediante Chrome DevTools Protocol. Se recorrieron los tres pasos en las doce resoluciones solicitadas y en 390 x 460 como simulacion de viewport reducido por teclado: **39 casos, sin fallos en las comprobaciones de geometria**.

En todos los casos: panel visual contenido, sin desbordamiento horizontal, footer dentro del modal y viewport, paso activo correcto y desplazamiento completo hasta el final del cuerpo. El paso 2 se reviso con Provincia seleccionada y el aviso del adelanto visible. El paso 3 usa datos largos, pack S/269.90, adelanto S/40 pendiente y saldo S/229.90.

La simulacion de teclado reduce el viewport; no sustituye una prueba con teclado real en Android/iOS. Las capturas de referencia mencionadas en el encargo no estaban en el adjunto disponible.

| Viewport | Altura paso 1 | Pasos comprobados | Resultado |
| --- | ---: | --- | --- |
| 375 x 812 | 796 px | 1, 2 y 3 | Correcto |
| 390 x 844 | 828 px | 1, 2 y 3 | Correcto |
| 599 x 800 | 784 px | 1, 2 y 3 | Correcto |
| 600 x 800 | 720 px | 1, 2 y 3 | Correcto |
| 700 x 600 | 540 px | 1, 2 y 3 | Correcto |
| 768 x 600 | 540 px | 1, 2 y 3 | Correcto |
| 1024 x 768 | 548 px | 1, 2 y 3 | Correcto |
| 1224 x 768 | 548 px | 1, 2 y 3 | Correcto |
| 1225 x 768 | 548 px | 1, 2 y 3 | Correcto |
| 1366 x 768 | 548 px | 1, 2 y 3 | Correcto |
| 1440 x 900 | 548 px | 1, 2 y 3 | Correcto |
| 1920 x 1080 | 548 px | 1, 2 y 3 | Correcto |
| 390 x 460 | 444 px | 1, 2 y 3 | Correcto |

## Capturas comparativas

| Rango | Antes (paso 1) | Despues (paso 1) | Despues (Provincia) | Despues (resumen) |
| --- | --- | --- | --- | --- |
| Movil | [Antes](before-390x844-step1.png) | [Despues](after-390x844-step1.png) | [Paso 2](after-390x844-step2.png) | [Paso 3](after-390x844-step3.png) |
| Intermedio | [Antes](before-768x600-step1.png) | [Despues](after-768x600-step1.png) | [Paso 2](after-768x600-step2.png) | [Paso 3](after-768x600-step3.png) |
| Grande | [Antes](before-1440x900-step1.png) | [Despues](after-1440x900-step1.png) | [Paso 2](after-1440x900-step2.png) | [Paso 3](after-1440x900-step3.png) |

[Viewport reducido por teclado: resumen](after-390x460-step3.png)

Las capturas anteriores del paso 2 corresponden a Lima; las finales comprueban Provincia. Los JSON conservan las dimensiones y resultados de cada caso.

Comprobaciones adicionales: `node --check js/main.js`, `node --check qa/modal-responsive/check.cjs` y `git diff --check` correctas.

No se modificaron HTML, JavaScript ni recursos originales durante este ajuste. No se hicieron commit, push, merge ni despliegue.
