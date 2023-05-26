const {
  Menu,
  BrowserWindow,
  getCurrentWindow,
  dialog
} = require('@electron/remote')
const { ipcRenderer, shell} = require('electron')
const path = require('path')

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

  // 打开编辑面板
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

  // 自定义窗口
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

  // 异步发送信息到主进程
  const ipcBtn = document.getElementById('async-ipc-btn');
  ipcBtn.onclick = () => {

    ipcRenderer.send('msg1', '来自Home渲染进程的异步消息')
  }

  // 同步发送
  document.getElementById('sync-ipc-btn').onclick = () => {

    const msg = ipcRenderer.sendSync('msg2', '来自Home渲染进程的同步消息')
    console.log(msg)
  }

  ipcRenderer.on('msg1Re', (ev, data) => {
    console.log(data)
  })

  ipcRenderer.on('mtp', (ev, data) => {
    console.log(data)
  })

  document.getElementById('new-btn').onclick = () => {

    ipcRenderer.sendSync('newWin', `打开窗口`)
    localStorage.setItem('newWinMsg', new Date().valueOf())
  }

  document.getElementById('dialog-btn').onclick = () => {

    dialog.showOpenDialog({
      defaultPath: __dirname,
      buttonLabel: '请选择',
      title: 'dialog对话框',
      properties: ['openFile'],
      filters: [
        {
          name: '代码文件',
          extensions: ['js', 'ts']
        }
      ]
    })
    .then((ret) => {
      console.log(ret)
    })
    .catch(err => {
      console.log(err)
    })
  }

  document.getElementById('dialog-err-btn').onclick = () => {
    dialog.showErrorBox('自定义错误', '出错啦')
  }

  document.getElementById('shell-baidu').onclick = () => {
    shell.openExternal('https://www.baidu.com')
  }

  document.getElementById('shell-folder').onclick = () => {
    shell.showItemInFolder(path.resolve(__dirname))
  }

})

