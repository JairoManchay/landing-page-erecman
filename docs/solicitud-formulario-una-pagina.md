# REDISEÑO DEL FORMULARIO ERECMAN PLUS — COMPRA EN UNA SOLA PÁGINA

## ROL

Actúa como desarrollador frontend senior especializado en HTML5, CSS3, JavaScript, diseño UX/UI, formularios comerciales, accesibilidad y diseño responsive.

Trabaja sobre el código existente de la landing Erecman Plus.

Rama de trabajo:

`feature/campana-navidena`

## OBJETIVO PRINCIPAL

Transformar el formulario modal actual de tres pasos en un formulario de compra de una sola página, tomando como referencia visual la imagen adjunta de buystoreperu.com.

**IMPORTANTE: NO CREAR UNA LANDING NUEVA. MODIFICAR ÚNICAMENTE EL FORMULARIO EXISTENTE.**

Quiero conservar la identidad visual de Erecman Plus, pero adoptar la organización vertical de la referencia:

1. Selección de promoción.
2. Selección de método de envío.
3. Información del comprador.
4. Resumen del pedido.
5. Botón para continuar por WhatsApp.

Eliminar completamente el indicador de:

- Paso 1: Datos principales.
- Paso 2: Ubicación.
- Paso 3: Resumen.

El usuario ya no debe navegar entre pantallas.

---

## 1. ANALIZAR EL CÓDIGO EXISTENTE

Antes de modificar cualquier archivo:

- Identificar los componentes HTML del formulario.
- Revisar los estilos CSS actuales.
- Identificar la lógica JavaScript de las promociones.
- Revisar los campos de ubicación y entrega.
- Identificar la función que calcula los precios.
- Revisar la integración con WhatsApp.
- Localizar las imágenes actuales de los productos.
- Revisar los breakpoints responsive.
- Identificar las validaciones existentes.

Reutilizar todos los componentes y funciones que sea posible.

No instalar dependencias innecesarias.

No eliminar funcionalidades que todavía se necesiten.

---

## 2. ESTRUCTURA GENERAL DEL FORMULARIO

El formulario debe tener una distribución vertical continua.

Orden obligatorio:

**Encabezado → Promociones → Método de envío → Datos del cliente → Resumen → WhatsApp.**

El usuario debe poder desplazarse verticalmente y completar toda la información sin pulsar SIGUIENTE.

### Encabezado

Mantener:

ERECMAN PLUS

REALIZA TU PEDIDO

Conservar:

- Ícono de carrito de compras.
- Botón de cierre.
- Colores corporativos.
- Fondo blanco.
- Bordes redondeados.

Eliminar únicamente el indicador de tres pasos.

No agregar un nuevo indicador de progreso.

---

## 3. CONSERVAR EL PANEL IZQUIERDO

En escritorio, mantener el panel rojo existente con:

- Logotipo Erecman Plus.
- Imagen original del frasco.
- Fondo rojo con curvas decorativas.
- Íconos de beneficios.
- Textos originales.

Beneficios:

- Más energía.
- Mayor potencia.
- Mejor rendimiento.
- Recupera tu confianza.

No modificar las imágenes de esta sección.

### En dispositivos móviles

El panel izquierdo debe transformarse en una cabecera compacta que permita mostrar el producto sin ocupar demasiado espacio.

Evitar que el logotipo, la imagen y los beneficios se superpongan.

No mostrar un panel demasiado alto que obligue al usuario a desplazarse excesivamente antes de llegar a las promociones.

---

## 4. SECCIÓN DE PROMOCIONES

Título:

**Selecciona tu promoción**

Utilizar tarjetas seleccionables similares a la referencia, conservando el estilo rojo y blanco de Erecman Plus.

### Promoción 1

Nombre:

Pide Especial

Cantidad:

1 frasco.

Precio:

S/150.

Imagen:

Utilizar la imagen existente de un frasco Erecman Plus con gorro navideño.

### Promoción 2

Nombre:

Especial Pack

Cantidad:

2 frascos.

Precio anterior:

S/299.

Precio actual:

S/269.90.

Etiqueta:

Oferta temporal.

Imagen:

Utilizar la imagen existente de dos frascos Erecman Plus con gorros navideños.

### Diseño de las tarjetas

Cada tarjeta debe contener:

- Radio button.
- Imagen del producto.
- Nombre comercial.
- Cantidad.
- Precio.
- Precio anterior tachado, cuando corresponda.
- Indicador de oferta, cuando corresponda.

