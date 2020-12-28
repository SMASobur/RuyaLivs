import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
    window.onNuxtReady(() => {
        new VuexPersistence({
            /* your options */
            // supportCircular: true,
            modules:['auth','order','menu']
        }).plugin(store);
    });
}