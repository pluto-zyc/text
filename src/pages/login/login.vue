<template>
  <div class="login">
    <div class="title">
      <img src="../../assets/image/logo.png" alt />
      <span>兰考大气污染扩散平台</span>
    </div>
    <div class="loginBox">
      <header class="top">
        <img class="logo" src="../../assets/image/logo.png" alt />
        <span>登录~</span>
      </header>
      <el-form :model="user" ref="dynamicValidateForm" label-width="45px" class="demo-dynamic">
        <el-form-item label="账号:">
          <el-input v-model="user.userId" placeholder="请输入账号" @blur="regUser"></el-input>
          <div class="regUser" v-if="showUser">请输入账号</div>
        </el-form-item>

        <el-form-item label="密码:">
          <el-input v-model="user.pwd" placeholder="请输入密码" @blur="regPass" type="password"></el-input>
          <div class="regUser" v-if="showPass">请输入密码</div>
        </el-form-item>
        <el-form-item class="remenmber">
          <div style="text-align: left;height: 24px;line-height: 24px;">
            <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
          </div>
        </el-form-item>
        <div style="text-align:center">
          <el-button type="primary" @click="login" :disabled="checked">登录</el-button>
          <!-- <el-button type="primary" @click="geiCookie" :disabled="checked">测试</el-button> -->
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { requestLogin } from "../../utils/request";
import { regTel } from "../../utils/reg";
import { successAlert, warningAlert } from "../../utils/alert";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      rememberPwd: false,
      checked: false,
      showUser: false,
      showPass: false,
      user: {
        userId: "",
        pwd: "",
      },
    };
  },
  methods: {
    getCookie() {
      var cookie = Cookies.get();
      this.rememberPwd = true;
      this.user.userId = JSON.parse(cookie.user).userId;
      this.user.pwd = JSON.parse(cookie.user).pwd;
    },
    // 验证 用户输入
    regUser() {
      this.showUser = this.user.userId == "" ? true : false;
    },
    regPass() {
      this.showPass = this.user.pwd == "" ? true : false;
    },
    // 登录请求
    login() {
      if (this.user.userId == "") {
        this.showUser = true;
        return;
      }
      if (this.user.pwd == "") {
        this.showPass = true;
        return;
      }
      var that = this;
      requestLogin(this.user).then((res) => {
        if (res.data.code != 200) {
          warningAlert(res.data.error);
          return;
        }
        if (that.rememberPwd) {
          if(Cookies.get().user == undefined){
            Cookies.set("user", that.user, { expires: 7 })
          }
          
        } else {
          console.log("false1");
          Cookies.remove("user");
        }
        // 存储用户信息 并提示 跳转
        localStorage.setItem("user", JSON.stringify(res.data.content));
        successAlert("登录成功");
        this.$router.push("/map");
      });
    },
  },
  mounted() {
    console.log(Cookies.get().user);
    console.log(Boolean(Cookies.get().user));
    if (Cookies.get().user) {
      this.getCookie();
     console.log(this.rememberPwd);
    }
  },
  beforeDestroy() {},
};
</script>
<style scoped>
.login {
  /* background: #fefefe; */
  width: 100vw;
  height: 100vh;
  background: url(../../assets/image/background.png) no-repeat center 0;
  background-size: 100% 310px;
  display: flex;
  justify-content: center;
}

.login .title{
  display: flex;
  justify-content: center;
  /* background: red; */
  margin-top: 160px;
  align-items: center;
  height: 100px;
  width:100vw;
}
.login .title img{
  width: 80px;
  height: 80px;
 
}
.login .title span{
   /* margin-left: 60px; */
  font-size: 50px;
  color: #fff;
}

.login .topBg {
}
.login .topBg img {
  width: 100vw;
  height: 310px;
}

.login .loginBox {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 255px;
  margin: 0 auto;
  /* margin-top: 255px; */
  width: 390px;
  height: 310px;
}

.login .loginBox .top {
  display: flex;
  align-items: center;
  color: #fff;
  text-align: center;
  line-height: 55px;
  height: 55px;
  font-size: 21px;
  background: #438eb9;
  /* background: red; */
  width: 390px;
}

.login .loginBox .top img {
  width: 40px;
  height: 40px;
  margin: 0 10px;
}

.login .loginBox .el-form {
  padding: 20px 20px;
  padding-top: 35px;
  box-shadow: 2px 3px 5px 2px #e6e6e6;
}

.login .loginBox .el-form .el-form-item {
  margin: 0;
  line-height: 70px;
  height: 70px;
}

.login .loginBox .el-form .el-button {
  /* width: 80%; */
}

.login .loginBox .el-form .remenmber {
  line-height: 25px;
  height: 25px;
  margin-bottom: 5px;
  margin-top: 0px;
}
.login .loginBox .el-form .regUser {
  font-size: 12px;
  color: red;
  line-height: 30px;
}
</style>
