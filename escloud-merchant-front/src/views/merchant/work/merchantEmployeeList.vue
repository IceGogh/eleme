<template>
  <div class="main-contain-new clearfix">
    <sidebar-menu></sidebar-menu>
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="Append">添加机构</el-button>
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantEmployee">添加员工</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord"/>
          <i class="el-icon-search" @click="searchMerchantEmployee"></i>
        </div>
      </div>
      <template>
        <div class="app-container calendar-list-container menuwrap">
          <el-row>
            <el-col :span="4">
              <div style="margin-top: 30px;">
                <m-tree v-model='organizationTree' @NodeClick="handleNodeClick" @OpenEdit="OpenEdit" @DelNode="DelNode" @Append="Append" ref='MTree' :tableTree='organizationTree' width='200px'>
                </m-tree>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="app-container calendar-list-container" style="margin-top: 30px;margin: 10px;overflow-y: auto;">
                <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
                  <el-table-column type="selection" width="50"></el-table-column>
                  <el-table-column type="index" width="62" label="序号"></el-table-column>
                  <el-table-column header-align="center" align="center" label="组织机构" prop='organizationCode'>
                    <template slot-scope="scope">
                      <span>{{scope.row.organizationName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" align="center" label="姓名" prop='employeeName'>
                    <template slot-scope="scope">
                      <span>{{scope.row.employeeName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" align="center" label="联系电话" prop='phone'>
                    <template slot-scope="scope">
                      <span>{{scope.row.phone}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" align="center" label="性别" prop='gender'>
                    <template slot-scope="scope">
                      <span>{{genderStateMapObj[scope.row.inJob]}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" align="center" label="身份证号码" prop='identityNo' :show-overflow-tooltip='true'>
                    <template slot-scope="scope">
                      <span>{{scope.row.identityNo}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" align="center" label="是否在职" prop='inJob'>
                    <template slot-scope="scope">
                      <span>{{inJobStateMapObj[scope.row.inJob]}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="center" align="center" label="家庭电话" prop='familyPhone'>
                    <template slot-scope="scope">
                      <span>{{scope.row.familyPhone}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button round size="small" type="text" @click="modifyMerchantEmployee(scope.row)">修改
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div v-show="!listLoading" class="pagination-container">
                  <el-row>
                    <el-col :span="24">
                      <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                      </el-pagination>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-dialog center class="create_dialog" :title="textMap[organDialogStatus]" :visible.sync="organDialogFormVisible" width="40%" :before-close="closeOrganizationFormDialog">
            <el-form :model="organizationForm" :rules="organizationFormRules" ref="organizationForm" label-width="80px">
              <el-row>
                <el-col :span="11">
                  <el-form-item v-if="false" label="主键ID" :label-width="formLabelWidth" prop="id">
                    <el-input size="small" v-model="organizationForm.id"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="机构名称" :label-width="formLabelWidth" prop="organizationName">
                    <el-input size="small" v-model="organizationForm.organizationName" :maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="父机构编码" :label-width="formLabelWidth" prop="organizationParentNo">
                    <el-input size="small" v-model="organizationForm.organizationParentNo" :maxlength="32"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="排序码" :label-width="formLabelWidth" prop="organizationOrder">
                    <el-input size="small" v-model.number="organizationForm.organizationOrder" :maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="组织类型" :label-width="formLabelWidth" prop="organizationType">
                    <el-select size="small" placeholder="请选择" v-model="organizationForm.organizationType">
                      <el-option v-for="item in organizationTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="11">
                  <el-form-item label="组长" :label-width="formLabelWidth" prop="employeeId">
                    <el-select size="small" v-model="organizationForm.employeeId" filterable remote
                               placeholder="请搜索" :remote-method="searchEmployee" :loading="searchEmployeeIdLoading">
                      <el-option v-for="item in employeeList" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="机构描述" :label-width="formLabelWidth" prop="organizationDesc">
                    <el-input size="small" v-model="organizationForm.organizationDesc" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button round @click="closeOrganizationFormDialog">取 消</el-button>
              <el-button round v-if="organDialogStatus=='create'" type="primary" @click="addOrganizationSubmit">确 定</el-button>
              <el-button round v-else type="primary" @click="updateOrganizationSubmit">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" :before-close="closeDialog">
            <el-form :model="merchantEmployeeForm" :rules="merchantEmployeeFormRules" ref="merchantEmployeeForm" label-width="80px">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="组织机构" :label-width="formLabelWidth" prop="organizationList">
                      <el-cascader size="small" :maxlength="32" expand-trigger="hover" filterable change-on-select :options="organizationTree"
                                    v-model="merchantEmployeeForm.organizationList" :props="{ value: 'value' }">
                      </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="11" v-show="false">
                  <el-form-item label="组织机构code" :label-width="formLabelWidth" prop="organizationCode">
                    <el-input size="small" v-model="merchantEmployeeForm.organizationCode" :maxlength="32"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="姓名" :label-width="formLabelWidth" prop="employeeName">
                    <el-input size="small" v-model="merchantEmployeeForm.employeeName" :maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
                    <el-input size="small" v-model.number="merchantEmployeeForm.phone" :maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
                    <el-radio-group v-model="merchantEmployeeForm.gender">
                      <el-radio label="1">男</el-radio>
                      <el-radio label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="身份证号码" :label-width="formLabelWidth" prop="identityNo">
                    <el-input size="small" v-model="merchantEmployeeForm.identityNo" :maxlength="18"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="是否在职" :label-width="formLabelWidth" prop="inJob">
                    <el-radio-group v-model="merchantEmployeeForm.inJob">
                      <el-radio label="1">在职</el-radio>
                      <el-radio label="2">离职</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="家庭联系电话" :label-width="formLabelWidth" prop="familyPhone">
                    <el-input size="small" v-model.number="merchantEmployeeForm.familyPhone" :maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="岗位" :label-width="formLabelWidth" prop="postId">
                    <el-select size="small" v-model="merchantEmployeeForm.postId" placeholder="请选择">
                      <el-option v-for="item in postList"
                                 :key="item.postId"
                                 :label="item.postName"
                                 :value="item.postId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="选择设备" :label-width="formLabelWidth" prop="equipmentIdList">
                    <el-select size="small" v-model="merchantEmployeeForm.equipmentIdList" :multiple="multiple" clearable filterable remote
                               placeholder="请搜索"
                               :remote-method="searchEquipmentList" :loading="searchEquimentLoading">
                      <el-option v-for="item in merchantEquipmentList" :key="item.equipmentId" :label="item.equipmentName" :value="item.equipmentId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="入职日期" :label-width="formLabelWidth" prop="entryDate">
                    <el-date-picker size="small" v-model="merchantEmployeeForm.entryDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="离职日期" :label-width="formLabelWidth" prop="leaveDate">
                    <el-date-picker size="small" v-model="merchantEmployeeForm.leaveDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="备注" :label-width="formLabelWidth" prop="employeeDesc">
                    <el-input size="small" v-model="merchantEmployeeForm.employeeDesc" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button round @click="closeDialog">取 消</el-button>
              <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
              <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import { getMerchantEmployeeList, addEmployee, editEmployee, getMerchantPostList, queryEquipmentList, searchEmployee, searchEmployeeById } from '@/api/merchant/work/merchantEmployee'
  import { quryOrganizationListTree, addOrganization, editOrganization, delOrganization, quryOrganizaTionCode } from '@/api/merchant/work/organization'
  import { globalConfig } from '@/globalConfig'
  import { validator } from '@/utils/validate'
  import waves from '@/directive/waves/index.js'
  import MTree from 'components/tree/index.vue'
  import PanThumb from '@/components/PanThumb'
  import ElCol from 'element-ui/packages/col/src/col'
  import { getApplicationCode, getCurProjectCode } from '@/api/common'
  import menuList from '@/views/plat/layout/menuList'
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'
  import { mapGetters } from 'vuex'

  export default {
    name: 'tableMerchantEmployee',
    directives: {
      waves
    },
    components: { PanThumb, MTree, ElCol, menuList, SidebarMenu },
    data() {
      const Validator = (rule, value, callback) => {
        const validatorResult = validator(rule, value)
        if (!validatorResult.pass) {
          callback(new Error(validatorResult.msg))
        } else {
          callback()
        }
      }
      return {
        curApplicationCode: '',
        // 暂定测试值
        curProjectCode: getCurProjectCode(),
        Height: 0,
        hash: '',
        routesArray: [],
        menuTitleName: '',
        menuTitleIcon: '',
        checkList: [],
        postList: [],
        list: [],
        organizationTree: [],
        merchantEquipmentList: [],
        employeeList: [],
        total: 0,
        selectDesc: '',
        multiple: true,
        isOrgNameDisabled: true,
        organListLoading: true,
        searchEquimentLoading: false,
        searchEmployeeIdLoading: false,
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
          curApplicationCode: '',
          organizationCode: '',
          organizationName: '',
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        organDialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        organDialogFormVisible: false,
        formLabelWidth: '120px',
        merchantEmployeeForm: {
          id: '',
          organizationCode: '',
          postId: '',
          employeeId: '',
          employeeName: '',
          phone: '',
          avatar: '',
          gender: '',
          identityNo: '',
          inJob: '',
          entryDate: '',
          leaveDate: '',
          employeeDesc: '',
          familyPhone: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: '',
          organizationName: '',
          equipmentIdList: [],
          organizationList: []
        },
        organizationForm: {
          projectCode: '',
          organizationName: '',
          organizationParentNo: '',
          organizationOrder: '',
          organizationDesc: '',
          organizationCode: '',
          organizationType: '',
          employeeId: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        organizationFormRules: {
          organizationName: [{
            required: true,
            message: '请输入组织名称',
            trigger: 'blur'
          }],
          organizationType: [{
            required: true,
            message: '请选择组织类型',
            trigger: 'change'
          }],
          organizationOrder: [{
            required: true,
            trigger: 'blur',
            fieldName: '组织机构序号',
            fieldType: 'number',
            validator: Validator
          }]
        },
        organizationTypeMapArr: [
          {
            label: '人工',
            value: '00'
          }, {
            label: '机械',
            value: '01'
          }, {
            label: '混合',
            value: '02'
          }
        ],
        inJobStateMapArr: [
          {
            label: '是',
            value: '1'
          }, {
            label: '否',
            value: '2'
          }
        ],
        inJobStateMapObj: {
          '1': '在职',
          '2': '离职'
        },
        genderStateMapObj: {
          '1': '男',
          '2': '女'
        },
        // 表单校验规则
        merchantEmployeeFormRules: {
          postId: [{
            required: true,
            message: '请选择岗位',
            trigger: 'blur'
          }],
          organizationCode: [{
            required: true,
            message: '请输入组织机构',
            trigger: 'blur'
          }],
          employeeName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          phone: [{
            type: 'number',
            required: true,
            trigger: 'blur',
            fieldName: '手机号码',
            fieldType: 'number',
            validator: Validator
          }],
          gender: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }],
          identityNo: [{
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          }],
          inJob: [{
            required: true,
            message: '请输入是否在职',
            trigger: 'blur'
          }],
          familyPhone: [{
            type: 'number',
            required: true,
            trigger: 'blur',
            fieldName: '家庭联系电话',
            fieldType: 'number',
            validator: Validator
          }],
          organizationList: [{
            type: 'array',
            required: true,
            message: '请选择组织机构',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      TableHeight() {
        return (this.Height - 50)
      },
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      const Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.Height = Height
      this.curApplicationCode = getApplicationCode(this)
      this.permission_routers.forEach((item, index) => {
        if (item.code === this.curApplicationCode) {
          this.routesArray.push(item)
          this.menuTitleName = item.name
          this.menuTitleIcon = item.icon
        }
      })
      this.loadOrganTree()
      this.getMerchantEmployeeList()
      getMerchantPostList({ projectCode: this.curProjectCode, curApplicationCode: this.curApplicationCode }).then(response => {
        if (response.data.error_no === 0) {
          this.postList = response.data.result
        } else {
          this.$message(response.data.error_info)
        }
      })
    },
    methods: {
      loadOrganTree() {
        this.listLoading = true
        quryOrganizationListTree({ projectCode: this.curProjectCode, curApplicationCode: this.curApplicationCode }).then(response => {
          const responseData = response.data
          if (typeof responseData !== 'undefined' && responseData) {
            if (responseData.error_no === 0) {
              this.organizationTree = responseData.result
            } else {
              this.$notify({
                title: '错误',
                message: responseData.error_info,
                type: 'error',
                duration: 2000
              })
            }
          } else {
            this.$notify({
              title: '失败',
              message: '请求失败',
              type: 'error',
              duration: 2000
            })
          }
          this.listLoading = false
        })
      },
      handleNodeClick(nodeData) {
        // 阻止事件
        this.stopBubbling()
        this.resetOrgForm()
        if (typeof nodeData !== 'undefined' && nodeData) {
          this.organizationForm = Object.assign({}, nodeData)
          this.merchantEmployeeForm.organizationCode = nodeData.organizationCode
          this.merchantEmployeeForm.organizationName = nodeData.organizationName
          this.filterForm.organizationCode = nodeData.organizationCode
          this.filterForm.organizationName = nodeData.organizationName
          this.getMerchantEmployeeList()
        }
      },
      OpenEdit(parentNode, nodeData) {
        // 阻止事件
        this.stopBubbling()
        if (typeof nodeData !== 'undefined' && nodeData) {
          this.organizationForm.employeeId = nodeData.employeeId
          this.employeeList = []
          this.searchEmployeeIdLoading = true
          if (nodeData.employeeId) {
            searchEmployeeById({ projectCode: this.curProjectCode, employeeId: nodeData.employeeId, curApplicationCode: this.curApplicationCode }).then(response => {
              if (response.data.error_no === 0) {
                this.employeeList.push(response.data.result)
              }
            })
          }
          this.organDialogFormVisible = true
          this.organDialogStatus = 'update'
          this.organizationForm.id = nodeData.id
          this.organizationForm.organizationParentNo = nodeData.organizationParentNo
          this.organizationForm.projectCode = nodeData.projectCode
          this.organizationForm.organizationName = nodeData.organizationName
          this.organizationForm.organizationDesc = nodeData.organizationDesc
          this.organizationForm.organizationOrder = nodeData.organizationOrder
          this.organizationForm.organizationCode = nodeData.organizationCode
          this.organizationForm.organizationType = nodeData.organizationType
          this.searchEmployeeIdLoading = false
        } else {
          this.organDialogFormVisible = false
        }
      },
      DelNode(parentNode, data, next) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {}
          params.primaryKey = data.id
          delOrganization(params).then(response => {
            next(true)
            this.loadOrganTree()
          })
          this.loadOrganTree()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      Append(parentNode, nodeData) {
        // 阻止事件
        this.stopBubbling()
        this.resetOrgForm()
        this.organDialogFormVisible = true
        this.organDialogStatus = 'create'
        this.organizationForm.organizationParentNo = nodeData.organizationCode
        this.organizationForm.projectCode = this.curProjectCode
      },
      stopBubbling() {
        var e = window.event
        if (e.stopPropagation) {
          // 阻止事件 冒泡传播
          e.stopPropagation()
        } else {
          // ie兼容
          e.cancelBubble = true
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
      getMerchantEmployeeList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        this.filterForm.organizationCode = this.organizationForm.organizationCode
        this.filterForm.organizationName = this.organizationForm.organizationName
        this.filterForm.projectCode = this.curProjectCode
        getMerchantEmployeeList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantEmployee() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.projectCode = this.curProjectCode
        this.filterForm.current = globalConfig.startPage
        this.getMerchantEmployeeList()
      },
      addMerchantEmployee() {
        this.merchantEmployeeForm.organizationCode = this.filterForm.organizationCode
        this.merchantEmployeeForm.organizationName = this.filterForm.organizationName
        if (this.merchantEmployeeForm.organizationCode) {
          this.merchantEmployeeForm.projectCode = this.curProjectCode
          quryOrganizaTionCode(this.merchantEmployeeForm).then(response => {
            if (response.data.error_no === 0) {
              for (let i = 0; i < response.data.result.length; i++) {
                this.merchantEmployeeForm.organizationList.push(response.data.result[i])
              }
              this.dialogStatus = 'create'
              this.dialogFormVisible = true
            }
          })
        } else {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
        }
      },
      searchEquipmentList(keyword) {
        if (keyword) {
          this.searchEquimentLoading = true
          queryEquipmentList({ projectCode: this.curProjectCode, keyword: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
            if (response.data.error_no === 0) {
              this.merchantEquipmentList = response.data.result
            } else {
              this.$message(response.data.error_info)
            }
            this.searchEquimentLoading = false
          })
        } else {
          this.merchantEquipmentList = []
        }
      },
      modifyMerchantEmployee(row) {
        row.equipmentIdList = []
        row.organizationList = []
        this.merchantEmployeeForm = Object.assign({}, row)
        this.merchantEmployeeForm.organizationCode = row.organizationCode
        this.merchantEmployeeForm.projectCode = this.curProjectCode
        quryOrganizaTionCode(this.merchantEmployeeForm).then(response => {
          if (response.data.error_no === 0) {
            for (let i = 0; i < response.data.result.length; i++) {
              this.merchantEmployeeForm.organizationList.push(response.data.result[i])
            }
          }
        })
        for (let i = 0; i < row.equipmentList.length; i++) {
          this.merchantEmployeeForm.equipmentIdList.push(row.equipmentList[i].equipmentId)
          this.merchantEquipmentList.push(row.equipmentList[i])
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      pageSizeChange(val) {
        this.filterForm.current = globalConfig.startPage
        this.filterForm.pageSize = val
        this.getMerchantEmployeeList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantEmployeeList()
      },
      addSubmit() {
        this.merchantEmployeeForm.organizationCode = this.merchantEmployeeForm.organizationList[this.merchantEmployeeForm.organizationList.length - 1]
        this.$refs['merchantEmployeeForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantEmployeeForm.curApplicationCode = this.curApplicationCode
            this.organizationForm.projectCode = this.curProjectCode
            addEmployee(this.merchantEmployeeForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantEmployee()
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
        this.merchantEmployeeForm.curApplicationCode = this.curApplicationCode
        this.merchantEmployeeForm.organizationCode = this.merchantEmployeeForm.organizationList[this.merchantEmployeeForm.organizationList.length - 1]
        this.$refs['merchantEmployeeForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editEmployee(this.merchantEmployeeForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantEmployee()
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
      addOrganizationSubmit() {
        this.$refs['organizationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.organizationForm.curApplicationCode = this.curApplicationCode
            this.organizationForm.projectCode = this.curProjectCode
            addOrganization(this.organizationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeOrganizationFormDialog()
                this.loadOrganTree()
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
      updateOrganizationSubmit() {
        this.$refs['organizationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.organizationForm.curApplicationCode = this.curApplicationCode
            editOrganization(this.organizationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeOrganizationFormDialog()
                this.loadOrganTree()
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
      resetSearch() {
        this.filterForm = {
          id: '',
          organizationCode: '',
          organizationName: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetOrgForm() {
        this.organizationForm = {
          projectCode: '',
          organizationName: '',
          organizationParentNo: '',
          organizationOrder: '',
          organizationDesc: '',
          organizationCode: '',
          organizationType: '',
          employeeList: []
        }
        if (this.$refs['organizationForm'] !== undefined) {
          this.$refs['organizationForm'].resetFields()
        }
      },
      resetForm() {
        this.merchantEmployeeForm = {
          id: '',
          postId: '',
          employeeId: '',
          employeeName: '',
          phone: '',
          avatar: '',
          gender: '',
          identityNo: '',
          inJob: '',
          entryDate: '',
          leaveDate: '',
          employeeDesc: '',
          familyPhone: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: '',
          equipmentIdList: [],
          organizationList: []
        }
        if (this.$refs['merchantEmployeeForm'] !== undefined) {
          this.$refs['merchantEmployeeForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '组织机构内码',
            '岗位ID',
            '员工ID',
            '姓名',
            '联系电话',
            '头像',
            '性别',
            '身份证号码',
            '是否在职',
            '入职日期',
            '离职日期',
            '备注',
            '家庭联系电话',
            '创建人',
            '创建日期',
            '修改人',
            '修改日期'
          ]
          const filterVal = [
            'id',
            'organizationCode',
            'postId',
            'employeeId',
            'employeeName',
            'phone',
            'avatar',
            'gender',
            'identityNo',
            'inJob',
            'entryDate',
            'leaveDate',
            'employeeDesc',
            'familyPhone',
            'createBy',
            'createDate',
            'modifyBy',
            'modifyDate'
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
      handleAvatarSuccess(res, file) {   // 图片上传成功调用
        this.merchantEmployeeForm.avatar = URL.createObjectURL(file.raw)
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
      closeOrganizationFormDialog() {
        this.organDialogFormVisible = false
        this.resetOrgForm()
      }
    }
  }
</script>

<style>
  .menuwrap .el-tree.filter-tree.el-tree--highlight-current {
    border: 1px solid rgb(209, 219, 229)!important;
    height: 662px!important;
    border-radius: 4px!important;
  }
  .el-date-editor.el-input {
    width: 100%;
    min-width: inherit;
  }
</style>
<style  src="@/styles/merchant.scss" rel="stylesheet/scss" lang="scss"></style>
