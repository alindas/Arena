const { app, Menu, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const Store = require('electron-store')

Store.initRenderer() // 在渲染进程中使用需要初始化

global.shareObject = {
  WinId: null,
  DocumentPath: '',
}

const rejectShortCut = (key, fn) => {
  if (!globalShortcut.register(key, fn)) {
    console.log(`快捷方式${key}注册失败`)
  }
}

const createBaseMenu = () => {
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
    {
      label: '刷新',
      role: 'reload'
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          role: 'about',
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

const createWindow = (config={}) => {
  let win = new BrowserWindow({
    show: false, // 是否显示窗体
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    resizable: true, // 为 false 时，通过 setSize 改变尺寸，只能放大不能缩小
    title: 'win title', // 权重比 html 里的低
    frame: true, //标签页，选项卡是否显示
    transparent: false, // 透明窗体
    webPreferences: {
      nodeIntegration: true, // 是否允许渲染页面使用 node 环境
      contextIsolation: false,
      // 打包后影响应用运行！！！暂且找不到原因
      // preload: path.join(__dirname, 'preload.js')
      // preload: path.resolve('./preload.js')
    },
    ...config
  })

  global.shareObject.WinId = win.id

  win.webContents.openDevTools({
    mode: 'undocked' // 脱离窗口
  })

  win.loadFile('./page/compatible/index.html')
  // win.loadFile(path.resolve('./page/compatible/index.html'))
  win.on('ready-to-show', () => {
    win.show();
  })

  // // 监听下载
  // win.webContents.session.on('will-download', (event, item, webContents) => {
  //   // 有手动设置 setSavePath，则不会弹出保存位置对话框
  //   const filePath = path.join(app.getPath('downloads'), item.getFilename());
  //   item.setSavePath(filePath);

  //   item.on('updated', (ev, state) => {
  //     if (state === 'progressing') {
  //       if (item.isPaused()) {
  //         console.log('下载被暂停')
  //       } else {
  //         // 通过任务栏设置下载进度
  //         win.setProgressBar(item.getReceivedBytes() / item.getTotalBytes())
  //       }
  //     } else if (state === 'interrupted') {
  //       console.log('下载被中断')
  //     } else {
  //       console.log('下载中的其他状态')
  //     }
  //   })

  //   item.on('done', (ev, state) => {
  //     if (state === 'completed') {
  //       console.log('文件下载完成')
  //     } else if (state === 'cancelled') {
  //       console.log('下载被取消')
  //     } else {
  //       console.log('下载完成的其他状态')
  //     }
  //     win.setProgressBar(-1) // 隐藏进度
  //   })
  // })

  win.on('close', () => {
    win = null
  })
}

app.whenReady().then(() => {
  createBaseMenu()
  createWindow()
  rejectShortCut('ctrl + q', app.quit)
  global.shareObject.DocumentPath = app.getPath('documents')  // 获取本机用户文档储存位置

})

app.on('before-quit', () => {
  ipcMain.removeAllListeners() // 摧毁所有 ipc 监视器
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.commandLine.appendSwitch('ignore-certificate-errors')

// preload 中暴露的 main 对象及api
ipcMain.on('restoreWin', (ev, data) => {
  let win = BrowserWindow.getFocusedWindow()
  if (win.maximizable) {
    win.restore()
  }
  ev.returnValue = ''
})

ipcMain.on('setSize', (ev, data) => {
  BrowserWindow.getFocusedWindow().setSize(+data[0], +data[1])
  ev.returnValue = ''
})

ipcMain.on('setZoomFactor', (ev, data) => {
  BrowserWindow.getFocusedWindow().webContents.setZoomFactor(data)
  ev.returnValue = ''
})

