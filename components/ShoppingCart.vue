<template>
  <v-container>
    <v-list two-line dense>
      <template v-for="(item, index) in cartItems">
        <v-divider inset :key="index + '-first'"></v-divider>
        <v-list-item :key="index">
          <v-list-item-avatar class="d-none d-sm-block">
            <v-img :src="item.thumbnail[0]" :lazy-src="item.thumbnail[0]"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ item.title }}
              <span v-if="item.size != 'default'"
                >({{ item.size }})</span
              ></v-list-item-title
            >
            <v-list-item-subtitle v-if="!disableIncDec">
              <v-btn-toggle dense color="accent" class="mt-1">
                <v-btn
                  tile
                  outlined
                  x-small
                  @click="onClickDecrementQuantity(item)"
                >
                  <v-icon color="accent">mdi-minus</v-icon>
                </v-btn>
                <v-btn tile outlined x-small class="body-2">{{
                  item.quantity
                }}</v-btn>
                <v-btn
                  tile
                  outlined
                  x-small
                  @click="onClickIncrementQuantity(item)"
                >
                  <v-icon color="accent">mdi-plus</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="showQuantity">
              Quantity: <strong>{{ item.quantity }}</strong>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-title>{{
              item.price * item.quantity
            }}</v-list-item-title>
          </v-list-item-action>
          <v-list-item-action v-if="!disableDelete">
            <v-btn
              @click="onClickRemoveItemFromCart(item)"
              icon
              small
              text
              rounded
            >
              <v-icon color="warning">mdi-delete-outline</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider
          v-if="index + 1 === cartItems.length"
          inset
          :key="index + '-second'"
        ></v-divider>
      </template>
      <v-list-item v-if="!hideTotal">
        <v-list-item-content>
          <v-list-item-title>Total:</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-title>{{ cartTotalPrice }}</v-list-item-title>
        </v-list-item-action>
        <v-list-item-action>
          <v-list-item-title></v-list-item-title>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: {
    disableIncDec: {
      type: Boolean,
      default: false,
    },
    disableDelete: {
      type: Boolean,
      default: false,
    },
    hideTotal: {
      type: Boolean,
      default: false,
    },
    showQuantity: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  methods: {
    ...mapActions("menu", [
      "incrementCartQuantity",
      "decrementCartQuantity",
      "toggleItemAddedToCart",
      "removeItemFromCart",
    ]),
    onClickIncrementQuantity(item) {
      const payload = {
        cartItemId: item.id,
        size: item.size,
      };
      this.incrementCartQuantity(payload);
    },
    onClickDecrementQuantity(item) {
      const payload = {
        cartItemId: item.id,
        size: item.size,
      };
      this.decrementCartQuantity(payload);
    },
    onClickRemoveItemFromCart(item) {
      const payload = {
        productId: item.id,
        size: item.size,
      };

      this.removeItemFromCart(payload);
      this.toggleItemAddedToCart(payload);
    },
  },
  computed: {
    ...mapGetters("menu", {
      cartItems: "cartItems",
      cartTotalPrice: "cartTotalPrice",
    }),
  },
};
</script>