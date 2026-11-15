const fs=require('fs');const {spawn}=require('child_process');
(async()=>{const browser=spawn('C:/Users/Usuario/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',['--headless','--no-sandbox','--disable-gpu','--remote-debugging-port=9338','--window-size=1440,1000','--load-extension='+process.cwd()+'/qa/final-form/zoom-helper','--user-data-dir='+process.env.TEMP+'/erecman-qa-live','about:blank'],{stdio:'ignore',windowsHide:true});
try{let targets;for(let i=0;i<40;i++){try{targets=await fetch('http://127.0.0.1:9338/json').then(r=>r.json());if(targets.some(t=>t.type==='page'))break}catch{}await new Promise(r=>setTimeout(r,250))}if(!targets)throw Error('No se pudo conectar con Chromium');const ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,m=>m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
﻿await send('Page.navigate',{url:'file:///'+process.cwd().replaceAll('\\','/')+'/index.html'});
for(let n=0;n<80;n++){if(await ev('document.readyState==="complete"&&!!document.querySelector("#order-form")'))break;await new Promise(r=>setTimeout(r,100))}
const assertions=[];const check=(name,pass)=>{assertions.push({name,pass:!!pass});if(!pass)throw Error(name)};
await ev('document.querySelector("[data-order-trigger=pack]").click()');
await ev(`document.querySelector('[data-next-step="2"]').click()`);
check('Campos obligatorios impiden avanzar',await ev(`document.querySelector('[data-step="1"]').hidden===false && !!document.querySelector('[data-error-for="customer-name"]').textContent`));
await ev(`document.querySelector('#customer-name').value='Carlos Ramirez';document.querySelector('#customer-phone').value='812345678';document.querySelector('[data-next-step="2"]').click()`);
check('Celular que no comienza con 9 rechazado',await ev(`!document.querySelector('[data-step="1"]').hidden && !!document.querySelector('#customer-phone-error').textContent`));
await ev(`document.querySelector('#customer-phone').value='98765432';document.querySelector('[data-next-step="2"]').click()`);
check('Celular de ocho digitos rechazado',await ev(`!document.querySelector('[data-step="1"]').hidden`));
await ev(`document.querySelector('#customer-phone').value='987654321';document.querySelector('[data-next-step="2"]').click()`);
check('Celular valido permite avanzar',await ev(`!document.querySelector('[data-step="2"]').hidden`));
await ev(`document.querySelector('[name="destination"][value="Provincia"]').click();document.querySelector('[name="deliveryMethod"]').click();for(const id of ['department','province','district','address'])document.getElementById(id).value=id==='department'?'Lima':'Datos de prueba';document.querySelector('[data-next-step="3"]').click()`);
check('Provincia muestra aviso y exige aceptacion del adelanto',await ev(`!document.querySelector('#province-notice').hidden&&!document.querySelector('[data-step="2"]').hidden`));
await ev(`document.querySelector('#province-advance').checked=true;document.querySelector('[data-next-step="3"]').click()`);
for(const key of ['pack','individual']){
 if(key==='individual')await ev(`document.querySelector('[data-prev-step="2"]').click();document.querySelector('[data-prev-step="1"]').click();document.querySelector('[name="promotion"][value="individual"]').click();document.querySelector('[data-next-step="2"]').click();document.querySelector('[data-next-step="3"]').click()`);
 const price=key==='pack'?'269.90':'150', balance=key==='pack'?'229.90':'110';
 check('Resumen e imagen correctos: '+key,await ev(`document.querySelector('#order-summary-product img').getAttribute('src')===document.querySelector('[data-promotion-card="${key}"] img').getAttribute('src')&&document.querySelector('#order-summary').innerText.includes('${price}')&&document.querySelector('#order-summary').innerText.includes('${balance}')`));
 await ev(`window.__opened='';window.open=url=>{window.__opened=url};document.querySelector('#order-form').requestSubmit()`);
 const url=await ev('window.__opened');const msg=decodeURIComponent(url.split('?text=')[1]||'');
 check('WhatsApp conserva numero, precio, adelanto pendiente y comprador: '+key,url.startsWith('https://wa.me/51970396146?text=')&&msg.includes(price)&&msg.includes('40')&&msg.includes('no pagado')&&msg.includes('Carlos Ramirez'));
}
check('Retroceso conserva datos',await ev(`document.querySelector('#customer-name').value==='Carlos Ramirez'&&document.querySelector('#customer-phone').value==='987654321'`));
check('Panel principal conserva imagen original',await ev(`!document.querySelector('.order-modal__campaign-image').src.includes('navide')&&!document.querySelector('.order-modal__campaign-image').src.includes('imagen_de_un_solo')`));
check('Sin caracteres corruptos en formulario',await ev(`!/[\uFFFD\u00c3\u00c2]/.test(document.querySelector('#order-form').innerText)`));
const targetList=await fetch('http://127.0.0.1:9338/json').then(r=>r.json());const worker=targetList.find(t=>t.type==='service_worker');
console.log('Extension de zoom disponible:',!!worker);
const zoomResults=[];
if(worker){const sw=new WebSocket(worker.webSocketDebuggerUrl);await new Promise(r=>sw.onopen=r);let id=0;const jobs=new Map();sw.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){jobs.get(m.id)?.(m.result);jobs.delete(m.id)}};const run=expression=>new Promise(resolve=>{const n=++id;jobs.set(n,resolve);sw.send(JSON.stringify({id:n,method:'Runtime.evaluate',params:{expression,awaitPromise:true,returnByValue:true}}))});
for(const zoom of [1,1.25,1.5]){const z=await run(`(async()=>{const t=(await chrome.tabs.query({})).find(t=>t.url?.startsWith('file:'));await chrome.tabs.setZoom(t.id,${zoom});return await chrome.tabs.getZoom(t.id)})()`);check('Zoom real '+zoom,z.result?.value===zoom);await new Promise(r=>setTimeout(r,250));await ev(`document.querySelector('[data-prev-step="2"]').click();document.querySelector('[data-prev-step="1"]').click()`);
for(let step=1;step<=3;step++){if(step===2)await ev(`document.querySelector('[data-next-step="2"]').click()`);if(step===3)await ev(`document.querySelector('[data-next-step="3"]').click()`);
const result=await ev(`(()=>{const d=document.querySelector('.order-modal__dialog'),f=document.querySelector('.order-step:not([hidden]) .order-fieldset'),b=document.querySelector('.order-step:not([hidden]) .order-actions')||document.querySelector('.order-step:not([hidden]) > .order-button');return {viewport:[innerWidth,innerHeight],ratio:devicePixelRatio,overflow:d.scrollWidth>d.clientWidth||f.scrollWidth>f.clientWidth,footer:b.getBoundingClientRect().bottom<=innerHeight,step:document.querySelector('.order-step:not([hidden])').dataset.step}})()`);zoomResults.push({zoom,step,...result});check('Layout zoom '+zoom+' paso '+step,!result.overflow&&result.footer&&Number(result.step)===step);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('qa/final-form/zoom-'+Math.round(zoom*100)+'-step'+step+'.png',Buffer.from(shot.data,'base64'));
}}
sw.close();}
fs.writeFileSync('qa/final-form/functional.json',JSON.stringify({assertions,zoomResults},null,2));console.log(JSON.stringify({assertions,zoomResults},null,2));await send('Browser.close');ws.close();}finally{browser.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
