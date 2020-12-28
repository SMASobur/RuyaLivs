export const state = () => ({
    content: '',
    color: ''
})

export const mutations = {
    showMessage(state, payload) {
        state.content = payload.content
        state.color = payload.color
    }
}

// export const actions = {
//     showMessage({ commit }, payload) {
//         commit('SHOW_MESSAGE', payload)
//     }
// }