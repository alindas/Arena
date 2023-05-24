const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  let win = new BrowserWindow({
    // x: 100, // 偏移
    // y: 100,
    // show: false, // 是否显示窗体
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    resizable: true,
    title: 'win title', // 权重比 html 里的低
    icon: './lite/favicon.ico',
    frame: true, //标签页，选项卡是否显示
    transparent: false, // 透明窗体
    // autoHideMenuBar: true, // 隐藏菜单
    webPreferences: {
      nodeIntegration: true, // 是否允许渲染页面使用 node 环境
      contextIsolation: false,
      // nodeIntegrationInWorker: true, // 渲染进程中使用 require 模块
      enableRemoteModule: true, // 允许使用 remote 模块
      preload: path.join(__dirname, 'preload.js')
    }
  })

  require('@electron/remote/main').initialize()  //添加语句
  require('@electron/remote/main').enable(win.webContents)   //添加语句

  win.loadFile('./index.html')

  win.on('ready-to-show', () => {
    win.show();
  })

  win.webContents.on('dom-ready', () => {
    console.log('2. dom-ready')
  })

  win.webContents.on('did-finish-load', () => {
    console.log('3. did-finish-load')
  })

  win.on('close', () => {
    console.log('4. closed')
    win = null
  })
}

// 在 ready 事情被激活后才能创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('ready', () => {
  console.log('1. ready')
})

// 没有监听该事件，所有窗口关闭后应用自动退出
// 手动监听了该事情，需要手动设置 quit。
app.on('window-all-closed', () => {
  console.log('5. window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  console.log('6. before-quit')
})

app.on('will-quit', () => {
  console.log('7. will-quit')
})

app.on('quit', () => {
  console.log('8. quit')
})
