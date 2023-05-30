const { app, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const remote = require("@electron/remote/main")
// const global = require('./global')
const Store = require('electron-store')

remote.initialize()

global.shareObject = {
  WinId: null,
  DocumentPath: '',
}
global.store = null

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
      label: '刷新',
      role: 'reload'
    },
    {
      label: '发送消息',
      click() {
        BrowserWindow.getFocusedWindow().webContents.send('mtp', '主进行主动发送的消息')
      }
    },
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

const rejectShortCut = (key, fn) => {
  if (!globalShortcut.register(key, fn)) {
    console.log(`快捷方式${key}注册失败`)
  }
}

const unRejectShortCut = (key) => {
  if (!globalShortcut.unregister(key)) {
    console.log(`快捷方式${key}解绑失败`)
  }
}

const createWindow = () => {
  let win = new BrowserWindow({
    // x: 100, // 偏移
    // y: 100,
    show: false, // 是否显示窗体
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

  global.shareObject.WinId = win.id;

  createMenu()

  win.webContents.openDevTools()
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

  // 监听下载
  win.webContents.session.on('will-download', (event, item, webContents) => {
    // 有手动设置 setSavePath，则不会弹出保存位置对话框
    const filePath = path.join(app.getPath('downloads'), item.getFilename());
    item.setSavePath(filePath);

    item.on('updated', (ev, state) => {
      if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('下载被暂停')
        } else {
          // 通过任务栏设置下载进度
          win.setProgressBar(item.getReceivedBytes() / item.getTotalBytes())
        }
      } else if (state === 'interrupted') {
        console.log('下载被中断')
      } else {
        console.log('下载中的其他状态')
      }
    })

    item.on('done', (ev, state) => {
      if (state === 'completed') {
        console.log('文件下载完成')
      } else if (state === 'cancelled') {
        console.log('下载被取消')
      } else {
        console.log('下载完成的其他状态')
      }
      win.setProgressBar(-1) // 隐藏进度
    })
  })

  win.on('close', () => {
    console.log('4. closed')
    win = null
  })
}

const createUrlWindow = (url) => {
  let win = new BrowserWindow({
    // x: 100, // 偏移
    // y: 100,
    show: false, // 是否显示窗体
    width: 1980,
    height: 1080,
    minWidth: 400,
    minHeight: 300,
    resizable: true,
    title: 'other', // 权重比 html 里的低
    icon: './static/favicon.png',
    frame: true, //标签页，选项卡是否显示
  })
  createMenu()
  // win.webContents.openDevTools()
  win.loadURL(url)
  win.on('ready-to-show', () => {
    win.show();
  })

  win.on('close', () => {
    console.log('4. closed')
    win = null
  })
}

// 在 ready 事情被激活后才能创建窗口
app.whenReady().then(() => {
  console.log('response here')
  createWindow();
  // createUrlWindow('http://localhost:8000/')

})

app.on('ready', () => {
  console.log('1. ready')
  rejectShortCut('ctrl + q', app.quit)
  // 数据初始化
  global.shareObject.DocumentPath = app.getPath('documents')  // 获取本机用户文档储存位置
  global.store = new Store() // 数据保存到 app.getPath('userData') 的 config.json 文件
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
  // unRejectShortCut('ctrl + q')
  globalShortcut.unregisterAll()
})

app.on('quit', () => {
  console.log('8. quit')
})

// 新窗口创建时赋予主线程通信能力
app.on('browser-window-created', (_, win) => {
  // 对 @electron/remote 包的使用
  remote.enable(win.webContents)
})

ipcMain.on('msg1', (ev, data) => {
  console.log(data)
  ev.sender.send('msg1Re', '来自于主进程回给Home的异步消息')
})

ipcMain.on('msg2', (ev, data) => {
  console.log(data)
  ev.returnValue = '来自于主进程回给Home的同步消息'
})

ipcMain.on('newWin', (ev, data) => {
  let win = new BrowserWindow({
    // x: 100, // 偏移
    // y: 100,
    // show: false, // 是否显示窗体
    parent: BrowserWindow.fromId(global.shareObject.WinId),
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    resizable: true,
    frame: true, //标签页，选项卡是否显示
    transparent: false, // 透明窗体
    webPreferences: {
      nodeIntegration: true, // 是否允许渲染页面使用 node 环境
      contextIsolation: false,
    }
  })
  win.loadFile('./page/demo/index.html')

  win.on('ready-to-show', () => {
    win.show();
  })

  win.on('close', () => {
    console.log('4. closed')
    win = null
  })
})

ipcMain.on('active', (ev, data) => {
  let win = BrowserWindow.fromId(global.shareObject.WinId)
  win.minimize()
  setTimeout(() => {
    console.log('showInactive')
    // win.showInactive() // v17.1.0 不起作用
    win.focus()
  }, 1000)
})

ipcMain.on('flash', (ev, data) => {
  let win = BrowserWindow.fromId(global.shareObject.WinId)
  win.minimize()
  setTimeout(() => {
    console.log('flashFrame')
    win.flashFrame(true)
  }, 1000)
})


