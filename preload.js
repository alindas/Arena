// const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  // console.log(process.platform) // 运行平台
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }


})


// contextBridge.exposeInMainWorld(
//   'main',
//   {
//     getGlobal: (type) => ipcRenderer.sendSync('global', type),
//     getCurrentWindow: () => ipcRenderer.sendSync('getCurrentWindow')
//   }
// )
