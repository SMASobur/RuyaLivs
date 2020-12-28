<template>
  <v-row>
    <v-col cols="12" md="6">
      <CategoryForm :category="category" />
    </v-col>
  </v-row>
</template>

<script>
import CategoryForm from "@/components/admin/CategoryForm.vue";
export default {
  layout: "admin",
  components: {
    CategoryForm
  },
  data() {
    return {
      category: {
        name: "",
        description: ""
      }
    };
  }
};
</script>

<style>
</style>