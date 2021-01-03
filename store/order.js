import getOrdersByUserIdQuery from "../gql/query/getOrdersByUserId.gql";
import acceptOrderGql from "@/gql/mutation/acceptOrder.gql";
import updateOrderStatusGql from "@/gql/mutation/updateOrderStatus.gql";

export const state = () => ({
    orderType: "Delivery",
    deliveryNote: "",
    orderAddress: {
        address: []
    },
    orders: []
})

export const mutations = {
    SET_ORDER_TYPE(state, orderType) {
        state.orderType = orderType;
    },
    SET_ORDER_USER_NAME(state, name) {
        state.orderAddress.name = name;
    },
    SET_ORDER_USER_FULL_NAME(state, name) {
        state.orderAddress.name = name;
    },
    SET_ORDER_USER_ADDRESS1(state, address) {
        state.orderAddress.address[0] = address;
    },
    SET_ORDER_USER_ADDRESS2(state, address) {
        state.orderAddress.address[1] = address;
    },
    SET_ORDER_USER_CONTACT(state, phoneNo) {
        state.orderAddress.phoneNo = phoneNo;
    },
    SET_ORDER_USER_EMAIL(state, email) {
        state.orderAddress.email = email;
    },
    SET_ORDER_USER_POSTAL_CODE(state, postalCode) {
        state.orderAddress.postalCode = postalCode;
    },
    SET_ORDER_USER_CITY(state, city) {
        state.orderAddress.city = city;
    },
    SET_ORDER_USER_COUNTRY(state, country) {
        state.orderAddress.country = country;
    },
    SET_ORDER_USER_ORGANIZATION_NO(state, orgNo) {
        state.orderAddress.organizationNo = orgNo;
    },


    SET_ORDER_USER(state, user) {
        state.orderAddress = user;
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
    },
    RESET_ORDER_ADDRESS(state) {
        state.orderAddress = {
            address: []
        }
    }
}

export const actions = {
    setOrderType({ commit }, orderType) {
        commit('SET_ORDER_TYPE', orderType)
    },
    setOrderUserName({ commit }, name) {
        commit('SET_ORDER_USER_NAME', name);
    },
    setOrderUserAddress1({ commit }, address) {
        commit('SET_ORDER_USER_ADDRESS1', address);
    },
    setOrderUserAddress2({ commit }, address) {
        commit('SET_ORDER_USER_ADDRESS2', address);
    },
    setOrderUserContactNo({ commit }, phoneNo) {
        commit('SET_ORDER_USER_CONTACT', phoneNo);
    },
    setOrderUserEmail({ commit }, email) {
        commit('SET_ORDER_USER_EMAIL', email);
    },
    setOrderUserCity({ commit }, city) {
        commit('SET_ORDER_USER_CITY', city)
    },
    setOrderUserPostalCode({ commit }, postalCode) {
        commit('SET_ORDER_USER_POSTAL_CODE', postalCode)
    },
    setOrderUserCountry({ commit }, country) {
        commit('SET_ORDER_USER_COUNTRY', country)
    },
    setOrderUserOrganizationNo({ commit }, orgNo) {
        commit('SET_ORDER_USER_ORGANIZATION_NO', orgNo)
    },
    setOrderUser({ commit }, user) {
        commit('SET_ORDER_USER', user);
        // commit('SET_ORDER_USER_FULL_NAME', user);
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
    resetOrderAddress({ commit }) {
        commit("RESET_ORDER_ADDRESS");
    },

    async fetchOrderByUserId({ commit }, userId) {
        let client = this.app.apolloProvider.defaultClient;
        const orderInput = {
            userId: userId,
            // userId: "5ea178359ab6e429f8bde668",
            orderStatus: [],
            orderType: ["DELIVERY", "COLLECTION"]
        };
        const response = await client.query({
            query: getOrdersByUserIdQuery,
            variables: { orderInput },
            fetchPolicy: 'network-only'
        });
        console.log("getOrderResponse", response);
        const orders = response.data.getOrderByUserId.orders;
        commit('SET_ORDERS', orders);
    },
    async acceptOrder({ commit }, orderId) {
        try {

            let client = this.app.apolloProvider.defaultClient;
            const input = {
                id: orderId
            };
            const response = await client.mutate({
                mutation: acceptOrderGql,
                variables: { input },
            });
            const data = response.data.acceptOrder;
            console.log('accept order data', data);
            return data;

        } catch (error) {
            console.log('accept order error', error);
        }
    },
    async rejectOrder({ commit }, orderId) {
        try {

            let client = this.app.apolloProvider.defaultClient;
            const input = {
                id: orderId,
                status: "REJECTED",
            };
            const response = await client.mutate({
                mutation: updateOrderStatusGql,
                variables: { input },
            });
            const data = response.data.updateOrderStatus;
            return data;


        } catch (error) {
            console.log('rejectOrder error', error);
        }
    },

}

export const getters = {
    orderType(state) {
        return state.orderType;
    },
    getOrderAddress(state) {
        return state.orderAddress;
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

