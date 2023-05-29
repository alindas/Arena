/**
 * 不适用。electron 主进程和渲染进行之间存在生殖隔离！我日
 */

const store = {
  WinId: null,
  DocumentPath: '',
  Store: null
}



function setWinId(val) {
  store.WinId = val
}

function getWinId() {
  return store.WinId
}

function setDocumentPath(val) {
  store.DocumentPath = val
}

function getDocumentPath() {
  return store.DocumentPath
}

function setStore(val) {
  console.log(val)
  store.Store = val
}

function getStore() {
  return store.Store
}

module.exports = {
  setWinId,
  getWinId,
  setDocumentPath,
  getDocumentPath,
  setStore,
  getStore
}
