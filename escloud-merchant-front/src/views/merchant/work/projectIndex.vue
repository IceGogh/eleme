<template>
  <div>
    <div class="main-contain-new clearfix">
      <sidebar-menu></sidebar-menu>
      <div class="main-contain-new-inner">XXX 项目工作台主页</div>
    </div>
  </div>
</template>
<script>
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'
  import { getCurProjectCode } from '@/api/common'

  export default {
    data() {
      return {
        curProjectCode: getCurProjectCode()
      }
    },
    components: {
      SidebarMenu
    },
    created() {
      console.log(this.curProjectCode)
    }
  }
</script>
<style>
  .main-contain-new {
    display: flex;
  }
  .main-contain-new-inner {
    flex-grow: 1
  }
</style>
