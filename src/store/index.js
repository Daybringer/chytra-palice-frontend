import Vue from "vue";
import Vuex from "vuex";
import generic from "./modules/generic";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    generic,
  },
  strict: debug,
});
