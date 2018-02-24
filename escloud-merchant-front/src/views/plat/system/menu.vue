<template>
  <div class="app-container calendar-list-container menuwrap">
    <el-row>
      <el-col :span="5">
        <m-tree v-model='menuTree' @NodeClick="handleNodeClick" @OpenEdit="OpenEdit" @DelNode="DelNode" @Append="Append" ref='MTree' :tableTree='menuTree' width='200px'>
        </m-tree>
      </el-col>
      <el-col :span="19">
        <div style="color:#1f2d3d; padding-left: 20px; line-height: 29px;">
          菜单管理
        </div>
        <!--<div style=" height: 360px; border-bottom: 1px solid #d1dbe5; border-top: 1px solid #d1dbe5; border-right: 1px solid #d1dbe5; padding: 20px;"  v-loading="listLoading" element-loading-text="给我一点时间">-->
        <div style=" height: 360px; box-shadow: 0 0 0.06rem rgba(117, 208, 255, 0.6); margin: 20px; padding: 15px 20px 20px;"  v-loading="listLoading" element-loading-text="给我一点时间">
          <div v-show=dialogVisible>
            <el-form :model="menuForm" :rules="menuFormRules" ref="menuForm" label-width="80px">
              <div>
                <el-row v-show='false'>
                  <el-col :span="11">
                    <el-form-item label="所属应用编码" :label-width="formLabelWidth" prop="applicationCode">
                      <el-input size="small" v-model="menuForm.applicationCode" :maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="父节点编号" :label-width="formLabelWidth" prop="menuParentNo">
                      <el-input size="small" v-model="menuForm.menuParentNo" :maxlength="32" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                      <el-input size="small" v-model="menuForm.menuName" :maxlength="20" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="菜单路由" :label-width="formLabelWidth" prop="menuUrl">
                      <el-input size="small" v-model="menuForm.menuUrl" :maxlength="50" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" >
                    <el-form-item label="排序值" :label-width="formLabelWidth" prop="menuOrder">
                      <el-input size="small" v-model="menuForm.menuOrder" :maxlength="11" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" >
                    <el-form-item label="资源类型" :label-width="formLabelWidth" prop="resType">
                      <el-select size="small" v-model="menuForm.resType" clearable :readonly='dialogStatus=="detail"'
                                 placeholder="请输入">
                        <el-option v-for="item in resTypeMapArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>

                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="接口路径" :label-width="formLabelWidth" prop="menuServerPath">
                      <el-input size="small" v-model="menuForm.menuServerPath" :maxlength="50" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="文件路径" :label-width="formLabelWidth" prop="menuFilePath">
                      <el-input size="small" v-model="menuForm.menuFilePath" :maxlength="50" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="图标类" :label-width="formLabelWidth" prop="menuIcon">
                      <el-input size="small" v-model="menuForm.menuIcon" :maxlength="50" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="图像" prop="menuIcon">
                      <i v-bind:class="menuForm.menuIcon"></i>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="菜单描述" :label-width="formLabelWidth" prop="menuDesc">
                      <el-input size="small" v-model="menuForm.menuDesc" :maxlength="100" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容" :readonly='dialogStatus=="detail"'></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-show='false'>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="自增ID" :label-width="formLabelWidth" prop="id">
                      <el-input size="small" v-model="menuForm.id" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="菜单编号" :label-width="formLabelWidth" prop="menuNo">
                      <el-input size="small" v-model="menuForm.menuNo" :maxlength="32"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <div style="text-align: left" v-if='dialogStatus!=="detail"'>
              <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
              <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
            </div>
          </div>
          <image-cropper :width="300" :height="300" field="multipartFile" url="http://192.168.0.106:8081/edenep/plat/image/upload" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>
        </div>

        <!--<div  v-if="dialogStatus==='detail'" style="height: 280px;color:#1f2d3d; border-bottom: 1px solid #d1dbe5; border-right: 1px solid #d1dbe5; line-height: 29px;overflow-y: auto;">-->
        <div  v-if="dialogStatus==='detail'" style="height: 280px; margin: 20px; padding: 20px; line-height: 29px;overflow-y: auto;  box-shadow: 0 0 0.06rem rgba(117, 208, 255, 0.6);">
          <el-table  ref="multipleTable" :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="buttonListLoading" element-loading-text="给我一点时间"
                    style="width: 100% ;" >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="62"></el-table-column>
            <el-table-column header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="按钮编号"  v-if=false  prop='btnNo'  :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.btnNo}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="名称" prop='btnName'  :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.btnName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="菜单编码"  v-if=false prop='menuNo'  :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.menuNo}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="菜单名称" prop='menuName'  :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{menuForm.menuName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="请求地址" prop='btnUrl' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.btnUrl}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="创建人" prop='createBy' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.createBy}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'  :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.createDate}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="修改人" prop='modifyBy' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.modifyBy}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="修改时间" prop='modifyDate' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.modifyDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240" fixed='right'>
              <template slot-scope="scope">
                <el-button round size="small" type="text" @click="modifyButton(scope.row,'update')">修改
                </el-button>
                <el-button round size="small" type="text" @click="deleteButton(scope.row,'delete')">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="!buttonListLoading" class="pagination-container" style="margin-bottom: 0px">
            <el-row>
              <el-col :span="12">
                <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addButton">添加</el-button>
                <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteAll">批量删除</el-button>
              </el-col>
              <el-col :span="12">
                <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog center class="create_dialog" :title="textMap[buttonDialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
      <el-form :model="buttonForm" :rules="buttonFormRules" ref="buttonForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-if="buttonDialogStatus=='update'" label="主键ID" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="buttonForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="btnName">
              <el-input size="small" v-model="buttonForm.btnName" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="菜单编码" :label-width="formLabelWidth" prop="menuNo">
              <el-input size="small" v-model="buttonForm.menuNo" :maxlength="32"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="请求地址" :label-width="formLabelWidth" prop="btnUrl">
              <el-input size="small" v-model="buttonForm.btnUrl" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="closeDialog">取 消</el-button>
        <el-button round v-if="buttonDialogStatus=='create'" type="primary" @click="addButtonSubmit">确 定</el-button>
        <el-button round v-else type="primary" @click="updateButtonSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMenuTree,
  addMenu,
  editMenu,
  delMenu
} from '@/api/plat/menu'
import {
  getButtonList,
  addButton,
  editButton,
  delButton,
  delAllButton
} from '@/api/plat/button'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import MTree from 'components/tree/index.vue'
import {
  validator
} from '@/utils/validate'
import ElCol from 'element-ui/packages/col/src/col'
export default {
  directives: {
    waves
  },
  components: {
    ElCol,
    ImageCropper,
    PanThumb,
    MTree
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
      total: 0,
      selectDesc: '',
      buttonListLoading: true,
      proSearch: false,
      downloadLoading: false,
      isBatch: true,
      buttonImagecropperShow: false,
      buttonImagecropperKey: 0,
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      resTypeMapObj: {
        '0': '平台资源',
        '1': '商户资源',
        '2': '项目资源'
      },
      resTypeMapArr: [
        {
          label: '平台资源',
          value: '0'
        }, {
          label: '商户资源',
          value: '1'
        }, {
          label: '项目资源',
          value: '2'
        }
      ],
      filterForm: {
        id: '',
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
        createBy: '',
        createDate: [],
        modifyBy: '',
        modifyDate: [],
        current: globalConfig.startPage,
        pageSize: 5
      },
      buttonDialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      buttonForm: {
        id: '',
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: '',
        resType: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      buttonFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入主键ID',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '主键ID必须为数字值'
        }],
        btnName: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        menuNo: [{
          required: true,
          message: '请输入菜单编码',
          trigger: 'blur'
        }],
        btnUrl: [{
          required: true,
          message: '请输入请求地址',
          trigger: 'blur'
        }]
      },
      menuTree: [],
      listLoading: true,
      imagecropperShow: false,
      imagecropperKey: 0,
      dialogStatus: '',
      dialogVisible: false,
      formLabelWidth: '120px',
      menuForm: {
        id: '',
        menuNo: '',
        menuName: '',
        menuDesc: '',
        applicationCode: '',
        menuParentNo: '',
        menuServerPath: '',
        menuOrder: '',
        menuUrl: '',
        menuIcon: '',
        menuFilePath: '',
        resType: ''
      },
      // 表单校验规则
      menuFormRules: {
        menuName: [{
          required: true,
          trigger: 'blur',
          fieldName: '菜单名称',
          fieldType: 'string',
          min: 4,
          max: 8,
          validator: Validator
        }],
        resType: [{
          required: true,
          message: '请选择资源类型',
          trigger: 'blur'
        }],
        applicationCode: [{
          required: true,
          message: '请输入所属模块编码',
          trigger: 'blur'
        }],
        menuUrl: [{
          required: true,
          message: '请输入路由',
          trigger: 'blur'
        }],
        menuServerPath: [{
          required: true,
          message: '请输入接口路径',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.loadMenuTree()
  },
  methods: {
    getButtonList() {
      this.buttonListLoading = true
      this.filterForm.menuNo = this.menuForm.menuNo
      getButtonList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.buttonListLoading = false
      })
    },
    loadMenuTree() {
      this.listLoading = true
      getMenuTree().then(response => {
        const responseData = response.data
        if (typeof responseData !== 'undefined' && responseData) {
          if (responseData.error_no === 0) {
            this.menuTree = responseData.result
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
      this.resetForm()
      if (typeof nodeData !== 'undefined' && nodeData) {
        this.dialogVisible = true
        this.dialogStatus = 'detail'
        this.menuForm = Object.assign({}, nodeData)
        this.getButtonList()
      } else {
        this.dialogVisible = false
      }
    },
    OpenEdit(parentNode, nodeData) {
      // 阻止事件
      this.stopBubbling()
      if (typeof nodeData !== 'undefined' && nodeData) {
        this.resetForm()
        this.dialogVisible = true
        this.dialogStatus = 'update'
        this.menuForm.id = nodeData.id
        this.menuForm.menuNo = nodeData.menuNo
        this.menuForm.resType = nodeData.resType
        this.menuForm.menuDesc = nodeData.menuDesc
        this.menuForm.applicationCode = nodeData.applicationCode
        this.menuForm.menuOrder = nodeData.menuOrder
        this.menuForm.menuParentNo = nodeData.menuParentNo
        this.menuForm.menuUrl = nodeData.menuUrl
        this.menuForm.menuServerPath = nodeData.menuServerPath
        this.menuForm.menuIcon = nodeData.menuIcon
        this.menuForm.menuName = nodeData.menuName
        this.menuForm.menuFilePath = nodeData.menuFilePath
      } else {
        this.dialogVisible = false
      }
    },
    DelNode(parentNode, data, next) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {}
        params.menuId = data.id
        delMenu(params).then(response => {
          next(true)
          this.loadMenuTree()
        })
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
      this.resetForm()
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.menuForm.menuParentNo = nodeData.menuNo
      this.menuForm.applicationCode = nodeData.applicationCode
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
    addSubmit() {
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMenu(this.menuForm).then(response => {
            if (response.data.error_no === 0) {
              this.loadMenuTree()
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
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
      this.$refs['menuForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMenu(this.menuForm).then(response => {
            if (response.data.error_no === 0) {
              this.loadMenuTree()
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
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
    resetForm() {
      this.menuForm = {
        id: '',
        menuNo: '',
        menuName: '',
        menuDesc: '',
        resType: '',
        applicationCode: '',
        menuParentNo: '',
        menuOrder: '',
        menuUrl: '',
        menuIcon: '',
        menuFilePath: ''
      }
      if (this.$refs['menuForm'] !== undefined) {
        this.$refs['menuForm'].resetFields()
      }
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.menuForm.menuIcon = resData.result.path
    },
    close() {
      this.imagecropperShow = false
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.resetButtonForm()
    },
    addButton() {
      this.buttonDialogStatus = 'create'
      this.dialogFormVisible = true
      this.buttonForm.menuNo = this.menuForm.menuNo
    },
    modifyButton(row) {
      this.buttonForm.id = row.id
      this.buttonForm.btnNo = row.btnNo
      this.buttonForm.btnName = row.btnName
      this.buttonForm.menuNo = row.menuNo
      this.buttonForm.btnUrl = row.btnUrl
      this.buttonDialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateButtonSubmit() {
      this.$refs['buttonForm'].validate((valid) => {
        if (valid) {
          this.buttonListLoading = true
          this.buttonForm.resType = this.menuForm.resType
          editButton(this.buttonForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.getButtonList()
            } else {
              this.$message(response.data.error_info)
            }
            this.buttonListLoading = false
          })
        } else {
          return false
        }
      })
    },
    deleteButton(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: row.id
        }
        this.buttonListLoading = true
        delButton(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getButtonList()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.buttonListLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteAll() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        for (var i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
        }
        const param = {
          primaryKeys: selectIds
        }
        this.buttonListLoading = true
        delAllButton(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getButtonList()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.buttonListLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addButtonSubmit() {
      this.$refs['buttonForm'].validate((valid) => {
        if (valid) {
          this.buttonListLoading = true
          this.buttonForm.resType = this.menuForm.resType
          addButton(this.buttonForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.getButtonList()
            } else {
              this.$message(response.data.error_info)
            }
            this.buttonListLoading = false
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
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getButtonList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getButtonList()
    },
    resetButtonForm() {
      this.buttonForm = {
        id: '',
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: '',
        resType: ''
      }
      if (this.$refs['buttonForm'] !== undefined) {
        this.$refs['buttonForm'].resetFields()
      }
    }
  }
}
</script>
<style>
  .menuwrap .el-tree.filter-tree.el-tree--highlight-current {
    border: 1px solid rgb(209, 219, 229)!important;
    height: 669px!important;
    border-radius: 4px!important;
  }
</style>
