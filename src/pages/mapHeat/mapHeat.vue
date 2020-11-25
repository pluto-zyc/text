<template>
  <div id="main" style="width: 800px;height:800px;"></div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import echarts from 'echarts'
  
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
        var myChart = echarts.init(document.getElementById('main'));
  },
  beforeDestroy() {},
};
</script>
<style scoped>
</style>