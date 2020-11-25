import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import actions from './actions'
import {state,mutations,getters} from './mutations'
import home from './modules/home'
import impEnter from './modules/impEnter'
import map from './modules/map'

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules:{
        home,
        impEnter,
        map
    }
})