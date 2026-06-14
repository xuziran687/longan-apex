import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 1. 引入 path 模块

export default defineConfig({
  plugins: [vue()],
  define: {
    global: 'globalThis'
  },
  resolve: {
    // 2. 配置别名
    alias: {
      '@': resolve(__dirname, 'src') 
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/ws': {
        target: 'http://localhost:8080',
        ws: true
      }
    }
  }
})