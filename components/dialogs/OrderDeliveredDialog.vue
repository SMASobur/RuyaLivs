<template>
  <v-dialog persistent v-model="shouldOpen" max-width="500px">
    <v-card>
      <v-card-title>Are you sure you this order is delivered ?</v-card-title>
      <v-card-text>
        This action is unchangeable.So, be careful before peroceed the action
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent" :disabled="loading" text @click="onClickClose"
          >Cancel</v-btn
        >
        <v-btn color="accent" :loading="loading" text @click="onOrderDelivered"
          >OK</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    shouldOpen: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapActions("order", ["deliveredOrder"]),
    onClickClose() {
      // console.log('onclickClose emiited');
      this.$emit("onclickClose");
    },
    async onOrderDelivered() {
      try {
        this.loading = true;
        this.$emit("onDeliveredRequestStarted");
        const orderDeliveredData = await this.deliveredOrder(this.orderId);
        // return;
        console.log("orderDeliveredData", orderDeliveredData);
        if (orderDeliveredData.success) {
          this.$emit("onclickClose");
          this.$emit("onDeliveredRequestSuccess", orderDeliveredData.message);
        }
      } catch (error) {
        console.log("orderDelivered error", error);
      } finally {
        this.loading = false;
        this.$emit("onOrderDeliveredCompleted");
      }
    },
  },
};
</script>

<style>
</style>