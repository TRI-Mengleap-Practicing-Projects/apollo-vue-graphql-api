<template>
  <div id="app">
    <ProductForm />
    <ProductList />
  </div>
</template>

<script>
import ProductForm from './components/ProductForm.vue';
import ProductList from './components/ProductList.vue';
export default {
  components: {
    ProductForm,
    ProductList
  },
};
</script>

<style>
/* Add your styles here */
</style>