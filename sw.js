const V='svn-v6',SHELL=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./favicon.ico','./favicon-32.png','./favicon-16.png'],HOSTS=['www.gstatic.com','cdn.jsdelivr.net'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    // open instantly from the cache, refresh the cached copy in the background (works offline too)
    e.respondWith(caches.match('./index.html').then(hit=>{
      const net=fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put('./index.html',c));return x}).catch(()=>hit);
      return hit||net;
    }));
    return;
  }
  if(u.origin===location.origin||HOSTS.includes(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{
      const net=fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>hit);
      return hit||net;
    }));
  }
});
