<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="(tag,index) in Array.from(visitedViews)" :to="tag.path" :key="index">
      <el-tag :closable="true" hit :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    visitedViews() {
      return this.$store.state.app.visitedViews.slice(-6)
    }
  },
  methods: {
    closeViewTabs(view, $event) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view.path)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
      $event.preventDefault()
    },
    generateRoute() {
      if (this.$route.matched[this.$route.matched.length - 1].name) {
        return this.$route.matched[this.$route.matched.length - 1]
      }
      this.$route.matched[0].path = '/'
      return this.$route.matched[0]
    },
    addViewTabs() {
      this.$store.dispatch('addVisitedViews', this.generateRoute())
    },
    isActive(path) {
      return path === this.$route.path
    }
  },
  watch: {
    $route() {
      this.addViewTabs()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    position: absolute;
    top: 0;
    left: 3.5rem;
    height: 40px;
    line-height: 34px;
    outline: none;
    .tabs-view {
      margin-left: 10px;
    }
  }
  .el-breadcrumb__inner span{
    color: #323232!important;
    font-weight: normal!important;
  }
</style>
