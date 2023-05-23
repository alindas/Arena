var version = '1.0.0';

this.addEventListener('install', (event) => {
  // 如果监听到了service worker已经安装成功的话
  // 就会调用event.waitUtil回调函数
  event.waitUntil(
    // 安装成功后调用CacheStorage缓存，使用之前先通过caches.open()
    // 打开对应的缓存空间
    caches.open('my-test-cache-v1')
      .then((cache) => {
        // 通过cache缓存对象的addAll方法添加
        return cache.addAll([
          '/',
          '/index.html'
        ])
      })
      .cache(() => {
        console.log('sw 安装出错了');
      })
  )
})

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果 service worker有自己的放回，就直接返回，减少一次http请求
        if (response) {
          return response;
        }
        // 如果service worker没有返回，那就直接请求真实远程服务
        var request = event.request.clone();
        return fetch(request)
          .then((res) => {
            // 请求失败，直接返回失败的结果
            if (!res || res.status !== 200) {
              return res;
            }
            // 请求成功的话，将请求缓存起来
            var responseClone = res.clone;
            caches
              .open('my-test-cache-v1')
              .then((cache) => {
                cache.put(event.request, respondClone)
              })
            return res;
          })
      })
  )
})

