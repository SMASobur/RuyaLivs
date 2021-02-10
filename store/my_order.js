
import getOrdersByUserIdQuery from "../gql/query/getOrdersByUserId.gql";

export const state = () => ({
    orders: [],
    totalOrderCount: 0

})


export const mutations = {
    SET_ORDERS(state, orders) {
        state.orders = orders;
    },
    SET_ORDER_COUNT(state, count) {
        state.totalOrderCount = count
    }
}

export const actions = {
    async fetchOrderByUserId({ commit }, orderInput) {
        let client = this.app.apolloProvider.defaultClient;
        const response = await client.query({
            query: getOrdersByUserIdQuery,
            variables: { orderInput },
            fetchPolicy: 'network-only'
        });
        console.log("getOrderResponse", response);
        const orders = response.data.getOrderByUserId.orders;
        const orderCount = response.data.getOrderByUserId.count;
        commit('SET_ORDERS', orders);
        commit('SET_ORDER_COUNT', orderCount)
    }

}

export const getters = {
    orders(state) {
        return state.orders;
    },
    totalOrderPage(state) {
        const limit = 10;
        const totalOrderCount = state.totalOrderCount;
        console.log('totalOrderCount',totalOrderCount);
        return Math.ceil(totalOrderCount / limit);

    }
}