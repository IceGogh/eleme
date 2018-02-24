<template>
  <div class="main-contain-new clearfix">
    <sidebar-menu></sidebar-menu>
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addManagerResource">添加</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord"/>
          <i class="el-icon-search" @click="searchManagerResource(filterForm.searchWord)"></i>
        </div>
      </div>
      <template xmlns="http://www.w3.org/1999/html">
        <div class="app-container calendar-list-container">
          <el-table ref="multipleTable" :key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="62" label="序号"></el-table-column>
            <el-table-column header-align="center" align="center" label="资源名称" prop='resourceName' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.resourceName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="资源状态" prop='resourceState'>
              <template slot-scope="scope">
                <span>{{stateMapObj[scope.row.resourceState]}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="资源类型" prop='resourceType' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{resourceTypeMapObj[scope.row.resourceType]}}</span>
              </template>
            </el-table-column>

            <el-table-column header-align="center" align="center" label="资源描述" prop='resourceDesc' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.resourceDesc}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="修改人" prop='modifyBy'>
              <template slot-scope="scope">
                <span>{{scope.row.modifyBy}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="修改时间" prop='modifyDate'>
              <template slot-scope="scope">
                <span>{{scope.row.modifyDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150" fixed='right'>
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="modifyManagerResource(scope.row,'update')">修改
                </el-button>
                <el-button size="small" type="text" @click="deleteManagerResource(scope.row,'delete')">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-show="!listLoading" class="pagination-container">
            <el-row>
              <el-col :span="7">
                <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
              </el-col>
              <el-col :span="17">
                <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </div>

          <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
            <el-form :model="managerResourceForm" :rules="managerResourceFormRules" ref="managerResourceForm" label-width="80px">
              <el-row>
                <el-col :span="11">
                  <el-form-item v-show="false" label="" :label-width="formLabelWidth" prop="id">
                    <el-input size="small" v-model="managerResourceForm.id" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="资源名称" :label-width="formLabelWidth" prop="resourceName">
                    <el-input size="small" v-model="managerResourceForm.resourceName" :maxlength="50"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="资源类型" :label-width="formLabelWidth" prop="resourceType">
                    <el-select size="small" v-model="managerResourceForm.resourceType" placeholder="请选择">
                      <el-option v-for="item in resourceTypeMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="managerResourceForm.resourceType=='ICON_RESOURCE'">
                <el-col :span="8">
                  <el-form-item label="在线图标类" :label-width="formLabelWidth" prop="iconOnlineClass">
                    <el-input size="small" v-model="managerResourceForm.iconOnlineClass" :maxlength="50"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="在线图标" prop="iconOnlineClass">
                    <i v-bind:class="managerResourceForm.iconOnlineClass"></i>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="离线图标类" :label-width="formLabelWidth" prop="iconOfflineClass">
                    <el-input size="small" v-model="managerResourceForm.iconOfflineClass" :maxlength="50"  placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label="离线图标" prop="iconOfflineClass">
                    <i v-bind:class="managerResourceForm.iconOfflineClass"></i>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="资源状态" :label-width="formLabelWidth" prop="resourceState">
                    <el-select size="small" v-model="managerResourceForm.resourceState" clearable
                               placeholder="请选择">
                      <el-option v-for="item in resourceStateMapArr" :key="item.value" :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="资源描述" :label-width="formLabelWidth" prop="resourceDesc">
                    <el-input size="small" v-model="managerResourceForm.resourceDesc" :maxlength="127" resize='vertical'
                              type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容" :readonly='dialogStatus=="detail"'>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="managerResourceForm.resourceType=='PICTURE_RESOURCE'">
                <el-form-item label="图片" :label-width="formLabelWidth">
                  <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :multiple="true"
                             :on-success="handleAvatarSuccess" :show-file-list="false" >
                    <img v-if="managerResourceForm.picturePath" :src="managerResourceForm.picturePath" class="avatar user-pic" :height="50" :width="50">
                    <i v-else class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
              <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import {
  getManagerResourceList,
  addManagerResource,
  editManagerResource,
  delManagerResource,
  delBatchManagerResource } from '@/api/merchant/auth/managerResource'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { getApplicationCode } from '@/api/common'
import menuList from '@/views/plat/layout/menuList'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'
import { mapGetters } from 'vuex'

export default {
  name: 'tableManagerResource',
  directives: {
    waves
  },
  components: {
    ImageCropper, PanThumb, menuList, SidebarMenu },
  data() {
    return {
      Height: 0,
      hash: '',
      curApplicationCode: '',
      routesArray: [],
      menuTitleName: '',
      menuTitleIcon: '',
      list: [],
      checkList: [],
      total: 0,
      selectDesc: '',
      listLoading: true,
      proSearch: false,
      downloadLoading: false,
      isBatch: true,
      imagecropperShow: false,
      imagecropperKey: 0,
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      queryType: '',
      queryParams: '',
      filterForm: {
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      managerResourceForm: {
        id: '',
        projectId: '',
        resourceName: '',
        iconOnlineClass: '',
        iconOfflineClass: '',
        resourceState: '1',
        resourceType: 'ICON_RESOURCE',
        resourceDesc: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      resourceTypeMapArr: [],
      resourceStateMapArr: [
        {
          label: '不启用',
          value: '0'
        }, {
          label: '启用',
          value: '1'
        }
      ],
      stateMapObj: {
        '0': '不启用',
        '1': '启用'
      },
      resourceTypeMapObj: {},
      // 表单校验规则
      managerResourceFormRules: {
        resourceName: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        }],
        iconOnlineClass: [{
          required: false,
          message: '请输入在线图标类',
          trigger: 'blur'
        }],
        iconOfflineClass: [{
          required: false,
          message: '请输入离线图标类',
          trigger: 'blur'
        }],
        resourceState: [{
          required: true,
          message: '请输入资源状态',
          trigger: 'blur'
        }],
        resourceType: [{
          required: true,
          message: '请输入资源类型',
          trigger: 'blur'
        }],
        resourceDesc: [{
          required: true,
          message: '请输入资源描述',
          trigger: 'blur'
        }]
      }
    }
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
  created() {
    const Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.Height = Height
    this.curApplicationCode = getApplicationCode(this)
    this.permission_routers.forEach((item, index) => {
      if (item.code === this.curApplicationCode) {
        this.routesArray.push(item)
        this.menuTitleName = item.name
        this.menuTitleIcon = item.icon
      }
    })
    const dictMap = JSON.parse(sessionStorage.getItem('EDENEP_SYSTEM_DICTS'))
    if (typeof dictMap !== undefined && dictMap) {
      this.resourceTypeMapArr = JSON.parse(dictMap.RESOURCE_TYPE)
      const tempResType = {}
      this.resourceTypeMapArr.forEach(function(item) {
        tempResType[item.enumValue] = item.enumName
      })
      this.resourceTypeMapObj = tempResType
    }
    this.getManagerResourceList()
  },
  methods: {
    getManagerResourceList() {
      this.listLoading = true
      this.filterForm.curApplicationCode = this.curApplicationCode
      getManagerResourceList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchManagerResource() {
      this.filterForm.current = globalConfig.startPage
      this.getManagerResourceList()
    },
    addManagerResource() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyManagerResource(row) {
      this.managerResourceForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteManagerResource(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: row.id,
          curApplicationCode: this.curApplicationCode
        }
        this.listLoading = true
        delManagerResource(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchManagerResource()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      })
    },
    deleteBatch() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        for (let i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
        }
        const param = {
          primaryKeys: selectIds,
          curApplicationCode: this.curApplicationCode
        }
        this.listLoading = true
        delBatchManagerResource(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchManagerResource()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      })
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getManagerResourceList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getManagerResourceList()
    },
    addSubmit() {
      this.$refs['managerResourceForm'].validate((valid) => {
        if (valid) {
          this.managerResourceForm.curApplicationCode = this.curApplicationCode
          this.listLoading = true
          addManagerResource(this.managerResourceForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchManagerResource()
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
      this.$refs['managerResourceForm'].validate((valid) => {
        if (valid) {
          this.managerResourceForm.curApplicationCode = this.curApplicationCode
          this.listLoading = true
          editManagerResource(this.managerResourceForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchManagerResource()
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
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.managerResourceForm = {
        id: '',
        projectId: '',
        resourceName: '',
        iconOnlineClass: '',
        iconOfflineClass: '',
        resourceState: '1',
        resourceType: 'ICON_RESOURCE',
        resourceDesc: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      }
      if (this.$refs['managerResourceForm'] !== undefined) {
        this.$refs['managerResourceForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          '项目ID',
          '资源名称',
          '在线图标类',
          '离线图标类',
          '资源状态',
          '资源类型',
          '资源描述',
          '创建人',
          '创建日期',
          '修改人',
          '修改日期'
        ]
        const filterVal = [
          'id',
          'projectId',
          'resourceName',
          'iconOnlineClass',
          'iconOfflineClass',
          'resourceState',
          'resourceType',
          'resourceDesc',
          'createBy',
          'createDate',
          'modifyBy',
          'modifyDate'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.managerResourceForm.picturePath = resData.files.avatar
    },
    handleAvatarSuccess(res, file) {   // 图片上传成功调用
      this.managerResourceForm.picturePath = URL.createObjectURL(file.raw)
      this.managerResourceForm.resourceType = 'ICON_RESOURCE'
      this.managerResourceForm.resourceType = 'PICTURE_RESOURCE'
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
<style scope>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
</style>
<style  src="@/styles/merchant.scss" rel="stylesheet/scss" lang="scss"></style>
