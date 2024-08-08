import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: false, // Default to not authenticated
      user: null, // Default user state
    };
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    login({ commit }, user) {
      // Simulate a login action
      commit('setAuthentication', true);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('setAuthentication', false);
      commit('setUser', null);
    },
  },
});

export default store;
