<template>
  <v-dialog persistent v-model="shouldOpen" max-width="500px">
    <v-card>
      <v-card-title>{{ heading }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          :disabled="loading"
          text
          @click="onClickClose"
          >Cancel</v-btn
        >
        <v-btn
          color="success"
          :loading="loading"
          text
          @click="onOrderAccepted"
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
    heading: {
      type: String,
      required: true,
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
          this.$emit("onAcceptRequestSucess",orderAcceptData.message);
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