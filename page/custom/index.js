
window.addEventListener('DOMContentLoaded', () => {

  // 控制窗口的关闭逻辑
  window.onbeforeunload = () => {
    const markEle = document.querySelector('.close-mark');
    markEle.style.display = 'block';
    const okBtn = markEle.querySelector('.confirm');
    const cancelBtn = markEle.querySelector('.cancel');
    okBtn.onclick = () => {
      win.destroy();
    }
    cancelBtn.onclick = () => {
      markEle.style.display = 'none';
    }
    return false
  }

  const win = require('@electron/remote').getCurrentWindow();
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

})
