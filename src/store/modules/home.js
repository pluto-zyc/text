import {requestHomeList} from '../../utils/request'

const state={
    homeList:[]
}

// 修改state
const mutations = {
     changeList(state,resList){
        state.homeList = resList
     }
}

// anction通知mutation修改state
const actions = {
    responseList(context,json){
        requestHomeList(json).then((res)=>{
            context.commit("changeList",res.data.list)
        })
     }
}

// getters暴露
const getters={
    list(state){
        return state.list
    }
}

// 暴露模块
export default {
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}