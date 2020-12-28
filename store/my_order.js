
import getOrdersByUserIdQuery from "../gql/query/getOrdersByUserId.gql";

export const state = () => ({
    orders: []
})


export const mutations = {
    SET_ORDERS(state, orders) {
        state.orders = orders;
    }
}

export const actions = {
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
    }
}

export const getters = {
    orders(state) {
        return state.orders;
    }
}