// 創建 Vue Router 實例和配置路由的歷史模式。
import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
// import { createRouter, createWebHistory } from "vue-router";
// import routes from '~pages'

// 使用 Vite 的 import.meta.glob 函數動態導入 ./pages 下的所有 .vue 自動產生路由
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.vue')
console.log(pages);

// 自動尋找指定目錄下的所有文件，其中 keys 是文件的路徑，value 是對應的模塊。
// 將動態導入的文件路徑轉換路由配置。每個文件路徑都被轉換成一個路由對象，其中包括路徑 (path) 和對應的組件 (component)。
// 路徑是根據文件路徑生成的，例如，./pages/Home.vue 生成的路徑是 /home。
const routes = Object.keys(pages).map((path) => {
  console.log(path);
  const name = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase()
  return {
    path: name === '/home' ? '/' : name,
    component: pages[path], // () => import('./pages/*.vue')
  }
})

// 在此判斷是否處於伺服器端渲染（SSR）模式，
// 選擇使用 createMemoryHistory 或 createWebHistory 來創建路由的歷史記錄。
// /test/ 是基本路徑
export function createRouter() {
  return _createRouter({
    // 為 server/client 使用適當的 history 記錄實現
    // import.meta.env.SSR 由 Vite 注入。
    history: import.meta.env.SSR ? createMemoryHistory('/test/') : createWebHistory('/test/'),
    routes,
  })
}

// export const routes = setupLayouts(generatedRoutes)
// console.log(routes)
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })
// export default router