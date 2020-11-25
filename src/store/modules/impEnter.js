import { requestSearchList } from "../../utils/request";
import { requestSearchDetail } from "../../utils/request";
const state={
    list:{},
    detail:{}
}
const mutations={
    changeList(state,list){
        state.list = list
    },
    changeDetail(state,detail){
        state.detail = detail
    }
} 
const actions={
     responseList(context,json){
        requestSearchList(json).then((res)=>{
            context.commit("changeList",res.data)
        })
     },
     responseDetail(context,json){
        requestSearchDetail(json).then((res)=>{
            context.commit("changeDetail",res.data)
        })
     }
}
const getters={
    list(state){
        return state.list
    },
    detail(state){
        return state.detail
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}