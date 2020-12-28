<template>
  <v-row>
    <v-col>
      <client-only>
        <v-data-table
          :headers="headers"
          :items="modifiedReservations"
          :items-per-page="reservationsPayload.limit"
          :server-items-length="totalReservationCount"
          class="elevation-1"
          @pagination="onPagination"
          disable-sort
          :loading="loadingReservations"
          loading-text="Loading reservations..."
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>All Reservations</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.order="{ item }">
            <v-btn
              x-small
              tile
              color="primary"
              v-if="item.isPreOrder==='Yes'"
              @click="onPressShowOrder(item.order)"
            >Show</v-btn>
          </template>
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon> -->
            <!-- <v-icon small @click="deleteItem(item)">mdi-delete</v-icon> -->
            <v-btn
              v-if="item.status ==='PENDING' || item.status ==='ACCEPTED'"
              x-small
              tile
              color="warning"
              :loading="loadingStatusUpdate && updatedStatusItemPayload.id == item.id && clickedButton=='CANCELLED'"
              @click="onRejectedReservation(item)"
            >Cancel</v-btn>
            <v-btn
              v-if="item.status ==='PENDING' || item.status ==='CANCELLED'"
              x-small
              tile
              color="primary"
              :loading="loadingStatusUpdate && updatedStatusItemPayload.id == item.id && clickedButton=='ACCEPTED'"
              @click="onAcceptedReservation(item)"
            >Accept</v-btn>
          </template>
        </v-data-table>
      </client-only>
    </v-col>
    <v-dialog v-model="orderDialog" max-width="700px">
      <OrderItems :order="order" />
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title v-if="clickedButton=='ACCEPTED'" class="headline">Confirm reservtaion ?</v-card-title>
        <v-card-title v-if="clickedButton=='CANCELLED'" class="headline">Cancel Reservation ?</v-card-title>
        <v-card-text
          v-if="clickedButton=='ACCEPTED'"
        >If you confirm the reservation, user will be notified.</v-card-text>
        <v-card-text
          v-if="clickedButton=='CANCELLED'"
        >If you cancel the reservation, user will be notified.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDialog = false">Close</v-btn>
          <v-btn v-if="clickedButton=='ACCEPTED'" color="success" text :loading="loadingStatusUpdate" @click="updateReservationStatus">Confirm Reservation</v-btn>
          <v-btn v-if="clickedButton=='CANCELLED'" color="warning" text :loading="loadingStatusUpdate" @click="updateReservationStatus">Cancel Reservation</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import allReservationsQuery from "@/gql/query/getReservations.gql";
import updateReservationStatusGql from "@/gql/mutation/updateReservationStatus.gql";
import OrderItems from "@/components/OrderItems.vue";
export default {
  layout: "admin",
  async fetch() {
    this.fetchReservations();
  },
  components: {
    OrderItems
  },
  data() {
    return {
      reservationsPayload: {
        pageNo: 1,
        limit: 15,
        reservationStatus: []
      },
      reservations: [],
      totalReservationCount: 0,
      headers: [
        { text: "Reserved by", value: "reservedBy" },
        { text: "Desired Date & Time", value: "deseiredDate" },
        // { text: "Time", value: "desiredTime" },
        { text: "Guest(s)", value: "totalGuest" },
        { text: "Pre-Order", value: "isPreOrder" },
        { text: "Items", value: "order" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      orderDialog: false,
      order: null,
      updatedStatusItemPayload: {
        id: "",
        status: ""
      },
      loadingStatusUpdate: false,
      selectedItemIndex: -1,
      selectedItem: null,
      clickedButton: "ACCEPTED",
      confirmDialog: false,
      loadingReservations:false
    };
  },
  methods: {
    async fetchReservations() {
      try {
        this.loadingReservations = true;
        const response = await this.$apollo.query({
          query: allReservationsQuery,
          variables: { input: this.reservationsPayload },
          fetchPolicy: "network-only"
        });
        const reservations = response.data.getReservations.reservations;
        const totalReservationCount = response.data.getReservations.count;
        console.log("reservations", reservations);
        this.reservations = reservations;
        console.log("totalReservationCount", totalReservationCount);
        this.totalReservationCount = totalReservationCount;
        this.loadingReservations = false;
      } catch (error) {
        this.loadingReservations = false;
        this.$notifier.showMessage({
          content: error.message,
          color: "error"
        });
      }
    },
    async updateReservationStatus() {
      this.loadingStatusUpdate = true;
      try {
        const response = await this.$apollo.mutate({
          mutation: updateReservationStatusGql,
          variables: { input: this.updatedStatusItemPayload }
        });
        const updatedReservations = response.data.updateReservationStatus;
        console.log("updatedReservations", updatedReservations);
        this.loadingStatusUpdate = false;
        this.confirmDialog = false;

        this.$notifier.showMessage({
          content: updatedReservations.message,
          color: "success"
        });
        this.updateTableItem(updatedReservations.reservation.reservationStatus);
      } catch (error) {
        this.$notifier.showMessage({
          content: error.message,
          color: "error"
        });
        this.loadingStatusUpdate = false;
        this.confirmDialog = false;
        console.log("error", error);
      }
    },
    onPagination(val) {
      console.log("onPagination", val);
      this.reservationsPayload.pageNo = val.page;
      this.fetchReservations();
    },
    onPressShowOrder(val) {
      console.log("order item", val);
      this.order = val;
      this.orderDialog = true;
    },
    onAcceptedReservation(val) {

      this.clickedButton = "ACCEPTED";
      this.confirmDialog = true;
      this.updatedStatusItemPayload.id = val.id;
      this.selectedItemIndex = this.modifiedReservations.indexOf(val);
      this.selectedItem = val;
      this.updatedStatusItemPayload.status = "ACCEPTED";
      console.log("updatedStatusItemPayload", this.updatedStatusItemPayload);
    },
    onRejectedReservation(val) {
      this.clickedButton = "CANCELLED";
      this.confirmDialog = true;
      this.updatedStatusItemPayload.id = val.id;
      this.selectedItemIndex = this.modifiedReservations.indexOf(val);
      this.selectedItem = val;
      this.updatedStatusItemPayload.status = "CANCELLED";
      console.log("updatedStatusItemPayload", this.updatedStatusItemPayload);
    },
    updateTableItem(status) {
      console.log("statues", status);
      this.selectedItem.status = status;
      Object.assign(
        this.modifiedReservations[this.selectedItemIndex],
        this.selectedItem
      );
    }
  },
  computed: {
    modifiedReservations() {
      return this.reservations.map(reservation => {
        return {
          id: reservation.id,
          reservedBy: `${reservation.reservedBy.firstName} ${reservation.reservedBy.lastName}`,
          deseiredDate: `${this.$moment(reservation.desiredDate).format(
            "dddd, MMMM Do YYYY"
          )}, ${this.$moment(reservation.desiredTime, "HH:mm").format(
            "hh:mm A"
          )} `,
          desiredTime: this.$moment(reservation.desiredTime, "HH:mm").format(
            "hh:mm A"
          ),
          totalGuest: reservation.numberOfPeople,
          isPreOrder: reservation.isPreOrder ? "Yes" : "No",
          order: reservation.order ? reservation.order : null,
          status: reservation.reservationStatus
        };
      });
    }
  }
};
</script>

<style>
</style>