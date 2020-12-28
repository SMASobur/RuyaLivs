<template>
  <div>
    <v-bottom-sheet v-model="sheet" inset scrollable persistent>
      <v-card>
        <!-- <p>{{ selectedSize }}</p> -->
        <div class="d-flex justify-space-between">
          <v-btn class="mt-4" text color="red" @click="sheet = !sheet"
            >close</v-btn
          >
        </div>
        <v-card-text>
          <v-sheet scrollable>
            <v-row>
              <v-col class="d-flex flex-column align-center">
                <v-img :src="item.thumbnail" contain max-width="200px"></v-img>

                <div v-if="item.hasMultipleSize">
                  <v-btn
                    v-if="!selectedSize.isAddedToCart"
                    color="primary"
                    tile
                    dark
                    @click="onClickAddToCart"
                    >Add to Cart</v-btn
                  >
                </div>
                <div v-else>
                  <v-btn
                    v-if="!item.isAddedToCart"
                    color="primary"
                    tile
                    dark
                    @click="onClickAddToCart"
                    >Add to Cart</v-btn
                  >
                </div>

                <div
                  v-if="
                    item.isAddedToCart ||
                    (selectedSize && selectedSize.isAddedToCart)
                  "
                  class="d-flex align-center"
                >
                  <v-btn-toggle dense color="accent">
                    <v-btn
                      tile
                      outlined
                      small
                      @click="onClickDecrementQuantity"
                    >
                      <v-icon color="accent">mdi-minus</v-icon>
                    </v-btn>
                    <v-btn tile outlined small class="body-2">{{
                      cartItemByIdAndSize
                    }}</v-btn>
                    <v-btn
                      tile
                      outlined
                      small
                      @click="onClickIncrementQuantity"
                    >
                      <v-icon color="accent">mdi-plus</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn
                    @click="onClickRemoveItemFromCart"
                    icon
                    small
                    text
                    rounded
                  >
                    <v-icon color="warning">mdi-delete-outline</v-icon>
                  </v-btn>
                </div>
              </v-col>
              <v-col>
                <v-list-item two-line v-if="selectedSize">
                  <v-list-item-content>
                    <v-list-item-subtitle>Size</v-list-item-subtitle>
                    <v-list-item-title>
                      <v-select
                        v-model="selectedSize"
                        :items="item.sizeAndPrice"
                        item-text="size"
                        item-value="price"
                        return-object
                      ></v-select
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Title</v-list-item-subtitle>
                    <v-list-item-title>{{
                      item.productName
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Category</v-list-item-subtitle>
                    <v-list-item-title>{{
                      item.category.name
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Price</v-list-item-subtitle>
                    <v-list-item-title v-if="selectedSize">
                      <b>{{ selectedSize.netPrice }}</b>
                      <s v-if="selectedSize.price != selectedSize.netPrice">{{
                        selectedSize.price
                      }}</s>
                    </v-list-item-title>
                    <v-list-item-title v-else>
                      <b>{{ item.netPrice }}</b>
                      <s v-if="item.price != item.netPrice">{{ item.price }}</s>
                    </v-list-item-title>
                  </v-list-item-content>
                  <div v-if="selectedSize">
                    <v-list-item-action v-if="selectedSize.offer != 0">
                      <v-chip color="green" text-color="white">
                        {{ selectedSize.offer }} % off
                        <v-icon right>mdi-star</v-icon>
                      </v-chip>
                    </v-list-item-action>
                  </div>
                  <v-list-item-action v-else-if="item.offer != 0">
                    <v-chip color="green" text-color="white">
                      {{ item.offer }} % off
                      <v-icon right>mdi-star</v-icon>
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Description</v-list-item-subtitle>
                    <v-list-item-title>{{
                      item.description
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    value: Boolean,
  },
  created() {
    this.selectedSize = this.item.sizeAndPrice.find(
      (it) => it.isDefault === true
    );
  },
  data() {
    return {
      selectedSize: null,
    };
  },
  mounted() {},
  methods: {
    ...mapActions("menu", [
      "addItemToCart",
      "toggleItemAddedToCart",
      "incrementCartQuantity",
      "decrementCartQuantity",
      "toggleItemAddedToCart",
      "removeItemFromCart",
    ]),
    onClickAddToCart() {
      if (this.selectedSize) {
        const payload = {
          productId: this.item.id,
          size: this.selectedSize.size,
        };
        this.addItemToCart(payload);
        this.toggleItemAddedToCart(payload);
      } else {
        const payload = {
          productId: this.item.id,
          size: "default",
        };
        this.addItemToCart(payload);
        this.toggleItemAddedToCart(payload);
      }
    },
    onClickIncrementQuantity() {
      if (this.selectedSize) {
        const payload = {
          cartItemId: this.item.id,
          size: this.selectedSize.size,
        };
        console.log("this.selectedSize.size", payload);
        this.incrementCartQuantity(payload);
      } else {
        const payload = {
          cartItemId: this.item.id,
          size: "default",
        };
        this.incrementCartQuantity(payload);
      }
    },
    onClickDecrementQuantity() {
      if (this.selectedSize) {
        const payload = {
          cartItemId: this.item.id,
          size: this.selectedSize.size,
        };
        console.log("this.selectedSize.size", payload);
        this.decrementCartQuantity(payload);
      } else {
        const payload = {
          cartItemId: this.item.id,
          size: "default",
        };
        this.decrementCartQuantity(payload);
      }
    },
    onClickRemoveItemFromCart() {
      if (this.selectedSize) {
        const payload = {
          productId: this.item.id,
          size: this.selectedSize.size,
        };
        console.log("this.selectedSize.size", payload);
        this.removeItemFromCart(payload);
        this.toggleItemAddedToCart(payload);
      } else {
        const payload = {
          productId: this.item.id,
          size: "default",
        };
        this.removeItemFromCart(payload);
        this.toggleItemAddedToCart(payload);
      }
    },
  },
  computed: {
    ...mapGetters("menu", ["cartItems", "getSelectedItemSelectedSize"]),
    sheet: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    cartItemByIdAndSize() {
      if (this.selectedSize) {
        return this.cartItems.find(
          (x) => x.id === this.item.id && x.size === this.selectedSize.size
        ).quantity;
      } else {
        if (this.cartItems)
          return this.cartItems.find((x) => x.id === this.item.id).quantity;
      }
    },
  },
};
</script>

<style>
</style>