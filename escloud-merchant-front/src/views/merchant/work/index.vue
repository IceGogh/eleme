<template>
  <div style="padding: 20px">
      <h1>工作台 Index 页面</h1>
      <h3>项目列表</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="project in projectList" :key="project.projectCode" >
          <el-card class="box-card" style="margin-bottom: 20px; height: 150px">
            <a href="javascript:;" @click="jumpToProjectIndex(project.projectCode)" title="点击进入项目工作台"><h4>{{project.projectName}}</h4></a>
            <p>Code：{{project.projectCode}}</p>
          </el-card>
        </el-col>
      </el-row>
      <div v-if="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="17" :offset="7">
            <el-pagination @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-size="filterForm.pageSize" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
  </div>
</template>
<script>
  import {
    getProjectList
  } from '@/api/merchant/project/projectManager'

  import {
    globalConfig
  } from '@/globalConfig'

  import { getApplicationCode, setCurProjectCode } from '@/api/common'

  import SidebarMenu from '@/views/plat/layout/SidebarMenu'

  export default {
    data() {
      return {
        curApplicationCode: getApplicationCode(this),
        projectList: [],
        listLoading: false,
        total: 0,
        filterForm: {
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: 12
        }
      }
    },
    components: {
      SidebarMenu
    },
    created() {
      this.getProjectList()
    },
    methods: {
      jumpToProjectIndex(projectCode) {
        setCurProjectCode(projectCode)
        this.$router.push('/work/project/index')
      },
      getProjectList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getProjectList(this.filterForm).then(response => {
          this.listLoading = false
          if (response.data.error_no === 0) {
            this.projectList = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getProjectList()
      }
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
