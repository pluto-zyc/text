<template>
  <div class="impEnter">
    <el-container style="height:calc(100vh - 60px)">
      <el-header>
        <span class="title">污染源信息--</span>
      </el-header>
      <el-container style="height:calc(100vh -120px)">
        <!-- 左边 -->
        <el-aside width="400px" style="height:calc(100vh -120px)">
          <div class="search_hig">
            <ul class="searchBox">
              <div class="top"></div>
              <!-- 搜索分类下拉框 -->
              <li>
                <span>污染源行业</span>
                <el-select
                  v-model="infoData.qName"
                  placeholder="请选择"
                  v-if="searchLists.code==200?true:false"
                >
                  <el-option label="全部 " value="all"></el-option>
                  <el-option v-for="b in searchLists.content.qNames" :key="b" :label="b" :value="b"></el-option>
                </el-select>
              </li>

              <li>
                <span>&nbsp;&nbsp;&nbsp;所属街道</span>
                <el-select
                  v-model="infoData.sName"
                  placeholder="请选择"
                  v-if="searchLists.code==200?true:false"
                >
                  <el-option label="全部 " value="all"></el-option>
                  <el-option
                    v-for="item in searchLists.content.sNames"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </li>

              <li class="searchNN">
                <el-input placeholder="请输入污染源名称" prefix-icon="el-icon-search" v-model="searchInfo"></el-input>
                <el-button type="primary" @click="bindSearch">搜索</el-button>
              </li>
            </ul>
            <ul class="searchList">
              <h3 class="searchList_title">共检索到{{pageTotal+1}}条信息~</h3>

              <li
                v-for="(f,index) in pageList"
                :key="f"
                :style="selectIndex==index?select_list:''"
                @click.stop="getDetial(index,$event)"
              >
                <span>{{f}}</span>
              </li>
              <li class="page_li">
                <el-pagination
                  :pager-count="5"
                  background
                  layout="prev, pager, next"
                  :page-size="6"
                  :total="pageTotal"
                  @current-change="changePage"
                ></el-pagination>
              </li>
            </ul>
          </div>
        </el-aside>
        <!-- 中间右边 -->
        <el-container style="height:calc(100vh -120px)">
          <el-main>
            <div class="right_detial">
              <div class="main_link">
                <img class="mapImage_link" src="../../assets/image/map.png" alt="map" />
                <el-link @click="toMap">去污染源地图~</el-link>
              </div>
              <div v-if="searchDetail.code==200?false:true" class="emptyText">请选择工地~</div>

              <el-form v-else :inline="true" label-position="right" :model="searchDetail">
                <el-form-item
                  size="medium"
                  label-width="130px"
                  v-for="item in searchDetail.content.oInfo"
                  :key="item.name"
                  :label="item.name"
                >
                  <el-input v-model="item.value"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <img src="@/assets/image/icon1.png" alt="">
  </div>
  
</template>

<script>
import { mapActions, mapGetters } from "vuex"; //状态层方法属性
import echarts from "echarts";

