<template>
  <v-dialog persistent v-model="shouldOpen" max-width="500px">
    <v-card>
      <v-card-title>Are you sure you want to accept the order ?</v-card-title>
      <v-card-text>
        This action is unchangeable.So, be careful before peroceed the action
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent" :disabled="loading" text @click="onClickClose"
          >Cancel</v-btn
        >
        <v-btn color="accent" :loading="loading" text @click="onOrderAccepted"
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
    ...mapActions("order", ["acceptOrder"]),
    onClickClose() {
      // console.log('onclickClose emiited');
      this.$emit("onclickClose");
    },
    async onOrderAccepted() {
      try {
        this.loading = true;
        this.$emit("onAcceptRequestStarted");
        const orderAcceptData = await this.acceptOrder(this.orderId);
        console.log("orderAcceptData", orderAcceptData);
        if (orderAcceptData.success) {
          this.$emit("onclickClose");
          this.$emit("onAcceptRequestSucess", orderAcceptData.message);
        }
      } catch (error) {
        console.log("acceptOrder error", error);
      } finally {
        this.loading = false;
        this.$emit("onAcceptRequestCompleted");
      }
    },
  },
};
</script>

<style>
</style>