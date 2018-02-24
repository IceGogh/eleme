<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="7" v-if="protocolName===''"  >
              <el-form-item label="协议名称" :label-width="filterFormLabelWidth" prop="protocolId" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.protocolId">
                  <el-option v-for="item in nameIdMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-else>
              <el-form-item label="协议名称" :label-width="filterFormLabelWidth"  prop="protocolName" class="form-bottom">
                <el-input size="small" class="filter-item"   :disabled="true"  v-model="protocolName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="字段名称" :label-width="filterFormLabelWidth" prop="fieldName" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" placeholder="字段名称" v-model="filterForm.fieldName">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="字段JAVA代码" :label-width="filterFormLabelWidth" prop="fieldJavaCode" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" placeholder="字段JAVA代码" v-model="filterForm.fieldJavaCode">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="解码方法" :label-width="filterFormLabelWidth" prop="analysisJavaMethod" class="form-bottom">
                <el-input @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" placeholder="解码方法" v-model="filterForm.analysisJavaMethod">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="解码顺序" :label-width="filterFormLabelWidth" prop="orderType" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.orderType">
                  <el-option v-for="item in orderTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="激活状态" :label-width="filterFormLabelWidth" prop="activeStatus" class="form-bottom">
                <el-select @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.activeStatus">
                  <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchProtocolAnalysis" v-waves>搜索</el-button>
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
            <el-select @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchProtocolAnalysis" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchProtocolAnalysis" v-waves>搜索</el-button>
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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="multipleTable-expand">
            <el-form-item label="协议名称">
              <span v-if="protocolName!==''">{{protocolName}}</span>
              <span v-else>{{nameIdMapObj[scope.row.protocolId]}}</span>
            </el-form-item>
            <el-form-item label="字段名称">
              <span>{{scope.row.fieldName}}</span>
            </el-form-item>
            <el-form-item label="字段JAVA代码">
              <span>{{scope.row.fieldJavaCode}}</span>
            </el-form-item>
            <el-form-item label="字段JAVA类型" >
              <span>{{scope.row.fieldJavaType}}</span>
            </el-form-item>
            <el-form-item label="解码方法">
              <span>{{scope.row.analysisJavaMethod}}</span>
            </el-form-item>
            <el-form-item label="解码顺序">
              <span>{{orderTypeMapObj[scope.row.orderType]}}</span>
            </el-form-item>
            <el-form-item label="字段开始位置">
              <span>{{scope.row.fieldStartPosition}}</span>
            </el-form-item>
            <el-form-item label="字段结束位置">
              <span>{{scope.row.fieldEndPosition}}</span>
            </el-form-item>
            <el-form-item label="字段长度">
              <span>{{scope.row.fieldSize}}</span>
            </el-form-item>
            <el-form-item label="字段类型">
              <span>{{scope.row.fieldType}}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{scope.row.createDate}}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{scope.row.createBy}}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{scope.row.updateDate}}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{scope.row.updateDate}}</span>
            </el-form-item>
            <el-form-item label="修改人">
              <span>{{scope.row.updateBy}}</span>
            </el-form-item>
            <el-form-item label="修改时间">
              <span>{{scope.row.updateDate}}</span>
            </el-form-item>
            <el-form-item label="激活状态">
              <span>{{activeStatusMapObj[scope.row.activeStatus]}}</span>
            </el-form-item>
            <el-form-item label="方法入参类型">
              <span>{{scope.row.fieldParamsJavaType}}</span>
            </el-form-item>
            <el-form-item label="字段坐标">
              <span>{{scope.row.fieldPosition}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="62"></el-table-column>
      <el-table-column header-align="center" align="center" label="协议" prop='id' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="协议名称" prop='protocolId' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span v-if="protocolName!==''">{{protocolName}}</span>
          <span v-else>{{nameIdMapObj[scope.row.protocolId]}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段名称" prop='fieldName' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段JAVA代码" prop='fieldJavaCode' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldJavaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段JAVA类型" prop='fieldJavaType' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldJavaType}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="解码方法" prop='analysisJavaMethod' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.analysisJavaMethod}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="解码顺序" prop='orderType' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{orderTypeMapObj[scope.row.orderType]}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段开始位置" prop='fieldStartPosition'  v-if=false :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldStartPosition}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段结束位置" prop='fieldEndPosition'  v-if=false :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldEndPosition}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段长度" prop='fieldSize'  v-if=false :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldSize}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="字段类型" prop='fieldType' v-if=false :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldType}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='createDate' v-if=false sortable :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='createBy' v-if=false  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='updateDate'  v-if=false :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='updateBy' v-if=false  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="激活状态" prop='activeStatus' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{activeStatusMapObj[scope.row.activeStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="方法入参类型" prop='fieldParamsJavaType' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldParamsJavaType}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label=" 字段坐标，split不为空有效。" v-if=false  prop='fieldPosition' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.fieldPosition}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyProtocolAnalysis(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteProtocolAnalysis(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="12">
          <el-button type="info" plain size="small" icon="edit" @click="addProtocolAnalysis">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="12">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close='closeDialog' >
      <el-form :model="protocolAnalysisForm" :rules="protocolAnalysisFormRules" ref="protocolAnalysisForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-show="false" label="协议" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="protocolAnalysisForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <template v-if="protocolName===''">
            <el-form-item label="协议名称" :label-width="formLabelWidth" prop="protocolId">
              <el-select size="small" v-model="protocolAnalysisForm.protocolId" clearable placeholder="请选择">
                <el-option v-for="item in nameIdMapArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="协议名称" :label-width="formLabelWidth"  prop="protocolName">
                <el-input size="small"  :maxlength="10" :disabled="true"  v-model="protocolName"></el-input>
              </el-form-item>
            </template>
          </el-col>
          <el-col :span="11">
            <el-form-item label="字段名称" :label-width="formLabelWidth" prop="fieldName">
              <el-input size="small" v-model="protocolAnalysisForm.fieldName" :maxlength="40"  placeholder="请输入字段名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="字段JAVA代码" :label-width="formLabelWidth" prop="fieldJavaCode">
              <el-input size="small" v-model="protocolAnalysisForm.fieldJavaCode" :maxlength="40" placeholder="请输入字段JAVA代码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="字段类型" :label-width="formLabelWidth" prop="fieldType">
              <el-input size="small" v-model="protocolAnalysisForm.fieldType" :maxlength="10"  placeholder="字段类型（0：字段，n*${mid}:标识指令集合）"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="激活状态" :label-width="formLabelWidth" prop="activeStatus">
              <el-select size="small" v-model="protocolAnalysisForm.activeStatus" clearable placeholder="请选择">
                <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="解码顺序" :label-width="formLabelWidth" prop="orderType">
              <el-select size="small" v-model="protocolAnalysisForm.orderType" clearable placeholder="请选择">
                <el-option v-for="item in orderTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="字段JAVA类型" :label-width="formLabelWidth" prop="fieldJavaType">
              <el-input size="small" v-model="protocolAnalysisForm.fieldJavaType" :maxlength="40" placeholder="请输字段类型，默认为String"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="解码方法" :label-width="formLabelWidth" prop="analysisJavaMethod">
              <el-input size="small" v-model="protocolAnalysisForm.analysisJavaMethod"  placeholder="请输入解码方法,全路径"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="字段开始位置" :label-width="formLabelWidth" prop="fieldStartPosition">
              <el-input size="small" v-model="protocolAnalysisForm.fieldStartPosition" :maxlength="11" placeholder="请输入字段开始位置"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="字段结束位置" :label-width="formLabelWidth" prop="fieldEndPosition">
              <el-input size="small" v-model="protocolAnalysisForm.fieldEndPosition" :maxlength="11"placeholder="请输入字段结束位置"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="字段长度" :label-width="formLabelWidth" prop="fieldSize">
              <el-input size="small" v-model="protocolAnalysisForm.fieldSize" :maxlength="11" placeholder="请输入字段长度"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="方法入参类型" :label-width="formLabelWidth" prop="fieldParamsJavaType">
              <el-input size="small" v-model="protocolAnalysisForm.fieldParamsJavaType"  placeholder="请输入入参类型，默认为byte[]"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label=" 字段坐标" :label-width="formLabelWidth" prop="fieldPosition">
              <el-input size="small" v-model="protocolAnalysisForm.fieldPosition" :maxlength="11" placeholder="请输入字段坐标"></el-input>
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
    getProtocolAnalysisList,
    addProtocolAnalysis,
    editProtocolAnalysis,
    delProtocolAnalysis,
    delBatchProtocolAnalysis,
    queryNameIdDic
  } from '@/api/manager/collect/protocolAnalysis'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableProtocolAnalysis',
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
          value: 'fieldName',
          label: '字段名称'
        },
        {
          value: 'fieldJavaCode',
          label: '字段JAVA代码'
        },
        {
          value: 'fieldJavaType',
          label: '字段JAVA类型'
        },
        {
          value: 'analysisJavaMethod',
          label: '解码方法'
        },
        {
          value: 'activeStatus',
          label: '激活状态（00：未激活，01：激活）'
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
        protocolName: '',
        protocolId: '',
        filterForm: {
          id: '',
          protocolId: '',
          fieldName: '',
          fieldJavaCode: '',
          fieldJavaType: '',
          analysisJavaMethod: '',
          orderType: '',
          fieldStartPosition: '',
          fieldEndPosition: '',
          fieldSize: '',
          fieldType: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          activeStatus: '',
          fieldParamsJavaType: '',
          fieldPosition: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        protocolAnalysisForm: {
          id: '',
          protocolId: '',
          fieldName: '',
          fieldJavaCode: '',
          fieldJavaType: '',
          analysisJavaMethod: '',
          orderType: '',
          fieldStartPosition: '',
          fieldEndPosition: '',
          fieldSize: '',
          fieldType: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          activeStatus: '',
          fieldParamsJavaType: '',
          fieldPosition: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        nameIdMapArr: [],
        nameIdMapObj: {},
        orderTypeMapArr: [
          {
            label: '正序',
            value: '0'
          }, {
            label: '倒序',
            value: '1'
          }
        ],
        orderTypeMapObj: {
          '0': '正序',
          '1': '倒序'
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
        protocolAnalysisFormRules: {
          protocolId: [{
            type: 'number',
            required: true,
            message: '请输入协议ID',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '协议ID必须为数字值'
          }],
          fieldName: [{
            required: true,
            message: '请输入字段名称',
            trigger: 'blur'
          }],
          fieldJavaCode: [{
            required: true,
            message: '请输入字段JAVA代码',
            trigger: 'blur'
          }],
          analysisJavaMethod: [{
            required: true,
            message: '请输入解码方法',
            trigger: 'blur'
          }],
          orderType: [{
            required: true,
            message: '请输入解码顺序（0：正序，1：倒序）',
            trigger: 'blur'
          }],
          fieldJavaType: [{
            required: true,
            message: '请输入字段Java类型）',
            trigger: 'blur'
          }],
          fieldType: [{
            required: true,
            message: '请输入字段类型（0：字段，n*${mid}:标识指令集合）',
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
      const initProtocolId = this.$route.query.protocolId
      const initProtocolName = this.$route.query.protocolName
      this.getProtocolAnalysisList(initProtocolId)
      if (initProtocolName !== undefined) {
        this.protocolName = initProtocolName
      } else {
        this.queryNameIdDic()
      }
      if (initProtocolId !== undefined) {
        this.protocolId = initProtocolId
      }
    },
    methods: {
      closeDialog() {
        this.dialogFormVisible = false
        if (this.$refs['protocolAnalysisForm'] !== undefined) {
          this.$refs['protocolAnalysisForm'].resetFields()
        }
      },
      queryNameIdDic() {
        queryNameIdDic().then(response => {
          if (response.data.error_no === 0) {
            const nameIdMapArrTemp = response.data.result
            for (const index of nameIdMapArrTemp) {
              const indexTemp = {}
              indexTemp.label = index.protocolName
              indexTemp.value = index.id
              this.nameIdMapArr.push(indexTemp)
              this.nameIdMapObj[index.id] = index.protocolName
            }
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getProtocolAnalysisList(initProtocolId) {
        this.listLoading = true
        if (initProtocolId !== undefined) {
          this.filterForm.protocolId = initProtocolId
        }
        getProtocolAnalysisList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchProtocolAnalysis() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        if (this.protocolId !== '') {
          this.filterForm.protocolId = this.protocolId
        }
        this.filterForm.current = globalConfig.startPage
        this.getProtocolAnalysisList()
      },
      addProtocolAnalysis() {
        this.resetForm()
        if (this.protocolId !== '') {
          this.protocolAnalysisForm.protocolId = this.protocolId
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyProtocolAnalysis(row) {
        this.protocolAnalysisForm = Object.assign({}, row)
        if (this.protocolId !== '') {
          this.protocolAnalysisForm.protocolId = this.protocolId
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteProtocolAnalysis(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id
          }
          this.listLoading = true
          delProtocolAnalysis(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProtocolAnalysisList()
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
          delBatchProtocolAnalysis(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProtocolAnalysisList()
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
        this.getProtocolAnalysisList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getProtocolAnalysisList()
      },
      addSubmit() {
        this.$refs['protocolAnalysisForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addProtocolAnalysis(this.protocolAnalysisForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProtocolAnalysisList()
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
        this.$refs['protocolAnalysisForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editProtocolAnalysis(this.protocolAnalysisForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProtocolAnalysisList()
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
          protocolId: '',
          fieldName: '',
          fieldJavaCode: '',
          fieldJavaType: '',
          analysisJavaMethod: '',
          orderType: '',
          fieldStartPosition: '',
          fieldEndPosition: '',
          fieldSize: '',
          fieldType: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          activeStatus: '',
          fieldParamsJavaType: '',
          fieldPosition: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.protocolAnalysisForm = {
          id: '',
          protocolId: '',
          fieldName: '',
          fieldJavaCode: '',
          fieldJavaType: '',
          analysisJavaMethod: '',
          orderType: '',
          fieldStartPosition: '',
          fieldEndPosition: '',
          fieldSize: '',
          fieldType: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          activeStatus: '',
          fieldParamsJavaType: '',
          fieldPosition: ''
        }
        if (this.$refs['protocolAnalysisForm'] !== undefined) {
          this.$refs['protocolAnalysisForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('vendor/Export2Excel')
          const tHeader = [
            '协议',
            '协议ID',
            '字段名称',
            '字段JAVA代码',
            '字段JAVA类型',
            '解码方法',
            '解码顺序（0：正序，1：倒序）',
            '字段开始位置',
            '字段结束位置',
            '字段长度',
            '字段类型（0：字段，n*${mid}:标识指令集合）',
            '',
            '',
            '',
            '',
            '激活状态（00：未激活，01：激活）',
            '方法入参类型，多个用，分割',
            ' 字段坐标，split不为空有效。'
          ]
          const filterVal = [
            'id',
            'protocolId',
            'fieldName',
            'fieldJavaCode',
            'fieldJavaType',
            'analysisJavaMethod',
            'orderType',
            'fieldStartPosition',
            'fieldEndPosition',
            'fieldSize',
            'fieldType',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy',
            'activeStatus',
            'fieldParamsJavaType',
            'fieldPosition'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '协议解码表(每一个字段的解析规则)')
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
