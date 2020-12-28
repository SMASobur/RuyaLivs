<template>
  <v-container>
    <div class="d-flex justify-center mt-4">
      <v-progress-circular
        color="accent"
        indeterminate
        v-if="$fetchState.pending"
        class="align-self-center"
      ></v-progress-circular>
    </div>
    <div v-if="allReservations.length == 0 && !$fetchState.pending">
      <p>You have not placed any reservation yet ! Go to reservation and book now.</p>
      <v-btn tile to="/reservation" color="accent">Reservation</v-btn>
    </div>
    <div v-else-if="allReservations.length !== 0 && !$fetchState.pending">
      <!-- <h3>My Reservations</h3> -->
      <v-list v-for="(reservation,index) in allReservations" :key="index">
        <h4>Reservation #{{index+1}}</h4>
        <v-card tile outlined>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>
                Reservation ID
                <v-chip x-small v-if="reservation.isPreOrder" color="orange" text-color="white">
                  Pre Order
                  <!-- <v-icon right>mdi-star</v-icon> -->
                </v-chip>
              </v-list-item-subtitle>
              <v-list-item-title>{{reservation.id}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Reserved at</v-list-item-subtitle>
              <v-list-item-title>{{$moment(reservation.createdAt).format("LLL")}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Number of guest</v-list-item-subtitle>
              <v-list-item-title>{{reservation.numberOfPeople}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Desired Date</v-list-item-subtitle>
              <v-list-item-title>{{$moment(reservation.desiredDate).format("dddd, MMMM Do YYYY")}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Desired Time</v-list-item-subtitle>
              <v-list-item-title>{{$moment(reservation.desiredTime,"HH:mm").format("hh:mm A")}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Reservation Status</v-list-item-subtitle>
              <v-list-item-title>{{reservation.reservationStatus}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="reservation.order">
            <v-expansion-panels accordion focusable class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-header>Order items</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list dense v-for="(item,i) in reservation.order.items.cartItems" :key="i">
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
                      <v-list-item-subtitle>{{reservation.order.items.totalCost}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>Total payable cost</v-list-item-title>
                      <v-list-item-subtitle>{{reservation.order.items.totalCost}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item>
        </v-card>
      </v-list>
    </div>
  </v-container>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";
import authRules from "@/utils/authRuls";
import addReservationGql from "@/gql/mutation/addReservation.gql";
import getReservationByUserIdGql from "@/gql/query/getReservationByUserId.gql";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  async fetch() {
    await this.getReservationByUserId();
  },
  data() {
    return {};
  },

  methods: {
    ...mapActions("reservation", ["getReservationByUserId"])
  },
  computed: {
    ...mapGetters("reservation", ["allReservations"])
  },
  middleware: ["isAuth"]
};
</script>
