const V='mushaf-20261109-1.2.5',FONT_CACHE='mushaf-fonts-v1';
const CORE=['./','index.html','backgrounds/list.js','icon-b64.js','data.js','meanings.js','config.js?v='+V,'analytics.js','mp4-muxer.js','fix-webm-duration.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
const FONTS=['QCF4_QBSML.woff2',...Array.from({length:47},(_,i)=>'QCF4_Hafs_'+String(i+1).padStart(2,'0')+'_W.woff2'),'tajawal-arabic-400-normal.woff2','tajawal-arabic-500-normal.woff2','tajawal-arabic-700-normal.woff2','xf-amiri-arabic-400.woff2','xf-amiri-arabic-700.woff2','xf-amiri-latin-400.woff2','xf-amiri-latin-700.woff2','xf-aref-ruqaa-arabic-400.woff2','xf-aref-ruqaa-arabic-700.woff2','xf-aref-ruqaa-latin-400.woff2','xf-aref-ruqaa-latin-700.woff2','xf-cairo-arabic-400.woff2','xf-cairo-arabic-700.woff2','xf-cairo-latin-400.woff2','xf-cairo-latin-700.woff2','xf-lalezar-arabic-400.woff2','xf-lalezar-latin-400.woff2','xf-reem-kufi-arabic-400.woff2','xf-reem-kufi-arabic-700.woff2','xf-reem-kufi-latin-400.woff2','xf-reem-kufi-latin-700.woff2'];
const fontUrl=f=>new URL('fonts/'+f,self.registration.scope);
async function warmFonts(){
 const cache=await caches.open(FONT_CACHE),queue=FONTS.slice();
 const worker=async()=>{while(queue.length){const request=new Request(fontUrl(queue.shift()));try{if(await cache.match(request,{ignoreSearch:true}))continue;const response=await fetch(request);if(response.ok)await cache.put(request,response)}catch(e){}}};
 await Promise.all([worker(),worker()])
}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{const c=await caches.open(V);await Promise.all(CORE.map(async asset=>{const request=new Request(new URL(asset,self.registration.scope),{cache:'no-store'}),response=await fetch(request);if(!response.ok)throw new Error('Failed to precache '+asset+': HTTP '+response.status);await c.put(request,response)}));await warmFonts()})())});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V&&x!=FONT_CACHE).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('message',e=>{if(e.data&&e.data.type=='SKIP_WAITING'){self.skipWaiting();return}if(!e.data||e.data.type!='REFRESH_APP_CACHE')return;e.waitUntil((async()=>{try{const c=await caches.open(V);for(const asset of CORE){const request=new Request(new URL(asset,self.registration.scope),{cache:'no-store'}),response=await fetch(request);if(!response.ok)throw new Error('Failed to refresh '+asset+': HTTP '+response.status);await c.put(request,response)}e.ports[0]?.postMessage({ok:true})}catch(error){console.error('App cache refresh failed.',error);e.ports[0]?.postMessage({ok:false,error:error.message})}})())});
self.addEventListener('fetch',e=>{
 if(e.request.cache=='no-store'||e.request.method!='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!=location.origin)return;
 if(/\/backgrounds\/manifest\.json$/.test(u.pathname))return;
 const isFont=/\/fonts\/[^/]+\.woff2$/.test(u.pathname),name=isFont?FONT_CACHE:V;
 e.respondWith((async()=>{
  try{const c=await caches.open(name),hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit}catch(err){}
  const response=await fetch(e.request);
  if(response.ok)caches.open(name).then(c=>c.put(e.request,response.clone())).catch(()=>{});
  return response
 })())
});
self.addEventListener('notificationclick',e=>{
 e.notification.close();
 e.waitUntil((async()=>{
  const all=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const c of all){if('focus'in c){await c.focus();return}}
  if(clients.openWindow)await clients.openWindow((e.notification.data&&e.notification.data.url)||self.registration.scope)
 })())
});
