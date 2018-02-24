<template>
  <div class='menu-wrapper' :class="MenuMini ? 'mini-menu' : ''" :style="'height:'+ (activeHeight - 87 - 50) + 'px'">
    <template v-for="item in orderRoutes">
      <div v-if="!item.hidden&&item.children.length>0">
        <template v-for="(items,index) in item.children">
          <div v-if="!items.hidden&&items.children.length>0">
            <div class="navItem navItem2" :class="MenuMini ? 'minNavItem' : ''" @click="toggleMenu(index)" :data-key="items.menuNo"  @mouseover="minihover(items.menuNo)" @mouseleave="minihoverLever">
              <svg class="icon" aria-hidden="true">
                <use v-bind:xlink:href="'#' + items.icon"></use>
              </svg>
              <span class="titleName" v-show="!MenuMini">{{items.name}}</span>
              <i v-show="!MenuMini" :class="toggleMenuStatus === index ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
            </div>
            <template v-for="innerItem in items.children">
              <router-link :to="items.path + '/' + innerItem.path" :data-code="curApplicationCode">
                <div class="navItem minNavItem navItem3" :class="{ 'minNavItem': MenuMini, 'hiddenItem': menuStatus(index, '#' + items.path + '/' + innerItem.path === selectHash), 'navItemSelect': innerItem.menuNo === MenuSelectMeno, 'selectItem': '#' + items.path + '/' + innerItem.path === selectHash}" @click="toggleMenuItem" :data-key="curApplicationCode"   @mouseover="minihover(innerItem.menuNo)" @mouseleave="minihoverLever">
                  <svg class="icon" aria-hidden="true">
                    <use v-bind:xlink:href="'#' + innerItem.icon"></use>
                  </svg>
                  <span class="titleName" v-show="!MenuMini"  :data-key="curApplicationCode">{{innerItem.name}}</span>
                </div>
              </router-link>
            </template>
          </div>
          <router-link v-else :to="items.path">
            <div class="navItem minNavItem navItem2" @mouseover="minihover(items.menuNo)" @mouseleave="minihoverLever">
              <svg class="icon" aria-hidden="true">
                <use v-bind:xlink:href="'#' + items.icon"></use>
              </svg>
              <span class="titleName" v-show="!MenuMini">{{items.name}}</span>
            </div>
          </router-link>
        </template>
      </div>
    </template>
    <div class="mini-btn" :class="{'mini-btn-hidden': MenuMini2ndStatus}" @click="MenuMini2nd"></div>
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
        curApplicationCode: '',
        MenuMini: false,
        MenuMini2ndStatus: false,
        BasetoggleMenuStatus: -1,
//        toggleMenuStatus: -1,
        MenuSelectMeno: '',
        MenuHoverStatus: false,
        MenuHoverMeno: ''
      }
    },
    created() {
      if (this.$store.state.app.applicationCode) {
        this.curApplicationCode = this.$store.state.app.applicationCode
      } else {
        this.curApplicationCode = sessionStorage.getItem('EDENEP_APPLICATION_CODE')
      }
    },
    computed: {
      toggleMenuStatus() {
        return this.$store.state.app.toggleMenuStatus
      },
      orderRoutes() {
        function NumAscSort(menuOrder) {
          return function(a, b) {
            const aa = a[menuOrder]
            const bb = b[menuOrder]
            return aa - bb
          }
        }
        const newRoutes = this.routes[0].children.sort(NumAscSort('menuOrder'))
        for (let i = 0; i < newRoutes.length; i++) {
          if (newRoutes[i].children.length) {
            newRoutes[i].children = newRoutes[i].children.sort(NumAscSort('menuOrder'))
          }
        }
        this.routes[0].children = newRoutes
        return this.routes
      }
    },
    props: {
      routes: {
        type: Array
      },
      activeHeight: {
        type: Number
      },
      selectHash: {
        type: String
      }
    },
    methods: {
      menuStatus(index, Booleans) {
        if (this.toggleMenuStatus !== index && !Booleans) {
          return true
        } else {
          return false
        }
      },
      MenuMini2nd() {
        this.MenuMini2ndStatus = !this.MenuMini2ndStatus
        this.$store.commit('MINI_MENU2ndStatus_change')
      },
      toggleStatus(e) {
        this.MenuMini = !this.MenuMini
        this.$store.commit('MINI_MENU_change')
      },
      BasetoggleMenu(name) {
        if (name === this.BasetoggleMenuStatus) {
          this.BasetoggleMenuStatus = -1
        } else {
          this.BasetoggleMenuStatus = name
        }
      },
      toggleMenu(ind) {
        const StatusInd = this.$store.state.app.toggleMenuStatus
        if (ind === StatusInd) {
          ind = -1
        }
        this.$store.dispatch('ACTION_SET_MENUSTATUS', ind)
      },
      toggleMenuItem(e) {
        const code = e.target.dataset.key
        this.$store.dispatch('ACTION_SET_APPLICATIONCODE', code)
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
    box-sizing: border-box;
    width: 100%;
    min-height: 630px;
    background-color: #e9eff4;
    color: #fffefe;
    text-align: center;
    border: 1px #dadfe4 solid;
    border-bottom-color: transparent;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: none;
  }
  .menu-wrapper .mini-btn {
    position: absolute;
    right: 0;
    top: 40%;
    width: 20px;
    height: 30px;
    background-color: #d6dde4;
    transform-origin: 50% 50%;
    transition: all .3s;
    background-image: url('../../../assets/img/menuMini.png');
    background-position: center center;
    background-size: 15px 20px;
    background-repeat: no-repeat;
  }
  .menu-wrapper .mini-btn-hidden {
    right: -20px;
    transform: rotateY(180deg);
  }
  .menu-wrapper .mini-btn:before {
    content: '';
    position: absolute;
    top: -10px;
    right: 0;
    width: 0;
    height: 0;
    border-right: 20px solid #d6dde4;
    border-top: 10px transparent solid;
  }
  .menu-wrapper .mini-btn:after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 0;
    width: 0;
    height: 0;
    border-right: 20px solid #d6dde4;
    border-bottom: 10px transparent solid;
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
  .navItem {
    width: 100%;
    height: .5rem;
    background-color: #e9eff4;
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
    margin-left: .25rem;
  }
  .navItem .titleName {
    position: relative;
    left: .12rem;
  }
  .navItem2 {
    color: #000;
    background-color: #e9eff4;
  }
  .navItem2:hover {
    background-color: #249ede;
    color: #fff;
  }
  .navItem3 {
    color: #a4a5a6;
    background-color: #e9eff4;
  }
  .navItem3:hover {
    background-color: #fff;
  }
  .selectItem {
    color: #409EFF;
    background: #fff;
  }
  .mini-menu {
    width: .65rem!important;
  }
  .menu-wrapper .hiddenItem {
    display: none
  }
  .menu-wrapper .navItemSelect {
    display: block!important;
    background: #249ede!important;
    color: #fff;
  }
  .mini-menu-right {
    display: none;
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
  .el-menu {
    border: none;
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
