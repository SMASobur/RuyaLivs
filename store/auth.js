
export const state = () => ({
    authUser: {},
    authResponse: {},
})

export const mutations = {
    SET_AUTH_USER(state, user) {
        state.authUser = user;
    },
    SET_AUTH_RESPONSE(state, response) {
        state.authResponse = response;
    },
    REMOVE_AUTH_RESPONSE(state, response) {
        state.authResponse = {}
    },
    REMOVE_AUTH_USER(state, user) {
        state.authUser = {}
    }

}

export const actions = {

    setAuthUser({ commit }, user) {
        commit('SET_AUTH_USER', user);
    },
    setAuthResponse({ commit }, response) {
        commit('SET_AUTH_RESPONSE', response);

    },
    removeAuthResponse({ commit }) {
        commit('REMOVE_AUTH_RESPONSE');
    },
    removeAuthUser({ commit }) {
        commit('REMOVE_AUTH_USER');
    }
}
export const getters = {
    authUser(state) {
        return state.authUser;
    },
    authUserResponse(state) {
        return state.authResponse
    }
}