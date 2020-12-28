<template>
  <v-card tile outlined>
    <v-card-title>
      <div v-if="orderType == 'new'">New order !!!</div>
      <div v-else-if="orderType == 'processing'">Current order details</div>
      <div v-else-if="orderType == 'history'">Past order</div>
      <v-spacer />
      <v-btn @click="onCloseClicked" small text tile color="primary"
        >Close</v-btn
      >
    </v-card-title>
    <v-card-text>
      <v-list dense v-for="(item, i) in order.items.cartItems" :key="i">
        <v-list-item-content>
          <v-list-item-title
            >{{ item.productName }}
            <span v-if="item.productSize != 'default'"
              >({{ item.productSize }})</span
            ></v-list-item-title
          >
          <v-list-item-subtitle class="mt-1">
            Quantity
            <strong>{{ item.productQuantity }}</strong>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list>
      <v-divider></v-divider>
      <div v-if="order.orderNote.length != 0">
        <v-list>
          <v-list-item-content>
            <v-list-item-subtitle>Order Note</v-list-item-subtitle>
            <v-list-item-title class="mt-1">{{
              order.orderNote
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list>
        <v-divider></v-divider>
      </div>
      <div v-if="order.prepareTime > 0">
        <v-list>
          <v-list-item-content>
            <v-list-item-subtitle>Prepare Time</v-list-item-subtitle>
            <v-list-item-title class="mt-1"
              >{{ order.prepareTime }} min</v-list-item-title
            >
          </v-list-item-content>
        </v-list>
        <v-divider></v-divider>
      </div>

      <v-card-actions>
        <v-form v-model="isFormValid">
          <div class="d-flex align-center">
            <v-select
              v-model="prepareTime"
              :items="time"
              label="Prepare time"
              :rules="timeRules"
            ></v-select>
            <strong class="ml-2">minutes</strong>
          </div>
        </v-form>
        <v-spacer />
        <v-btn
          v-if="
            order.orderStatus == 'ACCEPTED' && order.deliveryStatus != 'READY'
          "
          small
          tile
          color="primary"
          :loading="loadingAdjust"
          @click="adjustOrderTime"
          >Adjust Time</v-btn
        >
        <v-btn
          v-if="
            order.orderStatus == 'ACCEPTED' && order.deliveryStatus != 'READY'
          "
          small
          tile
          :loading="loadingReady"
          color="success"
          @click="readyOrder"
          >Ready</v-btn
        >
        <v-btn
          v-if="order.orderStatus == 'PENDING'"
          :disabled="!isFormValid"
          :loading="loadingAccept"
          small
          tile
          color="success"
          @click="acceptOrder"
          >Accept</v-btn
        >
        <v-btn
          v-if="order.orderStatus == 'PENDING'"
          small
          tile
          color="error"
          @click="confirmDialog = true"
          >Reject</v-btn
        >
      </v-card-actions>
    </v-card-text>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Reject Order ?</v-card-title>
        <v-card-text>Are you sure you want to reject this order ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDialog = false"
            >Close</v-btn
          >
          <v-btn
            color="warning"
            text
            :loading="loadingReject"
            @click="rejectOrder"
            >Confirm Reject</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import acceptOrderGql from "@/gql/mutation/acceptOrder.gql";
import updateOrderStatusGql from "@/gql/mutation/updateOrderStatus.gql";
import updateDeliveryStatusGql from "@/gql/mutation/updateDeliveryStatus.gql";
import adjustOrderTimeGql from "@/gql/mutation/adjustOrderTime.gql";
export default {
  props: {
    order: {
      type: Object,
    },
    orderType: {
      type: String,
      default: "new",
    },
  },
  data() {
    return {
      time: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      isFormValid: false,
      timeRules: [(v) => !!v || "Time is required"],
      loadingAccept: false,
      loadingReject: false,
      loadingReady: false,
      loadingAdjust: false,
      prepareTime: 30,
      confirmDialog: false,
    };
  },
  methods: {
    onCloseClicked() {
      this.$emit("onCloseClicked");
    },
    onAcceptedAclicked() {
      this.$emit("onAcceptedAclicked", this.prepareTime);
    },
    onRejectedclicked() {
      this.$emit("onRejectedclicked");
    },
    onReadyclicked() {
      this.$emit("onReadyclicked", this.order);
    },
    onAdjustClicked() {
      this.$emit("onAdjustClicked", this.prepareTime);
    },
    async acceptOrder() {
      try {
        this.loadingAccept = true;
        const input = {
          id: this.order.id,
          prepareTime: this.prepareTime,
        };
        const response = await this.$apollo.mutate({
          mutation: acceptOrderGql,
          variables: { input },
        });
        const data = response.data.acceptOrder;
        this.loadingAccept = false;
        // this.onCloseClicked();
        this.onAcceptedAclicked();
        this.$notifier.showMessage({
          content: data.message,
          color: "success",
        });
      } catch (error) {
        this.loadingAccept = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
      }
    },
    async rejectOrder() {
      try {
        this.loadingReject = true;
        const input = {
          id: this.order.id,
          status: "REJECTED",
        };
        const response = await this.$apollo.mutate({
          mutation: updateOrderStatusGql,
          variables: { input },
        });
        const data = response.data.updateOrderStatus;
        this.loadingReject = false;
        // this.onCloseClicked();
        this.onRejectedclicked();
        this.$notifier.showMessage({
          content: data.message,
          color: "success",
        });
      } catch (error) {
        this.loadingReject = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
      }
    },
    async readyOrder() {
      try {
        this.loadingReady = true;
        const input = {
          id: this.order.id,
          status: "READY",
        };
        const response = await this.$apollo.mutate({
          mutation: updateDeliveryStatusGql,
          variables: { input },
        });
        const data = response.data.updateDeliveryStatus;
        this.loadingReady = false;
        this.onReadyclicked();
        this.$notifier.showMessage({
          content: data.message,
          color: "success",
        });
      } catch (error) {
        this.loadingReady = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
      }
    },
    async adjustOrderTime() {
      try {
        this.loadingAdjust = true;
        const input = {
          id: this.order.id,
          prepareTime: this.prepareTime,
        };
        const response = await this.$apollo.mutate({
          mutation: adjustOrderTimeGql,
          variables: { input },
        });
        const data = response.data.adjustOrderTime;
        this.loadingAdjust = false;
        // this.onCloseClicked();
        this.onAdjustClicked();
        this.$notifier.showMessage({
          content: data.message,
          color: "success",
        });
      } catch (error) {
        this.loadingAdjust = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error",
        });
      }
    },
  },
};
</script>

<style>
</style>