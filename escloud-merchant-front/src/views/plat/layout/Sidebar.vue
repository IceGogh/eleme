<template>
    <el-menu default-active="2"
              mode="vertical" background-color="#333744" text-color="#bfcbd9" active-text-color="#409EFF" unique-opened :default-active="$route.path" :collapse="isCollapse">
    	<!--<i>{{permission_routers}}</i>-->
      <sidebar-item :routes='permission_routers'></sidebar-item>
    </el-menu>
</template>


<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
