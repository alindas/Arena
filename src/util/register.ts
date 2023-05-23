export function registerSW() {
  if ('serviceWorker' in navigator) {
    console.log('can use sw')
    // 注册前注销其他 sw，避免污染
    // await navigator.serviceWorker.getRegistrations().then(sws => {
    //   for(let sw of sws) {
    //     sw.unregister();
    //   }
    // })
    navigator.serviceWorker.register('/sw.js', { scope: '/' }) // 作用域，必须比注册的 sw 层级高
      .then((reg) => {
        console.log('Service Worker registration successful')
        console.log('page scope is', reg.scope)

      })
      .catch((err) => {
        console.log('Service worker registration failed', err)
      })
  } else {
    console.log('your browser can not support service worker')
  }
}

