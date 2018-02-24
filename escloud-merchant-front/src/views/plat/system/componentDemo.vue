<template>
  <div>
    <div class="components-container">


      <!-- 百度富文本 -->
      <div class="info">UE编辑器示例<br>需要使用编辑器时，调用UE公共组件即可。可设置填充内容defaultMsg，配置信息config(宽度和高度等)，可调用组件中获取内容的方法。支持页面内多次调用。</div>
      <button @click="getUEContent()">获取内容</button>
      <button @click="getUEContentTxt()">获取无文本内容</button>
      <div class="editor-container">
        <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
      </div>
      <br/>
      <br/>
      <hr/>


      <!-- 轻量级富文本 -->
      <Editor @getEditorData="getEditorData"></Editor>
      <br/>
      <br/>
      <hr/>



      <!-- 组织机构勾选树 -->
      <organization @selectList="getList" :preData="preList"></organization>
      <br/>
      <br/>
      <hr/>



      <!-- 高德地图 -->
      <AMap mapWidth="100%" mapHeight="400px" v-bind:options="true" @sendData="getMap"></AMap>


    </div>
  </div>
</template>
<style>
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }
</style>
<script>
  // 引入组织机构结构树形原始数据 fakeData , 同时在created中 赋值， 通过prop方法传入 organization组件
  import fakeData from '@/components/OrganizationTree/fake'
  import CityList from '@/components/CityList/index.vue'
  import {
    getApplicationList,
    addApplication,
    editApplication,
    delApplication,
    delBatchApplication,
    queryFreeModel,
    updateChildModel,
    synAllApplication
  } from '@/api/plat/application'
  import {
    globalConfig
  } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  // 分别引入相应组件
  import AMap from '@/components/Map'
  import UE from 'static/UE/ue.vue'
  import Editor from '@/components/Editor/Editor'
  import organization from '@/components/OrganizationTree'
  export default {
    name: 'tableApplication',
    directives: {
      waves
    },
    // 分别注册相应组件
    components: {
      CityList,
      AMap,
      UE,
      Editor,
      organization
    },
    created() {
      this.getApplicationList()
      this.preList = fakeData
    },
    data() {
      return {
        preList: [],
        selectList: [],
        mapData: {},
        dataArray: '',
        CityList: '',
        defaultMsg: '<span style="orphans: 2; widows: 2; font-size: 22px; font-family: KaiTi_GB2312; background-color: rgb(229, 51, 51);"><strong>夏钧姗：成功的投资需具备哪些心态和掌握哪些重要止损位</strong></span>',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        ue1: 'ue1',
        imageUrl: '',
        fileList: [],
        editorData: '',
        list: [],
        checkList: [],
        searchOptions: [{
          value: 'applicationName',
          label: '模块名称'
        },
        {
          value: 'applicationUrl',
          label: '资源地址'
        }],
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
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          isPermission: '',
          applicationFilePath: '',
          resType: '',
          applicationServerPath: '',
          applicationUrl: '',
          menuIcon: '',
          createBy: '',
          createDate: [],
          modifyBy: '',
          modifyDate: [],
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        transferDialogVisible: false,
        formLabelWidth: '120px',
        applicationForm: {
          id: '',
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          isPermission: '',
          resType: '',
          applicationFilePath: '',
          applicationServerPath: '',
          applicationUrl: '',
          menuIcon: '',
          createBy: '',
          createDate: '',
          modifyBy: '',
          modifyDate: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        // 表单校验规则
        applicationFormRules: {
          id: [{
            type: 'number',
            required: true,
            message: '请输入主键ID',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '主键ID必须为数字值'
          }],
          applicationName: [{
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }],
          applicationFilePath: [{
            required: true,
            message: '请输入文件路径',
            trigger: 'blur'
          }],
          isPermission: [{
            required: true,
            message: '请选择子菜单是否控制权限',
            trigger: 'blur'
          }],
          applicationServerPath: [{
            required: true,
            message: '请输入模块的请求路径',
            trigger: 'blur'
          }],
          applicationDesc: [{
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }],
          applicationUrl: [{
            required: true,
            message: '请输入资源地址',
            trigger: 'blur'
          }]
        },
        transferValue: [],
        transferData: [],
        isPermissionMapObj: {
          '0': '不控制',
          '1': '控制'
        },
        isPermissionMapArr: [
          {
            label: '不控制',
            value: '0'
          }, {
            label: '控制',
            value: '1'
          }
        ],
        resTypeMapObj: {
          '0': '平台资源',
          '1': '商户资源'
        },
        resTypeMapArr: [
          {
            label: '平台资源',
            value: '0'
          }, {
            label: '商户资源',
            value: '1'
          }
        ],
        updateTransferParams: {}
      }
    },
    methods: {
      // 从组织结构树中 获取勾选中的 部门/人
      getList(data) {
        //  数据结构与 preData 最初传入一样， 需要遍历  是否勾选  对应树形 checked
        this.selectList = data
      },
      // 从 map 组件中 获取 绘制的 线路(polyline)/ 区域(polygon) 的经纬度坐标数组
      getMap(data) {
        if (data.type === 'polyline') {
          this.mapData.polyline = data.arr
        } else if (data.type === 'polygon') {
          this.mapData.polygon = data.arr
        }
      },
      getCity(cityList) {
        this.CityList = cityList
      },
      // 从组件中 获取 文本内容
      geteditorData(val) {
        this.editorData = val
      },
      getUEContent() {
        const content = this.$refs.ue.getUEContent() // 调用子组件方法
        this.$notify({
          title: '获取成功，可在控制台查看！',
          message: content,
          type: 'success'
        })
        console.log(content)
      },
      getUEContentTxt() {
        const content = this.$refs.ue.getUEContentTxt() // 调用子组件方法
        this.$notify({
          title: '获取成功，可在控制台查看！',
          message: content,
          type: 'success'
        })
        console.log(content)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
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
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      getEditorData(val) {
        console.log('getData', val)
      },
      synAll() {
        this.listLoading = true
        synAllApplication().then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '同步成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      addChildModel(row) {
        this.transferValue.length = 0
        this.transferData.length = 0
        this.updateTransferParams = {}
        const applicationCode = row.applicationCode
        this.updateTransferParams.applicationCode = applicationCode
        this.transferDialogVisible = true
        var params = { 'applicationCode': applicationCode }
        queryFreeModel(params).then(response => {
          if (response.data.error_no === 0) {
            const result = response.data.result
            if (result !== undefined && result !== null) {
              result.forEach((i) => {
                this.transferData.push({
                  key: i.menuNo,
                  label: i.menuName
                })
                if (i.applicationCode === applicationCode) {
                  this.transferValue.push(
                    i.menuNo
                  )
                }
              })
            }
          }
        })
      },
      updateTransferDialog() {
        this.listLoading = true
        this.updateTransferParams.primaryKeys = this.transferValue
        updateChildModel(this.updateTransferParams).then(response => {
          if (response.data.error_no === 0) {
            this.transferDialogVisible = false
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
      },
      getApplicationList() {
        this.listLoading = true
        getApplicationList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchApplication() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getApplicationList()
      },
      addApplication() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyApplication(row) {
        this.applicationForm.id = row.id
        this.applicationForm.applicationFilePath = row.applicationFilePath
        this.applicationForm.resType = row.resType
        this.applicationForm.applicationServerPath = row.applicationServerPath
        this.applicationForm.isPermission = row.isPermission
        this.applicationForm.applicationCode = row.applicationCode
        this.applicationForm.applicationName = row.applicationName
        this.applicationForm.applicationDesc = row.applicationDesc
        this.applicationForm.applicationUrl = row.applicationUrl
        this.applicationForm.menuIcon = row.menuIcon
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteApplication(row) {
        const param = {
          primaryKey: row.id,
          applicationCode: row.applicationCode
        }
        this.listLoading = true
        delApplication(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchApplication()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      deleteBatch() {
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        const selectApplicationCodes = []
        for (var i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
          selectApplicationCodes.push(selection[i].applicationCode)
        }
        const param = {
          primaryKeys: selectIds,
          applicationCodes: selectApplicationCodes
        }
        this.listLoading = true
        delBatchApplication(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.$refs.multipleTable.clearSelection()
            this.searchApplication()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      pageSizeChange(val) {
        this.filterForm.current = globalConfig.startPage
        this.filterForm.pageSize = val
        this.getApplicationList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getApplicationList()
      },
      addSubmit() {
        this.$refs['applicationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            addApplication(this.applicationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchApplication()
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
        this.$refs['applicationForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editApplication(this.applicationForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchApplication()
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
        const ChkList = this.checkList
        ChkList[row.id - 1] = !ChkList[row.id - 1]
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
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          applicationUrl: '',
          createBy: '',
          createDate: [],
          modifyBy: '',
          modifyDate: [],
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        }
      },
      resetForm() {
        this.applicationForm = {
          id: '',
          applicationCode: '',
          applicationName: '',
          applicationDesc: '',
          applicationUrl: '',
          createBy: '',
          createDate: '',
          resType: '',
          isPermission: '',
          modifyBy: '',
          modifyDate: ''
        }
        if (this.$refs['applicationForm'] !== undefined) {
          this.$refs['applicationForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '模块编码',
            '模块名称',
            '描述',
            '资源地址',
            '创建人',
            '创建时间',
            '修改人',
            '修改时间'
          ]
          const filterVal = [
            'id',
            'applicationCode',
            'applicationName',
            'applicationDesc',
            'applicationUrl',
            'createBy',
            'createDate',
            'modifyBy',
            'modifyDate'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '模块表')
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
