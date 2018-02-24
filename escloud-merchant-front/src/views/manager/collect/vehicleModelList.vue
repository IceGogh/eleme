<template>
  <div class="app-container calendar-list-container">
    <div v-if="proSearch" class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="型号名称" :label-width="filterFormLabelWidth" prop="modelName" class="form-bottom">
              <el-input @keyup.enter.native="searchVehicleModel" size="small" class="filter-item" placeholder="型号名称"
                        v-model="filterForm.modelName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备厂商" :label-width="filterFormLabelWidth" prop="equipmentMfrs" class="form-bottom">
              <el-input @keyup.enter.native="searchVehicleModel" size="small" class="filter-item" placeholder="设备厂商"
                        v-model="filterForm.equipmentMfrs">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备型号" :label-width="filterFormLabelWidth" prop="equipmentModel" class="form-bottom">
              <el-input @keyup.enter.native="searchVehicleModel" size="small" class="filter-item" placeholder="设备型号"
                        v-model="filterForm.equipmentModel">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          <el-form-item label="车辆类型" :label-width="filterFormLabelWidth" prop="vehicleType"
                        class="form-bottom">
            <el-input @keyup.enter.native="searchVehicleModel" size="small" class="filter-item"
                      placeholder="车辆类型" v-model="filterForm.vehicleType">
            </el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchVehicleModel" v-waves>搜索</el-button>
                <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button type="primary" plain size="small" icon="document" @click="handleDownload"
                         :loading="downloadLoading">导出
              </el-button>
              <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>简单搜索
              </el-button>
            </el-col>
          </el-row>
      </el-form>
    </div>

    <div v-else class="simpleFilter">
      <el-form>
        <el-row class="button-group">
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
              <el-select @keyup.enter.native="searchVehicleModel" size="small" class="filter-item" @change="searchName"
                         clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
              <el-input @keyup.enter.native="searchVehicleModel" size="small" class="filter-item"
                        :placeholder="selectDesc" v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchVehicleModel" v-waves>搜索</el-button>
        </el-col>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button type="primary" plain size="small" icon="document" @click="handleDownload"
                       :loading="downloadLoading">导出
            </el-button>
            <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>高级搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini'
              :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox"
              v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column width="50px" header-align="center" align="center" label="ID" prop='id'>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="设备厂商" prop='equipmentMfrs'>
        <template slot-scope="scope">
          <span>{{scope.row.equipmentMfrsName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="设备型号" prop='equipmentModel'>
        <template slot-scope="scope">
          <span>{{scope.row.equipmentModelName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="车辆类型" prop='vehicleType'
                       :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{rendDictEnumName(vehicleTypList, scope.row.vehicleType)}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'
                       :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyVehicleModel(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteVehicleModel(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addVehicleModel">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除
          </el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange"
                         :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%" top="6vh"
               :before-close="closeDialog" :close-on-click-modal="false">
      <el-form :model="vehicleModelForm" :rules="vehicleModelFormRules" ref="vehicleModelForm" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="型号名称" :label-width="formLabelWidth" prop="modelName">
              <el-input size="small" v-model="vehicleModelForm.modelName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备厂商" :label-width="formLabelWidth" prop="equipmentMfrs">
              <el-select size="small" v-model="vehicleModelForm.equipmentMfrs" clearable filterable remote placeholder="请搜索"
                         :remote-method="searchEquipmentMfrs" :loading="searchEquipmentMfrsLoading">
                <el-option v-for="item in equipmentMfrsList"
                  :key="item.id"
                  :label="item.mfrsName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" :label-width="formLabelWidth" prop="equipmentModel">
              <el-select size="small" :disabled="!vehicleModelForm.equipmentMfrs" v-model="vehicleModelForm.equipmentModel" clearable filterable remote placeholder="请搜索"
                         :remote-method="searchEquipmentModels" :loading="searchEquipmentModelLoading">
                <el-option
                  v-for="item in equipmentModelList"
                  :key="item.modelCode"
                  :label="item.modelName"
                  :value="item.modelCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="vehicleType">
              <el-select size="small" v-model="vehicleModelForm.vehicleType" placeholder="请搜索">
                <el-option
                  v-for="item in vehicleTypList"
                  :key="item.enumValue"
                  :label="item.enumName"
                  :value="item.enumValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="油箱容量" :label-width="formLabelWidth" prop="fuelTankCapacity">
              <el-input size="small" v-model.number="vehicleModelForm.fuelTankCapacity" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="油箱长度" :label-width="formLabelWidth" prop="fuelTankLength">
              <el-input size="small" v-model.number="vehicleModelForm.fuelTankLength" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="油箱宽度" :label-width="formLabelWidth" prop="fuelTankWidth">
              <el-input size="small" v-model.numberl="vehicleModelForm.fuelTankWidth" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="油箱高度" :label-width="formLabelWidth" prop="fuelTankHeight">
              <el-input size="small" v-model="vehicleModelForm.fuelTankHeight" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="波动值" :label-width="formLabelWidth" prop="fluctuateValue">
              <el-input size="small" v-model="vehicleModelForm.fluctuateValue" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="油箱形状" :label-width="formLabelWidth" prop="fuelTankShape">
              <el-select size="small" v-model="vehicleModelForm.fuelTankShape" clearable placeholder="请选择">
                <el-option v-for="item in fuelTankShapeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="燃油类型" :label-width="formLabelWidth" prop="fuelType">
              <el-select size="small" v-model="vehicleModelForm.fuelType" clearable placeholder="请选择">
                <el-option v-for="item in fuelTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传感器类型" :label-width="formLabelWidth" prop="sensorType">
              <el-select size="small" v-model="vehicleModelForm.sensorType" clearable placeholder="请选择">
                <el-option v-for="item in sensorTypeList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开关量" :label-width="formLabelWidth" prop="switchValue">
              <el-select size="small" v-model="vehicleModelForm.switchValue" clearable placeholder="请选择">
                <el-option v-for="item in switchValueList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="排放标准" :label-width="formLabelWidth" prop="emissionStandard">
              <el-input size="small" v-model="vehicleModelForm.emissionStandard" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机型号" :label-width="formLabelWidth" prop="engineModel">
              <el-input size="small" v-model="vehicleModelForm.engineModel" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发动机排量" :label-width="formLabelWidth" prop="engineDisplacement">
              <el-input size="small" v-model="vehicleModelForm.engineDisplacement" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="速度限制" :label-width="formLabelWidth" prop="rateLimitation">
              <el-input size="small" v-model="vehicleModelForm.rateLimitation" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="额定功率" :label-width="formLabelWidth" prop="ratedPower">
              <el-input size="small" v-model="vehicleModelForm.ratedPower" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="百公里油耗" :label-width="formLabelWidth" prop="fuelConsumptionFor100km">
              <el-input size="small" v-model="vehicleModelForm.fuelConsumptionFor100km" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="车宽" :label-width="formLabelWidth" prop="vehicleWidth">
              <el-input size="small" v-model="vehicleModelForm.vehicleWidth" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车高" :label-width="formLabelWidth" prop="vehicleHeight">
              <el-input size="small" v-model="vehicleModelForm.vehicleHeight" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车长" :label-width="formLabelWidth" prop="vehicleLength">
              <el-input size="small" v-model="vehicleModelForm.vehicleLength" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="总质量" :label-width="formLabelWidth" prop="totalWeight">
              <el-input size="small" v-model="vehicleModelForm.totalWeight" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整备质量" :label-width="formLabelWidth" prop="curbWeight">
              <el-input size="small" v-model="vehicleModelForm.curbWeight" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核定载质量" :label-width="formLabelWidth" prop="ratifiedLoadWeight">
              <el-input size="small" v-model="vehicleModelForm.ratifiedLoadWeight" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="底盘类型" :label-width="formLabelWidth" prop="chassisType">
              <el-input size="small" v-model="vehicleModelForm.chassisType" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="准牵引总质量" :label-width="formLabelWidth" prop="tractionTotalWeight">
              <el-input size="small" v-model="vehicleModelForm.tractionTotalWeight" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核定载人数" :label-width="formLabelWidth" prop="ratifiedLoadNumberOfPeople">
              <el-input size="small" v-model="vehicleModelForm.ratifiedLoadNumberOfPeople" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item v-if="!vehicleModelForm.vehicleImage" label="图片" :label-width="formLabelWidth"
                          prop="vehicleImage">
              <el-button type="primary" icon="upload" @click="imagecropperShow=true">添加图片
              </el-button>
            </el-form-item>
            <el-form-item v-else label="图片" :label-width="formLabelWidth" prop="vehicleImage">
              <pan-thumb :image='vehicleModelForm.vehicleImage' height='50px' width='50px'></pan-thumb>
              <el-button type="primary" icon="upload" style="position: absolute;bottom: 18px;margin-left: 40px;"
                         @click="imagecropperShow=true">修改图片
              </el-button>
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

    <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close'
                   @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

  </div>
</template>
<script>
  import {
    getVehicleModelList,
    addVehicleModel,
    editVehicleModel,
    delVehicleModel,
    delBatchVehicleModel
  } from '@/api/manager/collect/vehicleModel'

  import {
    searchEquipmentMfrs
  } from '@/api/manager/collect/equipmentMfrs'

  import {
    searchEquipmentModels
  } from '@/api/manager/collect/equipmentModel'

  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableVehicleModel',
    directives: {
      waves
    },
    components: { ImageCropper, PanThumb },
    data() {
      var checkNumberData = (rule, value, callback) => {
        if (value) {
          if (parseFloat(value).toString() === 'NaN') {
            return callback(new Error('请输入数值'))
          }
        }

        callback()
      }

      return {
        curApplicationCode: '',
        list: [],
        searchOptions: [
          {
            value: 'id',
            label: 'ID'
          },
          {
            value: 'modelName',
            label: '型号名称'
          },
          {
            value: 'equipmentMfrs',
            label: '设备厂商'
          },
          {
            value: 'equipmentModel',
            label: '设备型号'
          },
          {
            value: 'vehicleType',
            label: '车辆类型'
          }
        ],
        total: 0,
        selectDesc: '',
        listLoading: true,
        proSearch: false,
        downloadLoading: false,
        searchEquipmentMfrsLoading: false,
        searchEquipmentModelLoading: false,
        isBatch: true,
        imagecropperShow: false,
        imagecropperKey: 0,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        queryType: '',
        queryParams: '',
        filterForm: {
          modelName: '',
          equipmentMfrs: '',
          equipmentModel: '',
          vehicleType: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        vehicleModelForm: {
          modelName: '',
          equipmentMfrs: '',
          equipmentModel: '',
          vehicleType: '',
          fuelTankCapacity: '',
          fuelTankLength: '',
          fuelTankWidth: '',
          fuelTankHeight: '',
          fluctuateValue: '',
          fuelTankShape: '',
          fuelType: '',
          sensorType: '',
          switchValue: '',
          emissionStandard: '',
          engineModel: '',
          engineDisplacement: '',
          rateLimitation: '',
          ratedPower: '',
          fuelConsumptionFor100km: '',
          vehicleWidth: '',
          vehicleHeight: '',
          vehicleLength: '',
          totalWeight: '',
          curbWeight: '',
          ratifiedLoadWeight: '',
          chassisType: '',
          tractionTotalWeight: '',
          ratifiedLoadNumberOfPeople: '',
          vehicleImage: ''
        },
        textMap: {
          update: '编辑车辆型号',
          create: '添加车辆型号'
        },
        // 表单校验规则
        vehicleModelFormRules: {
          modelName: [{
            required: true,
            message: '请输入型号名称',
            trigger: 'blur'
          }],
          equipmentMfrs: [{
            type: 'number',
            required: true,
            message: '请选择设备厂商',
            trigger: 'blur'
          }],
          equipmentModel: [{
            required: true,
            message: '请选择设备型号',
            trigger: 'blur'
          }],
          vehicleType: [{
            required: true,
            message: '请选择车辆类型',
            trigger: 'blur'
          }],
          fuelTankCapacity: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          fuelTankLength: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          fuelTankWidth: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          fuelTankHeight: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          fluctuateValue: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          emissionStandard: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          engineDisplacement: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          rateLimitation: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          ratedPower: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          fuelConsumptionFor100km: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          vehicleWidth: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          vehicleHeight: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          vehicleLength: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          totalWeight: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          curbWeight: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          ratifiedLoadWeight: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          tractionTotalWeight: [{
            validator: checkNumberData,
            trigger: 'blur'
          }],
          ratifiedLoadNumberOfPeople: [{
            validator: checkNumberData,
            trigger: 'blur'
          }]
        },
        equipmentMfrsList: [],
        equipmentModelList: [],
        vehicleTypList: [],
        // 油箱形状
        fuelTankShapeList: [
          '圆柱形横',
          '圆柱形竖',
          '长方形',
          '锥形',
          '梯形',
          '椭圆形横',
          '椭圆形竖'
        ],
        // 燃料类型
        fuelTypeList: [
          '柴油',
          '汽油'
        ],
        // 传感器类型
        sensorTypeList: [
          '超声波传感器',
          '油杆传感器'
        ],
        // 开关量
        switchValueList: [
          '油耗',
          '水耗',
          '未使用'
        ]
      }
    },
    computed: {},
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.getVehicleModelList()
      const edenepSystemDicts = sessionStorage.getItem('EDENEP_SYSTEM_DICTS')
      if (edenepSystemDicts) {
        this.vehicleTypList = JSON.parse(JSON.parse(edenepSystemDicts)['PLAT_VEHICLE_TYPE'])
      }
    },
    methods: {
      rendDictEnumName(dict, enumValue) {
        for (let i = 0; i < dict.length; i++) {
          if (dict[i].enumValue === enumValue) {
            return dict[i].enumName
          }
        }

        return ''
      },
      searchEquipmentMfrs(keyword) {
        if (keyword !== '') {
          this.searchEquipmentMfrsLoading = true
          searchEquipmentMfrs({ mfrsName: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
            if (response.data.error_no === 0) {
              this.equipmentMfrsList = response.data.result
            } else {
              this.$message(response.data.error_info)
            }
            this.searchEquipmentMfrsLoading = false
          })
        } else {
          this.equipmentMfrsList = []
        }
      },
      searchEquipmentModels(keyword) {
        if (this.vehicleModelForm.equipmentMfrs && keyword !== '') {
          this.searchEquipmentModelLoading = true
          searchEquipmentModels({ producerId: this.vehicleModelForm.equipmentMfrs, modelName: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
            if (response.data.error_no === 0) {
              this.equipmentModelList = response.data.result
            } else {
              this.$message(response.data.error_info)
            }
            this.searchEquipmentModelLoading = false
          })
        } else {
          this.equipmentModelList = []
        }
      },
      getVehicleModelList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getVehicleModelList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchVehicleModel() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getVehicleModelList()
      },
      addVehicleModel() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyVehicleModel(row) {
        this.vehicleModelForm = Object.assign({}, row)
        if (this.equipmentMfrsList.length === 0) {
          this.equipmentMfrsList.push({ id: row.equipmentMfrs, mfrsName: row.equipmentMfrsName })
        }

        if (this.equipmentModelList.length === 0) {
          this.equipmentModelList.push({ modelCode: row.equipmentModel, modelName: row.equipmentModelName })
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteVehicleModel(row) {
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
          delVehicleModel(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchVehicleModel()
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
          delBatchVehicleModel(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchVehicleModel()
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
        this.getVehicleModelList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getVehicleModelList()
      },
      addSubmit() {
        this.$refs['vehicleModelForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.vehicleModelForm.curApplicationCode = this.curApplicationCode
            addVehicleModel(this.vehicleModelForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchVehicleModel()
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
        this.$refs['vehicleModelForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.vehicleModelForm.curApplicationCode = this.curApplicationCode
            editVehicleModel(this.vehicleModelForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchVehicleModel()
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
          equipmentMfrs: '',
          equipmentModel: '',
          vehicleType: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.vehicleModelForm = {
          equipmentMfrs: '',
          equipmentModel: '',
          vehicleType: '',
          fuelTankCapacity: '',
          fuelTankLength: '',
          fuelTankWidth: '',
          fuelTankHeight: '',
          fluctuateValue: '',
          fuelTankShape: '',
          fuelType: '',
          sensorType: '',
          switchValue: '',
          emissionStandard: '',
          engineModel: '',
          engineDisplacement: '',
          rateLimitation: '',
          ratedPower: '',
          fuelConsumptionFor100km: '',
          vehicleWidth: '',
          vehicleHeight: '',
          vehicleLength: '',
          totalWeight: '',
          curbWeight: '',
          ratifiedLoadWeight: '',
          chassisType: '',
          tractionTotalWeight: '',
          ratifiedLoadNumberOfPeople: '',
          vehicleImage: ''
        }
        if (this.$refs['vehicleModelForm'] !== undefined) {
          this.$refs['vehicleModelForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '车辆型号内码',
            '设备厂商',
            '设备型号',
            '车辆类型',
            '油箱容量',
            '油箱长度',
            '油箱宽度',
            '油箱高度',
            '波动值',
            '油箱形状',
            '燃料类型',
            '传感器类型',
            '开关量',
            '排放标准',
            '发动机型号',
            '发动机排量',
            '速度限制',
            '额定功率',
            '百公里油耗',
            '车宽',
            '车高',
            '车长',
            '总质量',
            '整备质量',
            '核定载质量',
            '底盘类型',
            '准牵引总质量',
            '核定载人数'
          ]
          const filterVal = [
            'id',
            'modelCode',
            'equipmentMfrs',
            'equipmentModel',
            'vehicleType',
            'fuelTankCapacity',
            'fuelTankLength',
            'fuelTankWidth',
            'fuelTankHeight',
            'fluctuateValue',
            'fuelTankShape',
            'fuelType',
            'sensorType',
            'switchValue',
            'emissionStandard',
            'engineModel',
            'engineDisplacement',
            'rateLimitation',
            'ratedPower',
            'fuelConsumptionFor100km',
            'vehicleWidth',
            'vehicleHeight',
            'vehicleLength',
            'totalWeight',
            'curbWeight',
            'ratifiedLoadWeight',
            'chassisType',
            'tractionTotalWeight',
            'ratifiedLoadNumberOfPeople'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '车辆型号表')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        // this.vehicleModelForm.vehicleImage = resData.files.avatar
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
