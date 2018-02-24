<template>
  <div>
    <div class="filter-container" v-show="proSearch">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="7">
              <el-form-item label="消费者名称" :label-width="filterFormLabelWidth" prop="consumerName" class="form-bottom">
                <el-input @keyup.enter.native="searchMqConsumer" size="small" class="filter-item" placeholder="" v-model="filterForm.consumerName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="消费者执行类" :label-width="filterFormLabelWidth" prop="consumerClass" class="form-bottom">
                <el-input @keyup.enter.native="searchMqConsumer" size="small" class="filter-item" placeholder="" v-model="filterForm.consumerClass">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMqConsumer" v-waves>搜索</el-button>
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
              <el-select @keyup.enter.native="searchMqConsumer" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
              <el-input @keyup.enter.native="searchMqConsumer" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMqConsumer" v-waves>搜索</el-button>
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
      <el-table ref="multipleTable" :data-key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
                style="width: 100%">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="62"></el-table-column>
        <el-table-column header-align="center" align="center" label="" prop='id' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="消费者名称" prop='consumerName' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.consumerName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="消费者执行类" prop='consumerClass' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.consumerClass}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'  sortable>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="创建人" prop='createBy'>
          <template slot-scope="scope">
            <span>{{scope.row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="修改时间" prop='updateDate' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.updateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="修改人" prop='updateBy'>
          <template slot-scope="scope">
            <span>{{scope.row.updateBy}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed='right'>
          <template slot-scope="scope">
            <el-button round size="small" type="text" @click="modifyMqConsumer(scope.row,'update')">修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteMqConsumer(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="12">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addMqConsumer">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small">
        <el-form :model="mqConsumerForm" :rules="mqConsumerFormRules" ref="mqConsumerForm" label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item v-show="false" label="" :label-width="formLabelWidth" prop="id">
                <el-input size="small" v-model="mqConsumerForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="消费者名称：" :label-width="formLabelWidth" prop="consumerName">
                <el-input size="small" v-model="mqConsumerForm.consumerName" :maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="消费者执行类：" :label-width="formLabelWidth" prop="consumerClass">
                <el-input size="small" v-model="mqConsumerForm.consumerClass" :maxlength="127" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button round @click="dialogFormVisible = false">取 消</el-button>
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
  getMqConsumerList,
  addMqConsumer,
  editMqConsumer,
  delMqConsumer,
  delBatchMqConsumer
} from '@/api/plat/message/mqConsumer'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableMqConsumer',
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
        value: 'consumerName',
        label: '消费者名称'
      },
      {
        value: 'consumerClass',
        label: '消费者执行类'
      }
      ],
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
        consumerName: '',
        consumerClass: '',
        createDate: [],
        createBy: '',
        updateDate: [],
        updateBy: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      mqConsumerForm: {
        id: '',
        consumerName: '',
        consumerClass: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 表单校验规则
      mqConsumerFormRules: {
        consumerName: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }],
        consumerClass: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {},
  created() {
    this.getMqConsumerList()
  },
  methods: {
    reloadList() {
      getMqConsumerList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    getMqConsumerList() {
      this.listLoading = true
      getMqConsumerList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMqConsumer() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getMqConsumerList()
    },
    addMqConsumer() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMqConsumer(row) {
      this.mqConsumerForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteMqConsumer(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.list.indexOf(row)
        const param = {
          ids: row.id
        }
        this.listLoading = true
        delMqConsumer(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
            this.reloadList()
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
        let ids = ''
        const indexs = []
        for (let i = 0; i < selection.length; i++) {
          if (i === 0) {
            ids = selection[i].id
          } else {
            ids = ids + ',' + selection[i].id
          }
          indexs.push(this.list.indexOf(selection[i]))
        }
        const param = {
          ids: ids
        }
        this.listLoading = true
        delBatchMqConsumer(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.reloadList()
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
      this.isBatch = true
      this.filterForm.pageSize = val
      this.getMqConsumerList()
    },
    currentPageChange(val) {
      this.isBatch = true
      this.filterForm.current = val
      this.getMqConsumerList()
    },
    addSubmit() {
      this.$refs['mqConsumerForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMqConsumer(this.mqConsumerForm).then(response => {
            if (response.data.error_no === 0) {
              // this.list.unshift(this.mqCommandForm)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.reloadList()
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
      this.$refs['mqConsumerForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMqConsumer(this.mqConsumerForm).then(response => {
            if (response.data.error_no === 0) {
              for (const v of this.list) {
                if (v.id === this.mqConsumerForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.mqConsumerForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.reloadList()
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
        consumerName: '',
        consumerClass: '',
        createDate: [],
        createBy: '',
        updateDate: [],
        updateBy: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.mqConsumerForm = {
        id: '',
        consumerName: '',
        consumerClass: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      }
      if (this.$refs['mqConsumerForm'] !== undefined) {
        this.$refs['mqConsumerForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('vendor/Export2Excel')
        const tHeader = [
          'ID',
          '消费者名称',
          '消费者类',
          '创建时间',
          '创建人',
          '修改时间',
          '修改人'
        ]
        const filterVal = [
          'id',
          'consumerName',
          'consumerClass',
          'createDate',
          'createBy',
          'updateDate',
          'updateBy'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '队列消费者表')
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
    }
  }
}
</script>
