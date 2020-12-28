<template>
  <div>
    <div class="d-flex justify-end">
      <v-switch @change="onPasueOrderChange" v-model="snoozeShowOrder" label="Pause new delivery"></v-switch>
    </div>
    <v-tabs
      v-model="tab"
      background-color="primary"
      slider-color="orange"
      slider-size="5"
      grow
      dark
      align-with-title
    >
      <v-tab>CURRENT</v-tab>
      <v-tab>HISTORY</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :value="0">
        <client-only>
          <v-data-table
            :headers="headers"
            :items="modifiedProcessingOrders"
            :items-per-page="processingOrdersPayload.limit"
            :server-items-length="totalProcessingOrdersCount"
            class="elevation-1"
            disable-sort
            @pagination="onPaginationProcessingOrders"
            :loading="loadingProcessingOrders"
            loading-text="Loading processing orders..."
            @click:row="onClickRow"
          ></v-data-table>
        </client-only>
      </v-tab-item>
      <v-tab-item :value="1">
        <client-only>
          <v-data-table
            :headers="historyHeaders"
            :items="modifiedOrderHistory"
            :items-per-page="orderHistoryPayload.limit"
            :server-items-length="totalOrderHistoryCount"
            class="elevation-1"
            disable-sort
            @pagination="onPaginationOrderHistory"
            :loading="loadingOrdersHistory"
            loading-text="Loading orders history..."
            @click:row="onClickRowHistory"
          ></v-data-table>
        </client-only>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog persistent v-model="deliveryDialog" max-width="700px">
      <DeliverySingleOrder
        :order="order"
        :orderType="orderType"
        @onAcceptedAclicked="onAcceptedAclicked"
        @onRejectedclicked="onRejectedclicked"
        @onDeliveredclicked="onDeliveredclicked"
        @onAdjustClicked="onAdjustClicked"
        @onCloseClicked="onCloseClicked"
      />
    </v-dialog>
  </div>
</template>

