<template>
  <v-container>
    <p v-if="$fetchState.pending">Fetching order...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <!-- <pre>{{ orderData }}</pre> -->
      <OrderItems :items="orderData.order.items" :orderId="orderData.id" />

      <div class="d-flex justify-end my-4">
        <v-btn
          v-if="orderData.order.orderStatus === 'PENDING'"
          class="mx-2"
          color="success"
          small
          rounded
          @click="shouldShowAcceptDialog = true"
          >Accept Order</v-btn
        >
        <v-btn
          v-if="orderData.order.orderStatus === 'ACCEPTED'"
          class="mx-2"
          color="success"
          depressed
          small
          rounded
          disabled
          >Order Accepted</v-btn
        >

        <v-btn
          v-if="
            orderData.order.orderStatus != 'DELIVERED' &&
            orderData.order.orderStatus != 'REJECTED'
          "
          class="mx-2"
          color="error"
          small
          rounded
          @click="shouldShowRejectDialog = true"
          >Reject Order</v-btn
        >
        <v-btn
          v-if="orderData.order.orderStatus === 'REJECTED'"
          class="mx-2"
          color="error"
          small
          rounded
          depressed
          disabled
          >Order Rejected</v-btn
        >
        <v-btn
          v-if="
            orderData.order.orderStatus != 'REJECTED' &&
            orderData.order.orderStatus != 'DELIVERED'
          "
          class="mx-2"
          color="accent"
          small
          rounded
          @click="shouldOrderUpdateDialog = true"
          >Update Order</v-btn
        >
        <v-btn
          v-if="
            (orderData.order.orderStatus != 'DELIVERED') &
            (orderData.order.orderStatus != 'REJECTED')
          "
          class="mx-2"
          color="purple"
          small
          rounded
          dark
          @click="shouldShowDeliveredDialog = true"
          >Complete Delivery</v-btn
        >
        <v-btn
          v-if="orderData.order.orderStatus === 'DELIVERED'"
          class="mx-2"
          small
          rounded
          depressed
          disabled
          >Order Delivered</v-btn
        >
      </div>

      <OrderBillingInfo
        :orderAddress="orderData.order.orderAddress"
        :orderNote="orderData.order.orderNote"
        :orderType="orderData.order.orderType"
        class="mt-4"
      />
    </div>
    <div v-if="orderData">
      <OrderAcceptDialog
        :shouldOpen="shouldShowAcceptDialog"
        @onclickClose="onClickCloseAcceptRejectDialog"
        @onAcceptRequestStarted="onAcceptRequestStarted"
        @onAcceptRequestCompleted="onAcceptRequestCompleted"
        @onAcceptRequestSucess="onAcceptRequestSucess"
        :orderId="orderData.order.id"
      />
    </div>
    <div v-if="orderData">
      <OrderRejectDialog
        :shouldOpen="shouldShowRejectDialog"
        @onclickClose="onClickCloseAcceptRejectDialog"
        @onRejectRequestStarted="onRejectRequestStarted"
        @onRejectRequestCompleted="onRejectRequestCompleted"
        @onRejectRequestSucess="onRejectRequestSucess"
        :orderId="orderData.order.id"
      />
    </div>
    <div v-if="orderData">
      <OrderUpdateDialog
        :shouldOpen="shouldOrderUpdateDialog"
        :items="orderData.order.items"
        @onClickClose="onClickCloseUpdate"
        @onSuccessUpdateOrderItems="onSuccessUpdateOrderItems"
      />
    </div>
    <div v-if="orderData">
      <OrderDeliveredDialog
        :shouldOpen="shouldShowDeliveredDialog"
        @onclickClose="onClickCloseAcceptRejectDialog"
        @onDeliveredRequestStarted="onDeliveredRequestStarted"
        @onOrderDeliveredCompleted="onOrderDeliveredCompleted"
        @onDeliveredRequestSuccess="onDeliveredRequestSuccess"
        :orderId="orderData.order.id"
      />
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import OrderBillingInfo from "@/components/orderDetails/OrderBillingInfo.vue";
import OrderItems from "@/components/orderDetails/OrderItems.vue";
import OrderAcceptDialog from "@/components/dialogs/OrderAcceptDialog.vue";
import OrderRejectDialog from "@/components/dialogs/OrderRejectDialog.vue";
import OrderUpdateDialog from "@/components/orderDetails/OrderUpdateDialog.vue";
import OrderDeliveredDialog from "@/components/dialogs/OrderDeliveredDialog.vue";
export default {
  layout: "admin",
  async fetch() {
    const orderId = this.$route.params.id; // When calling /abc the slug will be "abc"
    const orderData = await this.getOrder(orderId);
    console.log("orderData", orderData);
    this.orderData = orderData;
  },
  components: {
    OrderBillingInfo,
    OrderItems,
    OrderAcceptDialog,
    OrderRejectDialog,
    OrderUpdateDialog,
    OrderDeliveredDialog,
  },

  data() {
    return {
      id: "",
      orderData: null,
      acceptInProgress: false,
      rejectInProgress: false,
      deliveredInProgress: false,
      shouldShowAcceptDialog: false,
      shouldShowRejectDialog: false,
      shouldOrderUpdateDialog: false,
      shouldShowDeliveredDialog: false,
    };
  },

  methods: {
    ...mapActions("order", ["getOrder"]),

    onAcceptRequestStarted() {
      this.acceptInProgress = true;
    },

    onAcceptRequestSucess(data) {
      this.$notifier.showMessage({
        content: data,
        color: "accent",
      });
      this.orderData.order.orderStatus = "ACCEPTED";
    },
    onAcceptRequestCompleted() {
      this.acceptInProgress = false;
    },

    onDeliveredRequestStarted() {
      this.deliveredInProgress = true;
    },
    onDeliveredRequestSuccess(data) {
      this.orderData.order.orderStatus = "DELIVERED";
      this.$notifier.showMessage({
        content: data,
        color: "accent",
      });
    },
    onOrderDeliveredCompleted() {
      this.deliveredInProgress = false;
    },

    onRejectRequestStarted() {
      this.rejectInProgress = true;
    },
    onRejectRequestSucess(data) {
      this.$notifier.showMessage({
        content: data,
        color: "accent",
      });
      this.orderData.order.orderStatus = "REJECTED";
    },
    onRejectRequestCompleted() {
      this.rejectInProgress = false;
    },

    onClickCloseAcceptRejectDialog() {
      // console.log('onClickClose callded');
      this.shouldShowAcceptDialog = false;
      this.shouldShowRejectDialog = false;
      this.shouldShowDeliveredDialog = false;
    },
    onClickCloseUpdate() {
      this.shouldOrderUpdateDialog = false;
    },
    onSuccessUpdateOrderItems(updatedCart) {
      this.orderData.order.items = updatedCart.cart;
      this.$notifier.showMessage({
        content: updatedCart.message,
        color: "accent",
      });
      this.shouldOrderUpdateDialog = false;
    },
  },
};
</script>

<style>
</style>