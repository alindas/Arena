// 全局配置文件，设置页面路由、全局窗口
export default defineAppConfig({
  pages: [
    // 第一行表示页面首页
    'pages/user/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  // tabBar: {},
})
