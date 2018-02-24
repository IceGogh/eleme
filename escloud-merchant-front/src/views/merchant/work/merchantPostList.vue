<template>
  <div class="main-contain-new clearfix">
    <sidebar-menu></sidebar-menu>
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">

      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantPost">添加</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord"/>
          <i class="el-icon-search" @click="searchMerchantPost(filterForm.searchWord)"></i>
        </div>
      </div>
      <template>
        <div >
          <div class="app-container calendar-list-container">
            <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column type="index" width="62" label="序号"></el-table-column>
              <el-table-column header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
                <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="岗位名称" prop='postName'>
                <template slot-scope="scope">
                  <span>{{scope.row.postName}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="岗位描述" prop='postDesc' :show-overflow-tooltip='true'>
                <template  slot-scope="scope">
                  <span>{{scope.row.postDesc}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="状态" prop='state' :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span>{{stateMapObj[scope.row.state]}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="创建人" prop='createBy' :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span>{{scope.row.createBy}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="创建日期" prop='createDate' :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span>{{scope.row.createDate}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="修改人" prop='modifyBy' :show-overflow-tooltip='true'>
                <template  slot-scope="scope">
                  <span>{{scope.row.modifyBy}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="修改日期" prop='modifyDate' :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span>{{scope.row.modifyDate}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button round size="small" type="text" @click="modifyMerchantPost(scope.row,'update')">修改
                  </el-button>|
                  <el-button round size="small" type="text" @click="deleteMerchantPost(scope.row,'delete')">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-show="!listLoading" class="pagination-container">
              <el-row>
                <el-col :span="24">
                  <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>

            <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" :before-close="closeDialog">
              <el-form :model="merchantPostForm" :rules="merchantPostFormRules" ref="merchantPostForm" label-width="80px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="岗位名称" :label-width="formLabelWidth" prop="postName">
                      <el-input size="small" v-model="merchantPostForm.postName" :maxlength="20"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
                      <el-select size="small" class="filter-item" clearable placeholder="请选择" v-model="merchantPostForm.state">
                        <el-option v-for="item in stateMapArr" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="选择图标资源" :label-width="formLabelWidth" prop="resourceId">
                      <el-select size="small" class="filter-item" v-model="merchantPostForm.resourceId" clearable placeholder="请选择">
                        <el-option
                          v-for="item in merchantResourceList"
                          :key="item.id"
                          :label="item.resourceName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22">
                    <el-form-item label="岗位描述" :label-width="formLabelWidth" prop="postDesc">
                      <el-input size="small" v-model="merchantPostForm.postDesc" :maxlength="75" resize='vertical' type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"></el-input>
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

            <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getMerchantPostList, addMerchantPost, editMerchantPost, delMerchantPost } from '@/api/merchant/work/merchantPost'
import {
  getMerchantResourceRelation,
  queryManagerResourceListByProjectCode
} from '@/api/merchant/auth/managerResource'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'
import { getApplicationCode, getCurProjectCode } from '@/api/common'
import menuList from '@/views/plat/layout/menuList'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import { mapGetters } from 'vuex'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'tableMerchantPost',
  directives: {
    waves
  },
  components: {
    ImageCropper, PanThumb, menuList, SidebarMenu },
  data() {
    return {
      // 暂定测试值
      curProjectCode: getCurProjectCode(),
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
      merchantResourceList: [],
      merchantPostForm: {
        id: '',
        projectCode: '',
        postId: '',
        postName: '',
        postDesc: '',
        state: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: '',
        resourceId: '',
        resourceRelationId: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      stateMapArr: [
        {
          label: '启用',
          value: '1'
        }, {
          label: '不启用',
          value: '2'
        }
      ],
      stateMapObj: {
        '1': '启用',
        '2': '不启用'
      },
      // 表单校验规则
      merchantPostFormRules: {
        postName: [{
          required: true,
          message: '请输入岗位名称',
          trigger: 'blur'
        }],
        postDesc: [{
          required: true,
          message: '请输入岗位描述',
          trigger: 'blur'
        }],
        state: [{
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }],
        resourceId: [{
          required: true,
          message: '请选图标',
          trigger: 'change'
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
    this.getMerchantPostList()
    queryManagerResourceListByProjectCode({ curApplicationCode: this.curApplicationCode, projectCode: this.curProjectCode }).then(response => {
      if (response.data.error_no === 0) {
        this.merchantResourceList = response.data.result
      } else {
        this.$message(response.data.error_info)
      }
    })
  },
  methods: {
    getMerchantPostList() {
      this.listLoading = true
      this.filterForm.curApplicationCode = this.curApplicationCode
      this.filterForm.projectCode = this.curProjectCode
      getMerchantPostList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMerchantPost() {
      this.filterForm.current = globalConfig.startPage
      this.getMerchantPostList()
    },
    addMerchantPost() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMerchantPost(row) {
      getMerchantResourceRelation({ curApplicationCode: this.curApplicationCode, objCode: row.postId, projectCode: this.curProjectCode }).then(response => {
        if (response.data.error_no === 0) {
          this.resourceId = response.data.result.resourceId
          this.merchantPostForm = Object.assign({}, row)
          this.merchantPostForm.resourceId = response.data.result.resourceId
          this.merchantPostForm.resourceRelationId = response.data.result.id
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        } else {
          this.$message(response.data.error_info)
        }
      })
    },
    deleteMerchantPost(row) {
      const param = {
        primaryKey: row.id,
        curApplicationCode: this.curApplicationCode,
        projectCode: row.projectCode,
        postId: row.postId
      }
      this.listLoading = true
      if (!window.confirm('是否确认删除')) {
        this.listLoading = false
        return
      }
      delMerchantPost(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchMerchantPost()
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getMerchantPostList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getMerchantPostList()
    },
    addSubmit() {
      this.$refs['merchantPostForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.merchantPostForm.curApplicationCode = this.curApplicationCode
          this.merchantPostForm.projectCode = this.curProjectCode
          addMerchantPost(this.merchantPostForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantPost()
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
      this.merchantPostForm.curApplicationCode = this.curApplicationCode
      this.$refs['merchantPostForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMerchantPost(this.merchantPostForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantPost()
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
      this.merchantPostForm = {
        id: '',
        projectCode: '',
        postId: '',
        postName: '',
        postDesc: '',
        state: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      }
      if (this.$refs['merchantPostForm'] !== undefined) {
        this.$refs['merchantPostForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          '项目code',
          '岗位ID',
          '岗位名称',
          '岗位描述',
          '状态',
          '创建人',
          '创建日期',
          '修改人',
          '修改日期'
        ]
        const filterVal = [
          'projectCode',
          'postId',
          'postName',
          'postDesc',
          'state',
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
<style  src="@/styles/merchant.scss" rel="stylesheet/scss" lang="scss"></style>
