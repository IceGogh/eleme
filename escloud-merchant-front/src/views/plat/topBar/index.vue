<template>
  <header class="topBar">
    <div class="logo">
      易登环卫云平台
    </div>
    <account-info></account-info>
    <top-nav-list></top-nav-list>
  </header>
</template>
<script>
  import { mapGetters } from 'vuex'
  import TopNavList from './topNavList'
  import accountInfo from './accountInfo'
  import Levelbar from '../layout/Levelbar'
  import TabsView from '../layout/TabsView'
  import Hamburger from 'components/Hamburger'
//  import Screenfull from 'components/Screenfull'
  import ErrorLog from 'components/ErrLog'
  import errLogStore from 'store/errLog'
  import people_png from '../../../assets/img/people.png'

  export default {
    components: {
      Levelbar,
      TabsView,
      Hamburger,
      ErrorLog,
//      Screenfull,
      TopNavList,
      accountInfo
    },
    data() {
      return {
        people_img_url: people_png,
        log: errLogStore.state.errLog
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ])
    },
    methods: {
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .topBar {
    position: fixed;
    top: 0;
    left: 0;
    height: 50px;
    width: 100%;
    background-color: #2f3538;
    border-bottom: 1px solid #2d383f;
    color: #f1f1f1;
    font-size: 15px;
    z-index: 1000;
    min-width: 1440px;
  }
  .logo {
    width: 200px;
    height: 28px;
    font-size: 18px;
    line-height: 28px;
    padding-left: 38px;
    color: #f1f1f1;
    float: left;
    margin-top: 12px;
    margin-left: 23px;
    background: url("../../../assets/img/company_icon.png") no-repeat left center;
    background-size: 32px;
  }
  .avatar-container {
    height: 50px;
    width: 167px;
    display: inline-block;
    /*position: absolute;*/
    /*right: 35px;*/
    float: right;
    .avatar-wrapper {
      height: 52px;
      cursor: pointer;
      margin-top: 8px;
      float: right;
      position: relative;
      right: 30px;
      /*.user-avatar {*/
        /*width: .48rem;*/
        /*height: .48rem;*/
        /*border-radius: .12rem;*/
        /*float: left;*/
      /*}*/
      /*.user-name {*/
        /*width: .96rem;*/
        /*height: .48rem;*/
        /*overflow: hidden;*/
        /*word-wrap: break-word;*/
        /*line-height: .48rem;*/
        /*-ms-text-overflow: ellipsis;*/
        /*text-overflow: ellipsis;*/
        /*font-size: .192rem;*/
        /*padding: 0 .096rem;*/
        /*float: left;*/
      /*}*/
      /*.el-icon-caret-bottom {
        position: absolute;
        right: -.24rem;
        top: .3rem;
        font-size: .144rem;
      }*/
    }
  }
</style>
