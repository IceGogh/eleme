<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import adminDashboard from './admin/index'
import editorDashboard from './editor/index'
import defaultDashboard from './default/index'

export default {
  name: 'dashboard',
  components: { defaultDashboard, adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'defaultDashboard'
    }
  },
  created() {
    return
    // 选择需要的控制台
    // if (this.roles.indexOf('admin') >= 0) {
    //   return
    // }
    // this.currentRole = 'adminDashboard'
  }
}
</script>
