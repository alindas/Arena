import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import path from 'path' //path模块是node.js内置的功能，但是node.js本身并不支持ts,解决方案：安装@types/node
import copy from 'rollup-plugin-copy' // 开发环境下复制文件到指定目录，模拟生产环境下的文件读取

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vue(), copy(
    {
      targets: [
        { src: 'src/sw.js', dest: 'public' },
      ]
    }
  )],
  resolve: {
    //路径别名
    alias: {
      '~': path.resolve(__dirname, './'), // 根路径
      '@': path.resolve(__dirname, 'src') // src 路径
    }
  },
})
