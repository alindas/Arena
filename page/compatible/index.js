
const {
  getCurrentWindow,
  getGlobal
} = require('@electron/remote')
const { ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  let open = false;

  // 将用户保存的内容更新到视图
  const store = getGlobal('store')
  // const initial = JSON.parse(store.get('screen')??'[]')
  const initial = store.get('screen')
  const screen = initial.map(o => {
    let node = document.createElement('option')
    node.value = o
    node.innerHTML = o
    return node
  })
  console.log(store, initial, screen)
  document.querySelector('.form-select').append(...screen)

  const pageUrl = store.get('page-url')
  if (pageUrl) {
    document.querySelector('iframe').src = pageUrl
    document.querySelector('.compatible-content').classList.add('.compatible-content-pickup')
  }

  let userConfig = store.get('user')
  document.querySelector('input[name=width]').value = userConfig['width']
  document.querySelector('input[name=length]').value = userConfig['length']
  document.querySelector('select[name=screen]').value = userConfig['screen']
  document.querySelector('select[name=scale]').value = userConfig['scale']
  document.querySelector('input[name=remember]').checked = userConfig['remember']

  const triggerEle = document.querySelector('.config-trigger')
  triggerEle.onclick = () => {
    const content = document.querySelector('.config-side')
    if (open) {
      triggerEle.innerHTML = '<'
      content.style.transform = 'translateX(100%)'

    } else {
      triggerEle.innerHTML = '>'
      content.style.transform = 'translateX(0)'
    }
    open = !open
  }

  const form = document.querySelector('.config-form')
  form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    const formData = new FormData(form)
    let width = formData.get('width')
    let length = formData.get('length')
    let screen = formData.get('screen')
    let scale = formData.get('scale')
    let remember = formData.get('remember')
    if (remember !== null && width && length && !screen) {
      let size = width + '*' + length
      if (initial.findIndex(o => new RegExp(`^${o}$`).test(width+''+length)) === -1) {
        console.log('size', size)
        initial.push(size)
        store.set('screen', initial)
        let node = document.createElement('option')
        node.value = size
        node.innerHTML = size
        document.querySelector('.form-select').append(node)
      }
    }
    let win = getCurrentWindow()
    if (win.maximizable) {
      win.restore()
    }
    if (screen) {
      let val = screen.split('*')
      triggerEle.click()
      win.setSize(+val[0], +val[1])
    } else if (width && length) {
      triggerEle.click()
      win.setSize(+width, +length)

    }
    // console.log(document.querySelector('iframe').contentWindow)
    // document.querySelector('iframe').contentWindow.devicePixelRatio = +scale/100
    // document.querySelector('iframe').contentWindow.webContents.setZoomFactor(+scale/100)
    win.webContents.setZoomFactor(+scale/100)
    // document.querySelector('.config-side').style.transform = `scale(${1/(+scale/100)}0)`
    console.log(width,length,screen,scale,remember)
    userConfig = {
      width,
      length,
      screen,
      scale,
      remember: remember === null ? false : true
    }
    store.set('user', userConfig)
  })

  document.querySelector('.load-page-btn').onclick = () => {
    const url = document.querySelector('.page-url').value
    console.log('url', url)
    getGlobal('store').set('page-url', url)
    // getCurrentWindow().loadURL(url)
    document.querySelector('iframe').src = url
    document.querySelector('.compatible-content').className = ('.compatible-content-pickup')
  }

  ipcRenderer.on('reload', (ev, data) => {
    document.querySelector('iframe').contentWindow.location.reload()
  })
})
