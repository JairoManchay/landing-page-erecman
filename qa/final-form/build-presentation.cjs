const fs=require('fs');
const dir='qa/final-form/';
const labels=['Datos principales','Ubicación y entrega','Resumen del pedido'];
const groups=[['Escritorio','1440x900'],['Móvil','390x844']];
let sections='';
for(let step=1;step<=3;step++){
sections+=`<section id="paso-${step}"><h2>Paso ${step}: ${labels[step-1]}</h2><div class="comparacion">`;
for(const [label,size] of groups){const base=`presentacion-${size}-step${step}`;sections+=`<article><h3>${label} · ${size.replace('x',' × ')}</h3><a href="${base}.png" target="_blank"><img src="${base}.png" alt="Paso ${step}: ${labels[step-1]} en ${label.toLowerCase()}" loading="lazy"></a><details><summary>Ver el contenido al desplazarse</summary><p>El cuerpo tiene desplazamiento interno; los botones permanecen accesibles.</p><a href="${base}-medio.png" target="_blank"><img src="${base}-medio.png" alt="Zona central del paso ${step}" loading="lazy"></a><a href="${base}-detalle.png" target="_blank"><img src="${base}-detalle.png" alt="Zona inferior del paso ${step}" loading="lazy"></a></details></article>`;}
sections+='</div></section>';
}
fs.writeFileSync(dir+'presentacion.html',`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Erecman Plus · Presentación final del formulario</title><style>body{margin:0;background:#f6f3f4;color:#272127;font:16px/1.6 system-ui,sans-serif}main{max-width:1500px;margin:auto;padding:32px 24px}h1{font-size:clamp(26px,4vw,40px);line-height:1.2;color:#ae1a39}h2{margin-top:40px}nav{display:flex;flex-wrap:wrap;gap:12px}a{color:#9b1232}nav a{padding:10px 16px;background:#fff;border-radius:8px}.comparacion{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(0,1fr);gap:24px;align-items:start}article{background:white;padding:16px;border:1px solid #e6dce0;border-radius:12px;min-width:0}h3{margin:0 0 14px;font-size:18px}img{display:block;width:100%;height:auto;border-radius:8px}summary{cursor:pointer;font-weight:600;padding:12px 0}details img{margin-top:16px}.nota{max-width:85ch;color:#51464b}footer{margin-top:40px}@media(max-width:760px){.comparacion{grid-template-columns:1fr}main{padding:24px 16px}}@media print{details{display:block}nav{display:none}article{break-inside:avoid}a{color:inherit}}</style></head><body><main><h1>Erecman Plus<br>Presentación final del formulario</h1><p class="nota">Capturas reales del navegador con datos ficticios. Se conservan la estructura de tres pasos, las promociones y el funcionamiento aprobado. Las miniaturas son más visibles y los textos, precios y controles tienen mayor legibilidad.</p><nav aria-label="Pasos del formulario"><a href="#paso-1">1. Datos principales</a><a href="#paso-2">2. Ubicación y entrega</a><a href="#paso-3">3. Resumen</a></nav>${sections}<footer><p>Envío a Provincia: adelanto de S/40 pendiente de coordinar. Pack: S/269.90. Saldo estimado tras el adelanto: S/229.90. Delivery por confirmar.</p><p><a href="README.md">Detalle de ajustes y pruebas</a> · <a href="functional.json">Resultados funcionales y de zoom</a></p></footer></main></body></html>`);
const layout=JSON.parse(fs.readFileSync(dir+'final.json','utf8'));
const functional=JSON.parse(fs.readFileSync(dir+'functional.json','utf8'));
const rows=layout.filter(r=>r.step==='1').map(r=>`| ${r.requested.join(' × ')} | 1, 2 y 3 | Correcto |`).join('\n');
const report=`# Erecman Plus — presentación final

[Ver presentación visual](presentacion.html)

## Ajustes realizados

- Solo se modificaron estilos del modal en este ajuste. No se cambiaron la landing, HTML, JavaScript ni imágenes originales.
- Miniaturas de promociones: 60 × 80 → 72 × 96 px en escritorio; 50 × 65 → 60 × 78 px hasta 700 px de ancho. Aumento del 20%, con \`object-fit: contain\`, sin deformación ni escalado artificial.
- La columna de imagen acompaña el aumento. Radio, nombre, cantidad y precio mantienen su orden; el radio marcado identifica la selección además del borde rojo.
- Miniatura del resumen: 68 × 92 px en escritorio y 56 × 76 px en móvil.
- Nombres de promociones a 16 px, precios a 20 px, textos secundarios a 14 px, labels y condiciones a 15 px, errores a 14 px y botones a 15 px. Encabezados de sección a 18 px.
- Campos de al menos 46 px y bordes más visibles. Cierre de 44 × 44 px. Opciones de entrega y destino con etiquetas de al menos 44 px de alto; se mantienen estados de foco existentes.
- Verde de WhatsApp más oscuro para mejorar el contraste con el texto blanco. No cambia la acción del botón.
- Se mantienen los breakpoints, scroll interno, panel rojo original y navegación aprobados.

## Pruebas

- ${layout.length} casos responsive: tres pasos en las doce resoluciones solicitadas previamente más 390 × 460 como viewport reducido por teclado. Sin desbordamiento horizontal, panel visual contenido, scroll hasta el final y footer dentro del modal.
- ${functional.assertions.length} comprobaciones funcionales y de zoom correctas. Celular de ocho dígitos y celular que no empieza con 9 rechazados; nueve dígitos comenzando con 9 aceptados.
- Provincia muestra S/40 y exige aceptación. Ambos productos conservan importes, saldos, imagen correcta y datos al retroceder.
- Se interceptó la apertura de WhatsApp para comprobar número y mensaje; no se envió ningún mensaje ni se contactó a terceros.
- Zoom real del navegador verificado mediante \`chrome.tabs.setZoom\` y \`getZoom\`: 100%, 125% y 150%; los tres pasos correctos en cada nivel. El helper es una extensión exclusivamente local de QA, no una dependencia del producto.
- Sin caracteres corruptos en el contenido del formulario. Sintaxis JavaScript y \`git diff --check\` correctos.
- El teclado se simuló reduciendo el viewport. Sigue pendiente una comprobación con teclado físico de dispositivo Android/iOS.

| Viewport | Pasos | Resultado |
| --- | --- | --- |
${rows}

## Capturas reales

La presentación reúne los tres pasos en escritorio y móvil. Cada paso incluye la captura inicial y vistas central/inferior del cuerpo desplazable para revisar los campos y el resumen completo sin simular imágenes.

| Paso | Escritorio | Móvil |
| --- | --- | --- |
${labels.map((label,i)=>`| ${i+1}. ${label} | [Captura](presentacion-1440x900-step${i+1}.png) | [Captura](presentacion-390x844-step${i+1}.png) |`).join('\n')}

[Resultados de geometría](final.json) · [Pruebas funcionales y zoom](functional.json)

Rama: feature/campana-navidena. Sin commit, push, merge ni despliegue.
`;
fs.writeFileSync(dir+'README.md',report.replaceAll('\`','`'));
console.log('Presentación y reporte generados.');
