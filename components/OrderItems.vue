<template>
  <v-card tile outlined>
    <v-card-title>
      All ordered items
    </v-card-title>
    <v-card-text>
      <v-list dense v-for="(item,i) in order.items.cartItems" :key="i">
        <v-list-item-content>
          <v-list-item-title>{{item.productName}}</v-list-item-title>
          <v-list-item-subtitle>Quantity {{item.productQuantity}}</v-list-item-subtitle>
          <v-list-item-subtitle>Price {{item.productQuantity*item.pricePerUnit}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item-content>
          <v-list-item-title>Total item cost</v-list-item-title>
          <v-list-item-subtitle>{{order.items.totalCost}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-content>
          <v-list-item-title>Total payable cost</v-list-item-title>
          <v-list-item-subtitle>{{order.items.totalCost}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    order: {
      type: Object
    }
  }
};
</script>

<style>
</style>