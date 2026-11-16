const fs=require('fs');const {spawn}=require('child_process');
(async()=>{const browser=spawn('C:/Users/Usuario/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',['--headless','--no-sandbox','--disable-gpu','--remote-debugging-port=9342','--user-data-dir='+process.env.TEMP+'/erecman-product-zoom','about:blank'],{stdio:'ignore',windowsHide:true});
try{let targets;for(let i=0;i<40;i++){try{targets=await fetch('http://127.0.0.1:9342/json').then(r=>r.json());if(targets.some(t=>t.type==='page'))break}catch{}await new Promise(r=>setTimeout(r,250))}if(!targets)throw Error('No se pudo conectar con Chromium');const ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,m=>m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result));ws.send(JSON.stringify({id,method,params}))});const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[];const checks=[];const check=(name,ok)=>{checks.push({name,ok});if(!ok)throw Error(name)};
await send('Page.enable');
async function load(width,height){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:8080/'});for(let n=0;n<100;n++){if(await ev('document.readyState==="complete" && !!document.querySelector("#order-form")'))break;await sleep(100)}await sleep(400)}
const next2=`document.querySelector('#customer-name').value='Cliente de prueba';document.querySelector('#customer-phone').value='987654321';document.querySelector('[data-next-step="2"]').click()`;
const next3=`document.querySelector('[name="destination"][value="Provincia"]').click();document.querySelector('[name="deliveryMethod"]').click();for(const id of ['department','province','district','address'])document.getElementById(id).value=id==='department'?'Lima':'Datos de prueba';document.querySelector('#province-advance').checked=true;document.querySelector('[data-next-step="3"]').click()`;
async function geometry(){return ev(`(()=>{let q=s=>document.querySelector(s),rect=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};let imgs=[...document.querySelectorAll('.section__presentation-image img,.order-step:not([hidden]) .order-promotion img,.order-step:not([hidden]) .order-summary-product img')];return {pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,cards:[...document.querySelectorAll('.order-step:not([hidden]) .order-promotion,.order-step:not([hidden]) .order-summary-product')].map(rect),imgs:imgs.filter(e=>e.getBoundingClientRect().width>0).map(e=>({rect:rect(e),animation:getComputedStyle(e).animationName,scale:getComputedStyle(e).getPropertyValue('--erecman-frasco-scale'),loaded:e.complete&&e.naturalWidth>0})),modalOverflow:q('.order-modal__dialog').scrollWidth>q('.order-modal__dialog').clientWidth,step:q('.order-step:not([hidden])').dataset.step}})()`)}
for(const [w,h] of [[375,812],[390,844],[768,1024],[1366,768],[1920,1080]]){
 await load(w,h);
 for(let step=0;step<=3;step++){
 if(step===1)await ev(`document.querySelector('[data-order-trigger=pack]').click()`);
 if(step===2)await ev(next2);if(step===3)await ev(next3);
 await ev(`document.querySelectorAll('img').forEach(e=>e.getAnimations().filter(a=>a.animationName==='erecmanFrascoZoom').forEach(a=>{a.pause();a.currentTime=0}))`);
 const rest=await geometry();await ev(`document.querySelectorAll('img').forEach(e=>e.getAnimations().filter(a=>a.animationName==='erecmanFrascoZoom').forEach(a=>a.currentTime=1200))`);const peak=await geometry();
 check(w+' step '+step+' no new horizontal overflow',peak.pageWidth<=Math.max(w,rest.pageWidth));
 check(w+' step '+step+' stable cards',JSON.stringify(rest.cards)===JSON.stringify(peak.cards));
 check(w+' step '+step+' images loaded',peak.imgs.every(i=>i.loaded));
 if(step>0){check(w+' step '+step+' correct step',Number(peak.step)===step);check(w+' step '+step+' modal no overflow',!peak.modalOverflow)}
 for(let i=0;i<peak.imgs.length;i++)check(w+' step '+step+' image '+i+' scale',Math.abs(peak.imgs[i].rect.w/rest.imgs[i].rect.w-Number(peak.imgs[i].scale))<0.002);
 results.push({width:w,height:h,step,rest,peak});
 }
}
await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});check('Reduced motion disables zoom',await ev(`[...document.querySelectorAll('.section__presentation-image img,.order-promotion img,.order-summary-product img')].every(e=>getComputedStyle(e).animationName==='none')`));await send('Emulation.setEmulatedMedia',{features:[]});
// Intercept WhatsApp locally so validation never sends an order.
await ev(`window.open=url=>{window.__whatsapp=url};document.querySelector('#order-form').requestSubmit()`);check('WhatsApp keeps price, advance and phone',await ev(`window.__whatsapp.startsWith('https://wa.me/51970396146?text=')&&decodeURIComponent(window.__whatsapp).includes('269.90')&&decodeURIComponent(window.__whatsapp).includes('40')`));
await ev(`document.querySelector('[data-prev-step="2"]').click();document.querySelector('[data-prev-step="1"]').click();document.querySelector('[name="promotion"][value="individual"]').click();document.querySelector('[data-next-step="2"]').click();document.querySelector('[data-next-step="3"]').click()`);check('Individual summary updates and keeps zoom',await ev(`document.querySelector('#order-summary-product img').src.includes('imagen_de_un_solo')&&getComputedStyle(document.querySelector('#order-summary-product img')).animationName==='erecmanFrascoZoom'`));
fs.writeFileSync('qa/product-zoom/results.json',JSON.stringify({checks,results},null,2));console.log('PASS '+checks.length+' checks');
// Record actual screenshots over 8 seconds, then encode them in Chromium with MediaRecorder.
await load(1366,768);
for(const view of ['landing','paso-1','paso-3']){
 if(view==='paso-1')await ev(`document.querySelector('[data-order-trigger=pack]').click()`);
 if(view==='paso-3'){await ev(next2);await ev(next3)}
 await ev(`document.querySelectorAll('img').forEach(e=>e.getAnimations().filter(a=>a.animationName==='erecmanFrascoZoom').forEach(a=>{a.currentTime=0;a.play()}))`);
 const frames=[];const start=Date.now();while(Date.now()-start<8200){frames.push((await send('Page.captureScreenshot',{format:'jpeg',quality:80})).data);await sleep(100)}
 fs.writeFileSync('qa/product-zoom/'+view+'-frames.json',JSON.stringify(frames));console.log('Captured '+view+' '+frames.length+' frames');
}
await send('Page.navigate',{url:'about:blank'});await sleep(200);
for(const view of ['landing','paso-1','paso-3']){
 const frames=JSON.parse(fs.readFileSync('qa/product-zoom/'+view+'-frames.json'));
 const data=await ev(`(async()=>{let frames=${JSON.stringify(frames)},canvas=document.createElement('canvas');canvas.width=1366;canvas.height=768;document.body.append(canvas);let ctx=canvas.getContext('2d'),stream=canvas.captureStream(10),rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8',videoBitsPerSecond:1800000}),chunks=[];rec.ondataavailable=e=>chunks.push(e.data);let done=new Promise(r=>rec.onstop=r);rec.start();for(let frame of frames){let im=new Image();im.src='data:image/jpeg;base64,'+frame;await im.decode();ctx.drawImage(im,0,0);await new Promise(r=>setTimeout(r,8200/frames.length))}rec.stop();await done;return await new Promise(r=>{let fr=new FileReader();fr.onload=()=>r(fr.result.split(',')[1]);fr.readAsDataURL(new Blob(chunks,{type:'video/webm'}))})})()`);
 fs.writeFileSync('qa/product-zoom/'+view+'.webm',Buffer.from(data,'base64'));fs.unlinkSync('qa/product-zoom/'+view+'-frames.json');console.log('Saved '+view+'.webm');
}
await send('Browser.close');ws.close();}finally{browser.kill()}})().catch(e=>{console.error(e);process.exitCode=1});

