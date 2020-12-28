<template>
  <v-card tile outlined>
    <v-card-title>Single order details</v-card-title>
    <v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Order ID</v-list-item-subtitle>
          <v-list-item-title>{{ order.id }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Ordered at</v-list-item-subtitle>
          <v-list-item-title>{{
            $moment(order.createdAt).format("LLL")
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Order Status</v-list-item-subtitle>
          <v-list-item-title>{{ order.orderStatus }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Delivery Status</v-list-item-subtitle>
          <v-list-item-title>{{ order.deliveryStatus }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>Delivery Time</v-list-item-subtitle>
          <v-list-item-title
            >Not specified (kitchen will update soon)</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="order.orderNote.length > 0">
        <v-list-item-content>
          <v-list-item-subtitle>Order Note</v-list-item-subtitle>
          <v-list-item-title>{{ order.orderNote }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-expansion-panels accordion focusable class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-header>Order items</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense v-for="(item, i) in order.items.cartItems" :key="i">
                <v-list-item-content>
                  <v-list-item-title
                    >{{ item.productName
                    }}<span v-if="item.productSize != 'default'"
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
              <v-divider></v-divider>
              <v-list>
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
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
    },
  },
};
</script>

<style>
</style>