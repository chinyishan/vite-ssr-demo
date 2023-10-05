import { defineConfig } from 'vite'
import createConfig from './vite.config.js'

export default defineConfig((env) => {
  const config = createConfig(env)
  return Object.assign(config, {
    ssr: {
      noExternal: /./,
    },
    resolve: {
      // 必要設定，因為 vue.ssrUtils 僅在 cjs 模組上導出
      alias: [
        {
          find: '@vue/runtime-dom',
          replacement: '@vue/runtime-dom/dist/runtime-dom.cjs.js',
        },
        {
          find: '@vue/runtime-core',
          replacement: '@vue/runtime-core/dist/runtime-core.cjs.js',
        },
      ],
    },
    optimizeDeps: {
      exclude: ['@vitejs/test-example-external-component'],
    },
  })
})
