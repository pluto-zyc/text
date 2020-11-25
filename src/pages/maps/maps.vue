<template>
  <el-container class="maps">
    <el-aside width="200px">
      <el-row class="tac">
        <el-col :span="12">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#fff"
            text-color="#545c64"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-setting"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-main>
      <div class="lankaoMap"></div>
    </el-main>
  </el-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import echarts from "echarts";
import lankaomap from "../../utils/asset/lankao.json";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapGetters({}),
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.querySelector(".lankaoMap"));
    var mapname = lankaomap;
    var mapJsonAll = [];
    mapname.features.map((item) => {
      mapJsonAll.push({ type: "FeatureCollection", features: [item] });
    });



    var mapJson = mapJsonAll.map((i) => {
      return { name: i.features[0].properties.name, json: i };
    });


    var mapDate = mapJsonAll.map((i) => {
      return { name: i.features[0].properties.name, value: i };
    });

    /**
此版本通过设置geoindex && seriesIndex: [1] 属性来实现geo和map共存，来达到hover散点和区域显示tooltip的效果

默认情况下，map series 会自己生成内部专用的 geo 组件。但是也可以用这个 geoIndex 指定一个 geo 组件。这样的话，map 和 其他 series（例如散点图）就可以共享一个 geo 组件了。并且，geo 组件的颜色也可以被这个 map series 控制，从而用 visualMap 来更改。
当设定了 geoIndex 后，series-map.map 属性，以及 series-map.itemStyle 等样式配置不再起作用，而是采用 geo 中的相应属性。

http://echarts.baidu.com/option.html#series-map.geoIndex

并且加了pin气泡图标以示数值大小
*/

    // myChart.showLoading();
    let index = -1;
    var timer = setInterval(function () {
      // 隐藏提示框
      myChart.dispatchAction({
        type: "hideTip",
        seriesIndex: 0,
        dataIndex: index,
      });
      // 显示提示框
      myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: index + 1,
      });
      // 取消高亮指定的数据图形
      myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: index,
      });
      // 高亮指定的数据图形
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: index + 1,
      });
      index++;
      if (index > 13) {
        index = -1;
      }
    }, 2000);

    myChart.on("mousemove", function (e) {
      clearInterval(timer); //鼠标移动时  清除轮换定时器

      myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: e.dataIndex,
      });
      myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: e.dataIndex,
      });
    }); //---------------------------------------------鼠标移入静止播放

    myChart.on("click", function (e) {
      // 筛选出 geo数据中和点击该项的那么相同项的 json
      var chooseName = mapJson.filter((item) => {
        return item.name == e.name;
      });
      mapname = chooseName[0].json;

      console.log(mapname, "选择地图");

      mapDate = [];
      $('<div class="back">返回杭州市</div>').appendTo($("#chart-panel"));

      $(".back").css({
        position: "absolute",
        left: "17px",
        top: "25px",
        color: "rgb(222,222,222)",
        "font-size": "15px",
        cursor: "pointer",
        "z-index": "100",
      });
      $(".back").click(function () {
        mapname = hzmap;
        mapDate = [
          {
            name: "江干区",
            value: [120.185, 30.274, 29999],
          },
          {
            name: "拱墅区",
            value: [120.182, 30.351, 29999],
          },
          {
            name: "西湖区",
            value: [120.091, 30.27, 29999],
          },
          {
            name: "滨江区",
            value: [120.21, 30.209, 29999],
          },
          {
            name: "萧山区",
            value: [120.254, 30.159, 29999],
          },
          {
            name: "余杭区",
            value: [120.295, 30.427, 29999],
          },
          {
            name: "富阳区",
            value: [119.956, 30.05, 29999],
          },
          {
            name: "桐庐县",
            value: [119.675, 29.784, 29999],
          },
          {
            name: "淳安县",
            value: [119.058, 29.613, 29999],
          },
          {
            name: "建德市",
            value: [119.28, 29.464, 29999],
          },
          {
            name: "临安区",
            value: [119.712, 30.227, 29999],
          },
          {
            name: "钱塘新区",
            value: [120.485, 30.284, 29999],
          },
        ];
        $(".back").css({
          position: "absolute",
          left: "17px",
          top: "-25px",
          color: "rgb(222,222,222)",
          "font-size": "15px",
          cursor: "pointer",
          "z-index": "100",
        });

        mapInit();
      });
      mapInit();
    });
    setTimeout(function () {
      mapInit();
    }, 1000);
    var mapInit = () => {
      var geoJson = lankaomap;
      echarts.registerMap("lankao", geoJson);
      // myChart.hideLoading();
      var option = {
        backgroundColor: "#020933",
        title: {
          top: 20,
          text: "兰考-空气质量",
          subtext: "",
          x: "center",
          textStyle: {
            color: "#ccc",
          },
        },

        // tooltip: {
        //     trigger: 'item',
        //     formatter: function(params) {
        //         console.log(params)
        //             return params.name + ' : ' + params.value[2];
        //     }
        // },
        visualMap: {
          min: 0,
          max: 1000000,
          right: 100,
          seriesIndex: 1,
          type: "piecewise",
          bottom: 100,
          textStyle: {
            color: "#FFFF",
          },
          splitList: [
            {
              gt: 50000,
              color: "#F5222D",
              label: "困难人数大于5万人",
            }, //大于5万人
            {
              gte: 30000,
              lte: 50000,
              color: "#FA541C ",
              label: "困难人数3-5万人",
            }, //3-5万人
            {
              gte: 10000,
              lte: 30000,
              color: "#FA8C16",
              label: "困难人数1-3万人",
            }, //1-3万人
            {
              lte: 10000,
              color: "#fbe1d6",
              label: "困难人数小于1万人",
            },
          ],
        },
        geo: {
          map: "lankao",
          aspectScale: 0.75, //长宽比
          zoom: 1.1,
          roam: false,
          itemStyle: {
            normal: {
              areaColor: "#013C62",
              shadowColor: "#182f68",
              shadowOffsetX: 0,
              shadowOffsetY: 25,
            },
            emphasis: {
              areaColor: "#2AB8FF",
              borderWidth: 0,
              color: "green",
              label: {
                show: false,
              },
            },
          },
        },
        series: [
          {
            type: "map",
            roam: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
              emphasis: {
                textStyle: {
                  color: "#fff",
                },
              },
            },

            itemStyle: {
              normal: {
                // borderColor: "red",
                // borderWidth: 1.5,
                // areaColor: "blue"
              },
              emphasis: {
                // areaColor: "yellow",
                // borderWidth: 5,
                // color: "purple",
              },
            },
            zoom: 1.1,
            roam: false,
            map: "hanzhou", //使用
            // data: this.difficultData //热力图数据   不同区域 不同的底色
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            showEffectOn: "render",
            rippleEffect: {
              period: 15,
              scale: 4,
              brushType: "fill",
            },
            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: "#ffff",
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            data: mapDate,
          },
        ],
      };
      myChart.setOption(option);
    };
  },
  beforeDestroy() {},
};
</script>
<style scoped>
.maps {
  display: flex;
  width: 100vw;
  height: calc(100vh - 60px);
}
.maps .lankaoMap {
  width: calc(100vw - 200px);
  height: calc(100vh - 60px);
}
.el-main {
  padding: 0;
}
.el-menu {
  width: 200px;
}
</style>