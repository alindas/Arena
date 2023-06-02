
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
    if (remember && width && length && !screen) {
      let size = width + '*' + length
      if (initial.findIndex(o => new RegExp(o).test(size)) === -1) {
        console.log('size', size)
        initial.push(size)
        store.set('screen', initial)
        let node = document.createElement('option')
        node.value = size
        node.innerHTML = size
        document.querySelector('.form-select').append(node)
      }
    }
    if (screen) {
      let val = screen.split('*')
      triggerEle.click()
      console.log('screen')
      getCurrentWindow().setSize(+val[0], +val[1])

    } else if (width && length) {
      console.log('custom')
      triggerEle.click()
      getCurrentWindow().setSize(+width, +length)

    }
    console.log(width,length,screen,scale,remember)
  })

  document.querySelector('.load-page-btn').onclick = () => {
    const url = document.querySelector('.page-url').value
    console.log('url', url)
    // getCurrentWindow().loadURL(url)
    document.querySelector('iframe').src = url
  }

  ipcRenderer.on('reload', (ev, data) => {
    document.querySelector('iframe').contentWindow.location.reload()
  })
})
