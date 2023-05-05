import CryptoJS from 'crypto-js'
// const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF') //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') //十六位十六进制数作为密钥偏移量

//解密方法
function decrypt(word: string, key: string): string {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(srcs, key)
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

//加密方法
function encrypt(word: string, key: string): string {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key)
  return encrypted.ciphertext.toString().toUpperCase()
}

function encryptMd5(password: string): string {
  return CryptoJS.MD5(password).toString().slice(0, 20)
}

export { decrypt, encrypt, encryptMd5 }
