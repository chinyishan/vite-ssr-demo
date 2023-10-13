<template>
  <div>
    <h1>商品列表</h1>
    <div class="shop_list">
      <div class="shop_col" v-for="item in productData" :key="item.id">
        {{ item.id }}
        <router-link :to="`/product/defult/${item.id}`" class="pic">
          <img :src="item.thumbnail" alt="pd" />
        </router-link>
        <h3 class="title">{{ item.title }}</h3>
        <div class="description">
          <p>{{ item.description }}</p>
        </div>
        <div class="price">
          <strong>${{ item.price }}</strong>
        </div>
      </div>
      <!-- {{ productData }} -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onServerPrefetch } from 'vue';
// import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route);

const productData = ref([]);

async function fetchProductData() {
  const response = await fetch("https://dummyjson.com/products");
  if (!response.ok) {
    throw new Error("Failed to fetch product data");
  }
  // console.log(111);
  return await response.json();
}

onMounted(async () => {
  try {
    const data = await fetchProductData();
    productData.value = data.products;
    // console.log(222);
  } catch (error) {
    console.error('Failed to fetch product data:', error);
  }
});

// onServerPrefetch(async () => {
//   try {
//     const data = await fetchProductData();
//     productData.value = data.products;
//     console.log(222);
//   } catch (error) {
//     console.error('Failed to fetch product data:', error);
//   }
// });

// const productData = ref({})
// const data = async() => {
//   await axios.get("https://dummyjson.com/products").then((res) => {
//     productData.value = res.data.products
//     // console.log(res.data.products)
//   })
// }
// data()
// const productData = await fetchData()
// async function fetchData() {
//   try {
//     const response = await axios.get("https://dummyjson.com/products");
//     console.log(response);
//     return response.data.products;
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//     return null;
//   }
// }


// const productsData = reactive({});
// const { data } = await useAsyncData("useProducts", async () => {
//   const res = await axios.get("https://dummyjson.com/products");
//   return res.data;
// });
</script>

<style lang="scss" scoped>
.shop_list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-grow: 1;
  width: min(1200px, 94%);
  margin: 0 auto;

  .shop_col {
    display: flex;
    flex-direction: column;
    width: 24%;
    padding: 10px;
    margin: 1%;
    background-color: #f3f3f3;

    .pic {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: #fff;
      margin-bottom: 10px;

      img {
        object-fit: contain;
        object-position: center;
      }
    }
    .title {
      margin-bottom: 10px;
    }
    .description {
      margin-bottom: 10px;
      flex-grow: 1;
    }
    .price {
      text-align: right;
      color: rgb(255, 27, 80);
      font-size: 28px;
    }
  }
}
@media screen and (max-width: 769px) {
  .shop_list {
    .shop_col {
      width: 36%;
      margin: 1%;
    }
  }
}
</style>
