// 引入了 Node.js 內建模塊和外部的庫，包括 fs（檔案系統操作）、path（路徑操作）、express（伺服器框架）、fileURLToPath（URL 轉換為路徑的函數）等。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

// isTest 用來檢查是否處於測試模式。
// 此變數可以根據 process.env.VITEST 環境變數的值設置，用於區分測試和正式運行。
const isTest = process.env.VITEST

// createServer 用於創建伺服器應用程序
export async function createServer(

  // root: 項目的根目錄，預設為當前工作目錄。
  // isProd: 表示是否處於生產環境，預設根據 process.env.NODE_ENV 的值判斷是否為生產環境
  // hmrPort: HMR（熱模塊替換）的端口號。
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort,
) {
  // 函數內部，設置變數 :
  // __dirname（當前文件所在目錄的絕對路徑）、
  // resolve（用於解析相對路徑的函數）、
  // indexProd（生產模式下的索引 HTML 內容、
  // manifest（用於 SSR 的資源清單）。
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? JSON.parse(
        fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8'),
      )
    : {}

  // 創建 Express 應用程序 app 來托管伺服器
  const app = express()

  // @type {import('vite').ViteDevServer}
  // 如果不處於生產環境，它將創建 Vite 開發伺服器。
  // 使用 vite 的庫來創建開發伺服器，配置了相應的選項，包括中間件模式、HMR 相關設定等。最後將 Vite 的中間件添加到 Express 應用程序中。
  let vite
  if (!isProd) {

    // 以中間件模式創建 Vite 應用，並將 appType 配置為 'custom' 
    // 這將停用 Vite 自己的 HTML 服務邏輯 
    // 並讓父伺服器接管控制
    vite = await (
      await import('vite')
    ).createServer({
      base: '/test/',
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // 在測試過程中，編輯檔案的速度太快，有時甚至是 chokidar，而錯過更改事件，因此強制輪詢以確保一致性
          // chokidar : 是封裝 Node.js 監控檔案系統檔案變更功能的函式庫
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    })
    // 使用 vite 的 connect 實例作為中間件
    // 如果使用了自己的 express 路由（express.Router()），應該使用 router.use
    app.use(vite.middlewares)
  } else {
    //如果處於生產環境，它將使用壓縮中間件和 serve-static 中間件來提供已經編譯完成的靜態資源（位於 dist/client 目錄下）。
    app.use((await import('compression')).default())
    app.use(
      '/test/',
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      }),
    )
  }

  app.use('*', async (req, res) => {
    try {
      // 設置一個路由，用於處理所有的請求。
      const url = req.originalUrl.replace('/test/', '/')

      // 1.讀取index.html
      let template, render

      if (!isProd) {
        // 始終閱讀開發中的新模板
        template = fs.readFileSync(resolve('index.html'), 'utf-8')

        // 2. 套用 Vite HTML 轉換。將會注入 Vite HMR 客戶端， 
        //    同時也會從 Vite 外掛程式套用 HTML 轉換。
        //    例如：@vitejs/plugin-react 中的 global preambles
        template = await vite.transformIndexHtml(url, template)

        // 3. 載入伺服器入口。 vite.ssrLoadModule 將自動轉換
        //    你的 ESM 原始碼使之可以在 Node.js 中運作！無需打包
        //    並提供類似 HMR 的視情況隨時失效。
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render

      } else {
        template = indexProd
        // @ts-ignore
        render = (await import('./dist/server/entry-server.js')).render
      }

      // 4. 渲染應用程式的 HTML。這假設 entry-server.js 導出的 `render` 
      //    函數呼叫了適當的 SSR 框架 API。 
      //    例如 ReactDOMServer.renderToString()
      const [appHtml, preloadLinks] = await render(url, manifest)

      // 5. 注入渲染後的應用程式 HTML 到模板中。
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)

      // 6. 返回渲染后的 HTML。
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // 如果捕獲到了一個錯誤，讓 Vite 來修復該堆疊，這樣它就可以映射回實際原始碼中。
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(6173, () => {
      console.log('http://localhost:6173')
    }),
  )
}
