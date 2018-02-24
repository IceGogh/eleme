<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item ,index) in levelList" :key="index">
      <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect" style="color:#323232;font-size:0.144rem;">{{item.name}}</span>
      <router-link v-else :to="item.redirect||item.path" style="color:#323232;font-size:0.144rem;">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && (first.name !== '首页' || first.path !== '')) {
        matched = [{ name: '首页', path: '/' }].concat(matched)
      }
      this.levelList = matched
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-menu.navbar {
    background-color: transparent!important;
  }
  .app-levelbar.el-breadcrumb {
    /*font-size: 14px;*/
    /*line-height: 50px;*/
    /*margin-left: 10px;*/
    padding: .156rem 0 .156rem .2rem;
    font-size: .156rem;
    color: #323232;
    margin: 0 0 .05rem .25rem;
    box-shadow: 0 0 .06rem rgba(117, 208, 255, .6);
    -webkit-box-shadow: 0 0 .06rem rgba(117, 208, 255, .6);
    outline: none;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
