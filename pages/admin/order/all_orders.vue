<template>
  <v-row>
    <v-col>
      <client-only>
        <v-data-table
          :headers="headers"
          :items="modifiedOrders"
          :items-per-page="orderPayload.limit"
          :server-items-length="totalOrderCount"
          class="elevation-1"
          disable-sort
          @pagination="onPagination"
          :loading="loadingOrders"
          loading-text="Loading orders..."
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>All Orders</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              x-small
              tile
              color="accent"
              @click="onPressShowOrder(item.order)"
              >Details</v-btn
            >
            <v-btn
              x-small
              tile
              color="primary"
              :loading="
                selectedItem && item.id === selectedItem.id && acceptInProgress
              "
              @click="onClcikAcceptOrder(item.order)"
              >Accept</v-btn
            >
            <v-btn x-small tile color="warning">Reject</v-btn>
          </template>
        </v-data-table>
      </client-only>
    </v-col>
    <v-dialog v-model="orderDialog" max-width="700px">
      <SingleOrder :order="order" />
    </v-dialog>
    <div v-if="selectedItem">
      <OrderAcceptDialog
        heading="Are you sure you want to accept the order ?"
        :shouldOpen="shouldShowAcceptDialog"
        @onclickClose="onClickCloseAcceptOrder"
        @onAcceptRequestStarted="onAcceptRequestStarted"
        @onAcceptRequestCompleted="onAcceptRequestCompleted"
        @onAcceptRequestSucess="onAcceptRequestSucess"
        :orderId="selectedItem.id"
      />
    </div>
  </v-row>
</template>

<script>
import allOrdersQuery from "@/gql/query/getOrders.gql";
import SingleOrder from "@/components/SingleOrder.vue";
import OrderAcceptDialog from "@/components/dialogs/OrderAcceptDialog.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  layout: "admin",
  async fetch() {
    this.fetchOrders();
  },
  components: {
    SingleOrder,
    OrderAcceptDialog,
  },
  data() {
    return {
      orderPayload: {
        pageNo: 1,
        limit: 15,
        status: [],
      },
      orders: [],
      totalOrderCount: 0,
      headers: [
        { text: "Order By", value: "orderBy" },
        { text: "Order Date", value: "orderDate" },
        { text: "Order ID", value: "id" },
        { text: "Order Type", value: "orderType" },
        { text: "Order Status", value: "orderStatus" },
        { text: "Delivery Status", value: "deliveryStatus" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      orderDialog: false,
      order: null,
      updatedStatusItemPayload: {
        id: "",
        status: "",
      },
      loadingStatusUpdate: false,
      selectedItemIndex: -1,
      selectedItem: null,
      clickedButton: "ACCEPTED",
      confirmDialog: false,
      loadingOrders: false,
      acceptInProgress: false,
      rejectInProgress: false,
      shouldShowAcceptDialog: false,
      shouldCloseAcceptDialog: false,
    };
  },
  methods: {
    async onClcikAcceptOrder(item) {
      this.selectedItem = item;
      console.log("accepted item", this.selectedItem);
      this.shouldShowAcceptDialog = true;
    },
    onClickCloseAcceptOrder() {
      // console.log('onClickClose callded');
      this.shouldShowAcceptDialog = false;
    },
    onAcceptRequestStarted() {
      this.acceptInProgress = true;
    },
    onAcceptRequestSucess(data) {
      this.selectedItem.orderStatus = "ACCEPTED";
      this.$notifier.showMessage({
            content: data,
            color: "primary",
          });
    },
    onAcceptRequestCompleted() {
      this.acceptInProgress = false;
    },

    async fetchOrders() {
      try {
        this.loadingOrders = true;
        const response = await this.$apollo.query({
          query: allOrdersQuery,
          variables: { input: this.orderPayload },
          fetchPolicy: "network-only",
        });
        this.loadingOrders = false;
        const orders = response.data.getOrders.orders;
        const totalOrderCount = response.data.getOrders.count;
        console.log("orders", orders);
        this.orders = orders;
        console.log("totalOrderCount", totalOrderCount);
        this.totalOrderCount = totalOrderCount;
      } catch (error) {
        this.loadingOrders = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
      }
    },

    onPagination(val) {
      console.log("onPagination", val);
      this.orderPayload.pageNo = val.page;
      this.fetchOrders();
    },
    onPressShowOrder(val) {
      console.log("order item", val);
      this.order = val;
      this.orderDialog = true;
    },
  },
  computed: {
    modifiedOrders() {
      return this.orders.map((order) => {
        return {
          id: order.id,
          orderBy: `${order.orderBy.firstName} ${order.orderBy.lastName}`,
          orderDate: `${this.$moment(order.createdAt).format("LLL")}`,
          orderItems: order.items,
          orderType: order.orderType,
          orderStatus: order.orderStatus,
          deliveryStatus: order.deliveryStatus,
          orderNote: order.orderNote,
          order: order,
        };
      });
    },
  },
};
</script>

<style>
</style>