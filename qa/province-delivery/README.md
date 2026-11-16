# Provincia y resumen móvil

- Provincia oculta y deshabilita Entrega a domicilio. Opciones: Envío por agencia Shalom y Envío por courier.
- Si estaba seleccionado domicilio y se cambia a Provincia, pasa a Shalom. Al volver a Lima desde courier, se selecciona agencia; domicilio vuelve a estar disponible.
- La validación impide avanzar con domicilio en Provincia incluso si se fuerza la selección desde el navegador.
- Resumen y WhatsApp reutilizan el método seleccionado. Adelanto S/40, precios y condiciones restantes conservados.
- Hasta 599 px, solo el cuadro Datos de entrega apila etiqueta y valor. Datos a 16 px, separación entre filas y ajuste de textos largos. El cuadro financiero conserva sus columnas.
- 54 comprobaciones específicas en 375, 390, 768, 1366 y 1920 px: métodos permitidos, ida y vuelta entre destinos, WhatsApp para Shalom/courier, adelanto y resumen sin desbordamiento con dirección larga.
- 15 pruebas funcionales adicionales correctas del formulario, promociones y mensaje de WhatsApp. No se enviaron pedidos; window.open se interceptó localmente.
- node --check js/main.js y git diff --check correctos.

Vista local: http://127.0.0.1:8080/qa/province-delivery/previsualizacion.html

Sin commit, push ni despliegue para esta tarea.
