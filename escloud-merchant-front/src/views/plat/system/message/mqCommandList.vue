<template>
  <div>
    <div class="filter-container" v-show="proSearch">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="7">
              <el-form-item label="指令名称" :label-width="filterFormLabelWidth" prop="createBy"
                            class="form-bottom">
                <el-input @keyup.enter.native="searchMqCommand" size="small" class="filter-item"
                          placeholder="" v-model="filterForm.commandName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="队列名称" :label-width="filterFormLabelWidth" prop="createBy"
                            class="form-bottom">
                <el-input @keyup.enter.native="searchMqCommand" size="small" class="filter-item"
                          placeholder="" v-model="filterForm.queueName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="消费者名称" :label-width="filterFormLabelWidth" prop="createBy"
                            class="form-bottom">
                <el-input @keyup.enter.native="searchMqCommand" size="small" class="filter-item"
                          placeholder="" v-model="filterForm.consumerName">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="指令状态" :label-width="filterFormLabelWidth"
                            prop="commandStatus" class="form-bottom">
                <el-select @keyup.enter.native="searchMqCommand" size="small" class="filter-item"
                           clearable placeholder="请选择" v-model="filterForm.commandStatus">
                  <el-option v-for="item in commandStatusMapArr" :key="item.value"
                             :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMqCommand"
                           v-waves>搜索
                </el-button>
                <el-button round type="primary" plain size="small" icon="el-icon-delete" @click="resetSearch"
                           v-waves>清空
                </el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload"
                         :loading="downloadLoading">导出
              </el-button>
              <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton"
                         v-waves>简单搜索
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
              <el-select @keyup.enter.native="searchMqCommand" size="small" class="filter-item"
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
              <el-input @keyup.enter.native="searchMqCommand" size="small" class="filter-item"
                        :placeholder="selectDesc" v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMqCommand"
                       v-waves>搜索</el-button>
          </el-col>
          </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload"
                       :loading="downloadLoading">导出
            </el-button>
            <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton"
                       v-waves>高级搜索
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-container calendar-list-container">
      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row
                size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox"
                @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
                style="width: 100%">
        <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="" prop='id' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="指令名称" prop='commandName'>
          <template slot-scope="scope">
            <span>{{scope.row.commandName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="队列名称" prop='queueName'>
          <template slot-scope="scope">
            <span>{{scope.row.queueName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="消费者名称" prop='consumerName'>
          <template slot-scope="scope" >
            <span>{{scope.row.consumerName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="消费者数量" prop='consumerQty' >
          <template slot-scope="scope">
            <span>{{scope.row.consumerQty}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="指令状态" prop='commandStatus'>
          <template slot-scope="scope">
            <span>{{commandStatusMapObj[scope.row.commandStatus]}}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建时间" prop='createDate'>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建人" prop='createBy'>
          <template slot-scope="scope">
            <span>{{scope.row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改时间" prop='updateDate'>
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
            <el-button round size="small" type="text" @click="modifyMqCommand(scope.row,'update')">修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteMqCommand(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="12">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addMqCommand">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete"
                       @click="deleteBatch">批量删除
            </el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-plat-sync" @click="synBatch">批量更新缓存</el-button>
            <el-button round type="info" plain size="small"  icon="el-icon-plat-sync" @click="synAll">更新所有缓存</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange"
                           :current-page.sync="filterForm.current" :page-sizes="pageSize"
                           :page-size="filterForm.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog center class="create_dialog" :title="textMap[dialogStatus]"
                 :visible.sync="dialogFormVisible" size="small">
        <el-form :model="mqCommandForm" :rules="mqCommandFormRules" ref="mqCommandForm"
                 label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item v-show="false" label="" :label-width="formLabelWidth"
                            prop="id">
                <el-input size="small" v-model="mqCommandForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="指令名称" :label-width="formLabelWidth" prop="commandName">
                <el-input size="small" v-model="mqCommandForm.commandName" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="业务类型" :label-width="formLabelWidth" prop="bisType">
                <el-select size="small" v-model="mqCommandForm.bisType" clearable filterable
                           placeholder="请输入">
                  <el-option v-for="item in bisTypeMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="消息队列" :label-width="formLabelWidth" prop="queueId">
                <el-select size="small" v-model="mqCommandForm.queueId" clearable filterable
                           placeholder="请输入">
                  <el-option v-for="item in queueIdMapArr" :key="item.id" :label="item.queueName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="消费者" :label-width="formLabelWidth" prop="consumerId">
                <el-select size="small" v-model="mqCommandForm.consumerId" clearable filterable
                           placeholder="请输入">
                  <el-option v-for="item in consumerIdMapArr" :key="item.id" :label="item.consumerName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="消费者数量" :label-width="formLabelWidth" prop="consumerQty">
                <el-input size="small" v-model.number="mqCommandForm.consumerQty" :maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="指令状态" :label-width="formLabelWidth" prop="commandStatus">
                <el-select size="small" v-model="mqCommandForm.commandStatus" clearable
                           placeholder="请选择">
                  <el-option v-for="item in commandStatusMapArr" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
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

      <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close'
                     @crop-upload-success="cropSuccess" :data-key="imagecropperKey"
                     v-show="imagecropperShow"></image-cropper>

    </div>
  </div>
</template>
<script>
  import {
    getMqCommandList,
    addMqCommand,
    editMqCommand,
    delMqCommand,
    delBatchMqCommand,
    getQueueName,
    getConsumerName,
    synAllMqCommand,
    synBatchMqCommand
  } from '@/api/plat/message/mqCommand'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  export default {
    name: 'tableMqCommand',
    directives: {
      waves
    },
    components: { ImageCropper, PanThumb },
    data() {
      return {
        list: [],
        searchOptions: [
          {
            value: 'commandName',
            label: '指令名称'
          },
          {
            value: 'queueName',
            label: '队列名称'
          },
          {
            value: 'consumerName',
            label: '消费者名称'
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
          queueName: '',
          consumerName: '',
          commandName: '',
          commandStatus: '',
          page: globalConfig.startPage,
          limit: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        mqCommandForm: {
          id: '',
          queueId: '',
          consumerId: '',
          consumerQty: '',
          commandName: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          commandStatus: '',
          listenStatus: '',
          bisType: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        queueIdMapArr: [],
        consumerIdMapArr: [],
        bisTypeMapArr: [],
        commandStatusMapArr: [
          {
            label: '未启用',
            value: '0'
          }, {
            label: '启用',
            value: '1'
          }
        ],
        commandStatusMapObj: {
          '0': '未启用',
          '1': '启用'
        },
        listenStatusMapArr: [],
        listenStatusMapObj: [],
        // 表单校验规则
        mqCommandFormRules: {
          queueId: [{
            type: 'number',
            required: true,
            message: '请输入队列id',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '队列id必须为数字值'
          }],
          consumerId: [{
            type: 'number',
            required: true,
            message: '请输入消费者id',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '消费者id必须为数字值'
          }],
          consumerQty: [{
            type: 'number',
            required: true,
            message: '请输入消费者数量',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '消费者数量必须为数字值'
          }],
          commandName: [{
            required: true,
            message: '请输入指令名称',
            trigger: 'blur'
          }],
          commandStatus: [{
            required: true,
            message: '请选择状态 0未启用，1启用',
            trigger: 'change'
          }],
          bisType: [{
            required: true,
            message: '请输入业务类型',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {},
    created() {
      const dictMap = JSON.parse(sessionStorage.getItem('EDENEP_SYSTEM_DICTS'))
      if (typeof dictMap !== undefined && dictMap) {
        this.bisTypeMapArr = JSON.parse(dictMap.ZD_YWLX)
      }
      this.getMqCommandList()
      this.getQueueAndConsumerName()
    },
    methods: {
      reloadList() {
        getMqCommandList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getMqCommandList() {
        this.listLoading = true
        getMqCommandList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      getQueueAndConsumerName() {
        getQueueName().then(response => {
          if (response.data.error_no === 0) {
            this.queueIdMapArr = response.data.result
          } else {
            console.log(response.data.error_info)
          }
        })
        getConsumerName().then(response => {
          if (response.data.error_no === 0) {
            this.consumerIdMapArr = response.data.result
          } else {
            console.log(response.data.error_info)
          }
        })
      },
      searchMqCommand() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getMqCommandList()
      },
      addMqCommand() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMqCommand(row) {
        this.mqCommandForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMqCommand(row) {
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
          delMqCommand(param).then(response => {
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
      synAll() {
        this.listLoading = true
        synAllMqCommand().then(response => {
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
      synBatch() {
        const selection = this.$refs.multipleTable.selection
        let commandNames = ''
        for (let i = 0; i < selection.length; i++) {
          if (i === 0) {
            commandNames = selection[i].commandName
          } else {
            commandNames = commandNames + ',' + selection[i].commandName
          }
        }
        const param = {
          commandNames: commandNames
        }
        this.listLoading = true
        synBatchMqCommand(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '同步成功',
              type: 'success',
              duration: 2000
            })
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
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
          delBatchMqCommand(param).then(response => {
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
        this.getMqCommandList()
      },
      currentPageChange(val) {
        this.isBatch = true
        this.filterForm.current = val
        this.getMqCommandList()
      },
      addSubmit() {
        this.$refs['mqCommandForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addMqCommand(this.mqCommandForm).then(response => {
              if (response.data.error_no === 0) {
              //  this.list.unshift(this.mqCommandForm)
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
        this.$refs['mqCommandForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editMqCommand(this.mqCommandForm).then(response => {
              if (response.data.error_no === 0) {
                for (const v of this.list) {
                  if (v.id === this.mqCommandForm.id) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.mqCommandForm)
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
          queueId: '',
          consumerId: '',
          consumerQty: '',
          commandName: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          commandStatus: '',
          listenStatus: '',
          bisType: '',
          page: globalConfig.startPage,
          limit: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.mqCommandForm = {
          id: '',
          queueId: '',
          consumerId: '',
          consumerQty: '',
          commandName: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          commandStatus: '',
          listenStatus: '',
          bisType: ''
        }
        if (this.$refs['mqCommandForm'] !== undefined) {
          this.$refs['mqCommandForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            'ID',
            '队列id',
            '消费者id',
            '消费者数量',
            '指令名称',
            '创建时间',
            '创建者',
            '更新时间',
            '更新着',
            '状态',
            '监听状态',
            '业务类型'
          ]
          const filterVal = [
            'id',
            'queueId',
            'consumerId',
            'consumerQty',
            'commandName',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy',
            'commandStatus',
            'listenStatus',
            'bisType'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '指令类型表')
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
