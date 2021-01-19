<template>
  <v-hover v-slot="{ hover }">
    <v-card @click="onDetailsClicked" hover class="mx-auto" height="100%" tile>
      <v-img
        height="150"
        contain
        class="green lighten-4"
        :src="thumbnail[0]"
        :lazy-src="thumbnail[0]"
      >
        <v-expand-transition>
          <div
            v-if="hover"
            class="d-flex transition-fast-in-fast-out primary darken-4 v-card--reveal"
            style="height: 100%"
          >
            <v-btn small rounded outlined dark> View Details </v-btn>
          </div>
        </v-expand-transition>
      </v-img>
      <p class="text-truncate mx-4 mt-2 mb-0 font-weight-bold">{{ title }}</p>
      <v-card-subtitle class="text-truncate mt-0 pt-0">
        {{ category }}</v-card-subtitle
      >

      <v-card-text>
        <div class="d-flex">
          <p
            v-if="hasDiscount"
            class="error--text my-0 text-decoration-line-through text-truncate"
          >
            SEK {{ originalPrice }}
          </p>
          <p
            :class="{ 'mx-2': hasDiscount }"
            class="success--text my-0 font-weight-bold text-truncate"
          >
            SEK {{ price }}
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
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
      type: Array,
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
    originalPrice: {
      type: String | Number,
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
  computed: {
    hasDiscount() {
      return this.originalPrice != this.price;
    },
  },
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>