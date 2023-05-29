const {
  Menu,
  BrowserWindow,
  getCurrentWindow,
  dialog,
  getGlobal
} = require('@electron/remote')
const { ipcRenderer, shell} = require('electron')
const path = require('path')
const fs = require('fs').promises
// const global = require('../../global')



window.addEventListener('DOMContentLoaded', () => {

  const parentWin = getCurrentWindow()
  // parentWin.webContents.openDevTools()

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
  document.getElementById('low-code-btn').onclick = () => {

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
  document.getElementById('custom-btn').onclick = () => {

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
  document.getElementById('async-ipc-btn').onclick = () => {

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

  document.getElementById('notify').onclick = () => {
    // console.log( path.join(__dirname, '../../'))
    const notification = new window.Notification('electron 通知', {
      // 通过 tag 设置不同类型的通知，相同 tag，相同 title，不同 body 同时成立才能满足通知的覆盖
      tag: 'call',
      body: `狠赚笔: ${new Date().valueOf()}`,
      icon: '../../static/favicon.png'
    })
    notification.onclick = () => {
      console.log('快跑')
    }
  }

  document.getElementById('add-file').onclick = () => {
    // console.log(process.cwd()) // 获取项目根路径
    fs.writeFile(path.join(process.cwd(), 'static/test.txt'), 'test file', 'utf-8')
    .then(() => {
      console.log('static/test.txt 文件创建成功')
    })
    .catch(err => {
      console.log('文件创建失败')
      console.error(err)
    })

  }

  document.getElementById('del-file').onclick = () => {
    fs.unlink(path.join(process.cwd(), 'static/test.txt'))
    .then(() => {
      console.log('static/test.txt 文件删除成功')
    })
    .catch(err => {
      console.log('文件删除失败')
      console.error(err)
    })

  }

  document.getElementById('update-file').onclick = () => {
    let filePath = path.join(process.cwd(), 'static/test.txt')
    fs.readFile(filePath)
    .then(value => {
      console.log(value)
      fs.writeFile(filePath, value+'\n新增111', 'utf-8')
      .then(() => {
        console.log('文件更新成功')
      })
      .catch((err) => {
        throw new Error(err)
      })
    })
    .catch((err) => {
      console.log('文件更新失败')
      console.error(err)
    })

  }

  document.getElementById('search-file').onclick = () => {
    fs.readdir(path.join(process.cwd(), 'static'))
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log('文件读取失败')
      console.error(err)
    })

  }

  document.getElementById('electron-store').onclick = () => {
    const store = getGlobal('store')
    store.set('animal', 'monkey')
    console.log(store.get('animal'))
  }

  document.getElementById('demo').onclick = () => {
    console.log('demo')
  }

})

