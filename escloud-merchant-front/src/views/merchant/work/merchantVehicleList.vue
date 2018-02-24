<template>
  <div class="main-contain-new clearfix">
    <!-- 菜单导航-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantVehicle">添加车辆</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchMerchantVehicle" />
          <i class="el-icon-search" @click="searchMerchantVehicle"></i>
        </div>
      </div>
        <template>
          <div>
            <div class="app-container calendar-list-container">
              <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}"
                        @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column header-align="center" align="center" label="ID" prop='id'>
                  <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车辆类型" prop='vehicleType'>
                  <template slot-scope="scope">
                    <span>{{findBy(vehicleTypeList, 'enumValue', scope.row.vehicleType).enumName}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车辆型号" prop='vehicleModel'>
                  <template slot-scope="scope">
                    <span>{{findBy(vehicleModelList, 'modelCode', scope.row.vehicleModel).modelName}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车牌号" prop='licensePlateNo'>
                  <template slot-scope="scope">
                    <span>{{scope.row.licensePlateNo}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车辆颜色" prop='vehicleColor'>
                  <template slot-scope="scope">
                    <span>{{scope.row.vehicleColor}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="运营状态" prop='operationState'>
                  <template slot-scope="scope">
                    <span>{{findBy(operationStateList, 'value', scope.row.operationState).label}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="是否报废" prop='scrapped'>
                  <template slot-scope="scope">
                    <span>{{findBy(scrappedOptionList, 'value', scope.row.scrapped).label}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="生产日期" prop='manufactureDate'>
                  <template slot-scope="scope">
                    <span>{{scope.row.manufactureDate}}</span>
                  </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车辆备注" prop='vehicleDesc' :show-overflow-tooltip='true'>
                  <template slot-scope="scope">
                    <span>{{scope.row.vehicleDesc}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button size="small" type="text" @click="modifyMerchantVehicle(scope.row,'update')">修改
                    </el-button>|
                    <el-button size="small" type="text" @click="deleteMerchantVehicle(scope.row,'delete')">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div v-show="!listLoading" class="pagination-container">
                <el-row>
                  <el-col :span="7">
                    <el-button type="info" round plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
                  </el-col>
                  <el-col :span="17">
                    <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current"
                                   :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                  </el-col>
                </el-row>
              </div>

              <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%" top="6vh"
                         :before-close="closeDialog" :close-on-click-modal="false">
                <div style="max-height: 550px; overflow: auto">
                  <el-form :model="merchantVehicleForm" :rules="merchantVehicleFormRules" ref="merchantVehicleForm" label-width="80px">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="车辆型号" :label-width="formLabelWidth" prop="vehicleModel">
                          <el-select size="small" v-model="merchantVehicleForm.vehicleModel" clearable placeholder="请选择" @change="onChangeVehicleModelSelect">
                            <el-option v-if="vehicleModelList.length > 0" v-for="item in vehicleModelList" :key="item.modelCode" :label="item.modelName"
                                       :value="item.modelCode">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="licensePlateNo">
                          <el-input size="small" v-model="merchantVehicleForm.licensePlateNo" :maxlength="8"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="车辆颜色" :label-width="formLabelWidth" prop="vehicleColor">
                          <el-select size="small" v-model="merchantVehicleForm.vehicleColor" clearable placeholder="请选择">
                            <el-option v-for="item in vehicleColorList" :key="item" :label="item" :value="item">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="运营状态" :label-width="formLabelWidth" prop="operationState">
                          <el-select size="small" v-model="merchantVehicleForm.operationState" clearable placeholder="请选择">
                            <el-option v-for="item in operationStateList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="是否报废" :label-width="formLabelWidth" prop="scrapped">
                          <el-select size="small" v-model="merchantVehicleForm.scrapped" clearable placeholder="请选择">
                            <el-option v-for="item in scrappedOptionList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <hr>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="生产日期" :label-width="formLabelWidth" prop="manufactureDate">
                          <el-date-picker v-model="merchantVehicleForm.manufactureDate" type="datetime" placeholder="选择日期时间"
                                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="购买日期" :label-width="formLabelWidth" prop="buyDate">
                          <el-date-picker v-model="merchantVehicleForm.buyDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="发证日期" :label-width="formLabelWidth" prop="certificateDate">
                          <el-date-picker v-model="merchantVehicleForm.certificateDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="车辆识别代号" :label-width="formLabelWidth" prop="vehicleIdentificationNo">
                          <el-input size="small" v-model="merchantVehicleForm.vehicleIdentificationNo" :maxlength="30"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="发动机号" :label-width="formLabelWidth" prop="engineNo">
                          <el-input size="small" v-model="merchantVehicleForm.engineNo" :maxlength="30"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="道路运输证号" :label-width="formLabelWidth" prop="transportLicenseNo">
                          <el-input size="small" v-model="merchantVehicleForm.transportLicenseNo" :maxlength="30"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="车架号码" :label-width="formLabelWidth" prop="carFrameNo">
                          <el-input size="small" v-model="merchantVehicleForm.carFrameNo" :maxlength="30"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="初始里程" :label-width="formLabelWidth" prop="initMileage">
                          <el-input size="small" v-model="merchantVehicleForm.initMileage" :maxlength="0"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <hr>
                    <!--选了车辆型号后，默认取车辆型号的相关属性过来。-->
                    <div v-show="merchantVehicleForm.vehicleModel">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="vehicleType">
                            <el-select  size="small" v-model="merchantVehicleForm.vehicleType" placeholder="请选择">
                              <el-option v-if="vehicleTypeList.length > 0"
                                v-for="item in vehicleTypeList"
                                :key="item.enumValue"
                                :label="item.enumName"
                                :value="item.enumValue">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="油箱长度" :label-width="formLabelWidth" prop="fuelTankLength">
                            <el-input size="small" v-model="merchantVehicleForm.fuelTankLength" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="油箱宽度" :label-width="formLabelWidth" prop="fuelTankWidth">
                            <el-input size="small" v-model="merchantVehicleForm.fuelTankWidth" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="油箱容量" :label-width="formLabelWidth" prop="fuelTankCapacity">
                            <el-input size="small" v-model="merchantVehicleForm.fuelTankCapacity" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="波动值" :label-width="formLabelWidth" prop="fluctuateValue">
                            <el-input size="small" v-model="merchantVehicleForm.fluctuateValue" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="油箱形状" :label-width="formLabelWidth" prop="fuelTankShape">
                            <el-select size="small" v-model="merchantVehicleForm.fuelTankShape" clearable placeholder="请选择">
                              <el-option v-for="item in fuelTankShapeList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="油箱高度" :label-width="formLabelWidth" prop="fuelTankHeight">
                            <el-input size="small" v-model="merchantVehicleForm.fuelTankHeight" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="传感器类型" :label-width="formLabelWidth" prop="sensorType">
                            <el-select size="small" v-model="merchantVehicleForm.sensorType" clearable placeholder="请选择">
                              <el-option v-for="item in sensorTypeList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="开关量" :label-width="formLabelWidth" prop="switchValue">
                            <el-select size="small" v-model="merchantVehicleForm.switchValue" clearable placeholder="请选择">
                              <el-option v-for="item in switchValueList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="燃料类型" :label-width="formLabelWidth" prop="fuelType">
                            <el-select size="small" v-model="merchantVehicleForm.fuelType" clearable placeholder="请选择">
                              <el-option v-for="item in fuelTypeList" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="发动机型号" :label-width="formLabelWidth" prop="engineModel">
                            <el-input size="small" v-model="merchantVehicleForm.engineModel" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="发动机排量" :label-width="formLabelWidth" prop="engineDisplacement">
                            <el-input size="small" v-model="merchantVehicleForm.engineDisplacement" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="排放标准" :label-width="formLabelWidth" prop="emissionStandard">
                            <el-input size="small" v-model="merchantVehicleForm.emissionStandard" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="额定功率" :label-width="formLabelWidth" prop="ratedPower">
                            <el-input size="small" v-model="merchantVehicleForm.ratedPower" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="百公里油耗" :label-width="formLabelWidth" prop="fuelConsumptionFor100km">
                            <el-input size="small" v-model="merchantVehicleForm.fuelConsumptionFor100km" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="车宽" :label-width="formLabelWidth" prop="vehicleWidth">
                            <el-input size="small" v-model="merchantVehicleForm.vehicleWidth" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="车高" :label-width="formLabelWidth" prop="vehicleHeight">
                            <el-input size="small" v-model="merchantVehicleForm.vehicleHeight" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="车长" :label-width="formLabelWidth" prop="vehicleLength">
                            <el-input size="small" v-model="merchantVehicleForm.vehicleLength" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="速度限制" :label-width="formLabelWidth" prop="rateLimitation">
                            <el-input size="small" v-model="merchantVehicleForm.rateLimitation" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="整备质量" :label-width="formLabelWidth" prop="curbWeight">
                            <el-input size="small" v-model="merchantVehicleForm.curbWeight" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="核定载质量" :label-width="formLabelWidth" prop="ratifiedLoadWeight">
                            <el-input size="small" v-model="merchantVehicleForm.ratifiedLoadWeight" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="总质量" :label-width="formLabelWidth" prop="totalWeight">
                            <el-input size="small" v-model="merchantVehicleForm.totalWeight" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="准牵引总质量" :label-width="formLabelWidth" prop="tractionTotalWeight">
                            <el-input size="small" v-model="merchantVehicleForm.tractionTotalWeight" :maxlength="0"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="核定载人数" :label-width="formLabelWidth" prop="ratifiedLoadNumberOfPeople">
                            <el-input size="small" v-model="merchantVehicleForm.ratifiedLoadNumberOfPeople" :maxlength="11"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="底盘类型" :label-width="formLabelWidth" prop="chassisType">
                            <el-input size="small" v-model="merchantVehicleForm.chassisType" :maxlength="50"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>

                    <el-row>
                      <el-col :span="22">
                        <el-form-item v-if=!merchantVehicleForm.vehicleImage label="车辆图片" :label-width="formLabelWidth" prop="vehicleImage">
                          <el-button type="primary" icon="upload" @click="imagecropperShow=true">添加车辆图片
                          </el-button>
                        </el-form-item>
                        <el-form-item v-else label="车辆图片" :label-width="formLabelWidth" prop="vehicleImage">
                          <pan-thumb :image='merchantVehicleForm.vehicleImage' height='50px' width='50px'></pan-thumb>
                          <el-button type="primary" icon="upload" style="position: absolute;bottom: 18px;margin-left: 40px;" @click="imagecropperShow=true">
                            修改车辆图片
                          </el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="16">
                        <el-form-item label="车辆备注" :label-width="formLabelWidth" prop="vehicleDesc">
                          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" v-model="merchantVehicleForm.vehicleDesc"
                                    :maxlength="255"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button round @click="closeDialog">取 消</el-button>
                  <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
                  <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
                </div>
              </el-dialog>

              <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess"
                             :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
            </div>
          </div>
        </template>
      </div>
  </div>
</template>
<script>
  import {
    getMerchantVehicleList,
    addMerchantVehicle,
    editMerchantVehicle,
    delMerchantVehicle,
    delBatchMerchantVehicle
  } from '@/api/merchant/work/merchantVehicle'

  import {
    getVehicleModelList
  } from '@/api/manager/collect/vehicleModel'

  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  import { getApplicationCode, getDicts, getCurProjectCode } from '@/api/common'
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'

  export default {
    name: 'tableMerchantVehicle',
    directives: {
      waves
    },
    components: { ImageCropper, PanThumb, 'sidebar-menu': SidebarMenu },
    data() {
      return {
        curApplicationCode: getApplicationCode(this),
        curProjectCode: getCurProjectCode(),
        list: [],
        total: 0,
        listLoading: true,
        downloadLoading: false,
        isBatch: true,
        imagecropperShow: false,
        imagecropperKey: 0,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        filterForm: {
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        merchantVehicleForm: {
          id: '',
          projectCode: '',
          vehicleModel: '',
          vehicleCode: '',
          licensePlateNo: '',
          vehicleColor: '',
          vehicleImage: '',
          operationState: '',
          scrapped: '',
          manufactureDate: '',
          buyDate: '',
          certificateDate: '',
          transportLicenseNo: '',
          vehicleIdentificationNo: '',
          engineNo: '',
          carFrameNo: '',
          initMileage: '',
          vehicleDesc: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
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
          ratifiedLoadNumberOfPeople: ''
        },
        textMap: {
          update: '编辑车辆',
          create: '添加车辆'
        },
        // 表单校验规则
        merchantVehicleFormRules: {
          vehicleModel: [{
            required: true,
            message: '请选择车辆型号',
            trigger: 'change'
          }],
          licensePlateNo: [{
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }],
          vehicleColor: [{
            required: true,
            message: '请选择车辆颜色',
            trigger: 'change'
          }],
          operationState: [{
            required: true,
            message: '请选择运营状态',
            trigger: 'change'
          }],
          scrapped: [{
            required: true,
            message: '请选择是否报废',
            trigger: 'change'
          }],
          vehicleType: [{
            required: true,
            message: '请选择车辆类型',
            trigger: 'change'
          }]
        },
        // 车辆型号列表
        vehicleModelList: [],
        // 车辆颜色列表
        vehicleColorList: ['黄色', '蓝色', '黑色', '白色'],
        // 运营状态
        operationStateList: [
          { label: '正常', value: '1' },
          { label: '维修', value: '2' },
          { label: '保养', value: '3' },
          { label: '停用', value: '0' }
        ],
        // 是否报废
        scrappedOptionList: [
          { label: '否', value: '0' },
          { label: '是', value: '1' }
        ],
        vehicleTypeList: [],
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
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.vehicleTypeList = getDicts('PLAT_VEHICLE_TYPE')
      this.getMerchantVehicleList()
      this.getVehicleModelList()
    },
    methods: {
      findBy(array, attrName, attrVal) {
        const result = array.filter((item) => {
          return item[attrName] === attrVal
        })
        if (result) {
          return result.length === 1 ? result[0] : result
        }

        return null
      },
      onChangeVehicleModelSelect(val) {
        const obj = this.vehicleModelList.filter((item) => {
          return item.modelCode === val
        })[0]
        // 取选定的车辆型号的相关参数作为默认值
        this.merchantVehicleForm.vehicleType = obj.vehicleType
        this.merchantVehicleForm.fuelTankCapacity = obj.fuelTankCapacity
        this.merchantVehicleForm.fuelTankLength = obj.fuelTankLength
        this.merchantVehicleForm.fuelTankWidth = obj.fuelTankWidth
        this.merchantVehicleForm.fuelTankHeight = obj.fuelTankHeight
        this.merchantVehicleForm.fluctuateValue = obj.fluctuateValue
        this.merchantVehicleForm.fuelTankShape = obj.fuelTankShape
        this.merchantVehicleForm.fuelType = obj.fuelType
        this.merchantVehicleForm.sensorType = obj.sensorType
        this.merchantVehicleForm.switchValue = obj.switchValue
        this.merchantVehicleForm.emissionStandard = obj.emissionStandard
        this.merchantVehicleForm.engineModel = obj.engineModel
        this.merchantVehicleForm.engineDisplacement = obj.engineDisplacement
        this.merchantVehicleForm.rateLimitation = obj.rateLimitation
        this.merchantVehicleForm.ratedPower = obj.ratedPower
        this.merchantVehicleForm.fuelConsumptionFor100km = obj.fuelConsumptionFor100km
        this.merchantVehicleForm.vehicleWidth = obj.vehicleWidth
        this.merchantVehicleForm.vehicleHeight = obj.vehicleHeight
        this.merchantVehicleForm.vehicleLength = obj.vehicleLength
        this.merchantVehicleForm.totalWeight = obj.totalWeight
        this.merchantVehicleForm.curbWeight = obj.curbWeight
        this.merchantVehicleForm.ratifiedLoadWeight = obj.ratifiedLoadWeight
        this.merchantVehicleForm.chassisType = obj.chassisType
        this.merchantVehicleForm.tractionTotalWeight = obj.tractionTotalWeight
        this.merchantVehicleForm.ratifiedLoadNumberOfPeopl = obj.ratifiedLoadNumberOfPeople
      },
      getVehicleModelList() {
        getVehicleModelList({ current: globalConfig.startPage, pageSize: 9999, curApplicationCode: this.curApplicationCode, curProjectCode: this.curProjectCode }).then(response => {
          if (response.data.error_no === 0) {
            this.vehicleModelList = response.data.result.records
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getMerchantVehicleList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        this.filterForm.curProjectCode = this.curProjectCode
        this.filterForm.projectCode = this.curProjectCode
        getMerchantVehicleList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantVehicle() {
        this.filterForm.current = globalConfig.startPage
        this.getMerchantVehicleList()
      },
      addMerchantVehicle() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantVehicle(row) {
        this.merchantVehicleForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantVehicle(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id,
            curApplicationCode: this.curApplicationCode,
            curProjectCode: this.curProjectCode
          }
          this.listLoading = true
          delMerchantVehicle(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantVehicle()
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
            curApplicationCode: this.curApplicationCode,
            curProjectCode: this.curProjectCode
          }
          delBatchMerchantVehicle(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantVehicle()
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
        this.filterForm.current = globalConfig.startPage
        this.filterForm.pageSize = val
        this.getMerchantVehicleList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantVehicleList()
      },
      addSubmit() {
        this.$refs['merchantVehicleForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantVehicleForm.curApplicationCode = this.curApplicationCode
            this.merchantVehicleForm.curProjectCode = this.curProjectCode
            this.merchantVehicleForm.projectCode = this.curProjectCode
            addMerchantVehicle(this.merchantVehicleForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantVehicle()
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
        this.merchantVehicleForm.curApplicationCode = this.curApplicationCode
        this.merchantVehicleForm.curProjectCode = this.curProjectCode
        this.$refs['merchantVehicleForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantVehicleForm.projectCode = this.curProjectCode
            editMerchantVehicle(this.merchantVehicleForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantVehicle()
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
      resetForm() {
        this.merchantVehicleForm = {
          id: '',
          projectCode: '',
          vehicleModel: '',
          vehicleCode: '',
          licensePlateNo: '',
          vehicleColor: '',
          vehicleImage: '',
          operationState: '',
          scrapped: '',
          manufactureDate: '',
          buyDate: '',
          certificateDate: '',
          transportLicenseNo: '',
          vehicleIdentificationNo: '',
          engineNo: '',
          carFrameNo: '',
          initMileage: '',
          vehicleDesc: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
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
          ratifiedLoadNumberOfPeople: ''
        }
        if (this.$refs['merchantVehicleForm'] !== undefined) {
          this.$refs['merchantVehicleForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '',
            '',
            '对应车辆型号内码',
            '车辆内码',
            '车牌号',
            '车辆颜色',
            '车辆图片',
            '运营状态: 1正常，2维修，3保养，0停用',
            '是否报废: 1是，0否',
            '生产日期',
            '购买日期',
            '发证日期',
            '道路运输证号',
            '车辆识别代号',
            '发动机号',
            '车架号码',
            '初始里程',
            '车辆备注',
            '',
            '',
            '',
            '',
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
            'projectCode',
            'vehicleModel',
            'vehicleCode',
            'licensePlateNo',
            'vehicleColor',
            'vehicleImage',
            'operationState',
            'scrapped',
            'manufactureDate',
            'buyDate',
            'certificateDate',
            'transportLicenseNo',
            'vehicleIdentificationNo',
            'engineNo',
            'carFrameNo',
            'initMileage',
            'vehicleDesc',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy',
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
          export_json_to_excel(tHeader, data, '车辆表')
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
      closeDialog() {
        this.dialogFormVisible = false
        this.resetForm()
      }
    }
  }
</script>
<style  rel="stylesheet/scss" lang="scss">

  .el-date-editor.el-input {
    width: 100%;
    min-width: inherit;
  }

  hr {
    border-top: 0.5px #e5e5e5 solid;
    margin-bottom: 20px;
  }
</style>
