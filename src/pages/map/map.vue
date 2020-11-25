<template>
  <div class="map" style="height:calc(100vh - 60px)" ref="map_ref">
    <!-- 地图底图层 -->
    <baidu-map
      style="height:calc(100vh - 60px)"
      class="baiduMap"
      :center="center"
      :zoom="zoom"
      @ready="baiduMounted"
    >
      <!-- 标尺控件 -->
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :offset="{width:160,height:10}"></bm-scale>
      <!-- 地图类型控件-->
      <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_RIGHT"
      ></bm-map-type>
      <!-- 缩略图控件  -->
      <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
      <!-- 城市列表控件 -->
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 20, height: 10}"></bm-city-list>

      <!-- 标注 -->
      <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="{width: 20, height:40}">
        <span class="msgText">
          <el-checkbox v-model="isShowLable">标注</el-checkbox>
        </span>
        <span class="msgText clear" @click="clear">清空坐标</span>
      </bm-control>
      <!-- 地图navbar -->
      <bm-control anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 20, height:40}">
        <div class="navBarBox">
          <el-radio-group v-model="isCollapse" style="margin-bottom: 5px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group>
          <el-menu
            :unique-opened="true"
            @select="changMenu"
            default-active="1-4-1"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            background-color="rgba(0,0,0,.6)"
            text-color="#fff"
            active-text-color="#fff"
          >
            <!-- 国控站 -->
            <el-submenu index="0">
              <template slot="title">
                <i class="el-icon-star-on"></i>
                <span slot="title">国控站</span>
              </template>
              <el-menu-item index="0-0" v-if="lankaoSitePoint.length>0">
                <el-checkbox
                  v-model="lankaoSitePoint[0].checked"
                  label="国控站"
                  style="color:#fff"
                  @click="changeCountry"
                  :checked="lankaoSitePoint[0].checked"
                ></el-checkbox>
              </el-menu-item>
            </el-submenu>

            <!-- 第一级 市控站-->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-caret-top"></i>
                <span slot="title">市控站</span>
              </template>
              <el-menu-item index="1-0" v-if="lankaoSitePoint.length>0">
                <el-checkbox
                  v-model="lankaoSitePoint[0].checked"
                  label="市控站"
                  style="color:#fff"
                  @click="changeCounty"
                  :checked="lankaoSitePoint[1].checked"
                ></el-checkbox>
              </el-menu-item>
            </el-submenu>

            <!-- 县控站 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-cooperation"></i>
                <span slot="title">县控站</span>
              </template>
              <el-menu-item index="0-0">
                <el-checkbox label="县控站" style="color:#fff"></el-checkbox>
              </el-menu-item>
            </el-submenu>
            <!-- 污染源分级 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">污染源</span>
              </template>
              <el-menu-item
                :index="'3-'+index"
                v-show="pointList.length>0?true:false"
                v-for="(i,index) in pointList"
                :key="i.lat"
              >
                <el-checkbox
                  v-model="i.checked"
                  :label="i.siteName"
                  style="color:#fff"
                  @click="bindChecked(index)"
                  :checked="i.checked"
                />
              </el-menu-item>
            </el-submenu>
            <!-- 设置 -->
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">设置</span>
              </template>

              <!-- 设置地图样式 -->
              <el-submenu index="6-2">
                <template slot="title">
                  <!-- <i class="el-icon-setting"></i> -->
                  <span slot="title">地图样式</span>
                </template>
                <el-menu-item index="6-2-1">
                  <span style="color:#fff">标准样式</span>
                </el-menu-item>
                <el-menu-item index="6-2-2">
                  <span style="color:#fff">清新蓝</span>
                </el-menu-item>
                <el-menu-item index="6-2-3">
                  <span style="color:#fff">黑夜模式</span>
                </el-menu-item>
                <el-menu-item index="6-2-4">
                  <span style="color:#fff">自然绿</span>
                </el-menu-item>
                <el-menu-item index="6-2-5">
                  <span style="color:#fff">青春绿</span>
                </el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </div>
      </bm-control>

      <!-- 国市区控站点标记 -->
      <div
        v-if="lankaoSitePoint.length>0 && i.checked"
        v-for="i in lankaoSitePoint"
        :key="i.siteName"
      >
        <!-- :icon="{url:'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 30, height: 30}}" -->
        <bm-marker
          :icon="i.siteName=='国控站'?icon_country:icon_city"
          v-for="(item) in i.children"
          :key="item.name"
          :style="{zIndex:10}"
          :position="{lng:item.lng,lat:item.lat}"
          :dragging="false"
          animation="BMAP_ANIMATION_DROP"
          @click="bindCountryPoint(item.name)"
        >
          <bm-label
            v-if="isShowLable"
            :content="item.name"
            :labelStyle="{color:'black',fontSize : '6px',borderColor:'lightblue'}"
            :offset="{width:0,height: -20}"
          />
          <bm-info-window
            :show="item.name == countryIndex?true:false"
            @clickclose="closeInfoWindow"
          >
            <h3>工地名称：{{item.name}}</h3>
            <ul>
              <li>地址：{{item.address}}</li>
              <li>经度：{{item.lng}}</li>
              <li>纬度：{{item.lat}}</li>
            </ul>
            <el-link @click="bindPointToDetail(item.name)" type="primary">详情~</el-link>
          </bm-info-window>
        </bm-marker>
      </div>
      <!-- 详情坐标 -->
      <div v-if="starPoint.name">
        <bm-marker
          :style="{zIndex:10}"
          :position="{lng:starPoint.lng,lat:starPoint.lat}"
          :dragging="false"
          animation="BMAP_ANIMATION_DROP"
          @click="changeStarInfoWindow"
        >
          <bm-label
            v-if="isShowLable"
            :content="starPoint.name"
            :labelStyle="{color:'black',fontSize : '6px',borderColor:'lightblue'}"
            :offset="{width:0,height: -20}"
          />
          <bm-info-window :show="starInfoWindow" @clickclose="closeInfoWindow">
            <h3>工地名称：{{starPoint.name}}</h3>
            <ul>
              <li>地址：{{starPoint.address}}</li>
              <li>经度：{{starPoint.lng}}</li>
              <li>纬度：{{starPoint.lat}}</li>
            </ul>
            <el-link @click="bindPointToDetail(starPoint.name)" type="primary">详情~</el-link>
          </bm-info-window>
        </bm-marker>
      </div>
      <!-- （海量）  点标记      dragging是否可拖拽 -->
      <div
        v-if="pointList.length>0 && i.checked?true:false"
        v-for="i in pointList"
        :key="i.siteName"
      >
        <bm-marker
          :icon="i.siteName=='建筑工地'?icon_pool1:icon_pool2"
          v-for="(item) in i.children"
          :key="item.id"
          :style="{zIndex:10}"
          :position="{lng:item.lng,lat:item.lat}"
          :dragging="false"
          animation="BMAP_ANIMATION_DROP"
          @click="changeInfo(item.name)"
        >
          <!-- 点标记添加标注信息可自定义信息窗体 -->
          <bm-label
            v-if="isShowLable"
            :content="item.name"
            :labelStyle="{color:'black',fontSize : '6px',borderColor:'lightblue'}"
            :offset="{width:0,height: -20}"
          />
          <bm-info-window :show="infoIndex==item.name?true:false" @clickclose="closeInfoWindow">
            <h3>工地名称：{{item.name}}</h3>
            <ul>
              <li>地址：{{item.address}}</li>
              <li>经度：{{item.lng}}</li>
              <li>纬度：{{item.lat}}</li>
            </ul>
            <el-link @click="bindPointToDetail(item.name)" type="primary">详情~</el-link>
          </bm-info-window>
        </bm-marker>
        <!-- </div> -->
      </div>
      <!-- 行政区划、 -->
      <bm-boundary
        name="河南省兰考县"
        :strokeWeight="4"
        strokeColor="blue"
        fillColor
        strokeStyle="dashed"
        :fillOpacity="0.1"
      ></bm-boundary>
      <!-- 热力图 -->
      <!-- &&isShowHeat -->
      <bml-heatmap v-if="heatList.length>0 && isShowHeat" :data="datas" :max=".3" :radius="15"></bml-heatmap>
      <!-- 热力图例 -->
      <bm-control :offset="{width: 10, height: 150}" anchor="BMAP_ANCHOR_BOTTOM_RIGHT">
        <div id="visualMapDOM" style="width: 120px;height:200px;"></div>
      </bm-control>
    </baidu-map>
    <!-- 播放控件 -->
    <div class="hig">
      <div class="svgBox">
        <div class="left" @click="bingImage">
          <img v-if="showImage" src="@/assets/image/video_hig.png" class="video_img" alt="播放" />
          <img v-else class="video_img" src="@/assets/image/video_nor.png" alt="播放" />
        </div>
        <div class="right">
          <!-- 进度条 -->
          <!-- <el-progress
            :percentage="percentage"
            :color="customColor"
            :stroke-width="14"
            :text-inside="false"
          ></el-progress>-->
          <svg>
            <g id="text">
              <text
                id="svg_text"
                @click="bindText(index)"
                v-for="(i,index) in textArr"
                :key="i"
                :x="38*(index+1)"
                y="22"
                style="text-anchor: middle;fill:white;cursor:pointer;font-size:12px"
              >{{i}}</text>
            </g>
          </svg>
        </div>
        <div class="uitil" :style="{left:hkleft+'px'}">
          <i class="after"></i>
          <span style="color:white">{{hktext}}</span>
        </div>
        <div class="rule">
          <button @click="openDistanceTool">开启测距</button>
          <button @click="bindShowHeatMap">{{showHeatText}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import { keduFun } from "../../utils/svg_kedu";
import { mapActions, mapGetters } from "vuex"; //状态层方法属性
import { BmlHeatmap } from "vue-baidu-map"; //热力图组件
import echarts from "echarts";
import * as d3 from "d3";
import DistanceTool from "bmaplib.distancetool";
import { warningAlert } from "../../utils/alert";
import lankaoSitePoint from "../../utils/asset/lankaoSite.json";
import icon1 from "../../assets/image/icon1.png";
import res from "../../utils/asset/geoJosn_text.json";
import mapvgl from "mapvgl";
export default {
  props: ["info", "heatList"],
  components: {
    BmlHeatmap, //热力图
  },
  data() {
    return {
      showHeatText: "开启热力图",
      lankaoSitePoint: [],
      countryIndex: "",
      starInfoWindow: true,
      starPoint: {},
      bool: false,
      color: {
        0.9999: "greenyellow", //value为0的颜色
        0.99999: "yellow", //value为50的颜色
        0.999996: "orange", //value为200的颜色
        1.0: "red", //value为500的颜色
        //0.97: "mediumvioletred", //value为1000的颜色
        //0.99: "red" //value为2000的颜色
        //1: "maroon", //value为2000的颜色
      },
      infoIndex: "", //控制住信息窗体显隐
      distanceTool: "",
      rule: null, //测距工具
      showImage: false, //控制播放按钮
      timer1: null,
      timer2: null,
      m: 0, //控制刻度条
      hktext: "00:00", //滑块text
      hkleft: 80, //刻度尺滑块left
      textArr: [
        //刻度text

        "0点",
        "1点",
        "2点",
        "3点",
        "4点",
        "5点",
        "6点",
        "7点",
        "8点",
        "9点",
        "10点",
        "11点",
        "12点",
        "13点",
        "14点",
        "15点",
        "16点",
        "17点",
        "18点",
        "19点",
        "20点",
        "21点",
        "22点",
        "23点",
      ],
      map: null, //地图实例
      // 控制导航收起隐藏
      isCollapse: true,
      isShowLable: false, //标注
      datas: [], // 操作热热力图数据
      isShowHeat: false,
      center: { lng: 0, lat: 0 }, //地图中心位置
      zoom: 3, //地图缩放
    };
  },
  computed: {
    ...mapGetters({
      pointList: "map/list",
    }),
    icon_country() {
      return {
        url:
          "https://www.xflyfun.com/attachment/images/2/2018/12/z21Nt3RI8vNT8MniVtzb1D8M1Ez885.png",
        size: { width: 25, height: 25 },
        opts: {
          // anchor: { width: 30, height: 30 },
          // imageOffset: { width: 0, height: 0 },
          imageSize: { width: 25, height: 25 },
          infoWindowAnchor: { width: 10, height: 0 },
          // printImageUrl: String,
        },
      };
    },
    icon_city() {
      return {
        url: "/static/image/ico_r.png",
        size: { width: 18, height: 23 },
        imageOffset: { width: 0, height: 0 },
        opts: {
          imageSize: { width: 18, height: 23 },
          infoWindowAnchor: { width: 10, height: 0 },
        },
      };
    },
    icon_pool1() {
      return {
        url: "/static/image/ico_b.png",
        size: { width: 18, height: 23 },
        imageOffset: { width: 0, height: 0 },
        opts: {
          anchor: { width: 10, height: 23 },
          imageSize: { width: 18, height: 23 },
          infoWindowAnchor: { width: 10, height: 0 },
        },
      };
    },
    icon_pool2() {
      return {
        url: "/static/image/ico_g.png",
        size: { width: 18, height: 23 },
        imageOffset: { width: 0, height: 0 },
        opts: {
          anchor: { width: 10, height: 23 },
          // imageOffset: { width: 0, height: 0 },
          imageSize: { width: 18, height: 23 },
          infoWindowAnchor: { width: 10, height: 0 },
        },
      };
    },
  },
  unmount() {
    const { distanceTool } = this;
    distanceTool && distanceTool.close();
  },
  watch: {
    pointList() {
      this.info.isShow = false;
    },
    // 热力数据请求完毕关闭loading
    heatList() {
      this.info.isShow = false;
      // 热力数据发生改变
      this.showImage = false; //关闭播放暂停按钮
      // 控制滑块移动
      this.hkleft = 80;
      this.hktext = "00:00";
      this.datas = [];
      clearInterval(this.timer2);
    },
  },
  created() {
    this.info.isShow = true;
    this.info.msg = "已经很努力啦，请稍等~";
    this.timer1 = setTimeout(() => {
      this.info.isShow = false;
    }, 10000);
  },
  methods: {
    ...mapActions({
      pointsRequest: "map/responseList",
    }),

    // 点击清空所有左边点
    clear() {
      this.starInfoWindow = false;
      this.countryIndex = "";
      this.infoIndex = "";
      this.lankaoSitePoint.forEach((i) => {
        //清空国县市控站
        i.checked = false;
      });
      this.starPoint = {}; //详情坐标
      this.pointList.forEach((i) => {
        //q清空污染源
        i.checked = false;
      });
    },
    // 点击详情坐标 点 打开信息窗口
    changeStarInfoWindow() {
      this.infoIndex = "";
      this.countryIndex = "";
      this.starInfoWindow = true;
    },
    // 点击显示热力图
    bindShowHeatMap(e) {
      if (this.isShowHeat) {
        this.isShowHeat = false;
        this.showHeatText = "开启热力图";
        return;
      }
      this.isShowHeat = true;
      this.showHeatText = "关闭热力图";
    },
    // 开始测距
    openDistanceTool(e) {
      const { distanceTool } = this;
      distanceTool && distanceTool.open();
    },
    // 点击刻度时间
    bindText(index, left, text) {
      this.showHeatText = "关闭热力图";
      if (this.heatList.length == 0) {
        warningAlert("请选择模型");
        return;
      }
      clearInterval(this.timer2);
      this.isShowHeat = true; //展示热力图
      this.showImage = false; //关闭播放暂停按钮
      // 控制滑块移动
      this.hkleft = index * 38 + 80;
      this.datas =
        index == 0
          ? this.heatList[this.heatList.length - 1]
          : this.heatList[index - 1];
      this.hktext = index < 10 ? "0" + index + ":" + "00" : index + ":" + "00";
      // 关联变量
      this.m = index;
    },
    // 点击污染源类型 切换坐标点
    bindChecked(index) {
      console.log(index);
      // this.info.isShow = true;
      // this.info.msg = "已经很努力啦，请稍等~";
      var obj = this.pointList[index];
      obj.checked = !obj.checked;
      this.$set(this.pointList, index, obj);
      // this.info.isShow = false;
      // this.$forceUpdate(); //强制刷新
    },
    // 点击播放按钮播放热力图 并且滑块跟着移动
    bingImage() {
      if (this.heatList.length == 0) {
        warningAlert("清选择模型");
        return;
      }
      this.isShowHeat = true; //展示热力图
      this.showImage = !this.showImage; //切换播放暂停按钮
      if (!this.showImage) {
        clearInterval(this.timer2);
        return;
      }
      this.timer2 = setInterval(() => {
        if (this.m > this.heatList.length - 1) {
          //到达23
          clearInterval(this.timer2);
          this.showImage = false; //切换播放/暂停按钮
          this.isShowHeat = false;
          this.datas = [];
          this.hkleft = 80;
          this.hktext = "00:00";
          this.m = 0;
          return;
        }
        this.datas =
          this.m == 0 ? this.heatList[23] : this.heatList[this.m - 1];
        this.hkleft = this.m * 38 + 80;
        this.hktext =
          this.m < 10 ? "0" + this.m + ":" + "00" : this.m + ":" + "00";
        this.m++;
      }, 2000);
    },
    // 点击国控站
    changeCountry() {
      console.log(12);
      this.lankaoSitePoint[0].checked = !this.lankaoSitePoint[0].checked;
    },
    changeCounty() {
      this.lankaoSitePoint[1].checked = !this.lankaoSitePoint[1].checked;
    },
    // 选中导航菜单项
    changMenu(key) {
      var index = Math.floor(key.slice(2));
      var ak = key.slice(0, 1);
      if (key == 0) {
      }
      if (key == 1) {
      }
      if (key == 2) {
      }
      // 地图样式
      if (key == "6-2-1") {
        this.map.setMapStyle({ style: "googlelite" });
      }
      if (key == "6-2-2") {
        this.map.setMapStyle({ style: "light" });
      }
      if (key == "6-2-3") {
        this.map.setMapStyle({ style: "dark" });
      }
      if (key == "6-2-4") {
        this.map.setMapStyle({ style: "grassgreen" });
      }
      if (key == "6-2-5") {
        this.map.setMapStyle({ style: "darkgreen" });
      }
    },
    //  关闭信息窗口后重置index
    closeInfoWindow() {
      this.infoIndex = "";
      this.countryIndex = "";
      this.starInfoWindow = false;
    },
    // 点及坐标点控制信息窗体
    changeInfo(name) {
      this.countryIndex = "";
      this.starInfoWindow = false;
      this.infoIndex = name;
    },
    // 点击国控站坐标 点
    bindCountryPoint(name) {
      this.starInfoWindow = false;
      this.infoIndex = "";
      this.countryIndex = name;
    },
    // 点击信息窗口详情 去往详情
    bindPointToDetail(name) {
      this.info.isShow = true;
      this.info.msg = "已经很努力啦，请稍等~";
      this.$router.push({ name: "impEnter", params: { id: name } });
    },
    // 地图回调对象 (mounted)
    baiduMounted({ BMap, map }) {
      //因为百度map组件以及其所有组组件的渲染只能是异步的 所以要在其自身的ready事案件来执行百度地图api
      // 设置滚轮缩放
      this.map = map;
      map.enableScrollWheelZoom(true);
      // map.setMapStyle({ style: "dark" });
      this.center.lng = 114.81961;
      this.center.lat = 34.8235;
      this.zoom = 12;
      //  点及地图获取经纬度
      map.addEventListener("click", function (e) {
        console.log("点击位置经纬度：" + e.point.lng + "," + e.point.lat);
      });
      this.distanceTool = new DistanceTool(map, { lineStroke: 2 }); //热力图例

  },
  mounted() {
    if (lankaoSitePoint.length > 0) {
      this.lankaoSitePoint = lankaoSitePoint;
    }
    // 调用热力图例
    var visualMapDOM = document.querySelector("#visualMapDOM");
    this.globalVar.visualMap(visualMapDOM); //热力图图例控件
    //  调用地图底部刻度尺
    var svg = d3.select("svg").attr("width", "950").attr("height", "50");
    keduFun(svg);

    //  一进页面请求坐标点
    if (this.pointList.length == 0) {
      this.pointsRequest();
    }

    // 从详情页面过来
    if (this.$route.query.id && this.pointList.length > 0) {
      this.pointList.map((i) => {
        var result = i.children.map((item) => {
          if (item.name == this.$route.query.id) {
            this.starPoint = item;
          }
        });
      });
    }

    if (this.pointList.length > 0) {
      this.info.isShow = false; //关闭loading
    }
  },
  beforeDestroy() {
    clearInterval(this.timer2);
    clearTimeout(this.timer1);
  },
}
</script>
<style scoped>
/* 标注  clear */
.msgText {
  display: block;
  width: 60px;
  height: 30px;
  background-color: white;
  text-align: center;
  line-height: 30px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #696b6f;
}
.clear {
  margin-top: 5px;
}
/* 地图navbar */
/* .navBarBox .el-menu-item,
.navBarBox .el-menu-item .el-submenu .el-menu-item {
  height: 35px!important;
  line-height: 35px!important;
  padding: 0;
} */

/* 地图下方刻度控件 */
.hig {
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 999999999999999999999999999999;
}
.hig .rule {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.svgBox {
  position: relative;
  display: flex;
  height: 50px;
  background-color: rgb(58, 56, 56);
}
/* 进度条 */
.svgBox .el-progress {
  margin: 10px 0px 0px 40px;
  width: 975px;
}
.svgBox .video_img {
  width: 40px;
  height: 40px;
  cursor: pointer;
  padding: 0 20px;
}
.svgBox .left {
  display: flex;
  align-items: center;
  border-right: 2px solid white;
}
.svgBox .uitil {
  background-color: rgba(0, 0, 0, 0.6);
  width: 80px;
  line-height: 40px;
  height: 40px;
  position: absolute;
  top: -40px;
  text-align: center;
  border-radius: 6px;
}
.svgBox .uitil .after {
  display: block;
  position: absolute;
  width: 0px;
  height: 0px;
  left: 32px;
  bottom: -16px;
  border-width: 8px;
  border-style: solid dashed dashed dashed;
  border-color: white transparent transparent transparent;
}
/* 地图 */
.map {
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.baiduMap {
  width: 100%;
}
/* 地图右边导航 */
/* 主体部分   地图右边nav */
.rightNav {
  width: 32px;
  height: 400px;
  color: #fff;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
}

/* 污染源选择框 */
.el-select {
  width: 130px;
  height: 30px;
}
/* 污染源搜索框 */
.el-input {
  width: 130px;
}

/* .地图管理icon图标 */
.font_span_nav:nth-child(1) {
  margin-top: 10px;
  font-size: 16px;
}
.font_span_nav:nth-child(2) {
  font-size: 20px;
}
.font_span_nav:nth-child(3) {
  font-size: 12px;
}
.font_span_nav:nth-child(5) {
  font-size: 22px;
}
.font_span_nav:nth-child(6) {
  font-size: 13px;
}
.font_span_nav:nth-child(7) {
  font-size: 20px;
}
.font_span_nav:nth-child(8) {
  font-size: 22px;
}
/* 右侧图标div盒子 */
.font_span_nav {
  display: block;
  padding: 7px 0;
  cursor: pointer;
}
.icon_info {
  position: relative;
}
/* 右侧图标div盒子  :hover信息 */
.mapNav_info {
  position: absolute;
  z-index: 2;
  left: -83px;
  top: -2px;
  padding-top: 2px;
  cursor: pointer;
}
/* 小三角箭头 */
.con {
  width: 60px;
  padding: 2px 4px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.7);
}
.con-ret {
  border: 7px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 70px;
  top: 9px;
}
/* 右侧详情展示盒子 */
.detail {
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  width: 168px;
  height: 400px;
  border-radius: 10px;
  left: -136px;
}
</style>