// 伺服器端渲染 (Server-Side Rendering, SSR)
import { basename } from 'node:path'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

//匯出 render 函數，渲染 Vue.js 應用程序，並返回渲染結果和預先載入連結。
export async function render(url, manifest) {
  const { app, router } = createApp()

  // 在渲染之前將 router 設定為所需的 URL，isReady() 確保 router 已準備好。
  await router.push(url)
  await router.isReady()

  // 傳遞 SSR 上下文對象，該對象可透過 useSSRContext() 取得 @vitejs/plugin-vue
  // 將程式碼注入到元件的 setup() 中，該元件在 ctx.modules 上註冊自身。
  // 渲染後，ctx.modules 將包含在此渲染呼叫期間實例化的所有元件。
  // 使用 renderToString 函数，將 Vue 應用程式渲染為 HTML，並將渲染結果儲存在 html 變數中。
  const ctx = {}
  const html = await renderToString(app, ctx)

  // Vite 產生的 SSR 清單包含模組 -> 區塊/資產映射(chunk/asset mapping)，
  // 使用 renderPreloadLinks 來確定需要預先請求，來載入哪些檔案。
  // 載入的會有 JavaScript、CSS 和其他資源等。
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest)
  return [html, preloadLinks]
}

// renderPreloadLinks 函數用於預先載入鏈接，在渲染期間實例化的所有模組，尋找它們的相關文件，然後產生適當的預先載入連結。
// 這有助於提高客戶端效能，因為它在客戶端加載所需的資源之前提前加載它們。
function renderPreloadLinks(modules, manifest) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          const filename = basename(file)
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile)
              seen.add(depFile)
            }
          }
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`
  } else {
    // TODO
    return ''
  }
}
