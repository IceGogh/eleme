<template>
  <div class="main-contain-new clearfix">
    <!-- 侧边菜单导航（按需加载，不需要就删除）-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <el-tabs v-model="currentView">
        <el-tab-pane label="班次管理" name="shift"></el-tab-pane>
        <el-tab-pane label="考勤组管理" name="attendance"></el-tab-pane>
        <el-tab-pane label="人员排班查询" name="schedule"></el-tab-pane>
      </el-tabs>
      <keep-alive>
        <component :is="currentView"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import SidebarMenu from '@/views/plat/layout/SidebarMenu'
import ShiftManage from '@/views/merchant/work/shiftManage'
import AttendanceManage from '@/views/merchant/work/attendanceManage'
import EmployeeSchedule from '@/views/merchant/work/employeeScheduleList'

export default {
  name: 'tableMarchantShift',
  components: { 'sidebar-menu': SidebarMenu, shift: ShiftManage, attendance: AttendanceManage, schedule: EmployeeSchedule },
  data() {
    return {
      currentView: 'shift'
    }
  },
  computed: {
    minimenu2ndStatus() {
      return this.$store.state.app.minimenu2ndStatus
    }
  },
  methods: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
