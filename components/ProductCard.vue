<template>
  <v-card hover class="mx-auto" height="100%" tile>
    <v-img
      v-if="thumbnail"
      @click="onDetailsClicked"
      max-height="200"
      contain
      class="green lighten-4"
      :src="thumbnail"
      :lazy-src="thumbnail"
    ></v-img>
    <v-card-title
      v-if="title"
      @click="onDetailsClicked"
      class="text-truncate"
      >{{ title }}</v-card-title
    >
    <v-card-text @click="onDetailsClicked" class="text--primary">
      <div class="subtitle-1">
        <v-chip small color="primary">{{ category }}</v-chip>
      </div>
      <div class="subtitle-1 my-1">Price {{ price }}</div>
      <div class="text-truncate">{{ description }}</div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
      <v-btn
        @click="onDetailsClicked"
        color="primary"
        small
        outlined
        >Add to Cart</v-btn
      >
      <!-- <v-btn
        v-if="isAddedToCart"
        @click="
          removeItemFromCart(id);
          toggleItemAddedToCart(id);
        "
        color="accent"
        small
        outlined
        >Remove
      </v-btn> -->

      <!-- <v-btn color="accent" small outlined @click="onDetailsClicked"
        >Details</v-btn
      > -->
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Food",
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isAddedToCart: {
      type: Boolean,
      default: false,
    },
    sizeAndPrice: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    console.log("title", this.title);
  },
  methods: {
    addItemToCart(productId) {
      this.addItemToCart(productId);
    },
    removeItemFromCart(productId) {
      this.removeItemFromCart(productId);
    },
    toggleItemAddedToCart(productId) {
      this.toggleItemAddedToCart(productId);
    },
    onDetailsClicked() {
      this.$emit("onDetailsClicked");
      // this.setSelectedItem(this.id);
    },
    ...mapActions("menu", [
      "addItemToCart",
      "toggleItemAddedToCart",
      "removeItemFromCart",
    ]),
  },
};
</script>

<style scoped>
.fix {
  overflow-wrap: anywhere;
  word-wrap: break-word;
  word-break: normal;
  hyphens: auto;
}
</style>