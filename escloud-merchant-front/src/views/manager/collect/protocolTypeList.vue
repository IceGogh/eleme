<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="7">
              <el-form-item label="类型名称" :label-width="filterFormLabelWidth" prop="typeName" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolType" size="small" class="filter-item" placeholder="类型名称" v-model="filterForm.typeName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="监听端口" :label-width="filterFormLabelWidth" prop="port" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolType" size="small" class="filter-item" placeholder="监听端口" v-model="filterForm.port">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="激活状态" :label-width="filterFormLabelWidth" prop="activeStatus" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocolType" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.activeStatus">
                  <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="消息头" :label-width="filterFormLabelWidth" prop="startTag" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolType" size="small" class="filter-item" placeholder="消息头" v-model="filterForm.startTag">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="消息尾" :label-width="filterFormLabelWidth" prop="endTag" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolType" size="small" class="filter-item" placeholder="消息尾" v-model="filterForm.endTag">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchProtocolType" v-waves>搜索</el-button>
                <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
              <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>简单搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="simpleFilter">
      <el-form>
        <el-row class="button-group">
        <span v-if=!proSearch>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
            <el-select @keyup.enter.native="searchProtocolType" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchProtocolType" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchProtocolType" v-waves>搜索</el-button>
        </el-col>
        </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
            <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>高级搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
              style="width: 100%" >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="multipleTable-expand">
            <el-form-item label="类型名称">
              <span>{{ scope.row.typeName }}</span>
            </el-form-item>
            <el-form-item label="监听端口">
              <span>{{ scope.row.port }}</span>
            </el-form-item>
            <el-form-item label="消息头">
              <span>{{ scope.row.startTag }}</span>
            </el-form-item>
            <el-form-item label="消息尾">
              <span>{{ scope.row.endTag }}</span>
            </el-form-item>
            <el-form-item label="激活状态">
              <span>{{activeStatusMapObj[scope.row.activeStatus]}}</span>
            </el-form-item>
            <el-form-item label="分隔符">
              <span>{{ scope.row.splitStr }}</span>
            </el-form-item>
            <el-form-item label="MID开始位置">
              <span>{{ scope.row.midStartPosition }}</span>
            </el-form-item>
            <el-form-item label="MID长度">
              <span>{{ scope.row.midSize }}</span>
            </el-form-item>
            <el-form-item label="MID结束位置">
              <span>{{ scope.row.midEndPosition }}</span>
            </el-form-item>
            <el-form-item label="MID坐标">
              <span>{{ scope.row.midPosition }}</span>
            </el-form-item>
            <el-form-item label="IMEI开始位置">
              <span>{{ scope.row.imeiStartPosition }}</span>
            </el-form-item>
            <el-form-item label="IMEI长度">
              <span>{{ scope.row.imeiSize }}</span>
            </el-form-item>
            <el-form-item label="IMEI结束位置">
              <span>{{ scope.row.imeiEndPosition }}</span>
            </el-form-item>
            <el-form-item label="IMEI坐标">
              <span>{{ scope.row.imeiPosition }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ scope.row.createDate }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ scope.row.createBy }}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{ scope.row.updateDate }}</span>
            </el-form-item>
            <el-form-item label="修改人">
              <span>{{ scope.row.updateBy }}</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="62"></el-table-column>
      <el-table-column header-align="center" align="center" label="主键" prop='id' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="类型名称" prop='typeName' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <router-link :to="{ path: 'protocolList', query: { typeId: scope.row.id ,typeName: scope.row.typeName}}" title="点击查看协议信息"><span>{{scope.row.typeName}}</span></router-link>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="监听端口" prop='port' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.port}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="消息头" prop='startTag' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.startTag}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="消息尾" prop='endTag' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.endTag}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间" prop='createDate' sortable :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建人" prop='createBy' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="修改时间" prop='updateDate' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="修改人" prop='updateBy' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="激活状态"  prop='activeStatus' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{activeStatusMapObj[scope.row.activeStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyProtocolType(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteProtocolType(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="12">
          <el-button type="info" plain size="small" icon="edit" @click="addProtocolType">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="plat-sync" @click="syn">批量更新缓存</el-button>
          <el-button type="info" plain size="small"  icon="plat-sync" @click="synAll">更新所有缓存</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close='closeDialog' >
      <el-form :model="protocolTypeForm" :rules="protocolTypeFormRules" ref="protocolTypeForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-show="false" label="主键" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="protocolTypeForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="类型名称" :label-width="formLabelWidth" prop="typeName">
              <el-input size="small" v-model="protocolTypeForm.typeName" :maxlength="50" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="监听端口" :label-width="formLabelWidth" prop="port">
              <el-input size="small" v-model.number="protocolTypeForm.port"  :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="消息头" :label-width="formLabelWidth" prop="startTag">
              <el-input size="small" v-model="protocolTypeForm.startTag" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="消息尾" :label-width="formLabelWidth" prop="endTag">
              <el-input size="small" v-model="protocolTypeForm.endTag" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="激活状态" :label-width="formLabelWidth" prop="activeStatus">
              <el-select size="small" v-model="protocolTypeForm.activeStatus" clearable placeholder="请选择">
                <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="分隔符" :label-width="formLabelWidth" prop="splitStr">
              <el-input size="small" v-model="protocolTypeForm.splitStr" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="IMEI的下标位置" :label-width="formLabelWidth" prop="imeiPosition">
              <el-input size="small" v-model.number="protocolTypeForm.imeiPosition" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="MID的下标位置" :label-width="formLabelWidth" prop="midPosition">
              <el-input size="small" v-model.number="protocolTypeForm.midPosition" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="MID开始位置" :label-width="formLabelWidth" prop="midStartPosition">
              <el-input size="small" v-model.number="protocolTypeForm.midStartPosition" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="MID结束位置" :label-width="formLabelWidth" prop="midEndPosition">
              <el-input size="small" v-model.number="protocolTypeForm.midEndPosition" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="MID长度" :label-width="formLabelWidth" prop="midSize">
              <el-input size="small" v-model.number="protocolTypeForm.midSize" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="IMEI开始位置" :label-width="formLabelWidth" prop="imeiStartPosition">
              <el-input size="small" v-model.number="protocolTypeForm.imeiStartPosition" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="IMEI结束位置" :label-width="formLabelWidth" prop="imeiEndPosition">
              <el-input size="small" v-model.number="protocolTypeForm.imeiEndPosition" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="IMEI长度" :label-width="formLabelWidth" prop="imeiSize">
              <el-input size="small" v-model.number="protocolTypeForm.imeiSize" :maxlength="11"></el-input>
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

    <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

  </div>
</template>
<script>
  import {
    getProtocolTypeList,
    addProtocolType,
    editProtocolType,
    delProtocolType,
    delBatchProtocolType,
    synAll,
    syn
  } from '@/api/manager/collect/protocolType'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableProtocolType',
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
          value: 'typeName',
          label: '类型名称'
        },
        {
          value: 'port',
          label: '监听端口'
        },
        {
          value: 'startTag',
          label: '消息头'
        },
        {
          value: 'endTag',
          label: '消息尾'
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
          typeName: '',
          port: '',
          startTag: '',
          endTag: '',
          midStartPosition: '',
          midEndPosition: '',
          midSize: '',
          imeiStartPosition: '',
          imeiEndPosition: '',
          imeiSize: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          activeStatus: '',
          splitStr: '',
          midPosition: '',
          imeiPosition: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        protocolTypeForm: {
          id: '',
          typeName: '',
          port: '',
          startTag: '',
          endTag: '',
          midStartPosition: '',
          midEndPosition: '',
          midSize: '',
          imeiStartPosition: '',
          imeiEndPosition: '',
          imeiSize: '',
          activeStatus: '',
          splitStr: '',
          midPosition: '',
          imeiPosition: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        activeStatusMapArr: [
          {
            label: '未激活',
            value: '00'
          }, {
            label: '激活',
            value: '01'
          }
        ],
        activeStatusMapObj: {
          '00': '未激活',
          '01': '激活'
        },
        // 表单校验规则
        protocolTypeFormRules: {
          typeName: [{
            required: true,
            message: '请输入消息头',
            trigger: 'blur'
          }],
          port: [{
            type: 'number',
            required: true,
            message: '请输入接受消息头端口',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '接受消息头端口必须为数字值'
          }],
          startTag: [{
            required: true,
            message: '请输入消息头',
            trigger: 'blur'
          }],
          endTag: [{
            required: true,
            message: '请输入消息尾',
            trigger: 'blur'
          }],
          activeStatus: [{
            required: true,
            message: '请选择激活状态（00：未激活，01：激活）',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {},
    created() {
      this.getProtocolTypeList()
    },
    methods: {
      closeDialog() {
        this.dialogFormVisible = false
        if (this.$refs['protocolTypeForm'] !== undefined) {
          this.$refs['protocolTypeForm'].resetFields()
        }
      },
      synAll() {
        this.listLoading = true
        synAll().then(response => {
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
      syn() {
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        const indexs = []
        for (let i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
          indexs.push(this.list.indexOf(selection[i]))
        }
        const param = {
          primaryKeys: selectIds
        }
        this.listLoading = true
        syn(param).then(response => {
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
      getProtocolTypeList() {
        this.listLoading = true
        getProtocolTypeList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchProtocolType() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getProtocolTypeList()
      },
      addProtocolType() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyProtocolType(row) {
        this.protocolTypeForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteProtocolType(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id
          }
          this.listLoading = true
          delProtocolType(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProtocolTypeList()
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
            primaryKeys: selectIds
          }
          this.listLoading = true
          delBatchProtocolType(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProtocolTypeList()
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
        this.getProtocolTypeList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getProtocolTypeList()
      },
      addSubmit() {
        this.$refs['protocolTypeForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addProtocolType(this.protocolTypeForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProtocolTypeList()
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
        this.$refs['protocolTypeForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editProtocolType(this.protocolTypeForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProtocolTypeList()
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
          typeName: '',
          port: '',
          startTag: '',
          endTag: '',
          midStartPosition: '',
          midEndPosition: '',
          midSize: '',
          imeiStartPosition: '',
          imeiEndPosition: '',
          imeiSize: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          activeStatus: '',
          splitStr: '',
          midPosition: '',
          imeiPosition: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.protocolTypeForm = {
          id: '',
          typeName: '',
          port: '',
          startTag: '',
          endTag: '',
          midStartPosition: '',
          midEndPosition: '',
          midSize: '',
          imeiStartPosition: '',
          imeiEndPosition: '',
          imeiSize: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          activeStatus: '',
          splitStr: '',
          midPosition: '',
          imeiPosition: ''
        }
        if (this.$refs['protocolTypeForm'] !== undefined) {
          this.$refs['protocolTypeForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('vendor/Export2Excel')
          const tHeader = [
            '主键',
            '类型名称',
            '接受消息头端口',
            '消息头',
            '消息尾',
            'MID开始位置,split为空有效。',
            'MID结束位置,split为空有效。',
            'MID长度,split为空有效。',
            'IMEI开始位置,split为空有效。',
            'IMEI结束位置,split为空有效。',
            'IMEI长度,split为空有效。',
            '创建人',
            '创建时间',
            '修改人',
            '修改时间',
            '激活状态（00：未激活，01：激活）',
            '分隔符,null表示不是分隔符处理的数据',
            'mid的下标位置 split不为空有效。',
            'mid的下标位置 split不为空有效。'
          ]
          const filterVal = [
            'id',
            'typeName',
            'port',
            'startTag',
            'endTag',
            'midStartPosition',
            'midEndPosition',
            'midSize',
            'imeiStartPosition',
            'imeiEndPosition',
            'imeiSize',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy',
            'activeStatus',
            'splitStr',
            'midPosition',
            'imeiPosition'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '协议类型表')
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
