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
              <el-form-item label="组名字" :label-width="filterFormLabelWidth" prop="groupName" class="form-bottom">
                <el-input @keyup.enter.native="searchGroup" size="small" class="filter-item" placeholder="组名字" v-model="filterForm.groupName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名称" :label-width="filterFormLabelWidth" prop="groupEname" class="form-bottom">
                <el-input @keyup.enter.native="searchGroup" size="small" class="filter-item" placeholder="英文名称" v-model="filterForm.groupEname">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="状态" :label-width="filterFormLabelWidth" prop="state" class="form-bottom">
                <el-select @keyup.enter.native="searchGroup" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.state">
                  <el-option v-for="item in stateMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button round type="primary" size="small" icon="el-icon-search" @click="searchGroup" v-waves>搜索</el-button>
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
                <el-select @keyup.enter.native="searchGroup" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
                <el-input @keyup.enter.native="searchGroup" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="searchSimpleBtn">
              <el-button round type="primary" size="small" icon="el-icon-search" @click="searchGroup" v-waves>搜索</el-button>
            </el-col>
            </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
            <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-container calendar-list-container">
      <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
        style="width: 100%">
        <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="" prop='id' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户" prop='merchantId'>
          <template slot-scope="scope">
            <span>{{merchantIdMap[scope.row.merchantId]}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="组名字" prop='groupName'>
          <template slot-scope="scope">
            <span>{{scope.row.groupName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="英文名称" prop='groupEname'>
          <template slot-scope="scope">
            <span>{{scope.row.groupEname}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="组描述" prop='description' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="状态" prop='state' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{stateMapObj[scope.row.state]}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip  header-align="center" align="center" label="创建人" prop='createBy'>
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
            <el-button round size="small" type="text" @click="modifyGroup(scope.row,'update')">修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteGroup(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="7">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addGroup">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
          </el-col>
          <el-col :span="17">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
        <el-form :model="groupForm" :rules="groupFormRules" ref="groupForm" label-width="80px">
          <el-row>
            <el-col :span="14">
              <el-form-item v-if="dialogStatus=='update'" label="id" :label-width="formLabelWidth" prop="id">
                <el-input size="small" v-model="groupForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="商户ID" :label-width="formLabelWidth" prop="merchantId">
                <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" clearable placeholder="商户" v-model="groupForm.merchantId">
                  <el-option v-for="item in merchantIdArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="组名字" :label-width="formLabelWidth" prop="groupName">
                <el-input size="small" v-model="groupForm.groupName" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="英文名称" :label-width="formLabelWidth" prop="groupEname">
                <el-input size="small" v-model="groupForm.groupEname" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
                <el-select size="small" v-model="groupForm.state" clearable placeholder="请选择">
                  <el-option v-for="item in stateMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                <el-input size="small" v-model="groupForm.description" :maxlength="100" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"></el-input>
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
    </div>
  </div>
</template>

<script>
import {
  getGroupList,
  addGroup,
  editGroup,
  delGroup,
  delBatchGroup
} from '@/api/plat/group'
import {
  queryNameIdDic
} from '@/api/plat/merchant'

import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import {
  validator
} from '@/utils/validate'
import ElRow from 'element-ui/packages/row/src/row'

export default {
  components: { ElRow },
  name: 'tableGroup',
  directives: {
    waves
  },
  data() {
    const Validator = (rule, value, callback) => {
      const validatorResult = validator(rule, value)
      if (!validatorResult.pass) {
        callback(new Error(validatorResult.msg))
      } else {
        callback()
      }
    }
    return {
      merchantIdMap: {},
      merchantIdArr: [],
      list: [],
      searchOptions: [{
        value: 'groupName',
        label: '组名字'
      },
      {
        value: 'groupEname',
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
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      queryType: '',
      queryParams: '',
      filterForm: {
        id: '',
        merchantId: '',
        groupName: '',
        groupEname: '',
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
      groupForm: {
        id: '',
        merchantId: '',
        groupName: '',
        groupEname: '',
        description: '',
        state: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      },
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
      groupFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '必须为数字值'
        }],
        merchantId: [{
          required: true,
          trigger: 'blur',
          fieldName: '商户ID',
          fieldType: 'number',
          validator: Validator
        }],
        groupName: [{
          required: true,
          message: '请输入组名字',
          trigger: 'blur'
        }],
        groupEname: [{
          required: true,
          message: '请输入英文名称',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入组描述',
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
    this.getGroupList()
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
    getGroupList() {
      this.listLoading = true
      getGroupList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchGroup() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getGroupList()
    },
    addGroup() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyGroup(row) {
      this.groupForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteGroup(row) {
      const param = {
        primaryKey: row.id
      }
      this.listLoading = true
      delGroup(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchGroup()
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    deleteBatch() {
      const selection = this.$refs.multipleTable.selection
      const selectIds = []
      for (let i = 0; i < selection.length; i++) {
        selectIds.push(selection[i].id)
      }
      const param = {
        primaryKeys: selectIds
      }
      this.listLoading = true
      delBatchGroup(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchGroup()
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
      this.getGroupList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getGroupList()
    },
    addSubmit() {
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addGroup(this.groupForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchGroup()
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
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editGroup(this.groupForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchGroup()
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
        groupName: '',
        groupEname: '',
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
      this.groupForm = {
        id: '',
        merchantId: '',
        groupName: '',
        groupEname: '',
        description: '',
        state: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      }
      if (this.$refs['groupForm'] !== undefined) {
        this.$refs['groupForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('vendor/Export2Excel')
        const tHeader = [
          '商户ID',
          '组名字',
          '英文名称',
          '组描述',
          '状态',
          '创建人',
          '创建时间',
          '修改人',
          '修改时间'
        ]
        const filterVal = [
          'merchantId',
          'groupName',
          'groupEname',
          'description',
          'state',
          'createBy',
          'createDate',
          'modifyBy',
          'modifyDate'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '权限模块组')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.resetForm()
    }
  }
}
</script>
