<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="8">
              <el-form-item label="厂商名称" :label-width="filterFormLabelWidth" prop="mfrsName" class="form-bottom">
                <el-input @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" placeholder="厂商名称" v-model="filterForm.mfrsName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名" :label-width="filterFormLabelWidth" prop="mfrsEname" class="form-bottom">
                <el-input @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" placeholder="英文名" v-model="filterForm.mfrsEname">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人" :label-width="filterFormLabelWidth" prop="mfrsContactPerson" class="form-bottom">
                <el-input @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" placeholder="联系人" v-model="filterForm.mfrsContactPerson">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系电话" :label-width="filterFormLabelWidth" prop="mfrsContactTel" class="form-bottom">
                <el-input @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" placeholder="联系电话" v-model="filterForm.mfrsContactTel">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系邮箱" :label-width="filterFormLabelWidth" prop="mfrsContactEmail" class="form-bottom">
                <el-input @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" placeholder="联系邮箱" v-model="filterForm.mfrsContactEmail">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchEquipmentMfrs" v-waves>搜索</el-button>
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
            <el-select @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchEquipmentMfrs" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchEquipmentMfrs" v-waves>搜索</el-button>
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
            <el-form-item label="厂商名称">
              <span>{{ scope.row.mfrsName }}</span>
            </el-form-item>
            <el-form-item label="厂商英文名">
              <span>{{ scope.row.mfrsEname }}</span>
            </el-form-item>
            <el-form-item label="联系人">
              <span>{{ scope.row.mfrsContactPerson }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ scope.row.mfrsContactTel }}</span>
            </el-form-item>
            <el-form-item label="联系邮箱">
              <span>{{ scope.row.mfrsContactEmail }}</span>
            </el-form-item>
            <el-form-item label="厂商网站">
              <span>{{ scope.row.mfrsSite }}</span>
            </el-form-item>
            <el-form-item label="主要业务及产品">
              <span>{{ scope.row.mfrsMainProducts }}</span>
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
            <el-form-item label="厂商地址">
              <span>{{ scope.row.mfrsAddress }}</span>
            </el-form-item>
            <el-form-item label="厂商描述">
              <span>{{ scope.row.mfrsDesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="62"></el-table-column>
      <el-table-column header-align="center" align="center" label="" prop='id' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="厂商名称"  prop='mfrsName' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="英文名" prop='mfrsEname' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsEname}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="厂商地址" prop='mfrsAddress' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="联系人" prop='mfrsContactPerson' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsContactPerson}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="联系电话" prop='mfrsContactTel'  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsContactTel}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="联系邮箱" prop='mfrsContactEmail' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsContactEmail}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="厂商网站" prop='mfrsSite' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsSite}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="主要业务及产品"  prop='mfrsMainProducts' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsMainProducts}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="厂商描述"  v-if=false prop='mfrsDesc' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.mfrsDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建时间"  v-if=false prop='createDate'  :show-overflow-tooltip='true'  sortable>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建人"  v-if=false prop='createBy' :show-overflow-tooltip='true' >
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="修改时间"  v-if=false prop='updateDate' :show-overflow-tooltip='true' >
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="修改人"  v-if=false prop='updateBy' :show-overflow-tooltip='true' >
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyEquipmentMfrs(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteEquipmentMfrs(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addEquipmentMfrs">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close='closeDialog' >
      <el-form :model="equipmentMfrsForm" :rules="equipmentMfrsFormRules" ref="equipmentMfrsForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-show="false" label="" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="equipmentMfrsForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="厂商名称" :label-width="formLabelWidth" prop="mfrsName">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsName" :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="厂商英文名" :label-width="formLabelWidth" prop="mfrsEname">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsEname" :maxlength="60"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系人" :label-width="formLabelWidth" prop="mfrsContactPerson">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsContactPerson" :maxlength="60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="厂商网站" :label-width="formLabelWidth" prop="mfrsSite">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsSite" :maxlength="60"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="联系电话" :label-width="formLabelWidth" prop="mfrsContactTel">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsContactTel" :maxlength="15"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系邮箱" :label-width="formLabelWidth" prop="mfrsContactEmail">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsContactEmail" :maxlength="60"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="厂商地址" :label-width="formLabelWidth" prop="mfrsAddress">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsAddress" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="厂商主要业务及产品" :label-width="formLabelWidth" prop="mfrsMainProducts">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsMainProducts" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="厂商描述" :label-width="formLabelWidth" prop="mfrsDesc">
              <el-input size="small" v-model="equipmentMfrsForm.mfrsDesc" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
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
    getEquipmentMfrsList,
    addEquipmentMfrs,
    editEquipmentMfrs,
    delEquipmentMfrs,
    delBatchEquipmentMfrs
  } from '@/api/manager/collect/equipmentMfrs'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import {
    validator
  } from '@/utils/validate'
  export default {
    name: 'tableEquipmentMfrs',
    directives: {
      waves
    },
    components: {
      ImageCropper,
      PanThumb
    },
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
        list: [],
        searchOptions: [{
          value: 'mfrsName',
          label: '厂商名称'
        },
        {
          value: 'mfrsEname',
          label: '英文名'
        },
        {
          value: 'mfrsAddress',
          label: '厂商地址'
        },
        {
          value: 'mfrsContactPerson',
          label: '联系人'
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
          mfrsName: '',
          mfrsEname: '',
          mfrsAddress: '',
          mfrsContactPerson: '',
          mfrsContactTel: '',
          mfrsContactEmail: '',
          mfrsSite: '',
          mfrsMainProducts: '',
          mfrsDesc: '',
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
        equipmentMfrsForm: {
          id: '',
          mfrsName: '',
          mfrsEname: '',
          mfrsAddress: '',
          mfrsContactPerson: '',
          mfrsContactTel: '',
          mfrsContactEmail: '',
          mfrsSite: '',
          mfrsMainProducts: '',
          mfrsDesc: '',
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
        equipmentMfrsFormRules: {
          mfrsName: [{
            required: true,
            message: '请输入厂商名称',
            trigger: 'blur'
          }],
          mfrsEname: [{
            required: true,
            message: '请输入英文名',
            trigger: 'blur'
          }],
          mfrsAddress: [{
            required: true,
            message: '请输入厂商地址',
            trigger: 'blur'
          }],
          mfrsContactPerson: [{
            required: true,
            message: '请输入联系人',
            trigger: 'blur'
          }],
          mfrsContactTel: [{
            required: true,
            trigger: 'blur',
            fieldName: '联系电话',
            fieldType: 'tel||mobile',
            validator: Validator
          }],
          mfrsContactEmail: [{
            required: true,
            trigger: 'blur',
            fieldName: '联系邮箱',
            fieldType: 'email',
            validator: Validator
          }],
          mfrsSite: [{
            required: true,
            message: '请输入厂商网站',
            trigger: 'blur'
          }],
          mfrsMainProducts: [{
            required: true,
            message: '请输入厂商主要业务及产品',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {},
    created() {
      this.getEquipmentMfrsList()
    },
    methods: {
      closeDialog() {
        this.dialogFormVisible = false
        if (this.$refs['equipmentMfrsForm'] !== undefined) {
          this.$refs['equipmentMfrsForm'].resetFields()
        }
      },
      getEquipmentMfrsList() {
        this.listLoading = true
        getEquipmentMfrsList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchEquipmentMfrs() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getEquipmentMfrsList()
      },
      addEquipmentMfrs() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyEquipmentMfrs(row) {
        this.equipmentMfrsForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteEquipmentMfrs(row) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            primaryKey: row.id
          }
          this.listLoading = true
          delEquipmentMfrs(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getEquipmentMfrsList()
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
          delBatchEquipmentMfrs(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getEquipmentMfrsList()
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
        this.getEquipmentMfrsList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getEquipmentMfrsList()
      },
      addSubmit() {
        this.$refs['equipmentMfrsForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addEquipmentMfrs(this.equipmentMfrsForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getEquipmentMfrsList()
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
        this.$refs['equipmentMfrsForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editEquipmentMfrs(this.equipmentMfrsForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getEquipmentMfrsList()
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
          mfrsName: '',
          mfrsEname: '',
          mfrsAddress: '',
          mfrsContactPerson: '',
          mfrsContactTel: '',
          mfrsContactEmail: '',
          mfrsSite: '',
          mfrsMainProducts: '',
          mfrsDesc: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.equipmentMfrsForm = {
          id: '',
          mfrsName: '',
          mfrsEname: '',
          mfrsAddress: '',
          mfrsContactPerson: '',
          mfrsContactTel: '',
          mfrsContactEmail: '',
          mfrsSite: '',
          mfrsMainProducts: '',
          mfrsDesc: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: ''
        }
        if (this.$refs['equipmentMfrsForm'] !== undefined) {
          this.$refs['equipmentMfrsForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('vendor/Export2Excel')
          const tHeader = [
            '',
            '厂商名称',
            '英文名',
            '厂商地址',
            '联系人',
            '联系电话',
            '联系邮箱',
            '厂商网站',
            '厂商主要业务及产品',
            '厂商描述',
            '创建时间',
            '创建人',
            '修改时间',
            '修改人'
          ]
          const filterVal = [
            'id',
            'mfrsName',
            'mfrsEname',
            'mfrsAddress',
            'mfrsContactPerson',
            'mfrsContactTel',
            'mfrsContactEmail',
            'mfrsSite',
            'mfrsMainProducts',
            'mfrsDesc',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '设备厂商')
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
