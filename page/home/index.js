const {BrowserWindow} = require('@electron/remote')

window.addEventListener('DOMContentLoaded', () => {
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
      width: 800,
      height: 600,
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
