# Vue 3 + Vite + SSR

在 Vite 中使用 Vue 3 進行開發。使用 Vue 3 `<script setup>` SFC，查看[腳本設定文件](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) 來學習更多的。

## 設置服務端啟動文件
- 功能是啟動一個 node 服務，然後根據請求，讀取html文件，處理資源後把註釋進行替換，最後把html發送給客戶端
### server.js
1. 引入 Node.js 內建模塊和外部的庫，包括 `fs`（檔案系統操作）、`path`（路徑操作）、`express`（伺服器框架）、`fileURLToPath`（URL 轉換為路徑的函數）等。

2. `isTest` 變數是用來檢查是否處於**測試模式**。這個變數可以根據 `process.env.VITEST` 環境變數的值設置，用於區分**測試**和**正式**運行。

3. `createServer` 函數是這個代碼的主要部分，它用於創建伺服器應用程序。它接受三個參數：
  * root: 項目的根目錄，預設為當前工作目錄。
  * isProd: 表示是否處於生產環境，預設根據 process.env.NODE_ENV 的值判斷是否為生產環境。
  * hmrPort: HMR（熱模塊替換）的端口號。

4. 在函數內部，它首先設置了一些變數，包括 __dirname（當前文件所在目錄的絕對路徑）、resolve（用於解析相對路徑的函數）、indexProd（生產模式下的索引 HTML 內容）和 manifest（用於 SSR 的資源清單）。

5. 接著，它創建一個 Express 應用程序 app 來托管伺服器。

6. 如果不處於生產環境，它將創建 Vite 開發伺服器。這部分代碼使用 vite 的庫來創建開發伺服器，配置了相應的選項，包括中間件模式、HMR 相關設定等。最後，它將 Vite 的中間件添加到 Express 應用程序中。

7. 如果處於生產環境，它將使用壓縮中間件和 serve-static 中間件來提供已經編譯完成的靜態資源（位於 dist/client 目錄下）。

8. 最後設置一個路由，用於處理所有的請求。在這個路由中，它讀取了 HTML 模板（根據是否處於生產環境讀取不同的模板），並使用 Vite 或自己的 SSR 渲染函數（render）來生成 SSR 的內容。然後，它將 SSR 內容插入模板中，並將最終的 HTML 返回給客戶端。

9. 最後，如果不處於測試模式，它使用 app.listen 啟動伺服器，並在控制台中輸出伺服器運行的地址。
