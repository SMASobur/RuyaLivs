<template>
  <div>
    <v-card>
      <v-card-subtitle v-if="!isEditForm">Category creation form</v-card-subtitle>
      <v-card-subtitle v-else-if="isEditForm">Category edit form</v-card-subtitle>
      <v-card-text>
        <v-form ref="categoryForm">
          <v-text-field v-model="category.name" label="Category Tile"></v-text-field>
          <v-text-field v-model="category.description" label="Category Description"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="!isEditForm"
          color="primary"
          :loading="isLoading"
          tile
          small
          @click="addCategory"
        >Save Category</v-btn>
        <v-btn
          v-else-if="isEditForm"
          color="primary"
          :loading="isLoading"
          tile
          small
          @click="updateCategory"
        >Update Catrogory</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import addCategoryMutation from "@/gql/mutation/addCategory.gql";
import updateCategoryMutation from "@/gql/mutation/updateCategory.gql";
export default {
  layout: "admin",
  props: {
    category: {
      type: Object
    },
    isEditForm: {
      type: Boolean
    }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async addCategory() {
      this.isLoading = true;
      const response = await this.$apollo.mutate({
        mutation: addCategoryMutation,
        variables: { category: this.category }
      });

      this.isLoading = false;
      const data = response.data.addCategory;

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
      this.$refs.categoryForm.reset();
    },
    async updateCategory() {
      const updatedCategory = {
        name: this.category.name,
        description: this.category.description
      };
      console.log("updated category", updatedCategory);
      this.isLoading = true;

      const response = await this.$apollo.mutate({
        mutation: updateCategoryMutation,
        variables: { id: this.category.id, category: updatedCategory }
      });

      this.isLoading = false;
      const data = response.data.updateCategory;

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
      this.$refs.categoryForm.reset();
    }
  }
};
</script>

<style>
</style>