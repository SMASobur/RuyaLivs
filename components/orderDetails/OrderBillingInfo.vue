<template>
  <v-card tile outlined class="mb-4">
    <v-card-title>Order Billing Information</v-card-title>
    <v-row>
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Name</v-list-item-subtitle>
              <v-list-item-title>{{ orderAddress.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
              <v-list-item-title>{{ orderAddress.email }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Contact No</v-list-item-subtitle>
              <v-list-item-title>{{ orderAddress.phoneNo }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Address Line 1</v-list-item-subtitle>
              <v-list-item-title>{{
                orderAddress.address[0]
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="orderAddress.address[1]">
            <v-list-item-content>
              <v-list-item-subtitle>Address Line 2</v-list-item-subtitle>
              <v-list-item-title>{{
                orderAddress.address[1]
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Order Type</v-list-item-subtitle>
              <v-list-item-title>{{ orderType }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="orderNote">
            <v-list-item-content>
              <v-list-item-subtitle>Order Note</v-list-item-subtitle>
              <v-list-item-title>{{ orderNote }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Country</v-list-item-subtitle>
              <v-list-item-title>{{ orderAddress.country }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>City</v-list-item-subtitle>
              <v-list-item-title>{{ orderAddress.city }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Postal Code</v-list-item-subtitle>
              <v-list-item-title>{{
                orderAddress.postalCode
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Organization No.</v-list-item-subtitle>
              <v-list-item-title>{{
                orderAddress.organizationNo
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    orderAddress: {
      type: Object,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
    },
    orderNote: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
</style>