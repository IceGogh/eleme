<template>
  <div class="main-contain-new clearfix">
    <!-- 菜单导航-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addProject">添加项目</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchProject"/>
          <i class="el-icon-search" @click="searchProject"></i>
        </div>
      </div>

      <template>
        <div>
          <div class="app-container calendar-list-container">

            <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}"
                      @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
              <el-table-column v-if="false" type="selection" width="50"></el-table-column>
              <el-table-column header-align="center" width="50" align="center" label="ID" prop='id'>
                <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" width="150" align="center" label="名称" prop='projectName'>
                <template slot-scope="scope">
                  <a href="javascript:;" @click="jumpToProjectIndex(scope.row.projectCode)" title="点击进入项目工作台">{{scope.row.projectName}}</a>
                </template>
              </el-table-column>
              <el-table-column header-align="center" width="80" align="center" label="金额" prop='amount'>
                <template slot-scope="scope">
                  <span>{{scope.row.amount}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="地址" prop='addressList'>
                <template slot-scope="scope">
                  <span v-if="scope.row.addressDTOList" v-for="item in scope.row.addressDTOList">{{renderAddressInfo(item)}}<br></span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="描述" prop='description'>
                <template slot-scope="scope">
                  <span>{{scope.row.description}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'>
                <template slot-scope="scope">
                  <span>{{scope.row.createDate}}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="manageProjectAddress(scope.row.projectCode)">地址配置
                  </el-button>|
                  <el-button size="small" type="text" @click="modifyProject(scope.row,'update')">修改
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-show="!listLoading" class="pagination-container">
              <el-row>
                <el-col :span="17" :offset="7">
                  <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>

            <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close='closeDialog' >
              <el-form :model="projectForm" ref="projectForm" label-width="80px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="项目名称" :label-width="formLabelWidth" prop="projectName" :rules="[
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                      ]">
                      <el-input v-model="projectForm.projectName" :maxlength="40"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="项目LOGO" :label-width="formLabelWidth" prop="logo" :rules="[
                        { required: true, message: '请上传Logo', trigger: 'blur' },
                      ]">
                      <el-upload
                        class="avatar-uploader"
                        :action="logoUploadUrl"
                        :show-file-list="false"
                        :on-success="handleUploadLogoSuccess"
                        :before-upload="beforeLogoUpload">
                        <img v-if="projectForm.logo" :src="projectForm.logo" class="avatar">
                        <i v-else class="el-icon-plus
                        avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="项目金额" :label-width="formLabelWidth" prop="amount">
                      <el-input-number v-model="projectForm.amount" controls-position="right" :min="0"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="项目管理员" :label-width="formLabelWidth" prop="description">
                      <el-select v-model="projectForm.projectManagerIdList" multiple placeholder="请选择">
                        <el-option
                          v-for="item in merchantProjectAdminList"
                          :key="item.userId"
                          :label="item.userName"
                          :value="item.userId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="projectForm.addressList !== undefined">
                  <el-col :span="24">
                    <el-form-item label="项目地址" :label-width="formLabelWidth">
                      <el-row v-for="(item, index) in projectForm.addressList" :key="'addressItem-' + index" style="margin-bottom: 15px;">
                        <el-col :span="21">
                          <el-row :gutter="16">
                            <el-col :span="12">
                              <el-form-item :key="index" label="" :prop="'addressList.' + index + '.provinceCtiyDstrictArray'"  :rules="[
                                { required: true, type: 'array', message: '请选择省市区', trigger: 'change' }
                              ]">
                                <el-cascader v-model="item.provinceCtiyDstrictArray" :options="cascaderDataSource" :props="{ value: 'label' }"
                                             expand-trigger="hover" class="width-full" @change="handleChangeCascaderByAddProject(index)">
                                </el-cascader>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <el-form-item :key="index" label="" :prop="'addressList.' + index + '.address'"  :rules="[
                                      { required: true, message: '请输入详细地址', trigger: 'blur' }
                                    ]">
                                <el-input v-model="item.address" :maxlength="50" class="width-full" placeholder="详细地址"></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-col>
                        <el-col :span="3" style="text-align: right">
                          <el-button type="warning" round icon="el-icon-search" @click="removeAddress" size="mini">移除</el-button>
                        </el-col>
                      </el-row>
                      <el-button v-show="projectForm.addressList.length < addressMaxSize" size="small" @click="addAddress">新增地址</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="项目描述" :label-width="formLabelWidth" prop="description">
                      <el-input type="textarea" :rows="3" :max="255" resize="none" v-model="projectForm.description" :maxlength="255"></el-input>
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

            <el-dialog class="create_dialog" title="项目地址管理" :visible.sync="dialogAddressVisible" size="small" :before-close='closeAddressDialog' >
              <el-table :data="projectAddressList" style="width: 100%" max-height="450">
                <el-table-column
                  label="省市区/镇" width="250px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.editing">
                      <el-cascader v-model="scope.row.provinceCtiyDstrictArray" :options="cascaderDataSource" :props="{ value: 'label' }"
                         class="width-full" @change="handleChangeCascaderByAddressManage(scope.$index)">
                      </el-cascader>
                    </span>
                    <span v-else>{{ scope.row.provinceCtiyDstrictArray ? scope.row.provinceCtiyDstrictArray.join(' / ') : '' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="地址">
                  <template slot-scope="scope">
                    <span v-if="scope.row.editing">
                      <el-input size="small" v-model="scope.row.address" clearable></el-input>
                    </span>
                    <span v-else>{{ scope.row.address }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed='right'
                  label="操作"
                  width="150">
                  <template slot-scope="scope">
                    <el-button native-type="submit" @click="handleEditAddress(scope.row, scope.$index)" type="text" size="small">{{scope.row.editing ? '保存' : '编辑'}}</el-button>
                    <el-button @click="handleRemoveAddress(scope.row, scope.$index)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <div slot="footer" class="dialog-footer">
                <el-button v-if="projectAddressList.length < addressMaxSize" type="primary" @click="addProjectAddress" icon="el-icon-plus">新增地址</el-button>
              </div>
            </el-dialog>

          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import {
    getProjectList,
    addProject,
    delProject,
    delBatchProject,
    editProject,
    getProjectAddressList,
    editAddress,
    addAddress,
    removeAddress,
    getMerchantProjectAdminList
  } from '@/api/merchant/project/projectManager'

  import {
    globalConfig
  } from '@/globalConfig'

  import waves from '@/directive/waves/index.js'

  import cascaderDataSource from '@/utils/city-data.js'

  import { getApplicationCode, getDicts, setCurProjectCode } from '@/api/common'
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'
  import { registerNewComponent } from '@/api/resignComponent'

  export default {
    name: 'tableProject',
    directives: {
      waves
    },
    components: {
      'sidebar-menu': SidebarMenu
    },
    mounted() {
      console.log('logoUploadUrl', this.logoUploadUrl)
    },
    data() {
      return {
        curApplicationCode: getApplicationCode(this),
        list: [],
        cascaderDataSource: cascaderDataSource,
        total: 0,
        listLoading: true,
        downloadLoading: false,
        isBatch: true,
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
        dialogAddressVisible: false,
        formLabelWidth: '120px',
        logoUploadUrl: '',
        logoUrl: '',
        logoUploadData: {},
        projectForm: {
          id: '',
          merchantId: '',
          projectName: '',
          logo: '',
          amount: '',
          description: '',
          projectManagerIdList: [],
          // TODO 地址，经纬度暂定测试数据
          addressList: [
            { province: '', city: '', district: '', provinceCtiyDstrictArray: null, address: '', longitude: '241.3245', latitude: '34.32453' }
          ]
        },
        textMap: {
          update: '编辑项目',
          create: '添加项目'
        },
        addressMaxSize: 3, // 地址最大记录
        currentActionProjectCode: null,
        projectAddressList: [],
        // 商户子管理员列表
        merchantProjectAdminList: []
      }
    },
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.getProjectList()
      this.projectForm.merchantId = getDicts('EDENEP_SYSTEM_MERCHANT_ID')

      getMerchantProjectAdminList({ curApplicationCode: this.curApplicationCode }).then(response => {
        if (response.data.error_no === 0) {
          this.merchantProjectAdminList = response.data.result
        } else {
          this.$message(response.data.error_info)
        }
      })

      this.$router.addRoutes(
        [
          registerNewComponent('/work/project/index', 'merchant/work/projectIndex', true)
        ]
      )
    },
    methods: {
      jumpToProjectIndex(projectCode) {
        setCurProjectCode(projectCode)
        this.$router.push('/work/project/index')
      },
      renderAddressInfo(addressObj) {
        return `${addressObj.province} / ${addressObj.city} / ${addressObj.district} / ${addressObj.address}`
      },
      handleChangeCascaderByAddProject(index) {
        const addressObj = this.projectForm.addressList[index]
        if (addressObj.provinceCtiyDstrictArray && addressObj.provinceCtiyDstrictArray.length === 3) {
          addressObj.province = addressObj.provinceCtiyDstrictArray[0]
          addressObj.city = addressObj.provinceCtiyDstrictArray[1]
          addressObj.district = addressObj.provinceCtiyDstrictArray[2]
          this.projectForm.addressList.splice(index, 1, addressObj)
        }
      },
      handleChangeCascaderByAddressManage(index) {
        const addressObj = this.projectAddressList[index]
        if (addressObj.provinceCtiyDstrictArray && addressObj.provinceCtiyDstrictArray.length === 3) {
          addressObj.province = addressObj.provinceCtiyDstrictArray[0]
          addressObj.city = addressObj.provinceCtiyDstrictArray[1]
          addressObj.district = addressObj.provinceCtiyDstrictArray[2]
          this.projectAddressList.splice(index, 1, addressObj)
        }
      },
      closeDialog() {
        this.dialogFormVisible = false
        if (this.$refs['projectForm'] !== undefined) {
          this.$refs['projectForm'].resetFields()
        }
      },
      closeAddressDialog() {
        this.dialogAddressVisible = false
      },
      // 获取项目地址列表
      getProjectAddressList(projectCode) {
        getProjectAddressList({ projectCode: projectCode, curApplicationCode: this.curApplicationCode }).then(response => {
          if (response.data.error_no === 0) {
            const addList = response.data.result
            addList.map(add => { add.provinceCtiyDstrictArray = [add.province, add.city, add.district] })
            this.projectAddressList = addList
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getProjectList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getProjectList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchProject() {
        this.filterForm.current = globalConfig.startPage
        this.getProjectList()
      },
      addAddress() {
        this.projectForm.addressList.push({ province: '', city: '', district: '', provinceCtiyDstrictArray: null, address: '', longitude: '35.1234', latitude: '35.1234' })
      },
      removeAddress(index) {
        this.projectForm.addressList.splice(index, 1)
      },
      checkAddressInfo(addressObj) {
        if (!addressObj.provinceCtiyDstrictArray || !addressObj.address || !addressObj.longitude || !addressObj.latitude) {
          this.$message.error('地址信息不完整')
          return false
        }
        return true
      },
      handleEditAddress(data, index) {
        if (data.editing) {
          if (!this.checkAddressInfo(data)) {
            return
          }

          data.curApplicationCode = this.curApplicationCode
          if (data.id) {
            // 编辑
            editAddress(data).then(response => {
              if (response.data.error_no === 0) {
                delete data.editing
                this.projectAddressList.splice(index, 1, data)
              }
              this.$message(response.data.error_info)
            })
          } else {
            data.objCode = this.currentActionProjectCode
            // 新增
            addAddress(data).then(response => {
              if (response.data.error_no === 0) {
                this.getProjectAddressList(this.currentActionProjectCode)
              }
              this.$message(response.data.error_info)
            })
          }
        } else {
          data.editing = true
          this.projectAddressList.splice(index, 1, data)
        }
      },
      handleRemoveAddress(data, index) {
        if (data.id) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeAddress({ primaryKey: data.id, curApplicationCode: this.curApplicationCode }).then(response => {
              if (response.data.error_no === 0) {
                this.projectAddressList.splice(index, 1)
              }
              this.$message(response.data.error_info)
            })
          })
        } else {
          this.projectAddressList.splice(index, 1)
        }
      },
      addProject() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        // 暂为测试
        this.projectForm.logo = 'wqerwqtreyreureytrey'
      },
      modifyProject(row) {
        this.projectForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      addProjectAddress() {
        this.projectAddressList.push({ province: '', city: '', district: '', provinceCtiyDstrictArray: null, address: '', longitude: '241.3245', latitude: '34.32453', editing: true })
      },
      manageProjectAddress(projectCode) {
        this.currentActionProjectCode = projectCode
        this.dialogAddressVisible = true
        this.getProjectAddressList(projectCode)
      },
      deleteProject(row) {
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
          delProject(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProjectList()
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
          delBatchProject(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getProjectList()
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
        this.getProjectList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getProjectList()
      },
      handleUploadLogoSuccess(res, file) {
        this.projectForm.logo = URL.createObjectURL(file.raw)
      },
      beforeLogoUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }

        return isJPG && isLt2M
      },
      checkProjectAddress() {
        let result = true
        const errMsg = '地址信息不完整'

        if (this.projectForm.addressList.length === 0) {
          result = false
        }

        let addressObj
        for (let i = 0; i < this.projectForm.addressList.length; i++) {
          addressObj = this.projectForm.addressList[i]
          if (!addressObj.provinceCtiyDstrictArray || !addressObj.address) {
            result = false
          }
        }

        if (!result) {
          this.$message.error(errMsg)
        }
        return result
      },
      addSubmit() {
        this.$refs['projectForm'].validate((valid) => {
          if (valid && this.checkProjectAddress()) {
            this.listLoading = true
            this.projectForm.addressListJson = JSON.stringify(this.projectForm.addressList)
            this.projectForm.curApplicationCode = this.curApplicationCode
            addProject(this.projectForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProjectList()
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
        this.$refs['projectForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            delete this.projectForm.addressList
            delete this.projectForm.addressDTOList
            this.projectForm.curApplicationCode = this.curApplicationCode
            editProject(this.projectForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getProjectList()
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
        this.projectForm.projectName = ''
        this.projectForm.logo = ''
        this.projectForm.amount = ''
        this.projectForm.description = ''
        this.projectForm.managerId = ''
        this.projectForm.addressList = [
          { province: '', city: '', district: '', provinceCtiyDstrictArray: null, address: '', longitude: '241.3245', latitude: '34.32453' }
        ]
        if (this.$refs['projectForm'] !== undefined) {
          this.$refs['projectForm'].resetFields()
        }
      },
      findBy(data, attName, attValue) {
        for (let i = 0; i < data.length; i++) {
          if (data[i][attName] === attValue) {
            return data[i]
          }
        }

        return null
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss">
  .text-overflow-ellipsis-3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .width-full {
    width: 100%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>
