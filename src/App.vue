<template>
  <div>
    <Header />
    <router-view v-slot="{ Component }">
      <Suspense>
        <div>
          <component :is="Component" />
        </div>
      </Suspense>
    </router-view>
  </div>
</template>

<script setup>
import Header from './components/header/index.vue'

</script>

<style>
* {
  margin: 0;
  padding: 0;
}
h1 {
  text-align: center;
  padding: 20px;
}
img {
  display: block;
  margin: auto;
  width: 100%;
  height: 100%;
}
a {
  display: block;
}

@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src:
    url('./assets/fonts/Inter-Italic.woff2#iefix') format('woff2'),
    url('./assets/fonts/Inter-Italic.woff') format('woff');
}
.inter {
  font-family: 'Inter';
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
