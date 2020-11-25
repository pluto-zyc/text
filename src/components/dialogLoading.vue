<template>
  <el-dialog
  custom-class='dialog'
    :show-close="false"
    :visible="info.isShow"
    width="210px"
    :center="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    top='50vh'
    title=""
  >
    <div class="loadingInfo">
        <i class="el-icon-loading"></i>
    <span :style="{display:'block'}">{{info.msg}}</span>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
    props:["info"],
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
    
  },
  beforeDestroy() {},
};
</script>
<style scoped>
.el-icon-loading{
    font-size: 30px;
    margin-bottom: 10px;
    text-align: center;
}
.loadingInfo{
    text-align: center;
    margin-top: -20px;
}

</style>