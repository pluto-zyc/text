<template>
  <div class="index" style="height: 100vh">
    <!-- inde一级路由 -->
    <!-- 二级路由出口 -->
    <el-container style="height: 100vh">
      <el-header>
        <div class="left">
          <img class="logo" src="@/assets/image/logo.png" alt="logo" />
          <span>兰考大气污染扩散平台</span>
        </div>
        <!-- 右边 -->
        <div class="right">
          <!-- 中间菜单 -->
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="bindHeadMenu"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item background-color="rgba(255,255,255,.2)" index="1">污染源地图</el-menu-item>
            <el-menu-item index="2">污染源统计</el-menu-item>
            <el-submenu index="3">
              <template slot="title">扩散影响</template>
              <el-submenu
                v-show="sceneList.length>0?true:false"
                :index="'3-'+ index"
                v-for="(item,index) in sceneList"
                :key="index"
              >
                <template slot="title">{{item.name}}</template>
                <el-menu-item
                  v-for="(i,idx) in item.children"
                  :key="idx"
                  :index="'3-'+index+'-'+idx"
                >{{i.info}}</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
          <!-- 退出登录部分 -->
          <div class="out">
            <el-dropdown>
              <i class="el-icon-user-solid" style="margin-right: 5px;font-size:20px;color:#fff;">
                <span class="userName">{{user.username}}</span>
              </i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>用户</el-dropdown-item>
                <el-dropdown-item>信息</el-dropdown-item>
                <el-dropdown-item>注销</el-dropdown-item>
                <el-dropdown-item @click.native="outLogin">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <!-- main部分 -->
      <router-view class="transition-box" :heatList="sceneDetails" :info="info"></router-view>
    </el-container>
    <v-loading :info="info"></v-loading>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vLoading from "../../components/dialogLoading";
import { requestSceneList, requestSceneDetail } from "../../utils/request";
import Cookies from "js-cookie";
export default {
  components: { vLoading },
  data() {
    return {
      user:{},
      sceneList: [], //扩散影响list
      sceneDetails: [],
      activeIndex: "1",
      info: {
        isShow: false,
        msg:''
      },
      // 控制头部导航下拉菜单
      navIndex: 20,
      options: {
        target: ".index",
      },
    };
  },
  computed: {
  },
  watch: {
    sceneDetails() {
      this.info.isShow = false;
      this.info.msg = "已经很努力啦，请稍等~";
    },
  },
  methods: {
    // 点击 头部菜单
    bindHeadMenu(key, keyPath) {
      switch (key) {
        case "1":
          if (this.$route.path == "/map") {
            return;
          }
          this.info.isShow = true;
           this.info.msg = "已经很努力啦，请稍等~";
          this.$router.push("/map");
          break;
        case "2":
          this.info.isShow = true
          this.info.msg = "正在努力ing,敬请期待哦~"
          setTimeout(()=>{
            this.info.isShow = false
          },1500)
          // if (this.$route.path == "/index/impEnter") {
          //   return;
          // }
          // this.info.isShow = true;
          //  this.info.msg = "已经很努力啦，请稍等~";
          // this.$router.push("/impEnter");
          break;
        case "3-0-0":
          this.info.isShow = true;
           this.info.msg = "已经很努力啦，请稍等~";
          if (this.$route.path != "/map") {
            this.$router.push("/map");
          }
          //  请求101热力图
          requestSceneDetail({
            sceneId: this.sceneList[0].children[0].id,
          }).then((res) => {
            this.sceneDetails = res.data;
          });
          break;
        case "3-0-1":
          this.info.isShow = true;
           this.info.msg = "已经很努力啦，请稍等~";
           if (this.$route.path != "/map") {
            this.$router.push("/map");
          }
          //  请求102热力图
          requestSceneDetail({
            sceneId: this.sceneList[0].children[1].id,
          }).then((res) => {
            this.sceneDetails = res.data;
          });
          break;
        default:
        // this.$router.push("/home");
      }
    },
    // 点及退出
    outLogin() {
      console.log("login");
      this.$router.history.push("/login");
    },
    // 鼠标离开头部导航
    outNavBar() {
      this.navIndex = 20;
    },
    ...mapActions({
      //  changeUser: "changeUser",
    }),

    // 显示头部导航下拉菜单
    showNavList(index) {
      this.navIndex = index;
    },
  },
  beforeMount() {},
  mounted() {
   var user = localStorage.getItem("user")
   this.user = JSON.parse(user)
    //  一进页面请求头部扩散影响
    requestSceneList().then((res) => {
      this.sceneList = res.data.length > 0 ? res.data : [];
    });
  },
};
</script>
<style scoped>
.userName{
  color:#fff;
  font-size:18px;
  cursor: pointer;
  padding-left:5px;
}
/* 头部导航 */
.el-header {
  display: flex;
  line-height: 60px;
  justify-content: space-between;
  background-color: #438eb9;
  color: #fff;
  text-align: center;
}

/* 头部左边 */
.el-header .left {
  display: flex;
  /* background: red; */
}
.el-header .left .logo {
  width: 60px;
  height: 60px;
}
.el-header .left span {
  font-size: 22px;
  /* background: red; */
  width: 400px;
  margin-left: 10px;
  text-align: left;
}
/* 头部右边 */
.el-header .right {
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
}
.el-header .right .navlist {
  cursor: pointer;
  width: 600px;
  z-index: 999;
  margin-left: 2px;
}
.el-header .right .navlist .navList_every {
  display: inline-block;

  z-index: 999;
  background-color: rgba(255, 255, 255, 0.2);
  line-height: 60px;
  margin-left: 4px;
  padding: 0 20px;
  font-size: 15px;
  /* position: relative; */
}
.el-header .right .navlist .navBar {
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-left: -20px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.el-header .right .navlist .navBar span {
  line-height: 50px;
  padding: 0 10px;
}
.el-container {
  height: 100vh;
}
</style>