<template>
  <v-container>

    <v-card>
      <v-card-title>Create Reservation</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isReservervationFormValid">
          <v-select
            :items="items"
            :value="reservationFormInfo.numberOfPeople"
            :rules="peopleRules"
            dense
            prepend-icon="mdi-account-multiple-outline"
            label="Total person"
            outlined
            @change="onNumberOfPeopleChange"
          ></v-select>
          <v-dialog
            ref="dateDialog"
            v-model="dateModal"
            :return-value.sync="reservationDate"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="computedDateFormattedMomentjs"
                :rules="dateRules"
                label="Choose reservation date"
                prepend-icon="mdi-calendar-range-outline"
                readonly
                outlined
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="reservationDate" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dateDialog.save(reservationDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
          <v-dialog
            ref="timeDialog"
            v-model="timeModal"
            :return-value.sync="reservationTime"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="computedTimeFormattedMomentjs"
                :rules="timeRules"
                label="Choose Time"
                prepend-icon="mdi-clock-outline"
                readonly
                outlined
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="timeModal" v-model="reservationTime" ampm-in-title full-width>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="timeModal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.timeDialog.save(reservationTime)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
          <div class="d-flex align-center">
            <v-btn
              color="accent"
              tile
              small
              :disabled="!isReservervationFormValid"
              @click="onClickCreateReservation()"
              :loading="isAddReservationLoading"
            >Create</v-btn>
            <!-- <v-btn
                    color="success"
                    @click="activatePreOrderReservation"
                    tile
            >Reservation with Pre Order</v-btn>-->
            <v-switch
              class="mx-4"
              v-model="isPreOrder"
              @change="onPreOrderChange"
              label="With Preorder"
            ></v-switch>
            <v-tooltip color="info" max-width="300" top>
              <template v-slot:activator="{ on }">
                <v-icon color="info" dark v-on="on">mdi-information-outline</v-icon>
              </template>
              <span>
                When pre-order is activated, you can order food with reservation in advance.
                You can turn it off from here as well as from menu.
              </span>
            </v-tooltip>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import authRules from "@/utils/authRuls";
import addReservationGql from "@/gql/mutation/addReservation.gql";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      numberOfPeople: null,
      reservationDate: null,
      reservationTime: null,
      dateModal: false,
      timeModal: false,
      isReservervationFormValid: false,
      loading: false,
      loadingReservation: false,
      tab: "tab1",
      reservations: [],
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      selectedNoOfPeople: null,
      selected: 1,
      ...authRules
    };
  },
  methods: {
    async onSubmit() {
      this.submitReservation();
    },
    onClickCreateReservation() {
      if (this.isReservationWithPreOrderActive) this.$router.push("/menu");
      else this.onSubmit();
    },
    onTabChanged(currentTab) {
      // console.log("current tab", currentTab);
      if (currentTab == "tab2") {
        this.getReservationByUserId();
        console.log("reservation tab activated");
      }
    },
    onCurrentReservationSelected() {
      this.setSelectedReservation(2);
      console.log("refffss", this.$refs.btnReservation);
    },
    onPreOrderChange(val) {
      if (val) this.activateReservationWithPreOrder();
      else this.deActivateReservationWithPreOrder();
    },
    onNumberOfPeopleChange(val) {
      this.setReservationNoOfPeople(val);
    },
    resetReservationForm() {
      this.numberOfPeople = null;
      this.reservationDate = null;
      this.reservationTime = null;
    },
    activatePreOrderReservation() {
      this.activateReservationWithPreOrder();
      this.$router.push("/menu");
    },
    ...mapActions("reservation", [
      "activateReservationWithPreOrder",
      "deActivateReservationWithPreOrder",
      "setReservationNoOfPeople",
      "setReservationDate",
      "setReservationTime",
      "submitReservation",
      "getReservationByUserId",
      "setSelectedReservation"
    ])
  },
  watch: {
    reservationDate(val) {
      this.setReservationDate(val);
    },
    reservationTime(val) {
      this.setReservationTime(val);
    },
    getSelectedReservation(val) {
      if (val == 2) {
        console.log("val is 222");
        this.getReservationByUserId();
      }
    }
  },
  computed: {
    computedDateFormattedMomentjs() {
      return this.reservationFormInfo.reservationDate
        ? this.$moment(this.reservationFormInfo.reservationDate).format(
            "dddd, MMMM Do YYYY"
          )
        : "";
    },
    computedTimeFormattedMomentjs() {
      return this.reservationFormInfo.reservationTime
        ? this.$moment(
            this.reservationFormInfo.reservationTime,
            "HH:mm"
          ).format("hh:mm A")
        : "";
    },
    ...mapGetters("reservation", [
      "isReservationWithPreOrderActive",
      "reservationFormInfo",
      "isAddReservationLoading",
      "isGetReservationByUserIdLoading",
      "allReservations",
      "getSelectedReservation"
    ]),
    isPreOrder: {
      get() {
        return this.isReservationWithPreOrderActive;
      },
      set(newVal) {}
    }
  },
  middleware: ["isAuth"]
};
</script>
