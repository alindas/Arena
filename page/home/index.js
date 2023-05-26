const {Menu, BrowserWindow, getCurrentWindow} = require('@electron/remote')

window.addEventListener('DOMContentLoaded', () => {

  const parentWin = getCurrentWindow()
  parentWin.webContents.openDevTools()

  // 响应右键菜单
  window.addEventListener('contextmenu', ev => {
    ev.preventDefault()
    console.log('response contextmenu')
    Menu.buildFromTemplate([
      {
        label: '打开文件'
      }
    ]).popup({window: parentWin})
  })

  const lowCodeBtn = document.getElementById('low-code-btn');
  lowCodeBtn.onclick = () => {

    // 渲染进程不能直接操作 BrowserWindow
    let win = new BrowserWindow({
      width: 1024,
      height: 800,
      icon: 'page/lite/favicon.ico'
    })

    // 需要借助 remote 模块，没有需要额外安装 @electron/remote
    // let win = new remote.BrowserWindow({
    //   width: 1024,
    //   height: 800
    // })

    win.loadFile('./page/lite/index.html');

    win.on('close', () => {
      win = null;
    })
  }

  const customBtn = document.getElementById('custom-btn');
  customBtn.onclick = () => {

    // 渲染进程不能直接操作 BrowserWindow
    let win = new BrowserWindow({
      parent: parentWin, // 指定父子窗口
      modal: true, // 模态形式
      x: 200,
      y: 200,
      width: 600,
      height: 400,
      frame: false,
      webPreferences:{
        nodeIntegration:true,//允许渲染进程使用nodejs
        contextIsolation:false//允许渲染进程使用nodejs
      }
    })

    win.loadFile('./page/custom/index.html');

    win.on('close', () => {
      win = null;
    })
  }

})

