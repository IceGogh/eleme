<template>
<div class="main-contain-new clearfix">
  <!-- 侧边菜单导航（按需加载，不需要就删除）-->
  <sidebar-menu></sidebar-menu>

  <!-- main-contain部分-->
  <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
    <!-- tab页切换部分 (根据需要写入 )-->
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in activeTitle" :label="item.name" :key="item.name" :name="item.title">
          <!-- 放切换的组件 -->
          <keep-alive>
            <div v-if="item.name === '事件管理'">
              <template>
                <!--事件管理 对应的组件-->
                <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
                <div class="option-bar">
                  <div class="searchBox">
                    <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterEventForm.searchWord" @keyup.enter="searchMerchantEvent"/>
                    <i class="el-icon-search" @click="searchMerchantEvent"></i>
                  </div>
                </div>
                <template>
                  <div>
                    <div class="app-container calendar-list-container">
                      <!-- 表格-->
                      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listEventLoading" element-loading-text="给我一点时间" style="width: 100%">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column type="index" width="62" label="序号"></el-table-column>
                        <el-table-column header-align="center" align="center" label="事件类型" prop='eventTypeCode' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.eventTypeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="事件描述" prop='eventDesc' :show-overflow-tooltip='true'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.eventDesc}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="事件地址" prop='reportLng' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.eventAddress}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="事件等级" prop='eventGrade' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{eventGradeMapObj[scope.row.eventGrade]}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="所属网格" prop='gridId' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.gridId}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="上报人" prop='reportPerson' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.reportPerson}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="状态" prop='eventState' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{eventStateMapObj[scope.row.eventState]}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="上报时间" prop='reportDate' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.reportDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="完成时间" prop='endDate' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.endDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="责任人" prop='employeeId' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.employeeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="处理人" prop='handleEmployeeId' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.handleEmployeeId}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="150">
                          <template slot-scope="scope">
                            <el-button size="small" type="text" @click="searchDetails(scope.row,'details')">查看
                            </el-button>
                            <el-button v-if="(scope.row.employeeId == '' || scope.row.employeeId == null) && (scope.row.eventState == 1 || scope.row.eventState == null)" size="small" type="text" @click="editAssignmentOrRebut(scope.row,'assignment')">分派
                            </el-button>
                            <el-button v-if="(scope.row.employeeId == '' || scope.row.employeeId == null) && (scope.row.eventState == 1 || scope.row.eventState == null)" size="small" type="text" @click="editAssignmentOrRebut(scope.row,'rebut')">驳回
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- 分页工具栏-->
                      <div v-show="!listEventLoading" class="pagination-container">
                        <el-row>
                          <el-col :span="24">
                            <el-pagination @size-change="pageSizeEventChange" @current-change="currentPageEventChange" :current-page.sync="filterEventForm.current" :page-sizes="pageSize" :page-size="filterEventForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <el-dialog center class="create_dialog" :title="textMap[detailDialogStatus]" :visible.sync="detailDialogFormVisible" width="40%" :before-close="closeDetailDialog">
                      <el-form :model="merchantEventForm" ref="merchantEventForm" label-width="80px">
                        <el-row>
                          <el-col :span="11">
                            <el-form-item label="事件类型" :label-width="formLabelWidth" prop="eventTypeName">
                              <el-input size="small" v-model="merchantEventForm.eventTypeName" :maxlength="32" readonly></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="11">
                            <el-form-item label="事件等级" :label-width="formLabelWidth" prop="eventGrade">
                              <el-input v-if="merchantEventForm.eventGrade == 1" size="small" :maxlength="1" value="一般" readonly></el-input>
                              <el-input v-if="merchantEventForm.eventGrade == 2" size="small" :maxlength="1" value="紧急" readonly></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="11">
                            <el-form-item label="所属网格" :label-width="formLabelWidth" prop="gridId">
                              <el-input size="small" v-model="merchantEventForm.gridId" :maxlength="11" readonly></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="11">
                            <el-form-item label="事件地址" :label-width="formLabelWidth" prop="eventAddress">
                              <el-input size="small" v-model="merchantEventForm.eventAddress" :maxlength="127" readonly></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col>
                            <el-col :span="22">
                              <el-form-item label="事件类型描述" :label-width="formLabelWidth" prop="eventDesc">
                                <el-input size="small" v-model="merchantEventForm.eventDesc" readonly :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-col>
                        </el-row>
                        <el-row>
                          <div class="leftline">
                            <div class="dot"></div>
                            <ul>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                            </ul>
                            <div class="dot"></div>
                          </div>
                          <div class="photos">
                            <i>上报时间：{{merchantEventForm.reportDate}}</i>
                            <i>上报人：{{merchantEventForm.reportPerson}}</i>
                            <el-carousel type="card" height="100px">
                              <el-carousel-item v-for="item in 4" :key="item" :autoplay="isDisabled">
                                <img src="../../../assets/img/people.png">
                              </el-carousel-item>
                            </el-carousel>
                            <i>分派时间：{{merchantEventForm.assignmentDate}}</i>
                            <i>责任人：{{merchantEventForm.employeeName}}</i>
                            <i>指派时间：{{merchantEventForm.assignDate}}</i>
                            <i>指派人：{{merchantEventForm.handleEmployeeName}}</i>
                            <el-carousel type="card" height="100px">
                              <el-carousel-item v-for="item in 4" :key="item" :autoplay="isDisabled">
                                <img src="../../../assets/img/people.png">
                              </el-carousel-item>
                            </el-carousel>
                            <i>处理完成时间：{{merchantEventForm.endDate}}</i>
                            <i>处理人：{{merchantEventForm.handleEmployeeName}}</i>
                            <i>检查人：{{merchantEventForm.employeeName}}</i>
                            <el-carousel type="card" height="100px">
                              <el-carousel-item v-for="item in 4" :key="item" :autoplay="isDisabled">
                                <img src="../../../assets/img/people.png">
                              </el-carousel-item>
                            </el-carousel>
                          </div>
                        </el-row>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" round @click="closeDetailDialog">确 定</el-button>
                      </div>
                    </el-dialog>
                    <el-dialog center class="create_dialog" :title="textMap[eventDialogStatus]" :visible.sync="eventDialogFormVisible" width="40%" :before-close="closeEventDialog">
                      <el-form :model="merchantEventForm" ref="merchantEventForm" label-width="80px">
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="事件类型" :label-width="formLabelWidth" prop="eventTypeName">
                              <el-input size="small" v-model="merchantEventForm.eventTypeName" :maxlength="32" readonly></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="事件等级" :label-width="formLabelWidth" prop="eventGrade">
                              <el-input v-if="merchantEventForm.eventGrade == 1" size="small" :maxlength="1" value="一般" readonly></el-input>
                              <el-input v-if="merchantEventForm.eventGrade == 2" size="small" :maxlength="1" value="紧急" readonly></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                            <el-form-item label="所属网格" :label-width="formLabelWidth" prop="gridId">
                              <el-input size="small" v-model="merchantEventForm.gridId" :maxlength="11" readonly></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="事件地址" :label-width="formLabelWidth" prop="eventAddress">
                              <el-input size="small" v-model="merchantEventForm.eventAddress" :maxlength="127" readonly></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col>
                            <el-col :span="22">
                              <el-form-item label="事件类型描述" :label-width="formLabelWidth" prop="eventDesc">
                                <el-input size="small" v-model="merchantEventForm.eventDesc" readonly :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-col>
                        </el-row>
                        <el-row>
                          <div class="leftline1">
                            <div class="dot1"></div>
                            <ul>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                              <li></li>
                            </ul>
                            <div class="dot1"></div>
                          </div>
                          <div class="photos">
                            <i>上报时间：{{merchantEventForm.reportDate}}</i>
                            <i>上报人：{{merchantEventForm.reportPerson}}</i>
                            <el-row>
                              <el-carousel type="card" height="100px">
                                <el-carousel-item v-for="item in 4" :key="item" :autoplay="isDisabled">
                                  <img src="../../../assets/img/people.png">
                                </el-carousel-item>
                              </el-carousel>
                            </el-row>
                          </div>
                          <div class="rightbox">
                            <el-form-item :label-width="formLabelWidth" style="margin-top:-40px;">
                              <el-radio-group v-model="assignmentOrRebut">
                                <el-radio :label="1">分派</el-radio>
                                <el-radio :label="2">驳回</el-radio>
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </el-row>
                        <el-row>
                          <el-col :span="12" v-if="assignmentOrRebut === 1">
                            <el-form-item label="责任人" :label-width="formLabelWidth" prop="employeeId">
                              <el-select size="small" v-model="merchantEventForm.employeeId" filterable remote
                                         placeholder="请搜索" :remote-method="searchEmployee" :loading="searchEmployeeIdLoading">
                                <el-option v-for="item in employeeList" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24" v-if="assignmentOrRebut === 2">
                            <el-form-item label="驳回原因" :label-width="formLabelWidth" prop="rebutCause">
                              <el-input size="small" v-model="merchantEventForm.rebutCause" :maxlength="127" resize='vertical'
                                        type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容" >
                              </el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                      <div slot="footer" class="dialog-footer">
                        <el-button type="primary" round @click="doSumit">确 定</el-button>
                        <el-button type="primary" round @click="closeEventDialog">取 消</el-button>
                      </div>
                    </el-dialog>
                  </div>
                </template>
              </template>
            </div>
          </keep-alive>
          <keep-alive>
            <div v-if="item.name === '事件类型'">
              <template>
                <!--事件类型 对应的组件-->
                <div class="option-bar">
                  <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantEventType">添加</el-button>
                  <div class="searchBox">
                    <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterEventTypeForm.searchWord"/>
                    <i class="el-icon-search" @click="searchMerchantEventType"></i>
                  </div>
                </div>
                <template>
                  <div >
                    <div class="app-container calendar-list-container">
                      <el-table ref="eventTypeTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listEventTypeLoading" element-loading-text="给我一点时间" style="width: 100%">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column type="index" width="62" label="序号"></el-table-column>
                        <el-table-column header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
                          <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="事件类型名称" prop='eventTypeName' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.eventTypeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="事件类型描述" prop='eventTypeDesc' :show-overflow-tooltip='true'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.eventTypeDesc}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="创建人" prop='createBy' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.createBy}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="创建日期" prop='createDate' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.createDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="修改人" prop='modifyBy' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.modifyBy}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="修改日期" prop='modifyDate' :show-overflow-tooltip='true'>
                          <template slot-scope="scope">
                            <span>{{scope.row.modifyDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="150">
                          <template slot-scope="scope">
                            <el-button round size="small" type="text" @click="modifyMerchantEventType(scope.row,'update')">修改
                            </el-button>|
                            <el-button round size="small" type="text" @click="deleteMerchantEventType(scope.row,'delete')">删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>

                      <div v-show="!listEventTypeLoading" class="pagination-container">
                        <el-row>
                          <el-col :span="7">
                            <el-button type="info" round plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
                          </el-col>
                          <el-col :span="17">
                            <el-pagination @size-change="pageSizeEventTypeChange" @current-change="currentPageEventTypeChange" :current-page.sync="filterEventTypeForm.current" :page-sizes="pageSize" :page-size="filterEventTypeForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                          </el-col>
                        </el-row>
                      </div>

                      <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%" :before-close="closeDialog">
                        <el-form :model="merchantEventTypeForm" :rules="merchantEventTypeFormRules" ref="merchantEventTypeForm" label-width="80px">
                          <el-row>
                            <el-col :span="22">
                              <el-form-item label="事件类型名称" :label-width="formLabelWidth" prop="eventTypeName">
                                <el-input size="small" v-model="merchantEventTypeForm.eventTypeName" :maxlength="32" placeholder="请输入类型名称"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-row>
                              <el-col :span="22">
                                <el-form-item label="事件类型描述" :label-width="formLabelWidth" prop="eventTypeDesc">
                                  <el-input size="small" v-model="merchantEventTypeForm.eventTypeDesc" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                          <el-button round @click="closeDialog">取 消</el-button>
                          <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
                          <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
                        </div>
                      </el-dialog>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </template>
    </div>
  </div>
</template>
<script>
  import {
    getMerchantEventList,
    getMerchantEventTypeList,
    addMerchantEventType,
    editMerchantEventType,
    delMerchantEventType,
    delBatchMerchantEventType,
    searchEmployee,
    assignmentPerson,
    rebut
  } from '@/api/merchant/work/merchantEvent'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import { getApplicationCode, getCurProjectCode } from '@/api/common'
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'

  export default {
    name: 'tableMerchantEvent',
    directives: {
      waves
    },
    components: { ImageCropper, PanThumb, 'sidebar-menu': SidebarMenu },
    data() {
      return {
        curProjectCode: getCurProjectCode(),
        curApplicationCode: '',
        employeeList: [],
        list: [],
        total: 0,
        isDisabled: true,
        listEventLoading: true,
        listEventTypeLoading: true,
        searchEmployeeIdLoading: false,
        downloadLoading: false,
        isBatch: true,
        assignmentOrRebut: 1,
        imagecropperShow: false,
        imagecropperKey: 0,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        filterEventForm: {
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        filterEventTypeForm: {
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        detailDialogStatus: '',
        detailDialogFormVisible: false,
        eventDialogStatus: '',
        eventDialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        merchantEventForm: {
          id: '',
          eventId: '',
          merchantId: '',
          projectCode: '',
          eventTypeCode: '',
          gridId: '',
          reportPerson: '',
          reportDate: '',
          reportLng: '',
          reportLat: '',
          eventAddress: '',
          eventState: '',
          employeeId: '',
          handleEmployeeId: '',
          endDate: '',
          eventDesc: '',
          eventGrade: '',
          rebutCause: '',
          assignmentDate: '',
          assignmentType: '',
          assignDate: '',
          eventTypeName: '',
          employeeName: '',
          handleEmployeeName: ''
        },
        merchantEventTypeForm: {
          id: '',
          eventTypeCode: '',
          eventTypeName: '',
          eventTypeDesc: '',
          projectCode: '',
          merchantId: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: ''
        },
        textMap: {
          update: '编辑',
          create: '创建',
          details: '查看详情',
          assignment: '分派',
          rebut: '驳回'
        },
        eventStateMapObj: {
          '1': '未处理',
          '2': '处理中',
          '3': '已处理',
          '4': '已撤销',
          '5': '驳回'
        },
        eventGradeMapObj: {
          '1': '一般',
          '2': '紧急'
        },
        // 表单校验规则
        merchantEventTypeFormRules: {
          eventTypeName: [{
            required: true,
            message: '请输入事件类型名称',
            trigger: 'blur'
          }],
          eventTypeDesc: [{
            required: true,
            message: '请输入事件类型描述',
            trigger: 'blur'
          }]
        },
        activeName: 'event',
        activeTitle: [
          {
            title: 'event',
            name: '事件管理'
          },
          {
            title: 'eventType',
            name: '事件类型'
          }
        ]
      }
    },
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.curApplicationCode = getApplicationCode(this)
      this.getMerchantEventList()
    },
    methods: {
      doSumit() {
        if (this.assignmentOrRebut === 1) {
          if (this.merchantEventForm.employeeId === '') {
            this.$alert('分派责任人时必须选择一个责任人', '错误提示', {
              confirmButtonText: '确定'
            })
          } else {
            const param = {
              id: this.merchantEventForm.id,
              curApplicationCode: this.curApplicationCode,
              projectCode: this.curProjectCode,
              employeeId: this.merchantEventForm.employeeId
            }
            this.listEventLoading = true
            assignmentPerson(param).then(response => {
              if (response.data.error_no === 0) {
                this.$notify({
                  title: '成功',
                  message: '分派成功',
                  type: 'success',
                  duration: 2000
                })
                this.closeEventDialog()
                this.getMerchantEventList()
              } else {
                this.$message(response.data.error_info)
              }
              this.listEventLoading = false
            })
          }
        } else if (this.assignmentOrRebut === 2) {
          if (this.merchantEventForm.rebutCause === '') {
            this.$alert('驳回必须填写驳回原因', '错误提示', {
              confirmButtonText: '确定'
            })
          } else {
            const param = {
              id: this.merchantEventForm.id,
              curApplicationCode: this.curApplicationCode,
              projectCode: this.curProjectCode,
              rebutCause: this.merchantEventForm.rebutCause
            }
            this.listEventLoading = true
            rebut(param).then(response => {
              if (response.data.error_no === 0) {
                this.$notify({
                  title: '成功',
                  message: '分派成功',
                  type: 'success',
                  duration: 2000
                })
                this.closeEventDialog()
                this.getMerchantEventList()
              } else {
                this.$message(response.data.error_info)
              }
              this.listEventLoading = false
            })
          }
        }
      },
      editAssignmentOrRebut(row, key) {
        this.merchantEventForm = Object.assign({}, row)
        this.eventDialogFormVisible = true
        this.eventDialogStatus = key
        if (key === 'assignment') {
          this.assignmentOrRebut = 1
        } else {
          this.assignmentOrRebut = 2
        }
      },
      searchEmployee(keyword) {
        if (keyword) {
          this.searchEmployeeIdLoading = true
          searchEmployee({ projectCode: this.curProjectCode, keyword: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
            if (response.data.error_no === 0) {
              for (let i = 0; i < response.data.result.length; i++) {
                this.employeeList.push(response.data.result[i])
              }
            } else {
              this.$message(response.data.error_info)
            }
            this.searchEmployeeIdLoading = false
          })
        } else {
          this.employeeList = []
        }
      },
      handleClick(tab, event) {
        if (tab.paneName === 'eventType') {
          this.list = []
          this.total = 0
          this.getMerchantEventTypeList()
        }
        if (tab.paneName === 'event') {
          this.list = []
          this.total = 0
          this.getMerchantEventList()
        }
      },
      getMerchantEventList() {
        this.listEventLoading = true
        this.filterEventForm.curApplicationCode = this.curApplicationCode
        this.filterEventForm.projectCode = this.curProjectCode
        getMerchantEventList(this.filterEventForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listEventLoading = false
        })
      },
      searchMerchantEvent() {
        this.filterEventForm.current = globalConfig.startPage
        this.getMerchantEventList()
      },
      pageSizeEventChange(val) {
        this.filterEventForm.current = globalConfig.startPage
        this.filterEventForm.pageSize = val
        this.getMerchantEventList()
      },
      currentPageEventChange(val) {
        this.filterEventForm.current = val
        this.getMerchantEventList()
      },
      getMerchantEventTypeList() {
        this.listEventTypeLoading = true
        this.filterEventTypeForm.curApplicationCode = this.curApplicationCode
        this.filterEventTypeForm.projectCode = this.curProjectCode
        getMerchantEventTypeList(this.filterEventTypeForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listEventTypeLoading = false
        })
      },
      searchMerchantEventType() {
        this.filterEventTypeForm.current = globalConfig.startPage
        this.getMerchantEventTypeList()
      },
      searchDetails(row, key) {
        this.merchantEventForm = Object.assign({}, row)
        this.detailDialogStatus = key
        this.detailDialogFormVisible = true
      },
      addMerchantEventType() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantEventType(row) {
        this.merchantEventTypeForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      addSubmit() {
        this.$refs['merchantEventTypeForm'][0].validate((valid) => {
          if (valid) {
            this.listEventTypeLoading = true
            this.merchantEventTypeForm.curApplicationCode = this.curApplicationCode
            this.merchantEventTypeForm.projectCode = this.curProjectCode
            addMerchantEventType(this.merchantEventTypeForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantEventType()
              } else {
                this.$message(response.data.error_info)
              }
              this.listEventTypeLoading = false
            })
          } else {
            return false
          }
        })
      },
      updateSubmit() {
        this.merchantEventTypeForm.curApplicationCode = this.curApplicationCode
        this.$refs['merchantEventTypeForm'][0].validate((valid) => {
          if (valid) {
            this.listEventTypeLoading = true
            editMerchantEventType(this.merchantEventTypeForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantEventType()
              } else {
                this.$message(response.data.error_info)
              }
              this.listEventTypeLoading = false
            })
          } else {
            return false
          }
        })
      },
      deleteMerchantEventType(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id,
            curApplicationCode: this.curApplicationCode,
            projectCode: this.curProjectCode
          }
          this.listEventTypeLoading = true
          delMerchantEventType(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantEventType()
              this.$refs.eventTypeTable[0].clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listEventTypeLoading = false
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
          const selection = this.$refs.eventTypeTable[0].selection
          const selectIds = []
          for (let i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
          }
          const param = {
            primaryKeys: selectIds,
            curApplicationCode: this.curApplicationCode,
            projectCode: this.curProjectCode
          }
          delBatchMerchantEventType(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantEventType()
              this.$refs.eventTypeTable[0].clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listEventTypeLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      pageSizeEventTypeChange(val) {
        this.filterEventTypeForm.current = globalConfig.startPage
        this.filterEventTypeForm.pageSize = val
        this.getMerchantEventTypeList()
      },
      currentPageEventTypeChange(val) {
        this.filterEventTypeForm.current = val
        this.getMerchantEventTypeList()
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
      resetEventForm() {
        this.merchantEventForm = {
          id: '',
          eventId: '',
          merchantId: '',
          projectCode: '',
          eventTypeCode: '',
          gridId: '',
          reportPerson: '',
          reportDate: '',
          reportLng: '',
          reportLat: '',
          eventAddress: '',
          eventState: '',
          employeeId: '',
          handleEmployeeId: '',
          endDate: '',
          eventDesc: '',
          eventGrade: '',
          rebutCause: ''
        }
      },
      resetForm() {
        this.merchantEventTypeForm = {
          id: '',
          eventTypeCode: '',
          eventTypeName: '',
          eventTypeDesc: '',
          projectCode: '',
          merchantId: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: ''
        }
        if (this.$refs['merchantEventTypeForm'] !== undefined) {
          this.$refs['merchantEventTypeForm'][0].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '事件ID',
            '商户ID',
            '项目CODE',
            '事件类型',
            '网格ID',
            '上报人',
            '上报时间',
            '上报经度',
            '上报纬度',
            '事件状态(1未处理2处理中3已处理)',
            '责任人',
            '处理人',
            '完成时间',
            '事件描述',
            '事件等级（1一般2紧急）'
          ]
          const filterVal = [
            'id',
            'eventId',
            'merchantId',
            'projectCode',
            'eventTypeCode',
            'gridId',
            'reportPerson',
            'reportDate',
            'reportLng',
            'reportLat',
            'eventState',
            'employeeId',
            'handleEmployeeId',
            'endDate',
            'eventDesc',
            'eventGrade'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '')
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
      },
      closeDetailDialog() {
        this.detailDialogFormVisible = false
      },
      closeEventDialog() {
        this.eventDialogFormVisible = false
        this.resetEventForm()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .leftline {
    width: 20px;
    height: 400px;
    float: left;
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #409EFF;
      margin-left: 10px;
    }
    ul {
      margin: 0;
      padding: 0;
      li {
        display: block;
        width: 2px;
        height: 10px;
        background: #409EFF;
        margin-bottom: 4px;
        margin-left: 13px;
      }
    }
  }
  .leftline1 {
    width: 20px;
    height: 200px;
    float: left;
    .dot1 {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #409EFF;
      margin-left: 10px;
    }
    ul {
      margin: 0;
      padding: 0;
      li {
        display: block;
        width: 2px;
        height: 10px;
        background: #409EFF;
        margin-bottom: 4px;
        margin-left: 13px;
      }
    }
  }
  .rightbox {
    float: left;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
