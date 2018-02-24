<template>
  <div>
    <div class="main-contain-new clearfix">
      <sidebar-menu></sidebar-menu>
      <div class="main-contain-new-inner">项目管理 一级默认页面</div>
    </div>
  </div>
</template>
<script>
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'
  export default {
    components: {
      SidebarMenu
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
