import Vue from 'vue'
import Vuex from 'vuex'
import VueAlong from 'vuex-along'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        answer: {
            radioAns: [],
            checkAns: [],
            gapAns: []
        }
    },
    getters: {

    },
    mutations: {
        // 添加答案 
        // addRadio(state,answer,id){
           
        // },
        // addCheck(state,answer,id){
        //     state.answer.checkAns.unshift(answer)
        // },
        // addGap(state,answer,id){
        //     state.answer.gapAns.unshift(answer)
        // }
    },
    actions: {

    },
    plugins: [ VueAlong ]
})