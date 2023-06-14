const config = {
  projectName: 'TaroApp',
  date: '2023-6-13',
  designWidth: 750,
   // 设计稿尺寸换算规则
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  // 全局变量设置
  defineConstants: {
  },
  // 文件 copy 配置
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  // 小程序端专用配置
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: true, // 1px 是否需要被转换
          unitPrecision: 5, // REM 单位允许的小数位
          propList: ['*'], // 允许转换的属性
          selectorBlackList: [],
          replace: true, // 直接替换而不是追加一条进行覆盖
          mediaQuery: false, // 允许媒体查询里的 px 单位转换
          minPixelValue: 0 // 设置一个可被转换的最小 px 值
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          onePxTransform: true,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
          baseFontSize: 20, // H5 字体尺寸大小基准值
          maxRootSize: 40, // H5 根节点 font-size 的最大值
          minRootSize: 20 // H5 根节点 font-size 的最小值
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    esnextModules: ['taro-ui'] // 引用 `node_modules` 的模块，默认不会编译，所以需要额外给 H5 配置 `esnextModules`
  },
  rn: {
    appName: 'taroDemo',
    postcss: {
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