La opción seleccionada debe tener:

- Borde rojo.
- Fondo rosado muy claro.
- Radio button marcado.

### Tamaño de imágenes

Los frascos deben verse más grandes que en la versión anterior.

Aplicar un aumento moderado de aproximadamente 15–20%, sin deformarlos ni provocar desbordamientos.

Las imágenes deben tener `object-fit: contain`.

No utilizar imágenes de otros productos.

No cambiar los precios.

---

## 5. MÉTODO DE ENVÍO

Debajo de las promociones agregar el encabezado:

**Método de envío**

Reproducir la estructura de la referencia, utilizando dos opciones seleccionables mediante radio buttons.

### Opción 1: Entrega en Lima

Mostrar:

**Entrega en Lima**

Descripción:

"Coordina la entrega y el pago con nuestro asesor."

No afirmar que el envío es gratuito si el negocio no lo ha confirmado.

### Opción 2: Envío a provincia

Mostrar:

**Envío a provincia**

Descripción:

"Se requiere un adelanto de S/40, que se descontará del importe pendiente de pago."

Destacar los S/40 en rojo.

### Comportamiento

Solo se puede seleccionar una modalidad a la vez.

Cuando se seleccione Provincia:

- Mostrar claramente el adelanto de S/40.
- Solicitar aceptación de la condición.
- Actualizar el resumen del pedido.
- Mantener los datos de ubicación correspondientes.

Cuando se seleccione Lima:

- No exigir el adelanto.
- Actualizar el resumen.
- Mantener únicamente los campos que correspondan al destino.

No copiar el adelanto de S/20 ni los precios de la página de referencia.

Conservar las reglas comerciales de Erecman Plus.

---

## 6. SECCIÓN DE DATOS DEL CLIENTE

Título:

**Completa tu información**

Utilizar una apariencia similar a la imagen adjunta:

- Labels grandes.
- Campos amplios.
- Bordes grises.
- Esquinas redondeadas.
- Íconos de apoyo.
- Espaciados cómodos.
- Tipografía legible.

### Campos requeridos

**Nombre completo**

Campo de texto obligatorio.

**Celular / WhatsApp**

Campo obligatorio.

Validar números celulares peruanos:

- Exactamente nueve dígitos.
- Comienzan con 9.
- Aceptar opcionalmente +51.
- No permitir avanzar con números incompletos.

**Departamento**

Utilizar un `select` con todos los departamentos del Perú y Callao.

**Provincia**

Campo de texto obligatorio.

**Distrito**

Campo de texto obligatorio.

**Dirección de entrega**

Campo obligatorio cuando corresponda.

**Referencia**

Campo opcional.

### Diseño de campos

En móviles:

Todos los campos en una columna.

En escritorio:

Se permite utilizar dos columnas para campos relacionados, siempre que se mantenga una lectura clara.

No utilizar campos demasiado pequeños.

---

## 7. RESUMEN DEL PEDIDO

Debajo de los datos del cliente mostrar una sección titulada:

**Resumen de tu pedido**

Este resumen debe actualizarse automáticamente cuando el cliente cambie de promoción o modalidad de envío.

Mostrar:

- Imagen pequeña del producto seleccionado.
- Nombre de la promoción.
- Cantidad.
- Precio del producto.
- Método de envío.
- Adelanto requerido, si corresponde.
- Saldo pendiente estimado.
- Costo adicional de delivery, si todavía debe confirmarse.

### Regla de los S/40

El adelanto de S/40 para provincias se descuenta del importe pendiente.

Ejemplo para Especial Pack:

Precio del producto: S/269.90.

Adelanto requerido: S/40.

Saldo estimado del producto después del adelanto: S/229.90.

IMPORTANTE:

El adelanto todavía no ha sido pagado.

No presentarlo como un pago recibido.

Si existen gastos adicionales de delivery pendientes de confirmar, mostrarlos por separado.

No inventar importes.

No descontar dos veces el adelanto.

---

## 8. BOTÓN FINAL DE WHATSAPP

Debajo del resumen colocar un botón destacado:

**REALIZAR PEDIDO POR WHATSAPP**

Diseño:

- Fondo verde WhatsApp.
- Ícono SVG oficial.
- Texto blanco.
- Bordes redondeados.
- Tamaño grande.
- Ancho completo en móviles.
- Sombra suave.
- Efecto de zoom automático muy discreto, respetando preferencias de movimiento reducido.

