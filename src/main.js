import Vue from 'vue';
import Map from './Map.vue';
import store from './store';

new Vue({
    store,
    render: h => h(Map),
}).$mount('#app');
