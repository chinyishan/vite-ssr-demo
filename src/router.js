import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router'

// 從 ./pages 下的 vue 檔案自動產生路由
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.vue')

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase()
  return {
    path: name === '/home' ? '/' : name,
    component: pages[path], // () => import('./pages/*.vue')
  }
})

export function createRouter() {
  return _createRouter({
    // 為 server/client 使用適當的 history 記錄實現
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR
      ? createMemoryHistory('/test/')
      : createWebHistory('/test/'),
    routes,
  })
}
