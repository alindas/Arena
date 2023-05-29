const fs = require('fs').promises

function readFile(path) {
  return fs.readFile(path, 'utf-8')
}

function writeFile(path, content) {
  return fs.writeFile(path, content, 'utf-8')
}

// 实际上集删除、创建于一体
function renameFile(path, newPath) {
  return fs.rename(path, newPath)
}

function deleteFile(path) {
  return fs.unlink(path)
}

module.exports = {
  readFile,
  writeFile,
  renameFile,
  deleteFile
}
