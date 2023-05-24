const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}

// 在 ready 事情被激活后才能创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 非 mac 平台所有窗口关闭后退出
app.addListener('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
