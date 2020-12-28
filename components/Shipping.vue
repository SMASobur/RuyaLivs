<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Order Placement</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="show = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container fluid>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Your Information</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">Payment Method</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Order Competion</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- personal information starts -->
            <v-stepper-content step="1">
              <v-card tile outlined class="mb-2">
                <v-card-title>Your information</v-card-title>
                <v-card-subtitle v-if="!authUserResponse.success">
                  <v-alert
                    dense
                    border="left"
                    type="warning"
                    class="mt-4"
                  >Missing information, you are not logged in</v-alert>
                  <v-btn @click.stop="showLogin=true" depressed tile small color="accent">Login now</v-btn>
                </v-card-subtitle>
                <div class="mx-4">
                  <v-form v-model="isUserInfoValid">
                    <v-text-field
                      dense
                      :ref="'aa'"
                      type="text"
                      @input="setOrderUserName"
                      label="Full Name"
                      :rules="nameRules"
                      :value="orderUserInfo.fullName"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      dense
                      type="email"
                      @input="setOrderUserEmail"
                      label="Email"
                      :rules="emailRules"
                      :value="orderUserInfo.email"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      dense
                      type="text"
                      @input="setOrderUserContactNo"
                      :rules="emergencyContactNoRules"
                      label="Emergency contact number"
                      :value="orderUserInfo.emergencyContactNo"
                      outlined
                    ></v-text-field>
                    <v-textarea
                      v-if="orderType === 'Delivery'"
                      placeholder="Address"
                      @input="setOrderUserAddress"
                      :rules="addressRules"
                      :value="orderUserInfo.address"
                      outlined
                      clearable
                    ></v-textarea>
                  </v-form>
                </div>
              </v-card>
              <v-btn :disabled="!isUserInfoValid" color="accent" @click="e1 = 2">Set Payment Method</v-btn>
            </v-stepper-content>
            <!-- personal information ends -->

            <!-- payment info starts -->
            <v-stepper-content step="2">
              <v-card tile outlined class="mb-2">
                <v-card-title>Payment Method</v-card-title>
                <v-card-subtitle>
                  <v-radio-group @change="resetCardInfo" v-model="paymentMethod" row>
                    <v-radio label="Card payment" value="Card payment"></v-radio>
                    <v-radio label="Cash on delivery" value="Cash on delivery"></v-radio>
                  </v-radio-group>
                </v-card-subtitle>
                <div class="mx-4" v-if="paymentMethod=='Card payment'">
                  <v-text-field
                    dense
                    type="text"
                    :rules="nameRules"
                    label="Card holder name"
                    v-model="cardHolderName"
                    outlined
                  ></v-text-field>

                  <v-stripe-card
                    outlined
                    dense
                    v-model="token"
                    label="Card Info"
                    hidePostalCode
                    apiKey="pk_test_CNBrx2glAUwnkNIUmxX2myBg005WiLZxnI"
                  ></v-stripe-card>
                </div>
                <div class="mx-4" v-else-if="paymentMethod=='Cash on delivery'">
                  <div class="d-flex align-center">
                    <v-text-field v-model="contactNo" placeholder="Enter phone number" type="text"></v-text-field>
                    <v-btn class="ml-2" color="accent">Send Code</v-btn>
                  </div>
                </div>
              </v-card>
              <v-btn
                color="accent"
                :disabled="cardHolderName ==='' || token.card.last4 === ''"
                @click="e1 = 3"
              >Order Completion</v-btn>

              <!-- <v-btn text>Cancel</v-btn> -->
            </v-stepper-content>
            <!-- payment info ends -->

            <!-- checkout summery starts-->
            <v-stepper-content step="3">
              <v-card tile outlined class="mb-4">
                <v-card-title>User Information</v-card-title>
                <v-row>
                  <v-col>
                    <v-subheader>Delivery details</v-subheader>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Name</v-list-item-subtitle>
                          <v-list-item-title>{{orderUserInfo.fullName}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Email</v-list-item-subtitle>
                          <v-list-item-title>{{orderUserInfo.email}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Contact No</v-list-item-subtitle>
                          <v-list-item-title>{{orderUserInfo.emergencyContactNo}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-if="orderType==='Delivery'">
                        <v-list-item-content>
                          <v-list-item-subtitle>Address</v-list-item-subtitle>
                          <v-list-item-title>{{orderUserInfo.address}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Order Type</v-list-item-subtitle>
                          <v-list-item-title>{{orderType}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Order Note</v-list-item-subtitle>
                          <v-list-item-title>{{deliveryNote}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col>
                    <v-subheader>Payment details</v-subheader>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Card Holder</v-list-item-subtitle>
                          <v-list-item-title>{{cardHolderName}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Card Last 4 digit</v-list-item-subtitle>
                          <v-list-item-title>{{token.card.last4}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>

              <v-row>
                <v-col>
                  <v-card tile outlined class="mb-4">
                    <v-card-title>Order items</v-card-title>
                    <ShoppingCart disableIncDec disableDelete hideTotal showQuantity></ShoppingCart>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card tile outlined class="mb-4">
                    <v-card-title>Order Summery</v-card-title>
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
                    <v-card-actions></v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

              <v-btn :loading="loading" color="accent" @click="onSubmit()">Complete Order</v-btn>
            </v-stepper-content>
            <!--  -->
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-card>

    <UserLogin v-model="showLogin" />
  </v-dialog>
</template>


<script>
import { mapState, mapActions, mapGetters } from "vuex";
import UserLogin from "@/components/auth/UserLogin.vue";
import ShoppingCart from "@/components/ShoppingCart.vue";
import authRules from "@/utils/authRuls";
import addOrderGql from "@/gql/mutation/addOrder.gql";
export default {
  components: {
    UserLogin,
    ShoppingCart
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      loading: false,
      devliveryCharge: 100,
      paymentMethod: "Card payment",
      contactNo: "",
      showLogin: false,
      cardHolderName: "",
      cardNumber: "",
      cardExpireDate: "",
      cvc: "",
      token: {
        card: {
          brand: "",
          country: "",
          exp_year: "",
          exp_month: "",
          last4: ""
        }
      },
      e1: "1",
      isUserInfoValid: false,
      formUserFullName: "",
      ...authRules
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      let deliveryCharge = 100;
      if (this.deliveryMethod === "COLLECTION") {
        this.orderAddress.address = "Not specified";
        deliveryCharge = 0;
      }

      // if (this.cartTotalPrice < 10) {
      //   this.$notifier.showMessage({
      //     content:
      //       "Minimum order amount is 10 Krona, Please buy something more.",
      //     color: "warning"
      //   });
      //   this.loading = false;
      //   return;
      // }

      const order = {
        orderBy: this.authUser.id,
        items: this.orderItems,
        orderAddress: this.orderAddress,
        orderType: this.deliveryMethod,
        deliveryCharge: deliveryCharge,
        orderNote: this.deliveryNote,
        totalCost: this.cartTotalPrice,
        paymentToken: this.token.id
      };

      // console.log("add order", order);
      try {
        const response = await this.$apollo.mutate({
          mutation: addOrderGql,
          variables: { order }
        });
        const data = response.data.addOrder;
        console.log("addOrder", data);

        this.loading = false;
        let color = "success";
        if (data.code !== 201) {
          color = "error";
        }
        this.resetOrder();
        this.$notifier.showMessage({
          content: data.message,
          color: color
        });

        // await this.$apolloHelpers.onLogin(res.token);
      } catch (err) {
        console.error("err", err);
        this.loading = false;
      }
    },

    ...mapActions("order", [
      "setOrderUserName",
      "setOrderUserEmail",
      "setOrderUserContactNo",
      "setOrderUserAddress",
      "clearOrderNote",
      "resetOrderType"
    ]),

    resetOrder() {
      this.resetCart();
      this.clearOrderNote();
      this.resetOrderType();
      this.$router.push("/order");
    },

    ...mapActions("menu", ["resetCart"]),

    showOderCompleteMessage() {
      this.$notifier.showMessage({
        content: "Order completed successfully",
        color: "success"
      });
    },
    resetCardInfo() {
      this.token = {
        card: {
          brand: "",
          country: "",
          exp_year: "",
          exp_month: "",
          last4: ""
        }
      };
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    ...mapGetters("menu", ["cartItems", "orderItems", "cartTotalPrice"]),
    ...mapGetters("auth", ["authUser", "authUserResponse"]),
    ...mapGetters("order", [
      "orderType",
      "deliveryMethod",
      "orderUser",
      "deliveryNote",
      "orderAddress"
    ]),
    totalCost() {
      return this.devliveryCharge + this.cartTotalPrice;
    },
    orderUserInfo() {
      if (this.orderUser) return this.orderUser;
      return orderUser => {};
    },
    orderAddress() {
      return {
        fullName: this.orderUser.fullName,
        email: this.orderUser.email,
        emergencyContactNo: this.orderUser.emergencyContactNo,
        address: this.orderUser.address
      };
    }
  }
};
</script>