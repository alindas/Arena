
// const {
//   getCurrentWindow,
//   getGlobal
// } = require('@electron/remote')
const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const createSkip = require('../../utils/skip')
const notice = require('../../utils/notice')

window.addEventListener('DOMContentLoaded', () => {
  let open = false;
  const store = new Store({
    defaults: {
      screen: [
        "1920*1080",
        "1680*1050",
        "1600*1200",
        "1440*900",
        "1280*1024",
        "1280*800",
        "1152*864",
        "1024*768",
        "800*600",
        "1536*824",
        "400*300"
      ],
      "page-url": '',
      "page-list": [],
      "user": {
        "width": "800",
        "length": "600",
        "screen": "800*600",
        "scale": "100",
        "remember": true
      }
    }
  })
  // 将用户保存的内容更新到视图
  // app.getPath('userData') 的 config.json 文件
  // const initial = JSON.parse(store.get('screen')??'[]')
  const initial = store.get('screen')
  // const initial = await ipcRenderer.invoke('getStore', 'screen')

  const screen = initial.map(o => {
    let node = document.createElement('option')
    node.value = o
    node.innerHTML = o
    return node
  })
  document.querySelector('.screen-list').append(...screen)

  const pageUrl = store.get('page-url')
  if (pageUrl) {
    let clearSkip = createSkip()
    fetch(pageUrl)
    .then(() => {
      let iframe = document.querySelector('iframe')
      iframe.src = pageUrl
      iframe.onload = () => {
        clearSkip()
      }
    })
    .catch(err => {
      console.log(err)
      clearSkip()
      notice.error('页面加载失败')
    })

  }

  // 历史访问链接（十条）
  const pageList = store.get('page-list')
  const pageOps = pageList.map(o => {
    let node = document.createElement('option')
    node.value = o
    node.innerHTML = o
    return node
  })
  const pageListNode = document.querySelector('.page-list')
  pageListNode.append(...pageOps)
  pageListNode.value = pageUrl

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
    // let win = ipcRenderer.sendSync('getCurrentWindow')
    // if (win.maximizable) {
    //   win.restore()
    // }
    ipcRenderer.sendSync('restoreWin')
    if (screen) {
      let val = screen.split('*')
      triggerEle.click()
      // win.setSize(+val[0], +val[1])
      ipcRenderer.sendSync('setSize', val)
    } else if (width && length) {
      triggerEle.click()
      // win.setSize(+width, +length)
      ipcRenderer.sendSync('setSize', [width, length])

    }
    // console.log(document.querySelector('iframe').contentWindow)
    // document.querySelector('iframe').contentWindow.devicePixelRatio = +scale/100
    // document.querySelector('iframe').contentWindow.webContents.setZoomFactor(+scale/100)
    // win.webContents.setZoomFactor(+scale/100)
    ipcRenderer.sendSync('setZoomFactor', +scale/100)
    // document.querySelector('.config-side').style.transform = `scale(${1/(+scale/100)}0)`
    // console.log(width,length,screen,scale,remember)
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
    let clearSkip = createSkip()
    fetch(url)
    .then(() => {
      store.set('page-url', url)
      // 如果是新 url，则将其添加到 config 上
      if (pageList.findIndex(o => o === url) === -1) {
        store.set('page-list', [...pageList, url].slice(-10)) // 保存十条记录
        let node = document.createElement('option')
        node.value = url
        node.innerHTML = url
        pageListNode.append(node)
        pageListNode.value = url
      }
      let iframe = document.querySelector('iframe')
      iframe.src = url
      iframe.onload = () => {
        clearSkip()
      }
    })
    .catch(err => {
      console.log(err)
      clearSkip()
      notice.error('页面加载失败')
    })

  }

  document.querySelector('.change-page-btn').onclick = () => {
    triggerEle.click()
    const url = document.querySelector('.page-list').value
    let iframe = document.querySelector('iframe')
    if (url === '') {
      iframe.src = ''
      return
    }
    let clearSkip = createSkip()
    fetch(url)
    .then(() => {
      store.set('page-url', url)
      iframe.src = url
      iframe.onload = () => {
        clearSkip()
      }
    })
    .catch(err => {
      console.log(err)
      clearSkip()
      notice.error('页面加载失败')
    })

  }

  // ipcRenderer.on('reload', (ev, data) => {
  //   document.querySelector('iframe').contentWindow.location.reload()
  // })
})
