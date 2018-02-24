<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="7" v-if="typeName===''"  >
              <el-form-item label="协议类型" :label-width="filterFormLabelWidth" prop="typeId" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocol" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.typeId">
                  <el-option v-for="item in nameIdMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-else >
              <el-form-item label="协议类型" :label-width="filterFormLabelWidth"  prop="typeName" class="form-bottom">
                <el-input size="small" class="filter-item"   :disabled="true"  v-model="typeName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="协议名称" :label-width="filterFormLabelWidth" prop="protocolName" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocol" size="small" class="filter-item" placeholder="协议名称" v-model="filterForm.protocolName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="MID" :label-width="filterFormLabelWidth" prop="mid" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocol" size="small" class="filter-item" placeholder="MID" v-model="filterForm.mid">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="激活状态" :label-width="filterFormLabelWidth" prop="activeStatus" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocol" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.activeStatus">
                  <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="解析方式" :label-width="filterFormLabelWidth" prop="analysisType" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocol" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.analysisType">
                  <el-option v-for="item in analysisTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="协议版本" :label-width="filterFormLabelWidth" prop="version" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocol" size="small" class="filter-item" placeholder="协议版本" v-model="filterForm.version">
                </el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchProtocol" v-waves>搜索</el-button>
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
            <el-select @keyup.enter.native="searchProtocol" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchProtocol" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchProtocol" v-waves>搜索</el-button>
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
              style="width: 100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="62"></el-table-column>
      <el-table-column header-align="center" align="center" label="ID" prop='id' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="协议类型" prop='typeName'  :show-overflow-tooltip='true'>
        <template slot-scope="scope" >
          <span v-if="typeName!==''">{{typeName}}</span>
          <span v-else>{{nameIdMapObj[scope.row.typeId]}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="协议名称" prop='protocolName' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <router-link :to="{ path: 'protocolAnalysisList', query: { protocolId: scope.row.id,protocolName: scope.row.protocolName}}" title="点击查看协议解析规则">  <span>{{scope.row.protocolName}}</span></router-link>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="MID" prop='mid' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mid}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="解析方式" prop='analysisType'>
        <template slot-scope="scope">
          <span>{{analysisTypeMapObj[scope.row.analysisType]}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="解码类" prop='analysisClazz' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.analysisClazz}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="协议版本" prop='version'>
        <template slot-scope="scope">
          <span>{{scope.row.version}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='createDate' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='createBy'  v-if=false >
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='updateDate'  v-if=false :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='updateBy'  v-if=false >
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="激活状态" prop='activeStatus' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{activeStatusMapObj[scope.row.activeStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="回写类" prop='callBackClazz' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.callBackClazz}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyProtocol(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteProtocol(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="12">
          <el-button type="info" plain size="small" icon="edit" @click="addProtocol">添加</el-button>
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
      <el-form :model="protocolForm" :rules="protocolFormRules" ref="protocolForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-show="false" label="ID" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="protocolForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <template v-if="typeName===''">
              <el-form-item label="协议类型" :label-width="formLabelWidth" prop="typeId">
                <el-select size="small" v-model="protocolForm.typeId" clearable placeholder="请选择">
                  <el-option v-for="item in nameIdMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="协议类型" :label-width="formLabelWidth"  prop="typeName">
                <el-input size="small"  :maxlength="10" :disabled="true"  v-model="typeName"></el-input>
              </el-form-item>
            </template>
          </el-col>
          <el-col :span="11">
            <el-form-item label="协议名称" :label-width="formLabelWidth" prop="protocolName">
              <el-input size="small" v-model="protocolForm.protocolName" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="MID" :label-width="formLabelWidth" prop="mid">
              <el-input size="small" v-model="protocolForm.mid" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="解析方式" :label-width="formLabelWidth" prop="analysisType">
              <el-select size="small" v-model="protocolForm.analysisType" clearable placeholder="请选择">
                <el-option v-for="item in analysisTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="协议版本" :label-width="formLabelWidth" prop="version">
              <el-input size="small" v-model="protocolForm.version" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="激活状态" :label-width="formLabelWidth" prop="activeStatus">
              <el-select size="small" v-model="protocolForm.activeStatus" clearable placeholder="请选择">
                <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="解码类" :label-width="formLabelWidth" prop="version">
              <el-input size="small" v-model="protocolForm.analysisClazz" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="回写类" :label-width="formLabelWidth" prop="callBackClazz">
              <el-input size="small" v-model="protocolForm.callBackClazz"  ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="closeDialog">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
        <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

  </div>
</template>
<script>
  import {
    getProtocolList,
    addProtocol,
    editProtocol,
    delProtocol,
    delBatchProtocol,
    queryNameIdDic,
    synAll,
    syn
  } from '@/api/manager/collect/protocol'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import ElCol from 'element-ui/packages/col/src/col'
  export default {
    name: 'tableProtocol',
    directives: {
      waves
    },
    components: {
      ElCol,
      ImageCropper,
      PanThumb
    },
    data() {
      return {
        list: [],
        searchOptions: [{
          value: 'protocolName',
          label: '协议名称'
        },
        {
          value: 'mid',
          label: 'MID'
        },
        {
          value: 'analysisType',
          label: '解析方式'
        },
        {
          value: 'version',
          label: '协议版本'
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
        typeName: '',
        typeId: '',
        filterForm: {
          id: '',
          typeId: '',
          protocolName: '',
          mid: '',
          analysisType: '',
          analysisClazz: '',
          version: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          activeStatus: '',
          callBackClazz: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        protocolForm: {
          id: '',
          typeId: '',
          protocolName: '',
          mid: '',
          analysisType: '',
          analysisClazz: '',
          version: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          activeStatus: '',
          callBackClazz: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        typeIdMapArr: [],
        typeIdMapObj: {},
        nameIdMapArr: [],
        nameIdMapArrTemp: [],
        nameIdMapObj: {},
        activeStatusMapArr: [
          {
            label: '未激活',
            value: '00'
          }, {
            label: '激活',
            value: '01'
          }
        ],
        analysisTypeMapArr: [
          {
            label: '智能解码',
            value: '00'
          }, {
            label: '自定义解码',
            value: '01'
          }
        ],
        activeStatusMapObj: {
          '00': '未激活',
          '01': '激活'
        },
        analysisTypeMapObj: {
          '00': '智能解码',
          '01': '自定义解码'
        },
        // 表单校验规则
        protocolFormRules: {
          typeId: [{
            type: 'number',
            required: true,
            message: '请输入协议类型ID',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '协议类型ID必须为数字值'
          }],
          protocolName: [{
            required: true,
            message: '请输入协议名称',
            trigger: 'blur'
          }],
          mid: [{
            required: true,
            message: '请输入MID',
            trigger: 'blur'
          }],
          analysisType: [{
            required: true,
            message: '请输入解析方式00：智能解码，01：自定义解码',
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
      const initTypeId = this.$route.query.typeId
      this.getProtocolList(initTypeId)
      const initTypeName = this.$route.query.typeName
      if (initTypeName !== undefined) {
        this.typeName = initTypeName
      } else {
        this.getNameIdDic()
      }
      if (initTypeId !== undefined) {
        this.typeId = initTypeId
      }
    },
    methods: {
      closeDialog() {
        this.dialogFormVisible = false
        if (this.$refs['protocolForm'] !== undefined) {
          this.$refs['protocolForm'].resetFields()
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
      getNameIdDic() {
        queryNameIdDic().then(response => {
          if (response.data.error_no === 0) {
            this.nameIdMapArrTemp = response.data.result
            for (const index of this.nameIdMapArrTemp) {
              const indexTemp = {}
              indexTemp.label = index.typeName
              indexTemp.value = index.id
              this.nameIdMapArr.push(indexTemp)
              this.nameIdMapObj[index.id] = index.typeName
            }
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getProtocolList(typeId) {
        if (typeId !== undefined) {
          this.filterForm.typeId = typeId
        }
        this.listLoading = true
        getProtocolList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchProtocol() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        if (this.typeId !== '') {
          this.filterForm.typeId = this.typeId
        }
        this.filterForm.current = globalConfig.startPage
        this.getProtocolList()
      },
      addProtocol() {
        this.resetForm()
        if (this.typeId !== '') {
          this.protocolForm.typeId = this.typeId
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyProtocol(row) {
        this.protocolForm = Object.assign({}, row)
        if (this.typeId !== '') {
          this.protocolForm.typeId = this.typeId
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteProtocol(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id
          }
          this.listLoading = true
          delProtocol(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProtocolList()
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
          const indexs = []
          for (let i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
            indexs.push(this.list.indexOf(selection[i]))
          }
          const param = {
            primaryKeys: selectIds
          }
          this.listLoading = true
          delBatchProtocol(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProtocolList()
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
        this.getProtocolList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getProtocolList()
      },
      addSubmit() {
        this.$refs['protocolForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addProtocol(this.protocolForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProtocolList()
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
        this.$refs['protocolForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editProtocol(this.protocolForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProtocolList()
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
          typeId: '',
          protocolName: '',
          mid: '',
          analysisType: '',
          analysisClazz: '',
          version: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          activeStatus: '',
          callBackClazz: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.protocolForm = {
          id: '',
          typeId: '',
          protocolName: '',
          mid: '',
          analysisType: '',
          analysisClazz: '',
          version: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          activeStatus: '',
          callBackClazz: ''
        }
        if (this.$refs['protocolForm'] !== undefined) {
          this.$refs['protocolForm'].resetFields()
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
            '协议类型ID',
            '协议名称',
            'MID',
            '解析方式00：智能解码，01：自定义解码',
            '解码类',
            '协议版本',
            '创建人',
            '创建时间',
            '修改人',
            '修改时间',
            '激活状态（00：未激活，01：激活）',
            '回写类'
          ]
          const filterVal = [
            'id',
            'typeId',
            'protocolName',
            'mid',
            'analysisType',
            'analysisClazz',
            'version',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy',
            'activeStatus',
            'callBackClazz'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '协议表（指令表，相当于一个一个的请求接口信息）')
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
