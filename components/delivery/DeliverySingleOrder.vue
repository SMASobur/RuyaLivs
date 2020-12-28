<template>
  <v-card tile outlined>
    <v-card-title>
      <div v-if="orderType == 'new'">New delivery !!!</div>
      <div v-else-if="orderType == 'processing'">Current delivery</div>
      <div v-else-if="orderType == 'history'">Past delivery</div>
      <v-spacer />
      <v-btn @click="onCloseClicked" small text tile color="primary"
        >Close</v-btn
      >
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item-content>
          <v-list-item-subtitle>Order By</v-list-item-subtitle>
          <v-list-item-title class="mt-1">{{
            order.orderAddress.fullName
          }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-subtitle>Order Address</v-list-item-subtitle>
          <v-list-item-title class="mt-1">{{
            order.orderAddress.address
          }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-subtitle>Contact No</v-list-item-subtitle>
          <v-list-item-title class="mt-1">{{
            order.orderAddress.emergencyContactNo
          }}</v-list-item-title>
        </v-list-item-content>
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
        <v-list-item-content v-if="order.orderNote.length != 0">
          <v-list-item-subtitle>Order Note</v-list-item-subtitle>
          <v-list-item-title class="mt-1">{{
            order.orderNote
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list>

      <v-list-item>
        <v-expansion-panels accordion focusable class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-header>Order items</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense v-for="(item, i) in order.items.cartItems" :key="i">
                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.productName }}
                    <span v-if="item.productSize != 'default'"
                      >({{ item.productSize }})</span
                    ></v-list-item-title
                  >
                  <v-list-item-subtitle
                    >Quantity {{ item.productQuantity }}</v-list-item-subtitle
                  >
                  <v-list-item-subtitle
                    >Price
                    {{
                      item.productQuantity * item.pricePerUnit
                    }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list-item>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          v-if="order.deliveryStatus == 'PICKED_UP'"
          small
          tile
          :loading="loadingDelivered"
          color="success"
          block
          @click="completeDelivery"
          >Complete Delivery</v-btn
        >
        <v-btn
          v-if="order.deliveryStatus == 'READY'"
          :loading="loadingAccept"
          small
          tile
          block
          color="success"
          @click="acceptDelivery"
          >I am on it</v-btn
        >
      </v-card-actions>
    </v-card-text>
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
      isFormValid: false,
      loadingDelivered: false,
      loadingAccept: false,
      deliveryStatus: "PICKED_UP",
    };
  },
  methods: {
    onCloseClicked() {
      this.$emit("onCloseClicked");
    },
    onAcceptedAclicked() {
      this.$emit("onAcceptedAclicked");
    },
    onRejectedclicked() {
      this.$emit("onRejectedclicked");
      ``;
    },
    onDeliveredclicked() {
      this.$emit("onDeliveredclicked", this.order);
    },
    onAdjustClicked() {
      this.$emit("onAdjustClicked", this.prepareTime);
    },

    async acceptDelivery() {
      try {
        this.loadingAccept = true;
        const input = {
          id: this.order.id,
          status: "PICKED_UP",
        };
        const response = await this.$apollo.mutate({
          mutation: updateDeliveryStatusGql,
          variables: { input },
        });
        const data = response.data.updateDeliveryStatus;
        this.loadingAccept = false;
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
    async completeDelivery() {
      try {
        this.loadingDelivered = true;
        const input = {
          id: this.order.id,
          status: "DELIVERED",
        };
        const response = await this.$apollo.mutate({
          mutation: updateDeliveryStatusGql,
          variables: { input },
        });
        const data = response.data.updateDeliveryStatus;
        this.loadingDelivered = false;
        this.onDeliveredclicked();
        this.$notifier.showMessage({
          content: data.message,
          color: "success",
        });
      } catch (error) {
        this.loadingDelivered = false;
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