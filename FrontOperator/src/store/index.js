/**
 * 全局状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
import login from '@/store/modules/login'
import state from '@/store/state'
import getters from '@/store/getters'
import * as actions from '@/store/actions'
import mutations from '@/store/mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        login
    },
    strict: process.env.NODE_ENV !== 'production', //是否开启严格模式
})

export default store
