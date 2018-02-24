<template>
  <div class="main-contain-new clearfix">
    <!-- 二三级菜单导航 (不用修改)-->
    <div class="aside" :class="{ 'aside-hidden' : !minimenu2ndStatus}" :style="'height:' + TableHeight + 'px'">
      <div class="aside-title">
        <svg class="icon" aria-hidden="true">
          <use v-bind:xlink:href="'#' + menuTitleIcon"></use>
        </svg>
        <span>{{menuTitleName}}</span>
      </div>
      <el-menu default-active="2"
               mode="vertical" background-color="#333744" text-color="#bfcbd9" active-text-color="#409EFF" unique-opened :default-active="$route.path">
        <menu-list :routes='routesArray' :activeHeight="Height" :selectHash="hash"></menu-list>
      </el-menu>
    </div>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">

      <!-- tab页切换部分 (根据需要写入 )-->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="item in activeTitle" :key="item.name" :label="item.name" :name="item.title">
            <!-- 放切换的组件 -->
            <keep-alive>
              <div v-if="item.name === '班次管理'">
                <template>
                  <!--班次管理项 对应的组件-->
                </template>
              </div>
            </keep-alive>
            <keep-alive>
              <div v-if="item.name === '考勤组管理'">
                <template>
                  <!--考勤组管理 对应的组件-->
                </template>
              </div>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </template>

      <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addItem">添加考勤组</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入班次/创建人/班次查询" v-model="SearchWord"/>
          <i class="el-icon-search" @click="afterSearch(SearchWord)"></i>
        </div>
      </div>

      <!-- main-contain-inner 原 application.vue 结构代码-->
      <template>
        <div>
          <div class="filter-container" v-show="proSearch">
            <el-form :model="filterForm" ref="filterForm">
              <div v-if=proSearch>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="模块名称" :label-width="filterFormLabelWidth" prop="applicationName" class="form-bottom">
                      <el-input @keyup.enter.native="searchApplication" size="small" class="filter-item" placeholder="模块名称"
                                v-model="filterForm.applicationName">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="资源地址" :label-width="filterFormLabelWidth" prop="applicationUrl" class="form-bottom">
                      <el-input @keyup.enter.native="searchApplication" size="small" class="filter-item" placeholder="资源地址"
                                v-model="filterForm.applicationUrl">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="button-group">
                  <el-col :span="12" class="searchSimpleBtn">
                    <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                      <el-button round type="primary" size="small" icon="el-icon-search" @click="searchApplication" v-waves>搜索
                      </el-button>
                      <el-button round type="primary" plain size="small" icon="el-icon-delete" @click="resetSearch" v-waves>清空
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col v-if=proSearch :span="12" class="searchProBtn">
                    <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload"
                               :loading="downloadLoading">导出
                    </el-button>
                    <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>简单搜索
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
          <div class="simpleFilter" v-show="!proSearch">
            <el-form>
              <el-row class="button-group">
          <span v-if=!proSearch>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
              <el-select @keyup.enter.native="searchApplication" size="small" class="filter-item" @change="searchName"
                         clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
              <el-input @keyup.enter.native="searchApplication" size="small" class="filter-item" :placeholder="selectDesc"
                        v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button round type="primary" size="small" icon="el-icon-search" @click="searchApplication" v-waves>搜索</el-button>
          </el-col>
          </span>
                <el-col v-if=!proSearch :span="12" class="searchProBtn">
                  <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload"
                             :loading="downloadLoading">导出
                  </el-button>
                  <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="app-container calendar-list-container">

            <el-table ref="multipleTable" :data-key="tableKey" :data="list" fit highlight-current-row size='mini'
                      :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox"         :row-style="selectRow"
                      :row-class-name="selectRowClass"
                      @select-all="selectAllCheckBox"
                      v-loading="listLoading" element-loading-text="给我一点时间"
                      style="width: 100%">
              <el-table-column show-overflow-tooltip type="selection" width="50">
              </el-table-column>
              <el-table-column show-overflow-tooltip type="index" width="50"></el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" width="50" align="center" label="主键ID" prop='id' v-if=false sortable>
                <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="模块编号" prop='applicationCode' width="150">
                <template slot-scope="scope">
            <span> <a href="javascript:void(0)" @click="addChildModel(scope.row)"
                      title="点击添加子模块">{{scope.row.applicationCode}}</a> </span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="模块名称" prop='applicationName'>
                <template slot-scope="scope">
                  <span>{{scope.row.applicationName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="图标类" prop='menuIcon'>
                <template slot-scope="scope">
                  <span>{{scope.row.menuIcon}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="描述" prop='applicationDesc'>
                <template slot-scope="scope">
                  <span>{{scope.row.applicationDesc}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="资源地址" prop='applicationUrl'>
                <template slot-scope="scope">
                  <span>{{scope.row.applicationUrl}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="请求路径" prop='applicationServerPath'>
                <template slot-scope="scope">
                  <span>{{scope.row.applicationServerPath}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="文件路径" prop='applicationFilePath'>
                <template slot-scope="scope">
                  <span>{{scope.row.applicationFilePath}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="资源类型" prop='resType'>
                <template slot-scope="scope">
                  <span>{{resTypeMapObj[scope.row.resType]}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="子菜单是否控制权限" prop='applicationServerPath'>
                <template slot-scope="scope">
                  <span>{{isPermissionMapObj[scope.row.isPermission]}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建人" prop='createBy'v-if=false>
                <template slot-scope="scope">
                  <span>{{scope.row.createBy}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建时间" prop='createDate' v-if=false sortable>
                <template slot-scope="scope">
                  <span>{{scope.row.createDate}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改人" prop='modifyBy' v-if=false>
                <template slot-scope="scope">
                  <span>{{scope.row.modifyBy}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改时间" prop='modifyDate'v-if=false>
                <template slot-scope="scope">
                  <span>{{scope.row.modifyDate}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" label="操作" width="220" fixed='right'>
                <template slot-scope="scope">
                  <el-button round size="small" type="text" @click="modifyApplication(scope.row,'update')">修改
                  </el-button>
                  <el-button round size="small" type="text" @click="deleteApplication(scope.row,'delete')">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-show="!listLoading" class="pagination-container">
              <el-row>
                <el-col :span="12">
                  <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addApplication">添加</el-button>
                  <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">
                    批量删除
                  </el-button>
                  <el-button round type="info" plain size="small"  icon="el-icon-plat-sync" @click="synAll">更新所有缓存</el-button>
                </el-col>
                <el-col :span="12">
                  <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange"
                                 :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize"
                                 layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>

            <el-dialog center class="transfer_dialog" title="添加子模块" :visible.sync="transferDialogVisible" size="tiny">
              <template style="padding: 55px">
                <el-transfer filterable filter-placeholder="请输入模块名称" v-model="transferValue" :data="transferData"
                             :titles="['可选模块', '已选模块']">
                </el-transfer>
              </template>
              <div slot="footer" class="dialog-footer">
                <el-button round @click="transferDialogVisible = false">取 消</el-button>
                <el-button round @click="updateTransferDialog" type="primary">确 定</el-button>
              </div>
            </el-dialog>

            <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small"
                       :before-close="closeDialog">
              <el-form :model="applicationForm" :rules="applicationFormRules" ref="applicationForm" label-width="80px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item v-if="false" label="主键ID" :label-width="formLabelWidth" prop="id">
                      <el-input size="small" v-model="applicationForm.id" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="模块名称" :label-width="formLabelWidth" prop="applicationName">
                      <el-input size="small" v-model="applicationForm.applicationName" :maxlength="20"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="图标类" :label-width="formLabelWidth" prop="menuIcon">
                      <el-input size="small" v-model="applicationForm.menuIcon" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="是否控制权限" :label-width="formLabelWidth" prop="isPermission">
                      <el-select size="small" v-model="applicationForm.isPermission" clearable filterable
                                 placeholder="请输入">
                        <el-option v-for="item in isPermissionMapArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="资源类型" :label-width="formLabelWidth" prop="resType">
                      <el-select size="small" v-model="applicationForm.resType" clearable filterable
                                 placeholder="请输入">
                        <el-option v-for="item in resTypeMapArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="请求路径" :label-width="formLabelWidth" prop="applicationServerPath">
                      <el-input size="small" v-model="applicationForm.applicationServerPath" :maxlength="150"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="资源地址" :label-width="formLabelWidth" prop="applicationUrl">
                      <el-input size="small" v-model="applicationForm.applicationUrl" :maxlength="150"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="文件地址" :label-width="formLabelWidth" prop="applicationFilePath">
                      <el-input size="small" v-model="applicationForm.applicationFilePath" :maxlength="150"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22">
                    <el-form-item label="描述" :label-width="formLabelWidth" prop="applicationDesc">
                      <el-input size="small" v-model="applicationForm.applicationDesc" :maxlength="100" resize='vertical'
                                type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button round @click="closeDialog">取 消</el-button>
                <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
                <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
              </div>
            </el-dialog>

            <!--<image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close'-->
            <!--@crop-upload-success="cropSuccess" v-show="imagecropperShow"></image-cropper>-->

          </div>
        </div>
      </template>
    </div>

  </div>
</template>
<script>
  import { getApplicationCode } from '@/api/common'
  import {
    getApplicationList,
    addApplication,
    editApplication,
    delApplication,
    delBatchApplication,
    queryFreeModel,
    updateChildModel,
    synAllApplication
  } from '@/api/plat/application'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import { mapGetters } from 'vuex'
  import menuList from '@/views/plat/layout/menuList'

  export default {
    name: 'tableApplication',
    directives: {
      waves
    },
    components: {
      menuList
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      TableHeight() {
        return (this.Height - 50)
      },
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    data() {
      return {
        Height: 0,
        hash: '',
        curApplicationCode: '',
        routesArray: [],
        menuTitleName: '',
        menuTitleIcon: '',
        checkList: [],
        SearchWord: '',
        activeName: 'banci',
        activeTitle: [
          {
            title: 'banci',
            name: '班次管理'
          },
          {
            title: 'kaoqin',
            name: '考勤组管理'
          }
        ],
        list: [],
        searchOptions: [{
          value: 'applicationName',
          label: '模块名称'
        },
        {
          value: 'applicationUrl',
          label: '资源地址'
        }],
        total: 0,
        selectDesc: '',
        listLoading: true,
        proSearch: false,
        downloadLoading: false,
        isBatch: true,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        queryType: '',
        queryParams: '',
        filterForm: {
          id: '',
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          isPermission: '',
          applicationFilePath: '',
          resType: '',
          applicationServerPath: '',
          applicationUrl: '',
          menuIcon: '',
          createBy: '',
          createDate: [],
          modifyBy: '',
          modifyDate: [],
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        transferDialogVisible: false,
        formLabelWidth: '120px',
        applicationForm: {
          id: '',
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          isPermission: '',
          resType: '',
          applicationFilePath: '',
          applicationServerPath: '',
          applicationUrl: '',
          menuIcon: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        // 表单校验规则
        applicationFormRules: {
          id: [{
            type: 'number',
            required: true,
            message: '请输入主键ID',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '主键ID必须为数字值'
          }],
          applicationName: [{
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }],
          applicationFilePath: [{
            required: true,
            message: '请输入文件路径',
            trigger: 'blur'
          }],
          isPermission: [{
            required: true,
            message: '请选择子菜单是否控制权限',
            trigger: 'blur'
          }],
          applicationServerPath: [{
            required: true,
            message: '请输入模块的请求路径',
            trigger: 'blur'
          }],
          applicationDesc: [{
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }],
          applicationUrl: [{
            required: true,
            message: '请输入资源地址',
            trigger: 'blur'
          }]
        },
        transferValue: [],
        transferData: [],
        isPermissionMapObj: {
          '0': '不控制',
          '1': '控制'
        },
        isPermissionMapArr: [
          {
            label: '不控制',
            value: '0'
          }, {
            label: '控制',
            value: '1'
          }
        ],
        resTypeMapObj: {
          '0': '平台资源',
          '1': '商户资源'
        },
        resTypeMapArr: [
          {
            label: '平台资源',
            value: '0'
          }, {
            label: '商户资源',
            value: '1'
          }
        ],
        updateTransferParams: {}
      }
    },
    created() {
      const Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.Height = Height
      this.curApplicationCode = getApplicationCode(this)
      const _this = this
      this.permission_routers.forEach(function(item, index) {
        if (item.code === _this.curApplicationCode) {
          _this.routesArray.push(item)
          _this.menuTitleName = item.name
          _this.menuTitleIcon = item.icon
        }
      })
      this.hash = window.location.hash
    },
    methods: {
      addItem() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleClick() {},
      synAll() {
        this.listLoading = true
        synAllApplication().then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '同步成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      selectRowClass(rowIndex) {

      },
      selectRow(rowIndex) {

      },
      addChildModel(row) {
        this.transferValue.length = 0
        this.transferData.length = 0
        this.updateTransferParams = {}
        const applicationCode = row.applicationCode
        this.updateTransferParams.applicationCode = applicationCode
        this.transferDialogVisible = true
        var params = { 'applicationCode': applicationCode }
        queryFreeModel(params).then(response => {
          if (response.data.error_no === 0) {
            const result = response.data.result
            if (result !== undefined && result !== null) {
              result.forEach((i) => {
                this.transferData.push({
                  key: i.menuNo,
                  label: i.menuName
                })
                if (i.applicationCode === applicationCode) {
                  this.transferValue.push(
                    i.menuNo
                  )
                }
              })
            }
          }
        })
      },
      updateTransferDialog() {
        this.listLoading = true
        this.updateTransferParams.primaryKeys = this.transferValue
        updateChildModel(this.updateTransferParams).then(response => {
          if (response.data.error_no === 0) {
            this.transferDialogVisible = false
            this.$notify({
              title: '成功',
              message: response.data.error_info,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      getApplicationList() {
        this.listLoading = true
        getApplicationList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchApplication() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getApplicationList()
      },
      addApplication() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyApplication(row) {
        this.applicationForm.id = row.id
        this.applicationForm.applicationFilePath = row.applicationFilePath
        this.applicationForm.resType = row.resType
        this.applicationForm.applicationServerPath = row.applicationServerPath
        this.applicationForm.isPermission = row.isPermission
        this.applicationForm.applicationCode = row.applicationCode
        this.applicationForm.applicationName = row.applicationName
        this.applicationForm.applicationDesc = row.applicationDesc
        this.applicationForm.applicationUrl = row.applicationUrl
        this.applicationForm.menuIcon = row.menuIcon
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteApplication(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id,
            applicationCode: row.applicationCode
          }
          this.listLoading = true
          delApplication(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchApplication()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      deleteBatch() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selection = this.$refs.multipleTable.selection
          const selectIds = []
          const selectApplicationCodes = []
          for (var i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
            selectApplicationCodes.push(selection[i].applicationCode)
          }
          const param = {
            primaryKeys: selectIds,
            applicationCodes: selectApplicationCodes
          }
          this.listLoading = true
          delBatchApplication(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.$refs.multipleTable.clearSelection()
              this.searchApplication()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      pageSizeChange(val) {
        this.filterForm.current = globalConfig.startPage
        this.filterForm.pageSize = val
        this.getApplicationList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getApplicationList()
      },
      addSubmit() {
        this.$refs['applicationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addApplication(this.applicationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchApplication()
              } else {
                this.$message(response.data.error_info)
              }
              this.listLoading = false
            })
          } else {
            return false
          }
        })
      },
      updateSubmit() {
        this.$refs['applicationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editApplication(this.applicationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchApplication()
              } else {
                this.$message(response.data.error_info)
              }
              this.listLoading = false
            })
          } else {
            return false
          }
        })
      },
      searchName(val) {
        this.resetSearch()
        if (val !== '') {
          let obj = {}
          obj = this.searchOptions.find((item) => {
            return item.value === val
          })
          this.selectDesc = '请输入' + obj.label
        } else {
          this.selectDesc = ''
        }
        this.queryParams = ''
      },
      changeProButton() {
        this.resetSearch()
        this.proSearch = !this.proSearch
      },
      selectCheckBox(selection, row) {
        if (selection.length === 0) {
          this.isBatch = true
        } else {
          this.isBatch = false
        }
        const ChkList = this.checkList
        ChkList[row.id - 1] = !ChkList[row.id - 1]
      },
      selectAllCheckBox(selection) {
        if (selection.length === 0) {
          this.isBatch = true
        } else {
          this.isBatch = false
        }
      },
      resetSearch() {
        this.filterForm = {
          id: '',
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          applicationUrl: '',
          createBy: '',
          createDate: [],
          modifyBy: '',
          modifyDate: [],
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.applicationForm = {
          id: '',
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          applicationUrl: '',
          createBy: '',
          createDate: '',
          resType: '',
          isPermission: '',
          modifyBy: '',
          modifyDate: ''
        }
        if (this.$refs['applicationForm'] !== undefined) {
          this.$refs['applicationForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '模块编码',
            '模块名称',
            '描述',
            '资源地址',
            '创建人',
            '创建时间',
            '修改人',
            '修改时间'
          ]
          const filterVal = [
            'id',
            'applicationCode',
            'applicationName',
            'applicationDesc',
            'applicationUrl',
            'createBy',
            'createDate',
            'modifyBy',
            'modifyDate'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '模块表')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.buttonForm.btnIcon = resData.files.avatar
      },
      close() {
        this.imagecropperShow = false
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.resetForm()
      }
    }
  }
</script>
<style  rel="stylesheet/scss" lang="scss">
  .main-contain-new {
    background-color: #e9eff4;
    .el-table__body-wrapper {
      background-color: #fff !important;
    }
    .el-table__body-wrapper.is-scroll-left table {
      /*border-collapse: separate;*/
      /*border-spacing: 0;*/
    }
    td {
      border-radius: 0!important;
      padding: 20px 0!important;
    }
    tr.current-row.el-table__row > td {
      background-color: #f4f5f7!important;
      color: #3f4042!important;
      a {
        color: #3f4042!important;
      }
    }
    tr.hover-row.el-table__row > td {
      background-color: #f4f5f7!important;
      color: #3f4042!important;
      a {
        color: #3f4042!important;
      }
    }
    thead, thead tr, thead tr th {
      background-color: #f3f5f7!important;
    }
    margin: 0;
    li {
      list-style: none;
    }
    tr.el-table__row {
      background: #fff!important;
    }
    .el-tabs__header {
      margin: 20px!important;
    }
    .el-tabs__content {
      margin: 20px!important;
    }
    .filter-container {
      box-shadow: none!important;
    }
    .simpleFilter {
      box-shadow: none!important;
    }
    .app-container.calendar-list-container {
      height: 720px!important;
      box-shadow: none!important;
    }
    .el-tabs__nav-wrap::after {
      content: '';
      display: none!important;
    }
    /*
    .hiddenNote {
      display: none;
      position: absolute;
      box-sizing: border-box;
      padding: 15px;
      top: 35px;
      left: 0;
      width: 210px;
      max-height: 150px;
      border-radius: 4px;
      box-shadow: 5px 5px 10px 5px rgba(240, 245, 249, 0.29);
      z-index: 100;
      background-color: #fafbfd;
      white-space: normal;
      font-size: 14px;
      p {
        max-height: 112px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }
    }
    .hiddenNote:after {
      content: '';
      position: absolute;
      left: 50%;
      top: -10px;
      width: 0;
      height: 0;
      margin-left: -5px;
      border-bottom: 10px #fafbfd solid;
      border-left: 10px transparent solid;
      border-right: 10px transparent solid;
    }
    .noteItem {
      position: relative;
      .noteBase {
        font-size: 28px;
        color: #cfd4d8;
        cursor:pointer;
      }
      .noteBase:hover {
        color: #19a3ca;
      }
    }
    .noteItem:hover {
      .hiddenNote {
        display: block;
      }
    }
    .pagination-container {
      background-color: #fff;
    }
    .icon {
      width: 1.2em; height: 1.2em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
    */
    .aside {
      background: #e9eff4;
    }
    .aside-title, .main-title {
      height: 87px;
      font-size: 13px;
      color: #323232;
      font-weight: bold;
    }
    .aside-title {
      line-height: 92px;
      text-indent: 2em;
      border-bottom-color: transparent;
      background-color: #eaeff5;
      border-right: solid 1px #e6e6e6;
      span {
        margin-left: 1em;
      }
    }
    .main-title {
      background-color: #f3f5f7;
      padding-left: 20px;
      > div {
        float: left;
        height: 40px;
        padding: 0 2px;
        margin: 20px 20px 0 0;
        line-height: 40px;
        cursor: pointer;
      }
      .select {
        color: #249ede;
        border-bottom: 2px solid #249ede;
      }
    }

    > div {
      height: 100%;
      float: left;
      box-sizing: border-box;
    }
    .aside {
      width: 12%;
      transition: width .3s;
      background-color: #e9eff4;
    }
    .aside-hidden {
      width: 0;
    }
    .main-contain-new-inner {
      width: 88%;
      height: auto;
      box-sizing: border-box;
      padding: 20px;
      background-color: #f3f5f7;
      transition: all .3s;
      .option-bar {
        height: 70px;
        padding: 20px;
        margin: 20px 40;
        box-sizing: border-box;
        background: #fff;
      }
      .searchBox {
        float: right;
        position: relative;
        height: 36px;
        input {
          border: none;
          outline: none;
          border-bottom: 2px #e1e6ea solid;
          width: 210px;
          padding-right: 40px;
          height: 34px;
          line-height: 34px;
          font-size: 13px;
        }
        i {
          position: absolute;
          right: 0;
          top: 0;
          width: 34px;
          height: 34px;
          cursor: pointer;
          color: #9fdf00;
          font-size: 22px;
          text-align: center;
          padding-top: 6px;
        }
      }
      .add-btn {
        width: 170px;
        height: 36px;
        padding: 0;
        border: none;
        float: left;
      }
      .search {
        width: 240px;
        float: right;
        border: none;
      }
    }
    .main-contain-new-inner-all {
      width: 100%;
    }
  }
</style>
