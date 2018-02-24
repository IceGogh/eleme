<template>
  <div class="aside" :class="{ 'aside-hidden' : !minimenu2ndStatus}" :style="'height:' + TableHeight + 'px'">
    <div class="aside-title">
      <svg class="icon" aria-hidden="true">
        <use v-bind:xlink:href="'#' + menuTitleIcon"></use>
      </svg>
      <span>{{menuTitleName}}</span>
    </div>
    <el-menu default-active="2"
             mode="vertical" background-color="#333744" text-color="#bfcbd9" active-text-color="#409EFF" unique-opened :default-active="$route.path">
      <menu-list :routes='routesArray' :activeHeight="Height" :selectHash="hash"></menu-list>
    </el-menu>
  </div>
</template>
<script>
  import { getApplicationCode } from '@/api/common'
  import { mapGetters } from 'vuex'
  import menuList from '@/views/plat/layout/menuList'

  export default {
    name: 'tableApplication',
    components: {
      menuList
    },
    beforeCreate() {
      this.$store.state.app.minimenu2ndStatus = true
      let urlWord = window.location.hash.substring(2)
      const ind = urlWord.indexOf('/')
      urlWord = urlWord.substring(0, ind)
      const routersList = this.$store.getters.permission_routers
      for (let i = 0; i < routersList.length; i++) {
        if (!routersList[i].hidden) {
          if (routersList[i].path.replace(/\//g, '') === urlWord) {
            this.$store.state.app.applicationCode = routersList[i].code
          }
        }
      }
    },
    beforeDestroy() {
      this.$store.state.app.minimenu2ndStatus = false
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      TableHeight() {
        return (this.Height - 50)
      },
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    data() {
      return {
        Height: 0,
        hash: '',
        curApplicationCode: '',
        routesArray: [],
        menuTitleName: '',
        menuTitleIcon: ''
      }
    },
    created() {
      const Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.Height = Height
      this.curApplicationCode = getApplicationCode(this)
      const _this = this
      this.permission_routers.forEach(function(item, index) {
        if (item.code === _this.curApplicationCode) {
          _this.routesArray.push(item)
          _this.menuTitleName = item.name
          _this.menuTitleIcon = item.icon
        }
      })
      this.hash = window.location.hash
    }
  }
</script>
<style  rel="stylesheet/scss" lang="scss">
    .aside {
      width: 12%;
      background: #e9eff4;
    }
    .aside-title, .main-title {
      height: 87px;
      font-size: 13px;
      color: #323232;
      font-weight: bold;
    }
    .aside-title {
      line-height: 92px;
      text-indent: 2em;
      border-bottom-color: transparent;
      background-color: #eaeff5;
      border-right: solid 1px #e6e6e6;
      overflow: hidden;
      span {
        margin-left: 1em;
      }
    }
    .main-title {
      background-color: #f3f5f7;
      padding-left: 20px;
      > div {
        float: left;
        height: 40px;
        padding: 0 2px;
        margin: 20px 20px 0 0;
        line-height: 40px;
        cursor: pointer;
      }
      .select {
        color: #249ede;
        border-bottom: 2px solid #249ede;
      }
    }
    > div {
      height: 100%;
      float: left;
      box-sizing: border-box;
    }
    .aside-hidden {
      width: 0;
    }
</style>
