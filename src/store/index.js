import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: '',
    },

    getters: {
        token: state => state.token,
    },


    mutations: {
        setToken(state, token) {
            state.token = token;
        }
    },

    actions: {
        // login({ commit }) {
        //     commit('setToken')
        // }
    }
});

export default store