<template>
  <div class="app-container calendar-list-container">
    <div v-if="proSearch" class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <el-row>
            <el-col :span="8">
              <el-form-item label="ID" :label-width="filterFormLabelWidth" prop="id" class="form-bottom">
                <el-input @keyup.enter.native="searchOrganization" size="small" class="filter-item" placeholder="" v-model="filterForm.id">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="组织名称" :label-width="filterFormLabelWidth" prop="organizationName" class="form-bottom">
                <el-input @keyup.enter.native="searchOrganization" size="small" class="filter-item" placeholder="组织机构名称" v-model="filterForm.organizationName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属项目" :label-width="filterFormLabelWidth" prop="projectCode" class="form-bottom">
                <el-input @keyup.enter.native="searchOrganization" size="small" class="filter-item" placeholder="所属项目" v-model="filterForm.projectCode">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchOrganization" v-waves>搜索</el-button>
                <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>简单搜索</el-button>
            </el-col>
          </el-row>
      </el-form>
    </div>

    <div v-else class="simpleFilter">
      <el-form>
        <el-row class="button-group">
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
            <el-select @keyup.enter.native="searchOrganization" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchOrganization" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchOrganization" v-waves>搜索</el-button>
        </el-col>
        <el-col v-if=!proSearch :span="12" class="searchProBtn">
          <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>高级搜索</el-button>
        </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column header-align="center" align="center" label="ID" prop='id'>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="所属项目" prop='projectName'>
        <template slot-scope="scope">
          <span>{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="组织名称" prop='organizationName'>
        <template slot-scope="scope">
          <span>{{scope.row.organizationName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="上级组织" prop='organizationParentName'>
        <template slot-scope="scope">
          <span>{{scope.row.organizationParentName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="顺序" prop='organizationOrder'>
        <template slot-scope="scope">
          <span>{{scope.row.organizationOrder}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建人" prop='createByName'>
        <template slot-scope="scope">
          <span>{{scope.row.createByName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyOrganization(scope.row,'update')">编辑
          </el-button>
          <el-button size="small" type="text" @click="deleteOrganization(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addOrganization">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
      <el-form :model="organizationForm" :rules="organizationFormRules" ref="organizationForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="所属项目" :label-width="formLabelWidth" prop="projectCode">
              <el-select :disabled="dialogStatus != 'create'" size="small" v-model="organizationForm.projectCode" placeholder="请选择">
                <el-option v-for="item in projectList"
                           :key="item.projectCode"
                           :label="item.projectName"
                           :value="item.projectCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="组织名称" :label-width="formLabelWidth" prop="organizationName">
              <el-input size="small" v-model="organizationForm.organizationName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="上级机构" :label-width="formLabelWidth" prop="organizationParentNo">
              <el-select :disabled="!organizationForm.projectCode" size="small" v-model="organizationForm.organizationParentNo" clearable filterable remote placeholder="请搜索"
                         :remote-method="searchOrganizationList" :loading="searchOrganizationsLoading">
                <el-option v-for="item in searchOrganizationResultList"
                           :key="item.organizationCode"
                           :label="item.organizationName"
                           :value="item.organizationCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="顺序" :label-width="formLabelWidth" prop="organizationOrder">
              <el-input size="small" v-model.number="organizationForm.organizationOrder" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" :label-width="formLabelWidth" prop="organizationDesc">
              <el-input size="small" v-model="organizationForm.organizationDesc" :maxlength="100" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
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
<script>
  import { getOrganizationList, addOrganization, editOrganization, delBatchOrganization, delOrganization, searchOrganizationList } from '@/api/merchant/work/organization'
  import { getProjectList } from '@/api/merchant/project/projectManager'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import Tree from '@/components/tree'

  export default {
    name: 'tableOrganization',
    directives: {
      waves
    },
    data() {
      return {
        curApplicationCode: '',
        projectList: [],
        searchOrganizationResultList: [],
        list: [],
        searchOptions: [
          {
            value: 'id',
            label: ''
          },
          {
            value: 'organizationName',
            label: '组织名称'
          },
          {
            value: 'projectCode',
            label: '所属项目'
          }
        ],
        total: 0,
        selectDesc: '',
        listLoading: true,
        proSearch: false,
        isBatch: true,
        searchOrganizationsLoading: false,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        queryType: '',
        queryParams: '',
        filterForm: {
          id: '',
          organizationName: '',
          projectCode: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        organizationForm: {
          projectCode: '',
          organizationName: '',
          organizationParentNo: '',
          organizationOrder: '',
          organizationDesc: ''
        },
        textMap: {
          update: '编辑组织信息',
          create: '创建组织信息'
        },
        // 表单校验规则
        organizationFormRules: {
          projectCode: [{
            required: true,
            message: '请选择所属项目',
            trigger: 'blur'
          }],
          organizationName: [{
            required: true,
            message: '请输入组织名称',
            trigger: 'blur'
          }],
          organizationOrder: [{
            type: 'number',
            required: true,
            message: '请输入序号',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '必须为数字值'
          }]
        }
      }
    },
    components: {
      Tree
    },
    computed: {},
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.getOrganizationList()
      getProjectList({ current: globalConfig.startPage, pageSize: 9999, curApplicationCode: this.curApplicationCode }).then(response => {
        if (response.data.error_no === 0) {
          this.projectList = response.data.result.records
        } else {
          this.$message(response.data.error_info)
        }
      })
    },
    methods: {
      searchOrganizationList(keyword) {
        if (keyword) {
          this.searchOrganizationsLoading = true
          searchOrganizationList({ projectCode: this.organizationForm.projectCode, organizationName: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
            if (response.data.error_no === 0) {
              this.searchOrganizationResultList = response.data.result
            } else {
              this.$message(response.data.error_info)
            }
            this.searchOrganizationsLoading = false
          })
        } else {
          this.searchOrganizationResultList = []
        }
      },
      getOrganizationList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getOrganizationList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchOrganization() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getOrganizationList()
      },
      addOrganization() {
        this.dialogStatus = 'create'
        this.resetForm()
        this.dialogFormVisible = true
      },
      modifyOrganization(row) {
        this.organizationForm = Object.assign({}, row)
        if (this.searchOrganizationResultList.length === 0 && row.organizationParentNo) {
          this.searchOrganizationResultList.push({ organizationCode: row.organizationParentNo, organizationName: row.organizationParentName })
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteOrganization(row) {
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
          delOrganization(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchOrganization()
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
          delBatchOrganization(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchOrganization()
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
        this.getOrganizationList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getOrganizationList()
      },
      addSubmit() {
        this.$refs['organizationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.organizationForm.curApplicationCode = this.curApplicationCode
            addOrganization(this.organizationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchOrganization()
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
        this.$refs['organizationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.organizationForm.curApplicationCode = this.curApplicationCode
            editOrganization(this.organizationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchOrganization()
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
          organizationName: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.organizationForm = {
          id: '',
          projectCode: '',
          organizationCode: '',
          organizationName: '',
          organizationParentNo: '',
          organizationOrder: '',
          organizationDesc: ''
        }
        if (this.$refs['organizationForm'] !== undefined) {
          this.$refs['organizationForm'].resetFields()
        }
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.resetForm()
      }
    }
  }
</script>
<style scoped>
  .el-tree {
    font-size: 12px;
    height: auto !important;
    max-height: 300px !important;
  }
</style>
