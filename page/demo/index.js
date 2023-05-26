
window.addEventListener('DOMContentLoaded', () => {

  const win = require('@electron/remote').getCurrentWindow();
  win.webContents.openDevTools()
  const opsBtn = document.querySelectorAll('.custom-header-ops > span');

  opsBtn[0].onclick = () => {
    win.minimize()

  }

  opsBtn[1].onclick = () => {
    if (win.isMaximized()) { // 当前窗口是否已最大
      opsBtn[1].innerHTML = '最大化'
      win.restore() // 恢复到上一个窗口大小
    } else {
      opsBtn[1].innerHTML = '还原'
      win.maximize()
    }
  }

  opsBtn[2].onclick = () => {
    win.close()
  }

  document.querySelector('.custom-content').innerHTML = localStorage.getItem('newWinMsg')
  console.log(localStorage.getItem('newWinMsg'))
})
