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
          <template v-slot:item.orderStatus="{ item }">
            <v-chip
              v-if="item.order.orderStatus === 'ACCEPTED'"
              color="success"
              small
            >
              ACCEPTED
            </v-chip>
            <v-chip
              v-if="item.order.orderStatus === 'REJECTED'"
              color="error"
              small
            >
              REJECTED
            </v-chip>
            <v-chip
              v-if="item.order.orderStatus === 'PENDING'"
              color="warning"
              small
            >
              PENDING
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn x-small tile color="accent" :to="`/admin/order/${item.order.id}`"
              >Details</v-btn
            >
            <v-btn
              v-if="item.order.orderStatus === 'PENDING'"
              x-small
              tile
              color="success"
              :loading="
                selectedItem && item.id === selectedItem.id && acceptInProgress
              "
              @click="onClcikAcceptOrder(item.order)"
              >Accept</v-btn
            >
            <v-btn
              v-if="item.order.orderStatus === 'PENDING'"
              x-small
              tile
              color="error"
              :loading="
                selectedItem && item.id === selectedItem.id && rejectInProgress
              "
              @click="onClcikRejectOrder(item.order)"
              >Reject</v-btn
            >
          </template>
        </v-data-table>
      </client-only>
    </v-col>
    <v-dialog v-model="orderDialog" max-width="700px">
      <SingleOrder :order="order" />
    </v-dialog>
    <div v-if="selectedItem">
      <OrderAcceptDialog
        :shouldOpen="shouldShowAcceptDialog"
        @onclickClose="onClickCloseAcceptOrder"
        @onAcceptRequestStarted="onAcceptRequestStarted"
        @onAcceptRequestCompleted="onAcceptRequestCompleted"
        @onAcceptRequestSucess="onAcceptRequestSucess"
        :orderId="selectedItem.id"
      />
    </div>
    <div v-if="selectedItem">
      <OrderRejectDialog
        :shouldOpen="shouldShowRejectDialog"
        @onclickClose="onClickCloseAcceptOrder"
        @onRejectRequestStarted="onRejectRequestStarted"
        @onRejectRequestCompleted="onRejectRequestCompleted"
        @onRejectRequestSucess="onRejectRequestSucess"
        :orderId="selectedItem.id"
      />
    </div>
  </v-row>
</template>

<script>
import allOrdersQuery from "@/gql/query/getOrders.gql";
import SingleOrder from "@/components/SingleOrder.vue";
import OrderAcceptDialog from "@/components/dialogs/OrderAcceptDialog.vue";
import OrderRejectDialog from "@/components/dialogs/OrderRejectDialog.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  layout: "admin",
  async fetch() {
    this.fetchOrders();
  },
  components: {
    SingleOrder,
    OrderAcceptDialog,
    OrderRejectDialog,
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
      shouldShowRejectDialog: false,
    };
  },
  methods: {
    onClcikAcceptOrder(item) {
      this.selectedItem = item;
      console.log("accepted item", this.selectedItem);
      this.shouldShowAcceptDialog = true;
    },
    onClcikRejectOrder(item) {
      this.selectedItem = item;
      console.log("rejected item", this.selectedItem);
      this.shouldShowRejectDialog = true;
    },
    onClickCloseAcceptOrder() {
      // console.log('onClickClose callded');
      this.shouldShowAcceptDialog = false;
      this.shouldShowRejectDialog = false;
    },
    onAcceptRequestStarted() {
      this.acceptInProgress = true;
    },
    onRejectRequestStarted() {
      this.rejectInProgress = true;
    },
    onAcceptRequestSucess(data) {
      this.selectedItem.orderStatus = "ACCEPTED";
      this.$notifier.showMessage({
        content: data,
        color: "primary",
      });
    },
    onRejectRequestSucess(data) {
      this.selectedItem.orderStatus = "REJECTED";
      this.$notifier.showMessage({
        content: data,
        color: "primary",
      });
    },
    onAcceptRequestCompleted() {
      this.acceptInProgress = false;
    },
    onRejectRequestCompleted() {
      this.rejectInProgress = false;
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