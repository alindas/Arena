const {BrowserWindow} =require('@electron/remote')

window.addEventListener('DOMContentLoaded', () => {
  console.log('load')
  const lowCodeBtn = document.getElementById('low-code-btn');
  lowCodeBtn.onclick = () => {
    console.log('click')

    // 渲染进程不能直接操作 BrowserWindow
    let win = new BrowserWindow({
      width: 1024,
      height: 800
    })

    // 需要借助 remote 模块，没有需要额外安装 @electron/remote
    // let win = new remote.BrowserWindow({
    //   width: 1024,
    //   height: 800
    // })

    win.loadFile('./lite/index.html');

    win.on('close', () => {
      win = null;
    })
  }
})
