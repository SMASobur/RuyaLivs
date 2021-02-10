<template>
  <div>
    <div class="d-flex justify-center">
      <v-progress-circular
        color="accent"
        indeterminate
        v-if="$fetchState.pending"
        class="align-self-center mt-4"
      ></v-progress-circular>
    </div>

    <!-- <div v-if="orders.length == 0 && !$fetchState.pending">
      <p>You have not placed any order yet ! Go to menu and place an order now.</p>
      <v-btn tile to="/menu" color="accent">Menu</v-btn>
    </div>-->
    <div v-if="!$fetchState.pending && orders.length == 0">
      <p>
        You have not placed any order yet ! Go to menu and place an order now.
      </p>
      <v-btn tile to="/shop" color="accent">Menu</v-btn>
    </div>

    <!-- <div v-else-if="orders.length !== 0 && !$fetchState.pending"> -->
    <div v-else-if="orders.length !== 0 && !$fetchState.pending">
      <!-- <h3>My Orders</h3> -->
      <v-list v-for="(order, index) in orders" :key="index">
        <h4>Order #{{ index + 1 }}</h4>
        <v-card tile outlined>
          <div
            v-if="
              order.orderStatus == 'PENDING' &&
              order.deliveryStatus == 'PENDING'
            "
            class="mt-3 d-flex flex-column justify-center align-center"
          >
            <h2 class="headline font-weight-bold warning--text">
              ORDER PROCESSING
            </h2>
            <v-img
              class="ml-2"
              src="img/order/processing_order.png"
              max-width="50px"
            ></v-img>
          </div>
          <div
            v-if="
              order.orderStatus == 'ACCEPTED' &&
              order.deliveryStatus == 'PENDING'
            "
            class="mt-3 d-flex flex-column justify-center align-center"
          >
            <h2 class="headline font-weight-bold success--text">
              PREPARING ORDER !
            </h2>
            <v-img
              class="ml-2"
              src="img/order/food_cooking_2.png"
              max-width="50px"
            ></v-img>
          </div>
          <div
            v-if="order.deliveryStatus == 'READY'"
            class="mt-3 d-flex flex-column justify-center align-center"
          >
            <h2 class="headline font-weight-bold success--text">
              ORDER READY !
            </h2>
            <v-img
              class="ml-2"
              src="img/order/food_ready.png"
              max-width="50px"
            ></v-img>
          </div>
          <div
            v-if="order.deliveryStatus == 'PICKED_UP'"
            class="mt-3 d-flex flex-column justify-center align-center"
          >
            <h2 class="headline font-weight-bold success--text">
              ON YOUR WAY !
            </h2>
            <v-img
              class="ml-2"
              src="img/order/deliver_food.png"
              max-width="50px"
            ></v-img>
          </div>
          <div
            v-if="order.deliveryStatus == 'DELIVERED'"
            class="mt-3 d-flex flex-column justify-center align-center"
          >
            <h2 class="headline font-weight-bold success--text">
              ORDER DELIVERED !
            </h2>
            <v-img
              class="ml-2"
              src="img/order/done_order.png"
              max-width="50px"
            ></v-img>
          </div>
          <div
            v-if="order.orderStatus == 'REJECTED'"
            class="mt-3 d-flex flex-column justify-center align-center"
          >
            <h2 class="headline font-weight-bold error--text">
              ORDER CANCELLED !
            </h2>
            <v-img
              class="ml-2"
              src="img/order/order_rejected.png"
              max-width="50px"
            ></v-img>
          </div>

          <v-card-text>
            <v-list-item
              v-if="
                $moment(order.orderAcceptedAt).isValid() &&
                order.deliveryStatus != 'DELIVERED'
              "
            >
              <v-list-item-content>
                <v-list-item-subtitle>Approximate Time</v-list-item-subtitle>
                <v-list-item-title>
                  <v-chip class="my-2" color="green" text-color="white">
                    <v-avatar left class="green darken-4">
                      <v-icon>mdi-clock</v-icon>
                    </v-avatar>
                    {{
                      $moment(order.orderAcceptedAt)
                        .add(order.prepareTime, "minutes")
                        .fromNow()
                    }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Order ID</v-list-item-subtitle>
                <v-list-item-title>{{ order.id }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Ordered at</v-list-item-subtitle>
                <v-list-item-title>{{
                  $moment(order.createdAt).format("LLL")
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Order Status</v-list-item-subtitle>
                <v-list-item-title>{{order.orderStatus}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Delivery Status</v-list-item-subtitle>
                <v-list-item-title>{{order.deliveryStatus}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>-->
          </v-card-text>
          <v-list-item>
            <v-expansion-panels accordion focusable class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-header>Order items</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list
                    dense
                    v-for="(item, i) in order.items.cartItems"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ item.productName }}
                        <span v-if="item.productSize != 'default'"
                          >({{ item.productSize }})</span
                        ></v-list-item-title
                      >
                      <v-list-item-subtitle
                        >Quantity
                        {{ item.productQuantity }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle
                        >Price
                        {{
                          item.productQuantity * item.pricePerUnit
                        }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list>
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-item-content>
                      <v-list-item-title>Total item cost</v-list-item-title>
                      <v-list-item-subtitle>{{
                        order.items.totalCost
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>Delivery fee</v-list-item-title>
                      <v-list-item-subtitle>{{
                        order.deliveryCharge
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>Total payable cost</v-list-item-title>
                      <v-list-item-subtitle>{{
                        order.items.totalCost + order.deliveryCharge
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
        </v-card>
      </v-list>
    </div>
    <v-pagination
      v-if="!$fetchState.pending && totalOrderPage > 1"
      v-model="orderInput.pageNo"
      class="my-4"
      :length="totalOrderPage"
      @input="onPaginationInput"
    ></v-pagination>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";
import getOrdersByUserIdQuery from "../gql/query/getOrdersByUserId.gql";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  components: {
    Logo,
    VuetifyLogo,
  },
  data() {
    return {
      // orders: null,
      getOrderByUserId: null,
      orderInput: {
        orderStatus: [],
        orderType: ["DELIVERY", "COLLECTION"],
        limit: 10,
        pageNo: 1,
      },
      isFirstView: true,
      interval: null,
      fetchInterval: 60000,
    };
  },
  async fetch() {
    const userId = this.$cookies.get("user-id");
    console.log("cookier user", userId);
    this.orderInput.userId = userId
    await this.fetchOrderByUserId(this.orderInput);
    this.isFirstView = false;
  },
  methods: {
    ...mapActions("my_order", ["fetchOrderByUserId"]),
    refresh() {
      this.$fetch();
    },
    updateOrder() {
      this.interval = setInterval(() => {
        this.refresh();
        // console.log("I am called",this.interval);
      }, this.fetchInterval);
    },
    stopUpdateOrder() {
      clearInterval(this.interval);
    },
    onPaginationInput(val){
      this.orderInput.pageNo = val
      this.$fetch();
      // window.scrollTo(0, 0);
    }
  },
  mounted() {
    this.updateOrder();
  },
  beforeDestroy() {
    this.stopUpdateOrder();
  },
  computed: {
    ...mapGetters("auth", ["authUser", "authUserResponse"]),
    ...mapGetters("my_order", ["orders","totalOrderPage"]),
    // orders() {
    //   return this.getOrderByUserId.orders;
    // }
  },
  middleware: ["isAuth"],
};
</script>
