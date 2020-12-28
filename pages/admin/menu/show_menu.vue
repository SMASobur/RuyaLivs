<template>
  <v-row>
    <v-col>
      <client-only>
        <v-data-table
          :headers="headers"
          :items="menus"
          :items-per-page="menuPayload.limit"
          :server-items-length="totalProductCount"
          class="elevation-1"
          @pagination="onPagination"
          :loading="loadigMenu"
          loading-text="Loading menu..."
          disable-sort
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>All Menu Items</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </client-only>
    </v-col>
    <v-dialog v-model="editDialog" max-width="700px">
      <MenuForm :isEditForm="true" :product="product" @onSaveEditedItem="onSaveEditedItem" />
    </v-dialog>
  </v-row>
</template>

<script>
import fetchMenuQuery from "@/gql/query/getProducts.gql";
import MenuForm from "@/components/admin/MenuForm.vue";
import deleteProductMutation from "@/gql/mutation/deleteProduct.gql";
export default {
  layout: "admin",
  async fetch() {
    this.fetchMenu();
  },
  components: {
    MenuForm
  },

  data() {
    return {
      menuPayload: {
        pageNo: 1,
        limit: 12,
        categories: [],
        searchText: ""
      },
      headers: [
        { text: "Menu Title", value: "productName"},
        { text: "Price", value: "price" },
        { text: "Offer (%)", value: "offer" },
        { text: "Net Price", value: "netPrice" },
        { text: "Category", value: "category.name" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      menus: [],
      totalProductCount: 0,
      editDialog: false,
      product: null,
      editedIndex: -1,
      deleteIndex: -1,
      loadigMenu:false,
    };
  },
  methods: {
    async fetchMenu() {
      try {

        this.loadigMenu = true;
        const response = await this.$apollo.query({
          query: fetchMenuQuery,
          variables: { productsInput: this.menuPayload },
          fetchPolicy:'network-only'
        });
        const products = response.data.getProducts.products;
        const totalProductCount = response.data.getProducts.count;
        console.log("products", products);
        this.menus = products;
        console.log("totalProductCount", totalProductCount);
        this.totalProductCount = totalProductCount;
        this.loadigMenu = false;
      } catch (error) {
        this.loadigMenu = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error"
        });
      }
    },
    editItem(item) {
      this.product = JSON.parse(JSON.stringify(item));
      this.editedIndex = this.menus.indexOf(item);
      this.editDialog = true;
    },
    deleteItem(item) {
      console.log("delete item id", item.id);
      this.deleteIndex = this.menus.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteProductAPICall(item.id);
    },
    onPagination(val) {
      console.log("onPagination", val);
      this.menuPayload.pageNo = val.page;
      this.fetchMenu();
    },
    async deleteProductAPICall(id) {
      const response = await this.$apollo.mutate({
        mutation: deleteProductMutation,
        variables: { id: id }
      });
      const data = response.data.deleteProduct;
      if (data.success) {
        this.$notifier.showMessage({
          content: data.message,
          color: "success"
        });
        this.menus.splice(this.deleteIndex, 1);
      } else {
        this.$notifier.showMessage({
          content: data.message,
          color: "error"
        });
      }
    },
    onSaveEditedItem(item) {
      console.log("product edite", this.product);
      Object.assign(this.menus[this.editedIndex], this.product);
      this.editDialog = false;
    }
  }
};
</script>

<style>
</style>