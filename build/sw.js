const cacheName ='v1';
const cacheAssets = [
    'index.html',
    '/static/js/bundle.js',
    '/static/js/0.chunk.js',
    '/static/js/main.chunk.js'
];
//call install event
self.addEventListener('install',(e)=>{
   // console.log('service worker install');
    e.waitUntil(caches.open(cacheName).then(cache =>{
       // console.log('service worker: caching files');
        cache.addAll(cacheAssets);
    }).then(()=>self.skipWaiting()))
});
//call activate event
self.addEventListener('activate',(e)=>{
   // console.log('service worker activated');
    e.waitUntil(caches.key().then( cacheNames =>{
        return Promise.all(
            cacheNames.map(cache => {
                if(cache !== cacheName){
                  //  console.log('service worker: Clearing old Cache');
                    return caches.delete(cache);
                }
            })
        )
    }))
});

// call fetch event

self.addEventListener('fetch',(e)=>{
   // console.log('service worker:fetching');
    if (!(e.request.url.indexOf('http') === 0)) 
    {
        return;
    }else{
    e.respondWith(
        fetch(e.request)
        .then(res=>{
            //make copy clone  of response
            const resClone = res.clone();
            //open cache
            caches.open(cacheName)
            .then(cache=>{
                cache.put(e.request.url, resClone)
            });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    )}
})