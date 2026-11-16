/* Groundwork service worker. Bump VERSION when you want to force every device to refresh its cache. */
const VERSION='groundwork-v1',CORE=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET')return;
 const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(u.origin!==location.origin&&!font)return;
 if(r.mode==='navigate'){ // network first so new deploys show up, cached copy when offline
  e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(VERSION).then(c=>c.put('index.html',y));return x}).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(VERSION).then(c=>c.put(r,y))}return x})));
});
