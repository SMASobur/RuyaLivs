<template>
  <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Reservation Placement</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="show = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-container fluid>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Reservation Info</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">Payment Method</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Reservation Competion</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <!-- personal information starts -->
            <v-stepper-content step="1">
              <v-card tile outlined class="mb-2">
                <v-card-title>Reservation information</v-card-title>
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
                  <v-form ref="form" v-model="isReservervationFormValid">
                    <!-- <v-text-field
                      label="Total person"
                      v-model="numberOfPeople"
                      :rules="peopleRules"
                      prepend-icon="mdi-account-multiple-outline"
                      outlined
                      dense
                      required
                    ></v-text-field>-->
                    <v-select
                      :items="items"
                      :value="reservationFormInfo.numberOfPeople"
                      :rules="peopleRules"
                      dense
                      prepend-icon="mdi-account-multiple-outline"
                      label="Total person"
                      outlined
                      @change="onNumberOfPeopleChange"
                    ></v-select>
                    <v-dialog
                      ref="dateDialog"
                      v-model="dateModal"
                      :return-value.sync="reservationDate"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="formatedReservationDate"
                          :rules="dateRules"
                          label="Choose Date"
                          prepend-icon="mdi-calendar-range-outline"
                          readonly
                          outlined
                          dense
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="reservationDate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dateDialog.save(reservationDate)"
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                    <v-dialog
                      ref="timeDialog"
                      v-model="timeModal"
                      :return-value.sync="reservationTime"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="formatedReservationTime"
                          :rules="timeRules"
                          label="Choose Time"
                          prepend-icon="mdi-clock-outline"
                          readonly
                          outlined
                          dense
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="timeModal"
                        v-model="reservationTime"
                        ampm-in-title
                        full-width
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="timeModal = false">Cancel</v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.timeDialog.save(reservationTime)"
                        >OK</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-form>
                </div>
              </v-card>
              <v-btn
                :disabled="!isReservervationFormValid"
                color="accent"
                @click="e1 = 2"
              >Set Payment Method</v-btn>
            </v-stepper-content>
            <!-- personal information ends -->

            <!-- payment info starts -->
            <v-stepper-content step="2">
              <v-card tile outlined class="mb-2">
                <v-card-title>Payment Method</v-card-title>
                <v-card-subtitle>
                  <v-radio-group @change="resetCardInfo" v-model="paymentMethod" row>
                    <v-radio label="Card payment" value="Card payment"></v-radio>
                    <v-radio label="Cash payment" value="Cash payment"></v-radio>
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
                <div class="mx-4" v-else-if="paymentMethod=='Cash payment'">
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
              >Reservation Completion</v-btn>

              <!-- <v-btn text>Cancel</v-btn> -->
            </v-stepper-content>
            <!-- payment info ends -->

            <!-- checkout summery starts-->
            <v-stepper-content step="3">
              <v-card tile outlined class="mb-4">
                <v-card-title>Reservation Information</v-card-title>
                <v-row>
                  <v-col>
                    <v-subheader>Reservation details</v-subheader>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Total Number of People</v-list-item-subtitle>
                          <v-list-item-title>{{reservationFormInfo.numberOfPeople}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Reservation Date</v-list-item-subtitle>
                          <v-list-item-title>{{formatedReservationDate}}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-subtitle>Reservation Time</v-list-item-subtitle>
                          <v-list-item-title>{{formatedReservationTime}}</v-list-item-title>
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
              <v-btn :loading="loading" color="accent" @click="onSubmit">Complete Reservation</v-btn>
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
import addPreOrderReservationGql from "@/gql/mutation/addPreOrderReservation.gql";
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
      devliveryCharge: 0,
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
      numberOfPeople: "",
      selectedNoOfPeople: null,
      reservationDate: null,
      reservationTime: null,
      dateModal: false,
      timeModal: false,
      isReservervationFormValid: false,
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      ...authRules
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      this.orderAddress.address = "Not specified";
      const order = {
        orderBy: this.authUser.id,
        items: this.orderItems,
        orderAddress: this.orderAddress,
        orderType: "PREORDER",
        deliveryCharge: 0,
        orderNote: this.deliveryNote,
        totalCost: this.cartTotalPrice,
        paymentToken: this.token.id
      };
      const preOrderReservation = {
        numberOfPeople: parseInt(this.reservationFormInfo.numberOfPeople),
        desiredDate: this.reservationFormInfo.reservationDate,
        desiredTime: this.reservationFormInfo.reservationTime,
        order: order,
        reservedBy: this.authUser.id
      };

      //   console.log("add preOrder", preOrderReservation);

      try {
        const response = await this.$apollo.mutate({
          mutation: addPreOrderReservationGql,
          variables: { preOrderReservation }
        });
        const data = response.data.addPreOrderReservation;
        console.log("pre order reservation", data);

        this.loading = false;
        this.resetOrder();
        this.resetReservation();
        // this.resetOrder();
        this.$notifier.showMessage({
          content: data.message,
          color: "success"
        });

        // await this.$apolloHelpers.onLogin(res.token);
      } catch (err) {
        console.error("err", err);
        this.loading = false;
        this.$notifier.showMessage({
          content: err.message,
          color: "error"
        });
      }
    },
    onNumberOfPeopleChange(val) {
      this.setReservationNoOfPeople(val);
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
      this.deActivateReservationWithPreOrder();
      this.$router.push("/current_reservation");
    },
    resetReservation() {
      this.setReservationDate(null);
      this.setReservationTime(null);
      this.setReservationNoOfPeople(null);
    },

    ...mapActions("menu", ["resetCart"]),
    ...mapActions("reservation", [
      "deActivateReservationWithPreOrder",
      "setReservationNoOfPeople",
      "setReservationDate",
      "setReservationTime",
      "setSelectedReservation"
    ]),
    showOderCompleteMessage() {
      this.$notifier.showMessage({
        content: "Order completed successfully",
        color: "success"
      });
    }
  },
  watch: {
    reservationDate(val) {
      this.setReservationDate(val);
    },
    reservationTime(val) {
      this.setReservationTime(val);
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
    ...mapGetters("reservation", ["reservationFormInfo"]),
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
    },
    formatedReservationDate() {
      return this.reservationFormInfo.reservationDate
        ? this.$moment(this.reservationFormInfo.reservationDate).format(
            "dddd, MMMM Do YYYY"
          )
        : "";
    },
    formatedReservationTime() {
      return this.reservationFormInfo.reservationTime
        ? this.$moment(
            this.reservationFormInfo.reservationTime,
            "HH:mm"
          ).format("hh:mm A")
        : "";
    }
  }
};
</script>