<script>
import allOrdersQuery from "@/gql/query/getOrders.gql";
import DeliverySingleOrder from "@/components/delivery/DeliverySingleOrder.vue";
export default {
  layout: "delivery",
  async fetch() {
    // this.fetchOrderHistory();
  },
  components: {
    DeliverySingleOrder
  },
  data() {
    return {
      loadingOrdersHistory: false,
      loadingProcessingOrders: false,
      loadingNewOrder: false,
      deliveryDialog: false,
      orderHistoryPayload: {
        pageNo: 1,
        limit: 15,
        status: ["ACCEPTED", "REJECTED"],
        deliveryStatus: ["DELIVERED"]
      },
      processingOrdersPayload: {
        pageNo: 1,
        limit: 15,
        status: ["ACCEPTED"],
        deliveryStatus: ["PICKED_UP"]
      },
      newOrderPayload: {
        pageNo: 1,
        limit: 1,
        status: ["ACCEPTED"],
        deliveryStatus: ["READY"]
      },
      processingOrders: [],
      ordersHistory: [],
      order: null,
      newOrders: [],
      totalOrderHistoryCount: 0,
      totalProcessingOrdersCount: 0,
      totalNewOrdersCount: 0,
      headers: [
        { text: "Order By", value: "orderBy" },
        { text: "Address", value: "orderAddress" },
        // { text: "Order ID", value: "id" },
        // { text: "Order Type", value: "orderType" },
        // { text: "Order Status", value: "orderStatus" },
        { text: "Delivery Status", value: "deliveryStatus" }
        // { text: "Delivery Status", value: "deliveryStatus" },
        // { text: "Actions", value: "actions", sortable: false }
      ],
      historyHeaders: [
        { text: "Order By", value: "orderBy" },
        // { text: "Order Date", value: "orderDate" },
        { text: "Address", value: "orderAddress" },
        // { text: "Order ID", value: "id" },
        // { text: "Order Type", value: "orderType" },
        // { text: "Order Status", value: "orderStatus" },
        { text: "Delivery Status", value: "deliveryStatus" }
        // { text: "Actions", value: "actions", sortable: false }
      ],
      tab: 0,
      snoozeShowOrder: false,
      interval: null,
      orderType: "new"
    };
  },
  methods: {
    async fetchOrderHistory() {
      try {
        this.loadingOrdersHistory = true;
        const response = await this.$apollo.query({
          query: allOrdersQuery,
          variables: { input: this.orderHistoryPayload },
          fetchPolicy: "network-only"
        });
        this.loadingOrdersHistory = false;
        const ordersHistory = response.data.getOrders.orders;
        const totalOrderCount = response.data.getOrders.count;
        console.log("ordersHistory", ordersHistory);
        this.ordersHistory = ordersHistory;
        console.log("totalOrderHistoryCount", totalOrderCount);
        this.totalOrderHistoryCount = totalOrderCount;
      } catch (error) {
        this.loadingOrdersHistory = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error"
        });
      }
    },
    async fetchProcessingOrders() {
      try {
        this.loadingProcessingOrders = true;
        const response = await this.$apollo.query({
          query: allOrdersQuery,
          variables: { input: this.processingOrdersPayload },
          fetchPolicy: "network-only"
        });
        this.loadingProcessingOrders = false;
        const processingOrders = response.data.getOrders.orders;
        const totalOrderCount = response.data.getOrders.count;
        console.log("processingOrders", processingOrders);
        this.processingOrders = processingOrders;
        console.log("totalProcessingOrdersCount", totalOrderCount);
        this.totalProcessingOrdersCount = totalOrderCount;
      } catch (error) {
        this.loadingProcessingOrders = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error"
        });
      }
    },
    async fetchNewOrder() {
      try {
        this.loadingNewOrder = true;
        const response = await this.$apollo.query({
          query: allOrdersQuery,
          variables: { input: this.newOrderPayload },
          fetchPolicy: "network-only"
        });
        this.loadingNewOrder = false;
        const newOrders = response.data.getOrders.orders;
        const totalOrderCount = response.data.getOrders.count;
        console.log("newOrders", newOrders);
        this.newOrders = newOrders;
        if (this.newOrders.length > 0) {
          this.showNewOrder();
        }
        console.log("newOrders", totalOrderCount);
        this.totalNewOrdersCount = totalOrderCount;
      } catch (error) {
        this.loadingNewOrder = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error"
        });
      }
    },

    onPaginationOrderHistory(val) {
      // console.log("onPaginationOrderHistory", val);
      this.orderHistoryPayload.pageNo = val.page;
      this.fetchOrderHistory();
    },
    onPaginationProcessingOrders(val) {
      // console.log("onPaginationProcessingOrders", val);
      this.processingOrdersPayload.pageNo = val.page;
      this.fetchProcessingOrders();
    },
    onClickRow(val) {
      console.log("table row", val);
      this.order = val.order;
      this.orderType = "processing";
      this.deliveryDialog = true;
      this.stopNewOrder();
    },
    onClickRowHistory(val) {
      this.order = val.order;
      this.orderType = "history";
      this.deliveryDialog = true;
      this.stopNewOrder();
    },
    onCloseClicked() {
      this.deliveryDialog = false;
      if (!this.snoozeShowOrder) {
        this.enableNewOrder();
      }
    },
    onAcceptedAclicked(prepareTime) {
      this.deliveryDialog = false;
      this.order.deliveryStatus = "PICKED_UP";
      this.processingOrders.push(this.order);
      if (this.totalProcessingOrdersCount == 0) {
        this.totalProcessingOrdersCount = this.processingOrders.length;
      }
      if (this.totalOrderHistoryCount == 0) {
        this.totalOrderHistoryCount = 1;
      }
      if (!this.snoozeShowOrder) {
        this.enableNewOrder();
      }
    },
    onRejectedclicked() {
      this.deliveryDialog = false;
      this.order.orderStatus = "REJECTED";
      this.ordersHistory.push(this.order);
      if (!this.snoozeShowOrder) {
        this.enableNewOrder();
      }
    },
    onDeliveredclicked(order) {
      this.deliveryDialog = false;
      const index = this.processingOrders.indexOf(order);
      this.processingOrders.splice(index, 1);
      order.deliveryStatus = "DELIVERED";
      this.ordersHistory.unshift(order);
      if (!this.snoozeShowOrder) {
        this.enableNewOrder();
      }
    },
    onAdjustClicked(prepareTime) {
      this.deliveryDialog = false;
      const index = this.processingOrders.indexOf(this.order);
      this.order.prepareTime = prepareTime;
      Object.assign(this.processingOrders[index], this.orders);

      if (!this.snoozeShowOrder) {
        this.enableNewOrder();
      }
    },
    enableNewOrder() {
      this.interval = setInterval(() => {
        this.fetchNewOrder();
        // console.log("I am called",this.interval);
      }, 20000);
    },
    stopNewOrder() {
      clearInterval(this.interval);
    },
    showNewOrder() {
      this.stopNewOrder();
      console.log("all new orders", this.newOrders[0]);
      this.order = this.newOrders[0];
      this.orderType = "new";
      this.deliveryDialog = true;
    },
    onPasueOrderChange(val) {
      console.log("onPasueOrderChange", val);
      if (val) {
        this.stopNewOrder();
      } else {
        this.enableNewOrder();
      }
    }
  },
  mounted() {
    this.onPasueOrderChange(false);
  },
  beforeDestroy() {
    this.stopNewOrder();
  },
  computed: {
    modifiedOrderHistory() {
      return this.ordersHistory.map(order => {
        return {
          id: order.id,
          orderBy: `${order.orderBy.firstName} ${order.orderBy.lastName}`,
          orderAddress: order.orderAddress.address,
          orderDate: `${this.$moment(order.createdAt).format("LLL")}`,
          orderItems: order.items,
          orderType: order.orderType,
          orderStatus: order.orderStatus,
          deliveryStatus: order.deliveryStatus,
          orderNote: order.orderNote,
          order: order
        };
      });
    },
    modifiedProcessingOrders() {
      return this.processingOrders.map(order => {
        return {
          id: order.id,
          orderBy: `${order.orderBy.firstName} ${order.orderBy.lastName}`,
          orderAddress: order.orderAddress.address,
          orderDate: `${this.$moment(order.createdAt).format("LLL")}`,
          orderItems: order.items,
          orderType: order.orderType,
          orderStatus: order.orderStatus,
          deliveryStatus: order.deliveryStatus,
          orderNote: order.orderNote,
          order: order
        };
      });
    }
  }
};
</script>

<style>
</style>