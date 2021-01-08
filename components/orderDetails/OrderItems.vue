<template>
  <div>
    <v-card tile outlined>
      <div class="d-flex justify-space-between">
        <v-card-title>Or der Items</v-card-title>
      </div>

      <v-data-table
        :headers="headers"
        :items="items.cartItems"
        hide-default-footer
        disable-sort
      >
        <template v-slot:item.totalPrice="{ item }">
          {{ item.pricePerUnit * item.productQuantity }}
        </template>
      </v-data-table>
      <v-divider />
      <div  class="d-flex justify-space-between my-4" style="margin-end: 12em; margin-start: 1em;">
        <div class="headning">Total cost:</div>
        <div> {{ items.totalCost }}</div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      required: true,
    },
    orderId: {
      type: String,
      default: "not-given",
    },
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "productName" },
        { text: "Quantity", value: "productQuantity" },
        { text: "Price/Unit", value: "pricePerUnit" },
        { text: "Total Price", value: "totalPrice", srotable: true },
      ],
    };
  },
};
</script>

<style>
</style>