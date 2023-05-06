import CryptoJS from 'crypto-js'

//解密方法
function decrypt(word: string, key: string): string {
  return CryptoJS.AES.decrypt(word, key).toString(CryptoJS.enc.Utf8)
}

//加密方法
function encrypt(word: string, key: string): string {
  return CryptoJS.AES.encrypt(word, key).toString()
}

function encryptMd5(password: string): string {
  return CryptoJS.MD5(password).toString().slice(0, 20)
}

export { decrypt, encrypt, encryptMd5 }
