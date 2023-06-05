class notice {

  static create(type) {
    // todo 优化项
    // 将 msg 通知项外面再包裹一个容器，用于多个通知之前不会被覆盖
    console.log(type)
    let classList = type.split(' ')
    let noticeBox = document.querySelector('.notice-box')
    if (noticeBox === null) {
      noticeBox = document.createElement('div')
      noticeBox.classList.add('notice-box')
    }

    let ctn = document.createElement('div')
    ctn.classList.add(...classList)
    ctn.innerHTML = this.msg
    noticeBox.append(ctn)
    document.body.append(noticeBox)
    setTimeout(() => {
      noticeBox.removeChild(ctn)
      if (noticeBox.children.length === 0) {
        document.body.removeChild(noticeBox)
      }
    }, 1500)
  }

  static error(msg) {
    this.msg = msg
    this.create('notice error-notice')
  }

  static info(msg) {
    this.msg = msg
    this.create('notice info-notice')
  }

  static success(msg) {
    this.msg = msg
    this.create('notice success-notice')
  }
}

module.exports = notice
