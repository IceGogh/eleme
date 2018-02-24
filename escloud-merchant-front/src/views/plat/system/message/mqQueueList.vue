<template>
  <div>
    <div class="filter-container" v-show="proSearch">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="7">
              <el-form-item label="队列名称" :label-width="filterFormLabelWidth" prop="queueName" class="form-bottom">
                <el-input @keyup.enter.native="searchMqQueue" size="small" class="filter-item" placeholder="队列名称" v-model="filterForm.queueName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="交换机模式" :label-width="filterFormLabelWidth" prop="exchangeType" class="form-bottom">
                <el-input @keyup.enter.native="searchMqQueue" size="small" class="filter-item" placeholder="交换机模式" v-model="filterForm.exchangeType">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="交换机名称" :label-width="filterFormLabelWidth" prop="exchangeName" class="form-bottom">
                <el-input @keyup.enter.native="searchMqQueue" size="small" class="filter-item" placeholder="交换机名称" v-model="filterForm.exchangeName">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMqQueue" v-waves>
                  搜索
                </el-button>
                <el-button round type="primary" plain size="small" icon="el-icon-delete" @click="resetSearch" v-waves>清空
                </el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出
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
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType"
                          class="simple-btn first">
              <el-select @keyup.enter.native="searchMqQueue" size="small" class="filter-item"
                         @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams"
                          class="simple-btn">
              <el-input @keyup.enter.native="searchMqQueue" size="small" class="filter-item"
                        :placeholder="selectDesc" v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMqQueue"
                       v-waves>搜索</el-button>
          </el-col>
          </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出
            </el-button>
            <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-container calendar-list-container">

      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
                style="width: 100%">
        <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="" prop='id' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="队列名称" prop='queueName'>
          <template slot-scope="scope">
            <span>{{scope.row.queueName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="交换机模式" prop='exchangeType' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.exchangeType}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="交换机名称" prop='exchangeName'>
          <template slot-scope="scope">
            <span>{{scope.row.exchangeName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="队列描述" prop='queueDesc'>
          <template slot-scope="scope">
            <span>{{scope.row.queueDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建时间" prop='createDate'  sortable>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建人" prop='createBy'>
          <template slot-scope="scope">
            <span>{{scope.row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改时间" prop='updateDate' :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.updateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改人" prop='updateBy'>
          <template slot-scope="scope">
            <span>{{scope.row.updateBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="操作" width="240" fixed='right'>
          <template slot-scope="scope">
            <el-button round size="small" type="text" @click="modifyMqQueue(scope.row,'update')">修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteMqQueue(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="12">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addMqQueue">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small">
        <el-form :model="mqQueueForm" :rules="mqQueueFormRules" ref="mqQueueForm" label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item v-show="false" label="" :label-width="formLabelWidth" prop="id">
                <el-input size="small" v-model="mqQueueForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="队列名称" :label-width="formLabelWidth" prop="queueName">
                <el-input size="small" v-model="mqQueueForm.queueName" :maxlength="10"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="交换机名称" :label-width="formLabelWidth" prop="exchangeName">
                <el-input size="small" v-model="mqQueueForm.exchangeName" :maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">

              <el-form-item label="交换机模式" :label-width="formLabelWidth" prop="exchangeType">
                <el-select size="small" v-model="mqQueueForm.exchangeType" clearable
                           placeholder="请输入">
                  <el-option v-for="(item,ind) in exchangeTypeMapArr" :key="ind" :label="item.value"
                             :value="item.value">
                    <span style="float: left">{{ item.value }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="队列描述" :label-width="formLabelWidth" prop="queueDesc">
                <el-input size="small" v-model="mqQueueForm.queueDesc" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
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
  getMqQueueList,
  addMqQueue,
  editMqQueue,
  delMqQueue,
  delBatchMqQueue
} from '@/api/plat/message/mqQueue'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableMqQueue',
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
        value: 'queueName',
        label: '队列名称'
      },
      {
        value: 'exchangeType',
        label: '交换机模式'
      },
      {
        value: 'exchangeName',
        label: '交换机名称'
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
      exchangeTypeMapArr: [
        {
          label: '订阅模式',
          value: 'direct'
        }, {
          label: '广播模式',
          value: 'fanout'
        }, {
          label: '主题模式',
          value: 'topic'
        }
      ],
      exchangeTypeMapObj: {
        'direct': '订阅模式',
        'fanout': '广播模式',
        'topic': '主题模式'
      },
      filterForm: {
        id: '',
        queueName: '',
        exchangeType: '',
        exchangeName: '',
        queueDesc: '',
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
      mqQueueForm: {
        id: '',
        queueName: '',
        exchangeType: '',
        exchangeName: '',
        queueDesc: '',
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
      mqQueueFormRules: {
        queueName: [{
          required: true,
          message: '请输入队列名称',
          trigger: 'blur'
        }],
        exchangeType: [{
          required: true,
          message: '请输入交换机模式',
          trigger: 'blur'
        }],
        exchangeName: [{
          required: true,
          message: '请输入交换机名称',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {},
  created() {
    this.getMqQueueList()
  },
  methods: {
    reloadList() {
      getMqQueueList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    getMqQueueList() {
      this.listLoading = true
      getMqQueueList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMqQueue() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getMqQueueList()
    },
    addMqQueue() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMqQueue(row) {
      this.mqQueueForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteMqQueue(row) {
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
        delMqQueue(param).then(response => {
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
        delBatchMqQueue(param).then(response => {
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
      this.getMqQueueList()
    },
    currentPageChange(val) {
      this.isBatch = true
      this.filterForm.current = val
      this.getMqQueueList()
    },
    addSubmit() {
      this.$refs['mqQueueForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMqQueue(this.mqQueueForm).then(response => {
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
      this.$refs['mqQueueForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMqQueue(this.mqQueueForm).then(response => {
            if (response.data.error_no === 0) {
              for (const v of this.list) {
                if (v.id === this.mqQueueForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.mqQueueForm)
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
        queueName: '',
        exchangeType: '',
        exchangeName: '',
        queueDesc: '',
        createDate: [],
        createBy: '',
        updateDate: [],
        updateBy: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.mqQueueForm = {
        id: '',
        queueName: '',
        exchangeType: '',
        exchangeName: '',
        queueDesc: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      }
      if (this.$refs['mqQueueForm'] !== undefined) {
        this.$refs['mqQueueForm'].resetFields()
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
          '队列名称',
          '交换机模式',
          '交换机名称',
          '队列描述',
          '创建时间',
          '创建者',
          '修改时间',
          '修改者'
        ]
        const filterVal = [
          'id',
          'queueName',
          'exchangeType',
          'exchangeName',
          'queueDesc',
          'createDate',
          'createBy',
          'updateDate',
          'updateBy'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '队列表')
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
