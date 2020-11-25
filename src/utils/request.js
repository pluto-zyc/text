import axios from "axios"
import qs from "qs"
import store from '../store/index'
import { successAlert, warningAlert } from '../utils/alert';
// 请求拦截
axios.interceptors.request.use(config => {
    console.log(config)
    // if (config.url != baseUrl + '/api/userlogin') {
    //     config.headers.authorization = store.state.user.token;
    // }
    return config
})

// 响应拦截
axios.interceptors.response.use(res => {
    console.log("======url:" + res.config.url + "==============")
    console.log(res)
    // if(res.data.msg==="登录已过期或访问权限受限"){
    //     warningAlert("登录已过期或访问权限受限")
    //     router.push("/login");
    //     return;
    // }
     
    return res
})
// 
const baseUrl = "/api"
// 请求测试/
export const requestHomeList = data => axios({
    url: baseUrl + "/api/data/excel/title",
    method: "post",
    data: qs.stringify(data)
  });


//分类添加
export const requestCateAdd = (params) => {
    var formData = new FormData()
    for (let i in params) {
        formData.append(i, params[i])
    }
    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data: formData
    })
}


//请求 地区检索 
export const requestAddressList = (params) => axios({
    url: baseUrl+'/place/v2/search?query=ATM机&tag=银行&region=北京&output=json&ak=您的ak',
    method: "get",
    params: params
    })
//请求 地区检索 
export const rootPath = () => axios({
    url: baseUrl + '/data/asset/data/hangzhou-tracks.json',
    method: "get"
    })
//login
export const requestLogin = (data) => axios({
    url: baseUrl + '/api/user/login',
    method: "post",
    data:qs.stringify(data)
    })
//请求 左边serachrlist
export const requestSearchList = (params) => axios({
    url: baseUrl + '/api/data/excel/title',
    method: "get",
    params
    })

// 请求 搜索  详情
export const requestSearchDetail = (params) => axios({
    url: baseUrl + '/api/data/excel/info',
    method: "get",
    params
    })
// 请求 污染源
export const requestPoints = () => axios({
    url: baseUrl + '/api/data/excel/points',
    method: "get"
    })
// 请求 头部 扩散影响按钮页表
export const requestSceneList = () => axios({
    url: baseUrl + '/api/data/json/sceneList',
    method: "get"
    })
// 请求 点击扩散影响
export const requestSceneDetail = (params) => axios({
    url: baseUrl + '/api/data/json/sceneResult',
    method: "get",
    params
    })















