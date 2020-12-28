import gql from 'graphql-tag';
import addReservationGql from "@/gql/mutation/addReservation.gql";
import getReservationByUserIdGql from "@/gql/query/getReservationByUserId.gql";

export const state = () => ({
    isReservationWithPreOrderActive: false,
    numberOfPeople: null,
    reservationDate: null,
    reservationTime: null,
    addReservationResponse: null,
    isAddReservationLoading: false,
    isGetReservationByUserIdLoading: false,
    reservations: [],
    selectedReservation: 1
})

export const mutations = {
    ACTIVATE_RESERVATION_WITH_PRE_ORDER(state) {
        state.isReservationWithPreOrderActive = true;
    },
    DEACTIVATE_RESERVATION_WITH_PRE_ORDER(state) {
        state.isReservationWithPreOrderActive = false;
    },
    SET_RESERVATION_NO_OF_PEOPLE(state, number) {
        state.numberOfPeople = number
    }
    ,
    SET_RESERVATION_DATE(state, date) {
        state.reservationDate = date;
    },
    SET_RESERVATION_TIME(state, time) {
        state.reservationTime = time
    },
    SET_RESERVATION_RESPONSE(state, response) {
        state.addReservationResponse = response;
    },
    SET_IS_LOADING_TRUE(state) {
        state.isAddReservationLoading = true;

    },
    SET_IS_LOADING_FALSE(state) {
        state.isAddReservationLoading = false;
    },
    SET_IS_GET_RESERVATION_BY_USER_ID_LOADING_TRUE(state) {
        state.isGetReservationByUserIdLoading = true;

    },
    SET_IS_GET_RESERVATION_BY_USER_ID_LOADING_FALSE(state) {
        state.isGetReservationByUserIdLoading = false;
    },
    SET_RESERVATIONS(state, reservations) {
        state.reservations = reservations;
    },
    RESET_RESERVATION(state) {
        state.numberOfPeople = null;
        state.reservationDate = null;
        state.reservationTime = null;
    },
    SET_SELECTED_RESERVATION(state, val) {
        state.selectedReservation = val
    }
}

export const actions = {
    activateReservationWithPreOrder({ commit }) {
        commit('ACTIVATE_RESERVATION_WITH_PRE_ORDER');
    },
    deActivateReservationWithPreOrder({ commit }) {
        commit('DEACTIVATE_RESERVATION_WITH_PRE_ORDER');
    },
    setReservationNoOfPeople({ commit }, number) {
        commit('SET_RESERVATION_NO_OF_PEOPLE', number);
    }
    ,
    setReservationDate({ commit }, date) {
        commit('SET_RESERVATION_DATE', date);
    },
    setReservationTime({ commit }, time) {
        commit('SET_RESERVATION_TIME', time);
    },
    setReservationResponse({ commit, response }) {

    },
    setReservations({ commit, reservations }) {
        commit('SET_RESERVATIONS', reservations);
    },
    setSelectedReservation({ commit }, val) {
        commit('SET_SELECTED_RESERVATION', val);
    },
    async submitReservation({ state, commit }) {

        const userId = this.$cookies.get("user-id");
        const reservation = {
            numberOfPeople: state.numberOfPeople,
            desiredDate: state.reservationDate,
            desiredTime: state.reservationTime,
            reservedBy: userId
        };
        commit("SET_IS_LOADING_TRUE");
        let client = this.app.apolloProvider.defaultClient;
        try {
            const response = await client.mutate({
                mutation: addReservationGql,
                variables: { reservation }
            });
            const data = response.data.addReservation;
            commit("RESET_RESERVATION");
            commit("SET_IS_LOADING_FALSE");
            this.$router.push("/current_reservation");
            this.$notifier.showMessage({
                content: data.message,
                color: "success"
            });

            // console.log("reservation response", data);
        } catch (err) {
            // console.log("reservation error", err);
            commit("SET_IS_LOADING_FALSE");
            this.$notifier.showMessage({
                content: err.message,
                color: "error"
            });
        }
    },
    async getReservationByUserId({ state, commit }) {
        console.log('entered reservation store');
        const userId = this.$cookies.get("user-id");
        commit("SET_IS_GET_RESERVATION_BY_USER_ID_LOADING_TRUE");
        this.loadingReservation = true;
        const input = {
            userId: userId,
            reservationStatus: ["PENDING","ACCEPTED","CANCELLED"],
            limit: 5,
            pageNo: 1
        };
        let client = this.app.apolloProvider.defaultClient;
        try {
            const response = await client.query({
                query: getReservationByUserIdGql,
                variables: { input },
                fetchPolicy: 'network-only'
            });
            const data = response.data.getReservationByUserId;
            commit("SET_IS_GET_RESERVATION_BY_USER_ID_LOADING_FALSE");
            console.log('reservations', data.reservations);
            commit('SET_RESERVATIONS', data.reservations);

        } catch (err) {
            console.log("reservation by user id error", err);
            commit("SET_IS_GET_RESERVATION_BY_USER_ID_LOADING_FALSE");

        }
    }
}

export const getters = {
    isReservationWithPreOrderActive(state) {
        return state.isReservationWithPreOrderActive;
    },
    reservationFormInfo(state) {
        return {
            numberOfPeople: state.numberOfPeople,
            reservationDate: state.reservationDate,
            reservationTime: state.reservationTime
        }
    },
    isAddReservationLoading(state) {
        return state.isAddReservationLoading;
    },
    isGetReservationByUserIdLoading(state) {
        return state.isGetReservationByUserIdLoading;
    },
    allReservations(state) {
        return state.reservations
    },
    getSelectedReservation(state) {
        return state.selectedReservation;
    }
}