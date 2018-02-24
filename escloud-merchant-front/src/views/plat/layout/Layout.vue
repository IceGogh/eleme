<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<topbar></topbar>
		<sidebar class="sidebar-container" v-if="simpleRoleChk !== 1 ? true : false"></sidebar>
		<div class="main-container" :class="{'mini-menuStatus': minimenStatus}"  :style="simpleRoleChk === 1 ? 'margin-left: 0' : ''">
			<!--<navbar></navbar>-->
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
import Topbar from 'views/plat/topBar'
import { Sidebar, AppMain } from 'views/plat/layout'

export default {
  name: 'layout',
  components: {
    Topbar,
    /* Navbar,*/
    Sidebar,
    AppMain
  },
  data() {
    return {
      simpleRoleChk: ''
    }
  },
  created() {
    if (this.$store.state.user.simpleRole) {
      this.simpleRoleChk = Number(this.$store.state.user.simpleRole)
    } else {
      this.simpleRoleChk = Number(sessionStorage.getItem('EDENEP_SYSTEM_SIMPLEROLE'))
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    minimenStatus() {
      return this.$store.state.app.minimenu
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.app-wrapper {
		@include clearfix;
		position: relative;
		/*height: 100%;*/
		width: 100%;
		/*&.hideSidebar {*/
			/*.sidebar-container{*/
				/*width:36px;*/
				/*overflow: inherit;*/
			/*}*/
			/*.main-container {*/
				/*margin-left: 36px;*/
			/*}*/
		/*}*/
		.sidebar-container {
			transition: width 0.28s ease-out;
			/*width: 180px;*/
			height: 100%;
			position: fixed;
			top: 50px;
			bottom: 0;
			left: 0;
			z-index: 1001;
			/*overflow-y: auto;*/
 			&::-webkit-scrollbar {display:none}
		}
		.main-container {
      position: relative;
      top: 50px;
			min-height: 100%;
			/*transition: margin-left 0.28s ease-out;*/
			margin-left: 1.76rem;
		}
    .mini-menuStatus {
      margin-left: .65rem;
    }
	}
  .el-menu.navbar {
    background-color: transparent!important;
  }
  .el-breadcrumb__inner span{
    color: #323232!important;
    font-weight: normal!important;
  }
</style>
