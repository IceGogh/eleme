<template>
  <div class="app-container calendar-list-container">
    <div v-if="proSearch" class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="ID" :label-width="filterFormLabelWidth" prop="id" class="form-bottom">
              <el-input @keyup.enter.native="searchEquipmentModel" size="small" class="filter-item" placeholder="ID" v-model="filterForm.id">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号名称" :label-width="filterFormLabelWidth" prop="modelName" class="form-bottom">
              <el-input @keyup.enter.native="searchEquipmentModel" size="small" class="filter-item" placeholder="型号名称" v-model="filterForm.modelName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号编号" :label-width="filterFormLabelWidth" prop="modelCode" class="form-bottom">
              <el-input @keyup.enter.native="searchEquipmentModel" size="small" class="filter-item" placeholder="型号编号" v-model="filterForm.modelCode">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="协议类型" :label-width="filterFormLabelWidth" prop="protocolTypeId" class="form-bottom">
              <el-select v-model="filterForm.protocolTypeId" clearable size="small" class="filter-item" placeholder="请选择">
                <el-option
                  v-for="item in protocolTypeList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂商" :label-width="filterFormLabelWidth" prop="producerId" class="form-bottom">
              <el-select v-model="filterForm.producerId" clearable size="small" class="filter-item" placeholder="请选择">
                <el-option
                  v-for="item in equipmentMfrsList"
                  :key="item.id"
                  :label="item.mfrsName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类型" :label-width="filterFormLabelWidth" prop="equipmentType" class="form-bottom">
              <el-select v-model="filterForm.equipmentType" clearable size="small" class="filter-item" placeholder="请选择">
                <el-option
                  v-for="item in equipmentTypeList"
                  :key="item.enumValue"
                  :label="item.enumName"
                  :value="item.enumValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchEquipmentModel" v-waves>搜索</el-button>
                <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
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
              <el-select @keyup.enter.native="searchEquipmentModel" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
              <el-select v-if="queryType && queryType == searchOptionEnum.PROTOCOL_TYPE_ID" clearable v-model="queryParams" size="small" class="filter-item" placeholder="请选择">
                <el-option v-for="item in protocolTypeList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
              </el-select>
              <el-select v-else-if="queryType && queryType == searchOptionEnum.PRODUCER_ID" clearable v-model="queryParams" size="small" class="filter-item" placeholder="请选择">
                <el-option v-for="item in equipmentMfrsList" :key="item.id" :label="item.mfrsName" :value="item.id"></el-option>
              </el-select>
              <el-select v-else-if="queryType && queryType == searchOptionEnum.EQUIPMENT_TYPE" clearable v-model="queryParams" size="small" class="filter-item" placeholder="请选择">
                <el-option v-for="item in equipmentTypeList" :key="item.enumValue" :label="item.enumName" :value="item.enumValue"></el-option>
              </el-select>
              <el-input v-else @keyup.enter.native="searchEquipmentModel" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button type="primary" size="small" icon="search" @click="searchEquipmentModel" v-waves>搜索</el-button>
          </el-col>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
          <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
          <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>高级搜索</el-button>
        </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}"
              @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column header-align="center" width="50" align="center" label="ID" prop='id'>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="型号名称" prop='modelName'>
        <template slot-scope="scope">
          <span>{{scope.row.modelName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="型号编号" prop='modelCode'>
        <template slot-scope="scope">
          <span>{{scope.row.modelCode}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="协议类型" prop='protocolTypeName'>
        <template slot-scope="scope">
          <span>{{scope.row.protocolTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="设备厂商" prop='producerName'>
        <template slot-scope="scope">
          <span>{{scope.row.producerName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="设备类型" prop='equipmentTypeName'>
        <template slot-scope="scope">
          <span>{{scope.row.equipmentTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="可用年限" prop='durableYears'>
        <template slot-scope="scope">
          <span>{{scope.row.durableYears}}</span>
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

      <el-table-column align="center" label="操作" width="300" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="manageEquipmentModelAttdef(scope.row.modelCode)">参数配置
          </el-button>
          <el-button size="small" type="text" @click="modifyEquipmentModel(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteEquipmentModel(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addEquipmentModel">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close='closeDialog' >
      <el-form :model="equipmentModelForm" :rules="equipmentModelFormRules" ref="equipmentModelForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="型号名称" :label-width="formLabelWidth" prop="modelName">
              <el-input v-model="equipmentModelForm.modelName" :maxlength="40"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备类型" :label-width="formLabelWidth" prop="equipmentType">
              <el-select v-model="equipmentModelForm.equipmentType" placeholder="请选择">
                <el-option
                  v-for="item in equipmentTypeList"
                  :key="item.enumValue"
                  :label="item.enumName"
                  :value="item.enumValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="设备厂商" :label-width="formLabelWidth" prop="producerId">
              <el-select v-model="equipmentModelForm.producerId" placeholder="请选择">
                <el-option
                  v-for="item in equipmentMfrsList"
                  :key="item.id"
                  :label="item.mfrsName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="协议类型" :label-width="formLabelWidth" prop="protocolTypeId">
              <el-select v-model="equipmentModelForm.protocolTypeId" placeholder="请选择">
                <el-option
                  v-for="item in protocolTypeList"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="可用年限" :label-width="formLabelWidth" prop="durableYears">
              <el-input-number v-model="equipmentModelForm.durableYears" :min="1" :max="10" controls-position="right"></el-input-number>
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

    <el-dialog class="create_dialog" title="设备型号参数管理" :visible.sync="dialogAttdefVisible" size="small" :before-close='closeAttdefDialog' >
      <el-table :data="equipmentModelAttdefList" style="width: 100%" max-height="450">
        <el-table-column
          label="显示名">
          <template slot-scope="scope">
            <span v-if="scope.row.editing"><el-input size="mini" v-model="scope.row.attributeName" clearable required></el-input></span>
            <span v-else>{{ scope.row.attributeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="代码名">
          <template slot-scope="scope">
            <span v-if="scope.row.editing"><el-input size="mini" v-model="scope.row.attributeCode" clearable></el-input></span>
            <span v-else>{{ scope.row.attributeCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数据类型">
          <template slot-scope="scope">
            <span v-if="scope.row.editing">
              <el-select v-model="scope.row.attributeDataType"  size="mini" placeholder="请选择">
                <el-option v-for="item in dataTypeList" :key="scope.row.modelCode + '-' + item.id" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </span>
            <span v-else>{{ findBy(dataTypeList, 'value', scope.row.attributeDataType).name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="值">
          <template slot-scope="scope">
            <span v-if="scope.row.editing">
              <el-input-number v-if="scope.row.attributeDataType == dataTypeEnum.INTEGER || scope.row.attributeDataType == dataTypeEnum.DOUBLE" size="small"
                               v-model="scope.row.attributeValue" controls-position="right"></el-input-number>
              <el-switch v-else-if="scope.row.attributeDataType == dataTypeEnum.BOOLEAN" v-model="scope.row.attributeValue"></el-switch>
              <el-input v-else size="mini" v-model="scope.row.attributeValue" clearable></el-input>
            </span>
            <span v-else>{{ scope.row.attributeValue }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed='right'
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleEditAttdef(scope.row, scope.$index)" type="text" size="small">{{scope.row.editing ? '保存' : '编辑'}}</el-button>
            <el-button @click="handleRemoveAttdef(scope.row, scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEquipmentModelAttdef" icon="el-icon-plus">新增设备型号参数</el-button>
      </div>
    </el-dialog>

    <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

  </div>
</template>
<script>
  import {
    getEquipmentModelList,
    addEquipmentModel,
    editEquipmentModel,
    delEquipmentModel,
    delBatchEquipmentModel
  } from '@/api/manager/collect/equipmentModel'

  import {
    getEquipmentModelAttdefList,
    addEquipmentModelAttdef,
    editEquipmentModelAttdef,
    removeEquipmentModelAttdef
  } from '@/api/manager/collect/equipmentModelAttdef'

  import {
    getEquipmentMfrsList
  } from '@/api/manager/collect/equipmentMfrs'

  import {
    getProtocolTypeList
  } from '@/api/manager/collect/protocolType'

  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableEquipmentModel',
    directives: {
      waves
    },
    components: {
      ImageCropper,
      PanThumb
    },
    data() {
      return {
        curApplicationCode: '',
        list: [],
        searchOptions: [{
          value: 'id',
          label: 'ID'
        },
        {
          value: 'modelName',
          label: '型号名称'
        },
        {
          value: 'modelCode',
          label: '型号编号'
        },
        {
          value: 'protocolTypeId',
          label: '协议类型'
        },
        {
          value: 'producerId',
          label: '设备厂商'
        },
        {
          value: 'equipmentType',
          label: '设备类型'
        }
        ],
        searchOptionEnum: {
          ID: 'id',
          MODEL_NAME: 'modelName',
          MODEL_CODE: 'modelCode',
          PROTOCOL_TYPE_ID: 'protocolTypeId',
          PRODUCER_ID: 'producerId',
          EQUIPMENT_TYPE: 'equipmentType'
        },
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
          modelName: '',
          modelCode: '',
          protocolTypeId: '',
          producerId: '',
          equipmentType: '',
          durableYears: '',
          extJson: '',
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
        dialogAttdefVisible: false,
        formLabelWidth: '120px',
        equipmentModelForm: {
          id: '',
          modelName: '',
          protocolTypeId: '',
          producerId: '',
          equipmentType: '',
          durableYears: ''
        },
        textMap: {
          update: '编辑设备型号',
          create: '添加设备型号'
        },
        equipmentTypeList: [ // 设备类型列表
        ],
        equipmentMfrsList: [ // 设备厂商列表
        ],
        protocolTypeList: [ // 协议类型列表
        ],
        // 表单校验规则
        equipmentModelFormRules: {
          modelName: [{
            required: true,
            message: '请输入型号名称',
            trigger: 'blur'
          }],
          protocolTypeId: [{
            required: true,
            type: 'number',
            message: '请选择协议类型',
            trigger: 'blur'
          }],
          producerId: [{
            required: true,
            type: 'number',
            message: '请选择设备厂商',
            trigger: 'blur'
          }],
          equipmentType: [{
            required: true,
            message: '请选择设备类型',
            trigger: 'blur'
          }],
          durableYears: [{
            type: 'number',
            required: true,
            message: '请输入可用年限',
            trigger: 'blur'
          }]
        },
        // 设备型号属性列表
        equipmentModelAttdefList: [
        ],
        // 当前操作的设备型号内码
        currentActionEquipmentModelCode: null,
        dataTypeList: [{ name: '整数', value: 'Integer' }, { id: 2, name: '小数', value: 'Double' }, { id: 3, name: '字符', value: 'String' }, { id: 4, name: '开关', value: 'Boolean' }],
        dataTypeEnum: { INTEGER: 'Integer', DOUBLE: 'Double', STRING: 'String', BOOLEAN: 'Boolean' }
      }
    },
    computed: {
    },
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.getEquipmentModelList()
      const edenepSystemDicts = sessionStorage.getItem('EDENEP_SYSTEM_DICTS')
      if (edenepSystemDicts) {
        this.equipmentTypeList = JSON.parse(JSON.parse(edenepSystemDicts)['PLAT_DICT_EM_TYPE'])
      }

      this.getEquipmentMfrsList()
      this.getProtocolTypeList()
    },
    methods: {
      closeDialog() {
        this.dialogFormVisible = false
        if (this.$refs['equipmentModelForm'] !== undefined) {
          this.$refs['equipmentModelForm'].resetFields()
        }
      },
      closeAttdefDialog() {
        this.dialogAttdefVisible = false
      },
      getEquipmentMfrsList() {
        getEquipmentMfrsList({ pageSize: 100, curApplicationCode: this.curApplicationCode }).then(response => {
          if (response.data.error_no === 0) {
            this.equipmentMfrsList = response.data.result.records
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getProtocolTypeList() {
        getProtocolTypeList({ pageSize: 100, curApplicationCode: this.curApplicationCode }).then(response => {
          if (response.data.error_no === 0) {
            this.protocolTypeList = response.data.result.records
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getEquipmentModelList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getEquipmentModelList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchEquipmentModel() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getEquipmentModelList()
      },
      addEquipmentModel() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyEquipmentModel(row) {
        this.equipmentModelForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteEquipmentModel(row) {
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
          delEquipmentModel(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getEquipmentModelList()
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
          delBatchEquipmentModel(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getEquipmentModelList()
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
        this.getEquipmentModelList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getEquipmentModelList()
      },
      /**
       * 提交“新增设备型号”表单
       */
      addSubmit() {
        this.$refs['equipmentModelForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.equipmentModelForm.curApplicationCode = this.curApplicationCode
            addEquipmentModel(this.equipmentModelForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getEquipmentModelList()
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
        this.$refs['equipmentModelForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.equipmentModelForm.curApplicationCode = this.curApplicationCode
            editEquipmentModel(this.equipmentModelForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getEquipmentModelList()
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
          modelName: '',
          modelCode: '',
          protocolTypeId: '',
          producerId: '',
          equipmentType: '',
          durableYears: '',
          extJson: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.equipmentModelForm = {
          id: '',
          modelName: '',
          protocolTypeId: '',
          producerId: '',
          equipmentType: '',
          durableYears: 1
        }
        if (this.$refs['equipmentModelForm'] !== undefined) {
          this.$refs['equipmentModelForm'].resetFields()
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
            '型号名称',
            '型号编号',
            '协议类型ID',
            '设备厂商id',
            '设备类型，取数据字段',
            '可用年限',
            '扩展字段json',
            '创建时间',
            '创建人',
            '修改时间',
            '修改人'
          ]
          const filterVal = [
            'id',
            'modelName',
            'modelCode',
            'protocolTypeId',
            'producerId',
            'equipmentType',
            'durableYears',
            'extJson',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '设备型号，比如华为p7，iphone X')
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
      getAttdefList(modelCode) {
        getEquipmentModelAttdefList({ modelCode: modelCode, curApplicationCode: this.curApplicationCode }).then(response => {
          if (response.data.error_no === 0) {
            this.equipmentModelAttdefList = response.data.result
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      manageEquipmentModelAttdef(modelCode) {
        this.currentActionEquipmentModelCode = modelCode
        this.dialogAttdefVisible = true
        this.getAttdefList(modelCode)
      },
      findBy(data, attName, attValue) {
        for (let i = 0; i < data.length; i++) {
          if (data[i][attName] === attValue) {
            return data[i]
          }
        }

        return null
      },
      checkEquipmentModelAttdefData(data) {
        let result = true
        let errMsg = '请填写完整'

        if (!data.modelCode || data.modelCode.trim().length === 0) {
          result = false
        } else if (!data.attributeName || data.attributeName.trim().length === 0) {
          result = false
        } else if (!data.attributeCode || data.attributeCode.trim().length === 0) {
          result = false
        } else if (!data.attributeDataType || data.attributeDataType.trim().length === 0) {
          result = false
        } else if (data.attributeValue === undefined) {
          result = false
        }

        if (data.attributeDataType === this.dataTypeEnum.INTEGER && !Number.isInteger(data.attributeValue)) {
          errMsg = '属性值与数据类型不匹配'
          result = false
        }

        if (!result) {
          this.$message.error(errMsg)
        }
        return result
      },
      handleEditAttdef(data, index) {
        if (data.editing) {
          if (!this.checkEquipmentModelAttdefData(data)) {
            return
          }

          data.curApplicationCode = this.curApplicationCode
          if (data.id) {
            // 编辑
            editEquipmentModelAttdef(data).then(response => {
              if (response.data.error_no === 0) {
                delete data.editing
                this.equipmentModelAttdefList.splice(index, 1, data)
              }
              this.$message(response.data.error_info)
            })
          } else {
            // 新增
            addEquipmentModelAttdef(data).then(response => {
              if (response.data.error_no === 0) {
                this.getAttdefList(data.modelCode)
              }
              this.$message(response.data.error_info)
            })
          }
        } else {
          data.editing = true
          this.equipmentModelAttdefList.splice(index, 1, data)
        }
      },
      handleRemoveAttdef(data, index) {
        if (data.id) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeEquipmentModelAttdef({ id: data.id, curApplicationCode: this.curApplicationCode }).then(response => {
              if (response.data.error_no === 0) {
                this.equipmentModelAttdefList.splice(index, 1)
              }
              this.$message(response.data.error_info)
            })
          })
        } else {
          this.equipmentModelAttdefList.splice(index, 1)
        }
      },
      addEquipmentModelAttdef() {
        if (this.currentActionEquipmentModelCode) {
          this.equipmentModelAttdefList.push({ modelCode: this.currentActionEquipmentModelCode, attributeName: '', attributeCode: '', attributeDataType: '', attributeValue: '', editing: true })
        }
      }
    }
  }
</script>