export default {
  props: ["info"],
  data() {
    return {
     
      outTimer:null,
      showDialog: false,
      pageSize: 1,
      pageTotal: 0,
      pageList: [],
      selectIndex:-1, //搜索类表项下标
      searchInfo: "", //搜索框内容
      infoData: {
        qName: "全部",
        sName: "全部",
        oName: "",
      },

      select_list: {
        //搜索列表选项样式
        background: "#438EB9",
        color: "#fff",
      },
      // 请求搜索类表参数默认
      searchData: {
        qName: "all",
        sName: "all",
        oName: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      searchLists: "impEnter/list", //左边搜索类表list
      searchDetail: "impEnter/detail", //左边搜索类表detail
    }),
  },
  watch: {
    searchLists() {
      this.changePage(1)
      this.info.isShow=false
    },
    searchDetail(){
      this.info.isShow=false
    }
  },
  methods: {
    // 点击搜索 获取搜索列表
    bindSearch() {
      this.info.isShow = true
       this.info.msg = "已经很努力啦，请稍等~";
      if(this.searchInfo==''){
         this.info.isShow = false
      }
      this.fillterString();
      this.infoData.oName = this.searchInfo;
      this.responseSearchList(this.infoData);
    },
    // 去污染源地图
    toMap() {
      this.info.isShow = true;
       this.info.msg = "已经很努力啦，请稍等~";
      if (this.searchDetail.code == 200 && this.searchDetail.content.oInfo.length>0) {
        var value = this.searchDetail.content.oInfo[0].value
        this.$router.push("/map?id="+value);
        return;
      }
      this.$router.push("/map");
    },
    ...mapActions({
      responseSearchList: "impEnter/responseList", //获取左边搜索类表
      responseSearchDetail: "impEnter/responseDetail", //获取左边搜索详情
    }),
    // 过滤全部字段
    fillterString() {
      if (this.infoData.qName == "全部") {
        this.infoData.qName = "all";
      }
      if (this.infoData.sName == "全部") {
        this.infoData.sName = "all";
      }
    },
    // 获取详情列表
    getDetial(index) {
      this.info.isShow = true
       this.info.msg = "已经很努力啦，请稍等~";
      this.selectIndex = index
      this.fillterString();//过滤字段
      this.infoData.oName = this.searchLists.content.oNames[index];
      this.responseSearchDetail(this.infoData);//请求详情
    },
    // 分页器
    changePage(index) {
      this.pageList = [];
      //切换页码 获取页面
      if (this.searchLists.code == 200) {
        for (var i = (index - 1) * 6; i <= (index - 1) * 6 + 5; i++) {
          //页面刷新搜索列表
          this.pageList.push(this.searchLists.content.oNames[i]);
        }
        this.pageTotal = this.searchLists.content.oNames.length - 1; //搜索类表总条数
      }
    },
  },
  created(){
    this.info.isShow==true
     this.info.msg = "已经很努力啦，请稍等~";
  },
  mounted() {
     this.outTimer =  setTimeout(()=>{
      this.info.isShow = false
    },5000)
    // 请求搜索类表
    this.responseSearchList(this.searchData);
    if (this.$route.params.id) {
      this.fillterString();
      this.infoData.oName = this.$route.params.id;
      this.responseSearchDetail(this.infoData);
    }
  },
  beforeDestroy(){
   clearTimeout(this.outTimer)
  },
};
</script>
<style scoped>
.el-main {
  position: relative;
}
.emptyText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 26px;
  /* padding-top: 50px; */
  text-align: center;
  color: #259edd;
  font-weight: 500;
}
.el-header {
  /* background-color: #b3c0d1; */
  background: #fff;
  color: #333;
  padding-left: 20px;
  height: 55px;
  display: flex;
  align-items: center;

  /* box-shadow: 5px 5px 10px 10px black; */
}
.el-header .title {
  border-radius: 10px;
  display: block;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  font-weight: 600;
  padding: 0 20px;
  background: #d3dce6;
  width: 100px;
}

.right_detial .el-form-item {
}
/* main 头部盒子 */
.right_detial .main_link {
  display: flex;
  align-items: center;
  height: 70px;
}
.right_detial .main_link .el-link {
  line-height: normal;
  font-size: 18px;
  font-weight: 600;
  color: #259edd;
}
.right_detial .main_link .mapImage_link {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
/* main 表单 */
.right_detial .el-form-item .el-input {
  width: 400px;
  height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* height: calc(100vh - 120px); */
}

/* 搜索盒子上 */
.searchBox {
  padding-top: 40px;
  padding-bottom: 20px;
  background: #d3dce6;
}
.searchBox .el-select {
  width: 275px;
  height: 70px;
}
.searchBox .el-input {
  width: 197px;
  line-height: 60px;
  margin-left: 50px;
}
/* 搜索类表 */
.searchList {
  background: #fff;
  width: 400px !important;
  padding-bottom: 2px;
  margin-top: 20px;

  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}

/* 搜索类表标题 */
.searchList .searchList_title {
  width: 400px;
  line-height: 45px;
  font-weight: normal;
  text-align: center;
  background: #438eb9;
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-family: "微软夜黑";
  /* margin-bottom:10px; */
}
/* 搜索列表项 */
.searchList li {
  cursor: pointer;
  color: rgb(54, 54, 54);
  font-size: 14px;
  text-align: left;
  line-height: 50px;
  display: flex;
}
.searchList li span {
  padding: 0px 40px;
}
.searchList li:hover {
  background: #438eb9;
  color: #fff;
}
.searchList li:last-child:hover {
  background: none;
  color: rgb(54, 54, 54);
}
/* 分页器 li*/
.searchList .page_li {
  justify-content: center;
  align-self: flex-end;
}

.searchList .el-pagination {
  margin-top: 10px;
}
</style>