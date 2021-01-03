<template>
  <v-dialog persistent v-model="shouldOpen" max-width="500px">
    <v-card>
      <v-card-title>Are you sure you want to reject this order ?</v-card-title>
      <v-card-text>
        This action is unchangeable.So, be careful before peroceed the action
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="warning" :disabled="loading" text @click="onClickClose"
          >Cancel</v-btn
        >
        <v-btn color="success" :loading="loading" text @click="onOrderRejected"
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
    ...mapActions("order", ["rejectOrder"]),
    onClickClose() {
      // console.log('onclickClose emiited');
      this.$emit("onclickClose");
    },
    async onOrderRejected() {
      try {
        this.loading = true;
        this.$emit("onRejectRequestStarted");
        const orderRejectData = await this.rejectOrder(this.orderId);
        console.log("orderRejectData", orderRejectData);
        if (orderRejectData.success) {
          this.$emit("onclickClose");
          this.$emit("onRejectRequestSucess", orderRejectData.message);
        }
      } catch (error) {
        console.log("rejectOrder error", error);
      } finally {
        this.loading = false;
        this.$emit("onRejectRequestCompleted");
      }
    },
  },
};
</script>

<style>
</style>