### Funcionamiento

Al presionar el botón:

1. Validar todos los campos obligatorios.
2. Comprobar la aceptación del adelanto cuando corresponda.
3. Mostrar errores junto a los campos inválidos.
4. Si existen errores, desplazar suavemente al primer campo inválido y enfocarlo.
5. Si todo está correcto, generar el mensaje de WhatsApp.
6. Abrir WhatsApp con el resumen completo preparado.

No procesar pagos dentro de la landing.

No afirmar que el pedido fue confirmado antes de que el usuario envíe el mensaje.

Reutilizar el número de WhatsApp existente en el proyecto.

---

## 9. SCROLL Y RESPONSIVE

El formulario será más largo porque todos los campos estarán en una sola pantalla.

Esto es intencional.

### En móviles

Permitir scroll vertical natural dentro del modal.

No establecer una altura fija para el contenido.

Mantener:

- Encabezado accesible.
- Formulario legible.
- Campos cómodos.
- Botón final accesible.
- Sin scroll horizontal.

No debe existir un botón SIGUIENTE fijo que oculte el contenido.

### En escritorio

Conservar las dos columnas.

El panel izquierdo puede permanecer visualmente estable mientras el contenido derecho se desplaza, siempre que no genere problemas de accesibilidad o desbordamiento.

### Breakpoints

Validar:

- 320 px.
- 375 px.
- 390 px.
- 430 px.
- 768 px.
- 1024 px.
- 1366 px.
- 1920 px.

Evitar media queries contradictorias.

---

## 10. ACCESIBILIDAD PARA PERSONAS MAYORES

El cliente indicó que una parte importante de su público está formada por personas de mayor edad.

Por tanto:

- Utilizar textos claramente legibles.
- Mantener labels visibles.
- Evitar información importante en letras diminutas.
- Priorizar precios y condiciones de pago.
- Utilizar contrastes adecuados.
- Mantener áreas táctiles de al menos 44 × 44 px.
- Mostrar errores fáciles de comprender.
- No depender únicamente del color para indicar una selección.
- No utilizar animaciones invasivas.

El formulario debe ser fácil de utilizar incluso para personas con poca experiencia comprando por internet.

---

## 11. RESTRICCIONES

No modificar:

- La portada de la landing.
- Las imágenes del médico.
- Los ingredientes.
- Los testimonios.
- Las garantías.
- La identidad visual de Erecman Plus.
- Los precios aprobados.
- Las condiciones comerciales vigentes.
- El número de WhatsApp configurado.

No añadir decoración navideña al formulario.

Únicamente se conservarán las imágenes de los frascos con gorros navideños dentro de las tarjetas de promoción y el resumen.

No crear un diseño genérico tipo Google Forms.

No hacer commit, push, merge ni desplegar sin autorización.

---

## 12. PRUEBAS Y ENTREGA

Antes de finalizar:

1. Ejecutar el proyecto localmente.
2. Abrir el formulario desde COMPRAR AHORA.
3. Verificar que desaparecieron los tres pasos.
4. Comprobar que todas las secciones aparezcan en una sola pantalla desplazable.
5. Seleccionar Pide Especial.
6. Seleccionar Especial Pack.
7. Cambiar entre Lima y Provincia.
8. Comprobar el aviso de S/40.
9. Probar validaciones de nombre y celular.
10. Revisar el resumen dinámico.
11. Comprobar el mensaje de WhatsApp.
12. Probar escritorio y móvil.
13. Comprobar que el botón flotante de WhatsApp de la landing no tape el formulario.

Generar capturas reales del formulario completo en versión móvil y escritorio.

Entregar un resumen de archivos modificados, validaciones realizadas y cualquier condición comercial pendiente.

## RESULTADO FINAL ESPERADO

Quiero un formulario Erecman Plus de una sola página, visualmente parecido a la referencia proporcionada, pero manteniendo:

- Colores corporativos rojo, blanco y negro.
- Imágenes de los frascos navideños.
- Dos promociones.
- Condiciones de envío propias.
- Adelanto de S/40 para provincias.
- Datos del comprador.
- Resumen dinámico.
- Confirmación por WhatsApp.

**Prioridad: facilitar la compra, mejorar la legibilidad y reducir pasos innecesarios sin alterar la landing original.**