const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const remote = require("@electron/remote/main")
remote.initialize()



const createMenu = () => {
  // 制定自定义菜单模板
  const menuTemp = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建文件',
          click() {
            console.log('新建文件')
          }
        },
        {
          label: '新建文件夹'
        },
        {
          type: 'separator'
        },
        {
          label: '复制',
          role: 'copy'
        },
        {
          label: '粘贴',
          role: 'paste'
        },
        {
          type: 'separator'
        },
        {
          label: '退出',
          role: 'quit'
        },
      ]
    },
    {label: '编辑'},
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          role: 'about',
          icon: './static/favicon.png',
          accelerator: 'ctrl + p'
        },
        {
          label: '更多',
          role: 'windowMenu',
          type: 'submenu'
        }
      ]
    },
  ]

  // 烧录菜单
  const menu = Menu.buildFromTemplate(menuTemp);
  // 绑定
  Menu.setApplicationMenu(menu)
}


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
    icon: './static/favicon.png',
    frame: true, //标签页，选项卡是否显示
    transparent: false, // 透明窗体
    // autoHideMenuBar: true, // 隐藏菜单
    webPreferences: {
      nodeIntegration: true, // 是否允许渲染页面使用 node 环境
      contextIsolation: false,
      // nodeIntegrationInWorker: true, // 渲染进程中使用 require 模块
      // enableRemoteModule: true, // 允许使用 remote 模块
      preload: path.join(__dirname, 'preload.js')
    }
  })

  createMenu()

  win.loadFile('./page/home/index.html')

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

// 新窗口创建时赋予主线程通信能力
app.on('browser-window-created', (_, win) => {
  // 对 @electron/remote 包的使用
  remote.enable(win.webContents)
})
