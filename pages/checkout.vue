<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-2" outlined tile fixed>
          <v-card-title>My Cart</v-card-title>
          <ShoppingCart />
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-row no-gutters>
          <v-col>
            <v-card outlined tile>
              <v-card-title>Order type</v-card-title>
              <v-select
                class="mx-4"
                :items="orderTypes"
                v-model="orderType"
                @change="setOrderType"
                label="Order Type"
                single-line
              ></v-select>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card outlined tile>
              <v-card-title>Order Note</v-card-title>
              <v-textarea
                class="mx-4"
                placeholder="Tell us any specific order requirement"
                clearable
                :value="deliveryNote"
                @input="setOrderDeliveryNote"
              ></v-textarea>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card class="pa-2" outlined tile>
              <v-card-title>Checkout Summery</v-card-title>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Subtotal</v-list-item-title>
                  </v-list-item-content>
                  <v-spacer></v-spacer>
                  <v-list-item-action>
                    <v-list-item-title>{{cartTotalPrice}}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Delivery fee</v-list-item-title>
                  </v-list-item-content>
                  <v-spacer></v-spacer>
                  <v-list-item-action>
                    <v-list-item-title>{{devliveryCharge}}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Total</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title>{{totalCost}}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">Payable Total</v-list-item-title>
                  </v-list-item-content>
                  <v-spacer></v-spacer>
                  <v-list-item-action>
                    <v-list-item-title class="font-weight-bold">{{totalCost}}</v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
            <v-expansion-panels hover focusable tile>
              <v-expansion-panel>
                <v-expansion-panel-header>Have any voucher ?</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-form v-model="isVoucherValid">
                    <div class="d-flex align-center">
                      <v-text-field
                        v-model="voucher"
                        :rules="voucherRules"
                        placeholder="Ex:123655"
                        type="text"
                      ></v-text-field>
                      <v-btn
                        :loading="voucherApplyLoading"
                        :disabled="!isVoucherValid"
                        @click="voucherApplyLoading=true"
                        class="ml-2"
                        color="accent"
                      >Apply</v-btn>
                    </div>
                  </v-form>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-btn
              class="my-2"
              color="accent"
              block
              @click.stop="showShipping=true"
            >Continue to Order Placement</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <Shipping v-model="showShipping"></Shipping>
  </v-container>
</template>
<script>
import ShoppingCart from "@/components/ShoppingCart.vue";
import Shipping from "@/components/Shipping.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    ShoppingCart,
    Shipping
  },
  data() {
    return {
      orderType: "Delivery",
      orderTypes: ["Delivery", "Collection"],
      devliveryCharge: 100,
      voucher: "",
      isVoucherValid: false,
      voucherRules: [v => !!v.trim() || "Voucher can not be empty"],
      voucherApplyLoading: false,
      showShipping: false
    };
  },
  methods: {
    ...mapActions("order", ["setOrderType","setOrderDeliveryNote"])
  },
  computed: {
    ...mapGetters("menu", ["cartItems", "cartTotalPrice"]),
    ...mapGetters("order", ["deliveryNote"]),
    totalCost() {
      return this.devliveryCharge + this.cartTotalPrice;
    },
    
  },
  watch: {
    orderType(newVal, oldVal) {
      if (newVal === "Collection") {
        this.devliveryCharge = 0;
      } else {
        this.devliveryCharge = 100;
      }
    }
  }
};
</script>