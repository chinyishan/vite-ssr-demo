<template>
  <div>
    <h1>Home</h1>
    <div class="logo">
      <img src="../assets/logo.png" alt="logo" />
    </div>
    <button @click="state.count++">count is: {{ state.count }}</button>
    <Foo />
    <p class="virtual">msg from virtual module: {{ foo.msg }}</p>
    <p class="inter">this will be styled with a font-face</p>
    <p class="import-meta-url">{{ state.url }}</p>
    <p class="protocol">{{ state.protocol }}</p>
    <p class="nested-virtual">msg from nested virtual module: {{ virtualMsg }}</p>
    <Button>CommonButton</Button>
    <div>
      encrypted message:
      <p class="encrypted-msg"></p>
    </div>
  
    <ImportType />
  </div>
</template>

<script setup>
import foo from '@foo'
import { msg as virtualMsg } from '@virtual-file'
import { reactive, defineAsyncComponent } from 'vue'
import Button from '../components/button'
const ImportType = load('ImportType')
const Foo = defineAsyncComponent(() =>
  import('../components/Foo').then((mod) => mod.Foo),
)
function load(file) {
  return defineAsyncComponent(() => import(`../components/${file}.vue`))
}
const url = import.meta.env.SSR
  ? import.meta.url
  : document.querySelector('.import-meta-url')?.textContent
const protocol = url ? new URL(url).protocol : undefined

const state = reactive({
  count: 0,
  protocol,
  url,
})
</script>

<style lang="scss" scoped>
h1 {
  color: green;
}
.logo {
  width: min(200px, 50%);
  margin: 0 auto;
}
</style>
