# Campaña navideña Erecman Plus

## Contexto de trabajo

- Repositorio: `JairoManchay/landing-page-erecman`
- Rama de trabajo: `feature/campana-navidena`
- Rama base: `develop`
- Último commit base: `f718131`
- No modificar directamente `main`, `develop` ni ramas de producción.
- No hacer merge, despliegue ni cambios comerciales no confirmados sin autorización.

## Arquitectura verificada

La aplicación es una landing estática existente:

- HTML principal: `index.html`
- Estilos: `css/style.css`
- JavaScript: `js/main.js`
- Animaciones: `js/scrollreveal.min.js`
- Recursos gráficos: `imgs/`
- No se identificó un framework frontend ni un sistema de pruebas automatizadas.
- Los botones de compra existentes usan enlaces directos a WhatsApp con el número actualmente configurado en `index.html`.
- La página ya contiene secciones de producto, oferta, ingredientes, beneficios, recomendación médica, testimonios, garantías y medios de entrega.

La implementación debe modificar la landing existente y reutilizar sus estilos, imágenes y estructura siempre que sea posible. No se debe crear una landing nueva ni reemplazar imágenes originales.

## Objetivo

Agregar una campaña navideña temporal para Erecman Plus con:

1. Promoción visible dentro de la sección de ofertas existente.
2. Botones de compra que abran un único modal, en lugar de redirigir inmediatamente a WhatsApp.
3. Formulario modal de tres pasos.
4. Resumen editable antes de contactar por WhatsApp.
5. Mensaje de WhatsApp generado con los datos del pedido.
6. Configuración centralizada para activar o desactivar la campaña.

## Oferta comercial

### Presentación individual

- Nombre: `Pide Especial`
- Cantidad: 1 frasco
- Precio: `S/150`

### Promoción navideña

- Nombre: `Pack Especial Navidad`
- Cantidad: 2 frascos
- Precio promocional: `S/269.90`
- Precio regular de referencia: `S/299`
- Delivery: no incluido
- Botón: `¡APROVECHAR PROMOCIÓN!`
- Debe abrir el modal con la promoción navideña seleccionada automáticamente.

La configuración debe incluir al menos `enabled`, `promotionalPrice`, `regularPrice` y `productQuantity`. Cuando la campaña esté desactivada, el pack de dos frascos debe mostrar/utilizar el precio regular de `S/299`.

## Modal de compra

### Reglas generales

- Un único modal reutilizable para todos los botones de compra.
- La landing debe conservar su posición al abrirlo.
- Bloquear el scroll del documento mientras esté abierto.
- Altura aproximada máxima: 90% del viewport.
- Permitir scroll interno si el contenido supera la altura disponible.
- Cierre mediante X, Escape y fuera del modal cuando no implique pérdida accidental de datos.
- Restaurar el foco al elemento que abrió el modal.
- Respetar `prefers-reduced-motion`.
- Diseño responsive sin scroll horizontal.

### Escritorio

Dos columnas:

- Panel izquierdo: fondo rojo oscuro con degradado, detalles dorados, producto original y decoración navideña discreta.
- Panel derecho: fondo blanco, título `REALIZA TU PEDIDO`, marca ERECMAN PLUS, indicador de tres pasos, promociones, campos y navegación.

### Móvil

Reorganizar a una columna y reducir la altura visual del producto/decoración para priorizar el formulario.

## Paso 1: Datos principales

Mostrar las dos promociones seleccionables. La selección activa debe tener borde rojo, fondo rosado claro y radio button activo.

Campos obligatorios:

- Nombre completo.
- Celular / WhatsApp.

No solicitar DNI, tarjeta, contraseña ni correo electrónico.

Botón: `SIGUIENTE`.

## Paso 2: Ubicación y entrega

### Destino

Mostrar únicamente:

- Lima
- Provincia

No incluir Callao como destino independiente.

### Aviso para provincias

Al seleccionar Provincia, mostrar:

> Envíos a provincias: se requiere un adelanto de S/40 para el transporte.

