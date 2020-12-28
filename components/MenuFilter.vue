<template>
  <v-row>
    <v-col cols="12" md="6" sm="12" class="my-0 py-0">
      <v-text-field
        placeholder="e.g. Burger, Indian Parata..."
        dense
        rounded
        outlined
        prepend-inner-icon="mdi-magnify"
        @input="onMenuSearch"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="6" sm="12" class="my-0 py-0">
      <v-autocomplete
        v-model="values"
        :items="categoryNames"
        outlined
        placeholder="Filter food by category"
        append-icon="mdi-arrow-up-circle-outline"
        dense
        prepend-inner-icon="mdi-filter-outline"
        multiple
        rounded
        @change="onMenuFilterChange"
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      values: []
    };
  },
  async fetch() {
    await this.fetchCategories();
  },
  methods: {
    onMenuSearch(val) {
      console.log("menu search val", val);
      this.setMenuSearchText(val);
      this.setPageNo(1);
      this.fetchMenus();
    },
    onMenuFilterChange(val) {
      console.log("menu filter val", val);
      this.setMenuCategories(val);
      this.setPageNo(1);
      this.fetchMenus();
    },

    ...mapActions("menu", [
      "fetchCategories",
      "setMenuCategories",
      "setMenuSearchText",
      "fetchMenus",
      "setPageNo"
    ])
  },
  computed: {
    ...mapGetters("menu", ["remoteCategories"]),
    categoryNames() {
      return this.remoteCategories.map(category => {
        return category.name;
      });
    }
  }
};
</script>

<style>
</style>