import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";
import vueDebounce from "vue-debounce";

import GAuth from "vue-google-oauth2";

const gauthOption = {
  clientId:
    "922077049204-lh8mmn4bak6bj81v9r2n3ir522c2gqu3.apps.googleusercontent.com",
  scope: "profile email",
  prompt: "select_account",
};
Vue.use(GAuth, gauthOption);

Vue.use(vueDebounce);

Vue.use(Buefy);
Vue.config.productionTip = false;

import generalPlugin from "./plugins/general";

Vue.use(generalPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