Exigir aceptación mediante checkbox:

> Entiendo que debo adelantar S/40 para gestionar mi envío a provincia.

El adelanto debe mostrarse como concepto independiente y pendiente de coordinación. No presentarlo como pagado ni asumir todavía si se descuenta del producto o si es un cargo adicional.

### Método de entrega

- Entrega a domicilio
- Envío por agencia

Estas opciones deben poder configurarse según las condiciones reales del negocio.

### Campos

- Departamento: selector con todos los departamentos del Perú y Callao.
- Provincia: texto manual.
- Distrito: texto manual.
- Dirección de entrega o agencia: obligatorio.
- Referencia: opcional.

Botones: `ATRÁS` y `SIGUIENTE`.

## Paso 3: Resumen del pedido

Mostrar antes de contactar:

- Imagen original del producto.
- Promoción seleccionada.
- Cantidad de frascos.
- Precio del producto.
- Destino.
- Adelanto de S/40 cuando corresponda.
- Nota de que delivery y condiciones del adelanto deben coordinarse.
- Nombre, celular, método de entrega y datos de ubicación.

Botones:

- `EDITAR DATOS`: vuelve a pasos anteriores sin perder información.
- `CONTACTAR POR WHATSAPP`: botón verde con ícono de WhatsApp.

No afirmar que el pedido fue enviado antes de que el usuario abra/envíe el mensaje por WhatsApp.

## WhatsApp

Reutilizar y verificar el número actualmente configurado en `index.html`; no inventar otro.

Construir el mensaje con `encodeURIComponent()` y el formato:

```js
const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
```

El mensaje debe incluir promoción, precio, destino, adelanto pendiente cuando aplique, datos del cliente, entrega y ubicación.

## Requisitos de accesibilidad y UX

- Labels visibles y placeholders claros.
- Navegación completa por teclado.
- Mensajes de validación claros.
- Persistencia temporal de datos al cambiar de paso.
- Indicador de progreso de tres pasos.
- Gestión y restauración del foco.
- Cierre accesible.
- Animaciones moderadas y compatibles con `prefers-reduced-motion`.

## Plan de integración

1. Revisar la estructura exacta de `index.html`, `css/style.css` y `js/main.js` antes de editar.
2. Identificar todos los botones y enlaces actuales de compra.
3. Añadir la configuración de campaña y el estado del formulario en `js/main.js`.
4. Añadir el bloque de promoción navideña dentro de la oferta existente.
5. Convertir los botones de compra a disparadores del modal conservando su apariencia y contexto.
6. Añadir el HTML del modal al final de `index.html`, con un único formulario de tres pasos.
7. Añadir estilos aislados y responsive en `css/style.css`.
8. Validar promociones, campos, navegación, provincias, resumen y mensaje de WhatsApp.
9. Ejecutar las validaciones disponibles y revisar manualmente escritorio/móvil.
10. Ejecutar antes de entregar:

```bash
git status
git diff --stat
git diff --check
```

## Pendientes de confirmación comercial

1. Confirmar si los `S/40` de provincia se descuentan del importe final o son un cargo adicional.
2. Confirmar métodos de entrega realmente disponibles por destino.
3. Confirmar la imagen publicitaria navideña que debe reutilizarse, si aún no está presente en `imgs/`.
4. Confirmar si el pack navideño puede solicitarse con entrega a domicilio y por agencia en todos los destinos.

## Criterios de aceptación

- Se mantiene la apariencia y contenido original de la landing.
- Todos los botones de compra abren el modal único.
- La promoción navideña selecciona `S/269.90`.
- El modal contiene los tres pasos y funciona en móvil.
- Se validan campos obligatorios y aceptación del adelanto provincial.
- El resumen contiene toda la información del pedido.
- WhatsApp recibe el mensaje completo y codificado.
- Desactivar la campaña restaura el precio regular del pack.
- No se modifican imágenes ni secciones existentes sin necesidad.
- Todos los cambios permanecen en `feature/campana-navidena`.

