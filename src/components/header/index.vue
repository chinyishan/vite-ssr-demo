<template>
  <div class="app-header">
    <header class="wrap_header">
      <nav class="content_nav">
        <ul class="nav_list">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/product">product</router-link></li>
          <li><router-link to="/product/defult/2">product222</router-link></li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.wrap_header {
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 5px 0px 10px 0px rgb(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
}
.content_nav {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  
  .nav_list {
    display: flex;

    li {
      padding: 15px 10px;
      position: relative;
      list-style: none;

      a {
        padding: 8px 8px;
        color: #848484;
        letter-spacing: 0.2em;
        white-space: nowrap;
        font-weight: 400;
        text-shadow: 10px 10px 10px 10px rgb(0, 0, 0);
        transition: 0.3s ease-out;
      }
    }
  }
}
</style>