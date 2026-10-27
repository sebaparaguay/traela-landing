/* Only handles notifications. No pages, credentials, messages, or API responses are cached. */
self.addEventListener('push', event => {
 let data={};try{data=event.data?.json()||{};}catch{}
 const raw=typeof data.url==='string'?data.url:'/operator';
 const url=raw.startsWith('/operator?conversation=')?raw:'/operator';
 event.waitUntil(self.registration.showNotification(data.title||'Traela Operator',{
 body:data.body||'Tenés una nueva consulta.',icon:'/favicon.png',badge:'/favicon.png',tag:data.tag||'traela',data:{url},renotify:true
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();const url=new URL(event.notification.data?.url||'/operator',self.location.origin).href;
 event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const client of windows){if(new URL(client.url).pathname.startsWith('/operator')){await client.navigate(url);return client.focus();}}return self.clients.openWindow(url);})());
});
