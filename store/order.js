import getOrdersByUserIdQuery from "../gql/query/getOrdersByUserId.gql";

export const state = () => ({
    orderType: "Delivery",
    deliveryNote: "",
    orderUser: {},
    orders: []
})

export const mutations = {
    SET_ORDER_TYPE(state, orderType) {
        state.orderType = orderType;
    },
    SET_ORDER_USER_NAME(state, name) {
        state.orderUser.fullName = name;
    },
    SET_ORDER_USER_FULL_NAME(state, user) {
        state.orderUser.fullName = user.firstName + " " + user.lastName;
    },
    SET_ORDER_USER_EMAIL(state, email) {
        state.orderUser.email = email;
    },
    SET_ORDER_USER_CONTACT(state, contactNo) {
        state.orderUser.emergencyContactNo = contactNo;
    },
    SET_ORDER_USER_ADDRESS(state, address) {
        state.orderUser.address = address;
    },
    SET_ORDER_USER(state, user) {
        state.orderUser = user;
    },
    SET_ORDER_DELIVERY_NOTE(state, note) {
        state.deliveryNote = note;
    },
    CLEAR_ORDER_NOTE(state) {
        state.deliveryNote = "";
    },
    RESET_ORDER_TYPE(state) {
        state.orderType = "Delivery"
    },
    SET_ORDERS(state, orders) {
        state.orders = orders;
    }
}

export const actions = {
    setOrderType({ commit }, orderType) {
        commit('SET_ORDER_TYPE', orderType)
    },
    setOrderUserName({ commit }, name) {
        commit('SET_ORDER_USER_NAME', name);
    },
    setOrderUserEmail({ commit }, email) {
        commit('SET_ORDER_USER_EMAIL', email);
    },
    setOrderUserContactNo({ commit }, contactNo) {
        commit('SET_ORDER_USER_CONTACT', contactNo);
    },
    setOrderUserAddress({ commit }, address) {
        commit('SET_ORDER_USER_ADDRESS', address);
    },
    setOrderUser({ commit }, user) {
        commit('SET_ORDER_USER', user);
        commit('SET_ORDER_USER_FULL_NAME', user);
    },
    setOrderDeliveryNote({ commit }, note) {
        commit('SET_ORDER_DELIVERY_NOTE', note)
    },
    clearOrderNote({ commit }) {
        commit('CLEAR_ORDER_NOTE');
    },
    resetOrderType({ commit }) {
        commit('RESET_ORDER_TYPE');
    },

    async fetchOrderByUserId({ commit }, userId) {
        let client = this.app.apolloProvider.defaultClient;
        const orderInput = {
            userId: userId,
            // userId: "5ea178359ab6e429f8bde668",
            orderStatus: [],
            orderType:["DELIVERY","COLLECTION"]
        };
        const response = await client.query({
            query: getOrdersByUserIdQuery,
            variables: { orderInput },
            fetchPolicy: 'network-only'
        });
        console.log("getOrderResponse",response);
        const orders = response.data.getOrderByUserId.orders;
        commit('SET_ORDERS', orders);
    }

}

export const getters = {
    orderType(state) {
        return state.orderType;
    },
    orderUser(state) {
        return state.orderUser;
    },
    deliveryNote(state) {
        return state.deliveryNote;
    },
    deliveryMethod(state) {
        if (state.orderType === "Delivery")
            return "DELIVERY"
        else if (state.orderType === "Collection")
            return "COLLECTION"
    },
    orders(state) {
        return state.orders;
    }
}

