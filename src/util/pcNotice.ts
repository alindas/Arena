/**
 *
 * @param title
 * @param options
 * tag: 通知标识，相同的标识，新通知直接覆盖旧通知
 *
 */
// 客户端通知推送
function PcNotice(title: string = '新通知', options?: NotificationOptions) {
  // 先检查浏览器是否支持该API
  if (!('Notification' in window)) {
    console.log('出错了', '该浏览器不支持Notification API, 请使用谷歌浏览器或Edge浏览器');
  } else {
    let permission = Notification.permission;
    // 判断用户是否允许接受通知
    if (permission === 'granted') {
      // 同意
      new Notification(title, options);
    } else if (permission === 'default') {
      // 继续向用户询问是否允许接受通知
      Notification.requestPermission().then((res) => {
        if (res === 'granted') {
          // 同意
          new Notification(title, options);
        }
      });
    } else {
      // 拒绝
      // console.log('用户拒绝了');
    }
  }
}
export default PcNotice
