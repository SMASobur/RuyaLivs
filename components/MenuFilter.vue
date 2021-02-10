<template>
  <v-row>
    <v-col cols="12" md="6" sm="12" class="py-0">
      <v-text-field
        placeholder="e.g. Burger, Indian Parata..."
        dense
        rounded
        outlined
        prepend-inner-icon="mdi-magnify"
        @input="onMenuSearch"
        hide-details
      ></v-text-field>
    </v-col>
    <v-col
      cols="12"
      md="6"
      sm="12"
      :class="{ 'my-0 pt-0': !$vuetify.breakpoint.xs }"
    >
      <!-- <v-autocomplete
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
      ></v-autocomplete> -->
      <v-chip-group
        v-model="values"
        active-class="accent"
        @change="onMenuFilterChange"
      >
        <v-chip
          v-for="category in categoryNames"
          :key="category"
          :value="category"
        >
          {{ category }}
        </v-chip>
      </v-chip-group>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      values: "All",
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
      console.log("menu filter val", this.values);
      if (!val || val === "All") {
        this.values = "All"
        this.setMenuCategories([]);
      } else this.setMenuCategories(val);
      this.setPageNo(1);
      this.fetchMenus();
    },

    ...mapActions("menu", [
      "fetchCategories",
      "setMenuCategories",
      "setMenuSearchText",
      "fetchMenus",
      "setPageNo",
    ]),
  },
  computed: {
    ...mapGetters("menu", ["remoteCategories"]),
    categoryNames() {
      const categories = this.remoteCategories.map((category) => {
        return category.name;
      });
      categories.unshift("All");
      return categories;
    },
  },
};
</script>

<style>
</style>