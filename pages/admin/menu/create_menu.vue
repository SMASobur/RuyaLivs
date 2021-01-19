<template>
  <div>
    <MenuForm :product="product" />
  </div>
</template>

<script>
import MenuForm from "@/components/admin/MenuForm.vue";
export default {
  layout: "admin",
  components: {
    MenuForm,
  },
  async fetch() {
    // this.fetchCategories();
  },
  data() {
    return {
      product: {
        category: "",
        productName: "",
        thumbnail: [],
        description: "",
        price: 0,
        offer: 0,
        isAvailable: false,
        hasMultipleSize: false,
        sizeAndPrice: [],
      },
    };
  },
};
</script>

<style>
</style>