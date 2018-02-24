<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-form :model="filterForm" ref="filterForm">
      <el-row>
        <el-col :span="4">
          <el-form-item label=" " :label-width="filterFormLabelWidth" prop="resource_url">
            <el-input @keyup.enter.native="searchRes" size="small" class="filter-item" placeholder="资源路径" v-model="filterForm.resource_url">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label=" " :label-width="filterFormLabelWidth" prop="resource_name">
            <el-input @keyup.enter.native="searchRes" size="small" class="filter-item" placeholder="资源名称" v-model="filterForm.resource_name">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label=" " :label-width="filterFormLabelWidth" prop="type">
            <el-select @keyup.enter.native="searchRes" size="small" class="filter-item" clearable placeholder="请选择资源类型" v-model="filterForm.type">
              <el-option v-for="item in resTypeMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label=" " :label-width="filterFormLabelWidth" prop="state">
            <el-select @keyup.enter.native="searchRes" size="small" class="filter-item" clearable placeholder="请选择是否有效" v-model="filterForm.state">
              <el-option v-for="item in stateMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="button-group">
        <el-button type="primary" icon="el-icon-search" @click="searchRes" v-waves>搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="addRes">添加</el-button>
      </el-row>
    </el-form>
  </div>

  <el-table :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column type="index" width="62"></el-table-column>
    <el-table-column align="center" label="ID" width="80" prop='id' sortable>
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="资源名称" width="150" prop='resource_name' sortable :show-overflow-tooltip='true'>
      <template slot-scope="scope">
        <span>{{scope.row.resource_name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="父节点" width="80">
      <template slot-scope="scope">
        <span>{{scope.row.parent_id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="类型" width="80">
      <template slot-scope="scope">
        <span>{{resTypeMapObj[scope.row.type]}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="left" label="资源地址" min-width='250' :show-overflow-tooltip='true'>
      <template slot-scope="scope">
        <span>{{scope.row.resource_url}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="是否有效" width="100">
      <template slot-scope="scope">
        <span>{{stateMapObj[scope.row.state]}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="排序值" width="80">
      <template slot-scope="scope">
        <span>{{scope.row.sort_value}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="left" label="描述" min-width='250' :show-overflow-tooltip='true'>
      <template slot-scope="scope">
        <span>{{scope.row.description}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="创建时间" width="170" prop='create_date' sortable>
      <template slot-scope="scope">
        <span>{{scope.row.create_date}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="创建人" width="100">
      <template slot-scope="scope">
        <span>{{scope.row.create_by}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed='right'>
      <template slot-scope="scope">
        <el-button size="small" type="success" @click="modifyRes(scope.row,'update')">修改
        </el-button>
        <el-button size="small" type="danger" @click="deleteRes(scope.row,'delete')">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.page" :page-sizes="pageSize" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>

  <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="resForm" :rules="resFormRules" ref="resForm" label-width="80px">
      <el-row>
        <el-col :span="11">
          <el-form-item v-if="dialogStatus=='update'" label="ID" :label-width="resFormLabelWidth" prop="id">
            <el-input size="small" v-model="resForm.id" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="资源名称" :label-width="resFormLabelWidth" prop="resource_name">
            <el-input size="small" v-model="resForm.resource_name" :maxlength="30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="资源地址" :label-width="resFormLabelWidth" prop="resource_url">
            <el-input size="small" v-model="resForm.resource_url" :maxlength="48"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="父节点" :label-width="resFormLabelWidth" prop="parent_id">
            <el-input size="small" v-model.number="resForm.parent_id" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="类型" :label-width="resFormLabelWidth" prop="type">
            <el-select size="small" v-model="resForm.type" clearable placeholder="请选择">
              <el-option v-for="item in resTypeMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否有效" :label-width="resFormLabelWidth" prop="state">
            <el-select size="small" v-model="resForm.state" clearable placeholder="请选择">
              <el-option v-for="item in stateMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="排序值" :label-width="resFormLabelWidth" prop="sort_value">
            <el-input size="small" v-model="resForm.sort_value" :maxlength="10"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="描述" :label-width="resFormLabelWidth" prop="description">
            <el-input size="small" v-model="resForm.description" :maxlength="200" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
      <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getSysResourceList
} from '@/api/plat/system'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  name: 'table_res',
  directives: {
    waves
  },
  data() {
    return {
      listLoading: true,
      stateMapObj: {},
      stateMapArr: [],
      resTypeMapObj: {},
      resTypeMapArr: [],
      list: [],
      total: null,
      tableKey: 0,
      flsTimer: '',
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '12px',
      filterForm: {
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize,
        resource_name: '',
        resource_url: '',
        type: '',
        state: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      resFormLabelWidth: '120px',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      resForm: {
        id: '',
        resource_name: '',
        resource_url: '',
        parent_id: '',
        type: '',
        state: '',
        sort_value: '',
        description: ''
      },
      // 表单校验规则
      resFormRules: {
        resource_name: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        }],
        resource_url: [{
          required: true,
          message: '请输入资源地址',
          trigger: 'blur'
        }],
        parent_id: [{
          required: true,
          message: '请输入父节点'
        }, {
          type: 'number',
          message: '节点必须为数字值'
        }],
        type: [{
          required: true,
          message: '请选择资源类型',
          trigger: 'blur'
        }],
        state: [{
          required: true,
          message: '请选择资源是否有效',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    const dictMap = JSON.parse(sessionStorage.getItem('EDENEP_SYSTEM_DICTS'))
    if (typeof dictMap !== undefined && dictMap) {
      const tempResType = {}
      const tempState = {}
      this.resTypeMapArr = dictMap.ZD_ZYLX
      this.stateMapArr = dictMap.ZD_SFYX
      dictMap.ZD_ZYLX.forEach(function(item) {
        tempResType[item.enumValue] = item.enumName
      })
      dictMap.ZD_SFYX.forEach(function(item) {
        tempState[item.enumValue] = item.enumName
      })
      this.resTypeMapObj = tempResType
      this.stateMapObj = tempState
    }
    // 初始化加载数据
    this.getResList()
  },
  methods: {
    getResList() {
      this.listLoading = true
      getSysResourceList(this.filterForm).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    searchRes() {
      this.$refs['filterForm'].validate((valid) => {
        if (valid) {
          this.filterForm.page = globalConfig.startPage
          this.getResList()
          this.$notify({
            title: '成功',
            message: '查询成功',
            type: 'success',
            duration: 2000
          })
        } else {
          return false
        }
      })
    },
    addRes() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyRes(row) {
      this.resForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteRes(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    pageSizeChange(val) {
      this.filterForm.limit = val
      this.getResList()
    },
    currentPageChange(val) {
      this.filterForm.page = val
      this.getResList()
    },
    addSubmit() {
      this.$refs['resForm'].validate((valid) => {
        if (valid) {
          this.resForm.id = parseInt(Math.random() * 100) + 1024
          this.resForm.create_date = +new Date()
          this.list.unshift(this.resForm)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          return false
        }
      })
    },
    updateSubmit() {
      this.$refs['resForm'].validate((valid) => {
        if (valid) {
          for (const v of this.list) {
            if (v.id === this.resForm.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.resForm)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.resForm = {
        id: '',
        resource_name: '',
        resource_url: '',
        parent_id: '',
        type: '',
        state: '',
        sort_value: '',
        description: ''
      }
      if (this.$refs['resForm'] !== undefined) {
        this.$refs['resForm'].resetFields()
      }
    }
  }
}
</script>
