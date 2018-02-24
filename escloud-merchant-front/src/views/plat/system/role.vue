<template>
  <div>
    <div class="filter-container" v-show="proSearch">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商户" :label-width="filterFormLabelWidth" prop="merchantId" class="form-bottom">
                <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" clearable placeholder="商户" v-model="filterForm.merchantId">
                  <el-option v-for="item in merchantIdArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="角色名字" :label-width="filterFormLabelWidth" prop="roleName" class="form-bottom">
                <el-input @keyup.enter.native="searchRole" size="small" class="filter-item" placeholder="角色名字" v-model="filterForm.roleName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名称" :label-width="filterFormLabelWidth" prop="roleCname" class="form-bottom">
                <el-input @keyup.enter.native="searchRole" size="small" class="filter-item" placeholder="英文名称" v-model="filterForm.roleCname">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="状态" :label-width="filterFormLabelWidth" prop="state" class="form-bottom">
                <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.state">
                  <el-option v-for="(item,ind) in stateMapArr" :key="ind" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button round type="primary" size="small" icon="el-icon-search" @click="searchRole" v-waves>搜索</el-button>
                <el-button round type="primary" plain size="small" icon="el-icon-delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
              <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>简单搜索</el-button>
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
              <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="(item,index) in searchOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
              <el-input @keyup.enter.native="searchRole" size="small" class="filter-item" :placeholder="selectDesc" ref="queryParamsRef" v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button round type="primary" size="small" icon="el-icon-search" @click="searchRole" v-waves>搜索</el-button>
          </el-col>
          </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
            <el-button round type="primary" class="firstBtn" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-container calendar-list-container">

      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
                style="width: 100%">
        <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户" prop='merchantId'>
          <template slot-scope="scope">
            <span>{{merchantIdMap[scope.row.merchantId]}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="角色名字" prop='roleName'>
          <template slot-scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="英文名称" prop='roleCname'>
          <template slot-scope="scope">
            <span>{{scope.row.roleCname}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="描述" prop='description'>
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="状态" prop='state'>
          <template slot-scope="scope">
            <span>{{stateMapObj[scope.row.state]}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建人" prop='createBy'>
          <template slot-scope="scope">
            <span>{{scope.row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建时间" prop='createDate' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改人" prop='modifyBy'>
          <template slot-scope="scope">
            <span>{{scope.row.modifyBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改时间" prop='modifyDate'>
          <template slot-scope="scope">
            <span>{{scope.row.modifyDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="操作" width="240" fixed='right'>
          <template slot-scope="scope">
            <el-button round size="small" type="text" @click="modifyRole(scope.row,'update')">修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteRole(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="12">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addRole">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
        <el-form :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item v-if="dialogStatus=='update'" label="主键ID" :label-width="formLabelWidth" prop="id">
                <el-input size="small" v-model="roleForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="商户ID" :label-width="formLabelWidth" prop="merchantId">
                <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" clearable placeholder="商户" v-model="roleForm.merchantId">
                  <el-option v-for="(item,index) in merchantIdArr" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="角色名字" :label-width="formLabelWidth" prop="roleName">
                <el-input size="small" v-model="roleForm.roleName" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="英文名称" :label-width="formLabelWidth" prop="roleCname">
                <el-input size="small" v-model="roleForm.roleCname" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
                <el-select size="small" v-model="roleForm.state" clearable placeholder="请选择">
                  <el-option v-for="item in stateMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
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

      <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :data-key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

    </div>
  </div>
</template>
<script>
  import {
    getRoleList,
    addRole,
    editRole,
    delRole,
    delBatchRole
  } from '@/api/plat/role'
  import {
    queryNameIdDic
  } from '@/api/plat/merchant'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableRole',
    directives: {
      waves
    },
    components: {
      ImageCropper,
      PanThumb
    },
    data() {
      return {
        list: [],
        searchOptions: [{
          value: 'merchantId',
          label: '商户ID'
        },
        {
          value: 'roleName',
          label: '角色名字'
        },
        {
          value: 'roleCname',
          label: '英文名称'
        },
        {
          value: 'state',
          label: '状态'
        }],
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
          id: '',
          merchantId: '',
          roleName: '',
          roleCname: '',
          description: '',
          state: '',
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
        formLabelWidth: '120px',
        roleForm: {
          id: '',
          merchantId: '',
          roleName: '',
          roleCname: '',
          description: '',
          state: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: ''
        },
        merchantIdMap: {},
        merchantIdArr: [],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        stateMapArr: [
          {
            label: '有效',
            value: '0'
          }, {
            label: '无效',
            value: '1'
          }
        ],
        stateMapObj: {
          '0': '有效',
          '1': '无效'
        },
        // 表单校验规则
        roleFormRules: {
          id: [{
            type: 'number',
            required: true,
            message: '请输入主键ID',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '主键ID必须为数字值'
          }],
          merchantId: [{
            required: true,
            message: '请输入商户ID',
            trigger: 'blur'
          }],
          roleName: [{
            required: true,
            message: '请输入角色名字',
            trigger: 'blur'
          }],
          roleCname: [{
            required: true,
            message: '请输入英文名称',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }],
          state: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {},
    created() {
      this.getRoleList()
      this.getMerchantDis()
    },
    methods: {
      getMerchantDis() {
        queryNameIdDic({}).then(response => {
          if (response.data.error_no === 0) {
            this.nameIdMapArrTemp = response.data.result
            for (const index of this.nameIdMapArrTemp) {
              const indexTemp = {}
              indexTemp.label = index.merchantName
              indexTemp.value = index.merchantId
              this.merchantIdArr.push(indexTemp)
              this.merchantIdMap[index.merchantId] = index.merchantName
            }
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getRoleList() {
        this.listLoading = true
        getRoleList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchRole() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getRoleList()
      },
      addRole() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyRole(row) {
        this.roleForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteRole(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id
          }
          this.listLoading = true
          delRole(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchRole()
              this.$refs.multipleTable.clearSelection()
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
          for (var i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
          }
          const param = {
            primaryKeys: selectIds
          }
          this.listLoading = true
          delBatchRole(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchRole()
              this.$refs.multipleTable.clearSelection()
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
        this.getRoleList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getRoleList()
      },
      addSubmit() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addRole(this.roleForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchRole()
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
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editRole(this.roleForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchRole()
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
          if (obj.value === 'merchantId') {
            this.$refs.queryParamsRef.type = 'number'
            this.selectDesc = '请输入' + obj.label + '（只能输入数字）'
          }
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
          merchantId: '',
          roleName: '',
          roleCname: '',
          description: '',
          state: '',
          createBy: '',
          createDate: [],
          modifyBy: '',
          modifyDate: [],
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.roleForm = {
          id: '',
          merchantId: '',
          roleName: '',
          roleCname: '',
          description: '',
          state: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: ''
        }
        if (this.$refs['roleForm'] !== undefined) {
          this.$refs['roleForm'].resetFields()
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
            '商户ID',
            '角色名字',
            '英文名称',
            '描述',
            '状态',
            '创建人',
            '创建时间',
            '修改人',
            '修改时间'
          ]
          const filterVal = [
            'id',
            'merchantId',
            'roleName',
            'roleCname',
            'description',
            'state',
            'createBy',
            'createDate',
            'modifyBy',
            'modifyDate'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '权限模块角色')
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
