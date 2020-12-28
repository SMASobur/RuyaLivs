<template>
  <v-row>
    <v-col>
      <client-only>
        <v-data-table
          :headers="headers"
          :items="categories"
          class="elevation-1"
          :loading="loadingCategory"
          loading-text="Loading category..."
          disable-sort

        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>All Categories</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </client-only>
    </v-col>
    <v-dialog v-model="editDialog" max-width="500px">
      <CategoryForm :isEditForm="true" :category="category" />
    </v-dialog>
  </v-row>
</template>

<script>
import getAllCategoriesQuery from "@/gql/query/getAllCategories.gql";
import deleteCategoryMutation from "@/gql/mutation/deleteCategory.gql";
import CategoryForm from "@/components/admin/CategoryForm.vue";
export default {
  layout: "admin",
  components: {
    CategoryForm
  },
  async fetch() {
   await this.fetchCategories();
  },
  data() {
    return {
      headers: [
        { text: "Title", value: "name" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      categories: [],
      category: null,
      editDialog: false,
      loadingCategory: false
    };
  },
  methods: {
    async fetchCategories() {
      try {
        this.loadingCategory = true;
        const response = await this.$apollo.query({
          query: getAllCategoriesQuery,
          cachePolicy: "no-cache",
          fetchPolicy: "network-only"
        });
        const categories = response.data.getCategories;
        this.categories = categories;
        this.loadingCategory = false;
      } catch (error) {
        this.loadingCategory = false;
        this.$notifier({
          content: error.message,
          color: "error"
        });
      }
    },
    editItem(item) {
      this.category = JSON.parse(JSON.stringify(item));
      this.editDialog = true;
    },
    deleteItem(item) {
      console.log("delete item id", item.id);
      const index = this.categories.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.categories.splice(index, 1) &&
        this.deleteCategoryAPICall(item.id);
    },
    async deleteCategoryAPICall(id) {
      const response = await this.$apollo.mutate({
        mutation: deleteCategoryMutation,
        variables: { id: id }
      });
      const data = response.data.deleteCategory;
      if (data.success) {
        this.$notifier.showMessage({
          content: data.message,
          color: "success"
        });
      } else {
        this.$notifier.showMessage({
          content: data.message,
          color: "error"
        });
      }
    }
  }
};
</script>

<style>
</style>