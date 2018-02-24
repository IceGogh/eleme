<template>
  <div class='menu-wrapper' :class="MenuMini ? 'mini-menu' : ''">
    <div class="menuTop" :class="MenuMini ? 'menuTopMini' : ''" @click="toggleStatus"></div>
    <template v-for="item in routes">
      <div v-if="!item.hidden" @click="toggleMenuItem" :data-key="item.code"  @mouseover="minihover(item.name)" @mouseleave="minihoverLever" :class="selectCheck(item.code) ? 'selected' : ''">
        <router-link :to="item.path" :data-key="item.code" class="navItem0 navItem " :class="MenuMini ? 'minNavItem' : ''">
          <svg class="icon" aria-hidden="true" :data-key="item.code">
            <use v-bind:xlink:href="'#' + item.icon"  :data-key="item.code"></use>
          </svg>
          <span class="titleName" v-show="!MenuMini"  :data-key="item.code">{{item.name}}</span>
          <div class="mini-menu-right" v-show="MenuHoverStatus && item.name === MenuHoverMeno">
            {{item.name}}
          </div>
        </router-link>
      </div>
    </template>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  Vue.use(Vuex)
  export default {
    name: 'SidebarItem',
    data() {
      return {
        BasetoggleMenuStatus: -1,
        toggleMenuStatus: -1,
        MenuSelectMeno: '',
        MenuHoverStatus: false,
        MenuHoverMeno: ''
      }
    },
    computed: {
      MenuMini() {
        return this.$store.state.app.minimenu
      }
    },
    props: {
      routes: {
        type: Array
      }
    },
    methods: {
      selectCheck(code) {
        if (code === this.$store.state.app.applicationCode) {
          return true
        } else {
          return false
        }
      },
      toggleStatus(e) {
        const Status = this.$store.state.app.minimenu
//        this.MenuMini = !this.MenuMini
        this.$store.commit('MINI_MENU_change', !Status)
      },
      BasetoggleMenu(name) {
        if (name === this.BasetoggleMenuStatus) {
          this.BasetoggleMenuStatus = -1
        } else {
          this.BasetoggleMenuStatus = name
        }
      },
      toggleMenu(path) {
        if (path === this.toggleMenuStatus) {
          this.toggleMenuStatus = -1
        } else {
          this.toggleMenuStatus = path
        }
      },
      toggleMenuItem(e) {
        this.$store.state.app.minimenu = true
        const code = e.target.dataset.key
        this.$store.dispatch('ACTION_SET_APPLICATIONCODE', code)
        this.$store.dispatch('ACTION_SET_APPCODE_TO_SESSION', code)
        this.MenuSelectMeno = code
      },
      minihover(Meno) {
        if (!this.MenuMini) {
          return
        }
        this.MenuHoverMeno = Meno
        this.MenuHoverStatus = true
      },
      minihoverLever() {
        if (!this.MenuMini) {
          return
        }
        this.MenuHoverStatus = false
      }
    }
  }
</script>
<style scoped>
  .menu-wrapper {
    width: 1.76rem;
    color: #fffefe;
    text-align: center;
  }
  .menuTop {
    width: 100%;
    height: .46rem;
    position: relative;
    line-height: .46rem;
    background-color: #333744;
    background-image: url("../../../assets/img/menuTop.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: .24rem;
    margin-bottom: 3px;
  }
  .menuTop:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: -1px;
    background-color: #3d4448;
  }
  .menuTop:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: -2px;
    background-color: #1c1f21;
  }
  .menuTopMini {
    background-position-x: .24rem;
    background-image: url("../../../assets/img/menuTop2.png");
  }
  .menu-wrapper .navItem0 {
    background-color: #333744;
  }
  .menu-wrapper .navItem0:hover {
    background-color: #2d303c;
  }
  .selected a{
      background-color: #23252f !important;
  }
  .navItem {
    display: block;
    width: 100%;
    height: .5rem;
    background-color: #42485b;
    line-height: .5rem;
    position: relative;
    cursor: pointer;
    text-align: left;
    text-indent: .15rem;
    font-size: .1rem;
  }
  .navItem i {
    padding-right: .12rem!important;
  }
  .navItem .icon {
    margin-left: .1rem;
  }
  .navItem .titleName {
    position: relative;
    left: .12rem;
  }
  .navItem2 {
    background-color: #2a2d38;
  }
  .navItem2:hover {
    background-color: #249ede;
    color: #fff;
  }
  .navItem3 {
    background-color: #21232e;
  }
  .navItem3:hover {
    background-color: #42485b;
  }
  .mini-menu {
    width: .65rem!important;
  }
  .menu-wrapper .hiddenItem {
    display: none
  }
  .menu-wrapper .navItemSelect {
    background: #249ede!important;
    color: #fff;
  }
  .mini-menu-right {
    /*display: none;*/
    position: absolute;
    box-sizing: content-box;
    text-align: center;
    min-width: .624rem;
    height: .456rem;
    line-height: .456rem;
    padding: 0 .252rem;
    top: .084rem;
    left: .78rem;
    background-color: rgba(34, 34, 34, .7);
    border-radius: .048rem;
    color: #fff;
    font-size: .12rem;
    word-break: keep-all;
    text-indent: 0;
  }
  .mini-menu-right::after {
    content: '';
    position: absolute;
    left: -.096rem;
    top: .12rem;
    width: 0;
    height: 0;
    border-right: .096rem solid rgba(34, 34, 34, .7);
    border-top: .072rem solid transparent;
    border-bottom: .072rem solid transparent;
  }
  .el-menu--collapse {
    width: auto!important;
  }
  .el-icon-arrow-right, .el-icon-arrow-down {
    position: absolute;
    right: -.03rem;
    top: .18rem;
  }
  .mini-menu i {
    margin-left: -.05rem;
  }
  .navItem .icon {
    width: 1.2em; height: 1.2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
