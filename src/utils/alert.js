import Vue from "vue"
import { Loading } from "element-ui";
var vm = new Vue();

//成功弹框
export const successAlert = (msg) => {
  vm.$message({
    message: msg,
    type: 'success'
  });
}

//警告弹框
export const warningAlert = (msg) => {
  vm.$message({
    message: msg,
    type: 'warning'
  });
}

//错误弹框
export const errorAlert = (msg) => {
  vm.$message.error(msg);
}

// 封装 loading
export const loadingFun = () => {
 return Loading.service({
    lock: false,
    spinner: "el-icon-loading",
    text: '努力加载中...请稍等~',
    background: "rgba(0,0,0,0.7)",
  })
}

