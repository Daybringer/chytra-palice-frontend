const state = () => ({
  loggedIn: true,
  admin: true,
});

// getters
const getters = {
  isLoggedIn: (state) => {
    return state.loggedIn;
  },
  isAdmin: (state) => {
    return state.admin;
  },
};

// actions
const actions = {
  logOut(context) {
    context.commit("flush");
  },
  logIn(context) {
    context.commit("login");
  },
};

// mutations
const mutations = {
  flush(state) {
    state.loggedIn = false;
  },
  login(state) {
    state.loggedIn = true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
