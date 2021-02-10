import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";

Vue.use(Buefy);
Vue.config.productionTip = false;

import generalPlugin from "./plugins/general";

Vue.use(generalPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
