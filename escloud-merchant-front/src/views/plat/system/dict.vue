<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="5">
        <m-tree v-model='dictTree' @NodeClick="handleNodeClick" @OpenEdit="OpenEdit" @DelNode="DelNode" @Append="Append" ref='MTree' :tableTree='dictTree' width='200px' :proSearchStatus="proSearch">
        </m-tree>
      </el-col>
      <el-col :span="19">
        <div style="color:#1f2d3d; padding-left: 20px; line-height: 29px;">
          数据字典列表
        </div>
        <div class="filter-container" v-show="proSearch" style="margin-top: 15px;">
          <el-form :model="filterForm" ref="filterForm">
            <div v-if=proSearch>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="枚举名称" :label-width="filterFormLabelWidth" prop="enumName">
                    <el-input @keyup.enter.native="searchButton" class="filter-item" placeholder="枚举名称" v-model="filterForm.enumName">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="枚举值" :label-width="filterFormLabelWidth" prop="enumName">
                    <el-input @keyup.enter.native="searchButton" class="filter-item" placeholder="枚举值" v-model="filterForm.enumValue">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="button-group">
                <el-col :span="12" class="searchSimpleBtn">
                  <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                    <el-button round type="primary" size="small" icon="el-icon-search" @click="searchButton" v-waves>搜索</el-button>
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
                <el-col :span="4">
                  <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
                    <el-select @keyup.enter.native="searchButton" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                      <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
                    <el-input @keyup.enter.native="searchButton" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="searchSimpleBtn">
                  <el-button round type="primary" size="small" icon="el-icon-search" @click="searchButton" v-waves>搜索</el-button>
                </el-col>
                </span>
              <el-col v-if=!proSearch :span="12" class="searchProBtn">
                <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
                <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div style="padding: 20px; margin: 0 20px; box-shadow: 0 0 0.06rem rgba(117, 208, 255, 0.6);">

          <el-table ref="multipleTable" :key='tableKey' :data="list" fit highlight-current-row size='mini' @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%;" height="446" >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column header-align="center" align="center" :show-overflow-tooltip='true' label="id" prop='id' sortable>
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :show-overflow-tooltip='true' label="字典编码" prop='enumCode'>
              <template slot-scope="scope">
                <span>{{scope.row.enumCode}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :show-overflow-tooltip='true' label="名称" prop='enumName'>
              <template slot-scope="scope">
                <span>{{scope.row.enumName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :show-overflow-tooltip='true' label="枚举值" prop='enumValue' sortable>
              <template slot-scope="scope">
                <span>{{scope.row.enumValue}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :show-overflow-tooltip='true' label="排序值" prop='orderline' sortable>
              <template slot-scope="scope">
                <span>{{scope.row.orderline}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :show-overflow-tooltip='true' label="状态" prop='enumStatus'>
              <template slot-scope="scope">
                <span>{{statusObj[scope.row.enumStatus]}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="操作" width="240">
              <template slot-scope="scope">
                <el-button round size="small" type="text" @click="modifyDictValue(scope.row,'edit')">修改
                </el-button>
                <el-button round size="small" type="text" @click="deleteDictValue(scope.row,'delete')">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-show="!listLoading" class="pagination-container">
            <el-row>
              <el-col :span="12">
                <el-button round type="info" plain size="small" :disabled="isAddDictFlag" icon="el-icon-edit" @click="handleCreate">添加</el-button>
                <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteAll">批量删除</el-button>
              </el-col>
              <el-col :span="12">
                <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.page" :page-sizes="pageSize" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="dict_type_dialog" :title="textMap[dialogStatus]" :visible.sync="dictTypeDialogFormVisible" size="small" :before-close="closeDialog" ref='dictTypeDialog'>
      <el-form :model="dictForm" ref="dictForm" :rules="dictFormRules" label-width="80px">
        <el-row v-if="dialogStatus=='create'">
          <el-col :span="11">
            <el-form-item label="添加的类型" :label-width="formLabelWidth" prop='is_dict_type'>
              <el-select size="small" v-model="dictForm.isDictType" placeholder="请选择">
                <el-option v-for="item in isDictTypeMap" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="编号" :label-width="formLabelWidth" prop="enumCode">
              <el-input size="small" v-model="dictForm.enumCode" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="enumLabel">
              <el-input size="small" v-model="dictForm.enumLabel" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select size="small" v-model="dictForm.enumStatus" placeholder="请选择">
                <el-option v-for="item in stateMap" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序值" :label-width="formLabelWidth">
              <el-input size="small" v-model="dictForm.orderline" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="dictForm.isDictType=='0'">
          <el-row>
            <el-col :span="11">
              <el-form-item label="是否动态字典" :label-width="formLabelWidth">
                <el-select size="small" v-model="dictForm.isDynamic" placeholder="请选择">
                  <el-option v-for="item in isDynamicMap" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="dictForm.isDynamic=='1'">
            <el-col :span="22">
              <el-form-item label="SQL语句" :label-width="formLabelWidth" prop="sqlStatement" :rules="{required: true, message: '请输入SQL语句', trigger: 'blur'}">
                <el-input size="small" v-model="dictForm.sqlStatement" :maxlength="200" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="22">
            <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
              <el-input size="small" v-model="dictForm.description" :maxlength="200" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="closeDialog">取 消</el-button>
        <el-button round v-if="dialogStatus=='create'" type="primary" @click="submitDictType">确 定</el-button>
        <el-button round v-else type="primary" @click="editDictType">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dict_enum_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
      <el-form :model="dictEnumForm" ref="dictEnumForm" :rules="dictEnumFormRules" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="编号" :label-width="formLabelWidth" prop="enumCode">
              <el-input size="small" v-model="dictEnumForm.enumCode" :maxlength="30" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序值" :label-width="formLabelWidth">
              <el-input size="small" v-model="dictEnumForm.orderline" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="枚举值" :label-width="formLabelWidth">
              <el-input size="small" v-model="dictEnumForm.enumValue" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="enumName">
              <el-input size="small" v-model="dictEnumForm.enumName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="dictEnumForm.enumStatus" placeholder="请选择">
                <el-option v-for="item in stateMap" :key="item.value" :label="item.label" :value="item.value">
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

  </div>
</template>

<script>
import {
  getDictTree,
  getDictEnumList,
  addEnumValue,
  editEnumValue,
  delEnumValue,
  delBatchEnumValue,
  addEnumType,
  editEnumType,
  delEnumType
} from '@/api/plat/dict'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js' // 水波纹指令
import MTree from 'components/tree/index.vue'
export default {
  directives: {
    waves
  },
  data() {
    return {
      searchOptions: [{
        value: 'enumName',
        label: '名称'
      },
      {
        value: 'enumValue',
        label: '枚举值'
      }
      ],
      list: [],
      dictTree: [],
      total: 0,
      selectDesc: '',
      curEnumCode: '',
      listLoading: true,
      proSearch: false,
      downloadLoading: false,
      isAddDictFlag: true,
      isBatch: true,
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      queryType: '',
      queryParams: '',
      filterForm: {
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize,
        enumName: undefined,
        sort: '+id',
        enumCode: ''
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      dictTypeDialogFormVisible: false,
      dictForm: {
        enumCode: '',
        enumLabel: '',
        description: '',
        isDictType: 0,
        enumStatus: 1,
        isDynamic: 0,
        parentId: '',
        sqlStatement: '',
        orderline: ''
      },
      dictFormRules: {
        enumCode: [{
          required: true,
          message: '请输入编号',
          trigger: 'blur'
        }],
        enumLabel: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        orderline: [{
          required: true,
          message: '请输排序值',
          trigger: 'blur'
        }]
      },
      dictEnumForm: {
        enumCode: '',
        enumName: '',
        enumValue: '',
        orderline: '',
        enumStatus: ''
      },
      dictEnumFormRules: {
        enumLabel: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }]
      },
      formLabelWidth: '120px',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      stateMap: [{
        label: '正常',
        value: 1
      }, {
        label: '失效',
        value: 0
      }],
      isDictTypeMap: [{
        label: '数据字典',
        value: 0
      }, {
        label: '字典分类',
        value: 1
      }],
      isDynamicMap: [{
        label: '否',
        value: 0
      }, {
        label: '是',
        value: 1
      }],
      statusObj: {
        0: '失效',
        1: '正常'
      }
    }
  },
  created() {
    this.loadDictTree()
  },
  components: {
    MTree
  },
  methods: {
    loadDictTree() {
      this.listLoading = true
      getDictTree(this.filterForm).then(response => {
        const responseData = response.data
        if (typeof responseData !== 'undefined' && responseData) {
          if (responseData.error_no === 0) {
            this.dictTree = responseData.result
          } else {
            this.$notify({
              title: '错误',
              message: responseData.error_info,
              type: 'error',
              duration: 2000
            })
          }
        } else {
          this.$notify({
            title: '失败',
            message: '请求失败',
            type: 'error',
            duration: 2000
          })
        }
        this.listLoading = false
      })
    },
    handleNodeClick(nodeData) {
      if (typeof nodeData !== 'undefined' && nodeData) {
        if (nodeData.isDictType === 0) {
          // 将节点的字典编号对应的枚举列表查询出来
          this.filterForm.enumCode = nodeData.enumCode
          this.curEnumCode = nodeData.enumCode
          this.isAddDictFlag = false
          this.getDictFunction()
        } else if (nodeData.isDictType === 1) {
          this.list = []
          this.resetSearch()
          this.isAddDictFlag = true
        }
      }
    },
    OpenEdit(parentNode, data) {
      // 阻止事件
      this.stopBubbling()
      this.dictForm = Object.assign({}, data)
      this.dialogStatus = 'update'
      this.dictTypeDialogFormVisible = true
    },
    DelNode(parentNode, data, next) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: data.id,
          enumCode: data.enumCode
        }
        this.listLoading = true
        delEnumType(param).then(response => {
          if (response.data.error_no === 0) {
            this.loadDictTree()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.loadDictTree()
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
    Append(parentNode, data) {
      // 阻止事件
      this.stopBubbling()
      this.dictForm.parentId = data.id
      this.dialogStatus = 'create'
      this.dictTypeDialogFormVisible = true
    },
    stopBubbling() {
      var e = window.event
      if (e.stopPropagation) {
        // 阻止事件 冒泡传播
        e.stopPropagation()
      } else {
        // ie兼容
        e.cancelBubble = true
      }
    },
    resetSearch() {
      this.filterForm = {
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize,
        enumName: undefined,
        sort: '+id',
        enumCode: ''
      }
    },
    resetForm(formName) {
      this.dictEnumForm = {
        enumCode: '',
        enumName: '',
        enumValue: '',
        orderline: '',
        enumStatus: ''
      }

      this.dictForm = {
        enumCode: '',
        enumLabel: '',
        description: '',
        isDictType: 0,
        enumStatus: 1,
        isDynamic: 0,
        parentId: '',
        sqlStatement: '',
        orderline: ''
      }

      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].fields.forEach(function(field) {
          field.validateState = ''
        })
      }
    },
    submitDictType() {
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          // 数据字典类没有父类，因此父ID设置为 0
          if (this.dictForm.isDictType === 1) {
            this.dictForm.parentId = 0
          }
          addEnumType(this.dictForm).then(response => {
            this.dictTypeDialogFormVisible = false
            const responseData = response.data
            if (typeof responseData !== 'undefined' && responseData) {
              if (responseData.error_no === 0) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.loadDictTree()
              } else {
                this.$notify({
                  title: '错误',
                  message: responseData.error_info,
                  type: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          return false
        }
      })
    },
    editDictType() {
      this.$refs['dictForm'].validate((valid) => {
        if (valid) {
          // 数据字典类的修改不需要 children
          this.dictForm.children = []
          editEnumType(this.dictForm).then(response => {
            this.dictTypeDialogFormVisible = false
            const responseData = response.data
            if (typeof responseData !== 'undefined' && responseData) {
              if (responseData.error_no === 0) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.loadDictTree()
              } else {
                this.$notify({
                  title: '错误',
                  message: responseData.error_info,
                  type: 'error',
                  duration: 2000
                })
              }
            }
          })
        } else {
          return false
        }
      })
    },
    getDictFunction() {
      this.listLoading = true
      this.filterForm.enumCode = this.curEnumCode
      getDictEnumList(this.filterForm).then(response => {
        const responseData = response.data
        if (typeof responseData !== 'undefined' && responseData) {
          if (responseData.error_no === 0) {
            this.list = responseData.result.records
            this.total = responseData.result.total
            this.listLoading = false
          } else {
            this.$notify({
              title: '错误',
              message: responseData.error_info,
              type: 'error',
              duration: 2000
            })
          }
        } else {
          this.$notify({
            title: '失败',
            message: '请求失败',
            type: 'error',
            duration: 2000
          })
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
    handleCreate() {
      this.dictEnumForm.enumCode = this.curEnumCode
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    searchButton() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.page = globalConfig.startPage
      this.getDictFunction()
    },
    modifyDictValue(row) {
      this.dictEnumForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    addSubmit() {
      this.$refs['dictEnumForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.dictEnumForm.enumCode = this.curEnumCode
          addEnumValue(this.dictEnumForm).then(response => {
            if (response.data.error_no === 0) {
              this.getDictFunction()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.getDictFunction()
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
      this.$refs['dictEnumForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.dictEnumForm.enumCode = this.curEnumCode
          editEnumValue(this.dictEnumForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.getDictFunction()
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
    deleteDictValue(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: row.id
        }
        this.listLoading = true
        delEnumValue(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getDictFunction()
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
    deleteAll() {
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
        delBatchEnumValue(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getDictFunction()
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
      this.filterForm.limit = val
      this.getDictFunction()
    },
    currentPageChange(val) {
      this.filterForm.page = val
      this.getDictFunction()
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('vendor/Export2Excel')
        const tHeader = [
          '主键ID',
          '字典编码',
          '名称',
          '枚举值',
          '排序值',
          '状态'
        ]
        const filterVal = [
          'id',
          'enumCode',
          'enumName',
          'enumValue',
          'orderline',
          'enumStatus'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '数据字典资源')
        this.downloadLoading = false
      })
    },
    closeDialog() {
      this.dictTypeDialogFormVisible = false
      this.dialogFormVisible = false
      this.resetForm('dictForm')
      this.resetForm('dictEnumForm')
    }
  }
}
</script>
