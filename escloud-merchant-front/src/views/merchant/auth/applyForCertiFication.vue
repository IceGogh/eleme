<template>
  <div class="wrap">
    <h2 style="color:#409EFF ">完善商户信息</h2>
    <el-form ref="merchantAuthform" :model="merchantAuthform" label-width="100px" :rules="merchantAuthFormRules" v-loading="merchantAuthLoading">
      <el-row>
        <el-col>
          <el-form-item label="商户名称" prop="merchantName">
            <el-input v-model="merchantAuthform.merchantName" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择地址"  prop="provinceCtiyDstrictArray">
            <template v-if="!isDisabled">
              <el-cascader v-model="merchantAuthform.provinceCtiyDstrictArray" :options="cascaderDataSource" :props="{ value: 'label' }"
                           expand-trigger="hover" class="width-full" >
              </el-cascader>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="merchantAuthform.address" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人姓名" prop="contactsName">
          <el-input v-model="merchantAuthform.contactsName" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机号" prop="contactsMobile">
            <el-input v-model.number="merchantAuthform.contactsMobile" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="eMail">
            <el-input v-model="merchantAuthform.eMail" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="营业执照" prop="businessLicenseFront">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :on-success="handleUploadLogoSuccess"
              :before-upload="beforeLogoUpload">
              <img v-if="merchantAuthform.businessLicenseFront" :src="merchantAuthform.businessLicenseFront" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-upload
            class="avatar-uploader"
            action="http://192.168.0.140:8081/edenep/plat/image/upload"
            name="file"
            multiple
            :show-file-list="false"
            :on-success="handleUploadLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="merchantAuthform.businessLicenseReverse" :src="merchantAuthform.businessLicenseReverse" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
      <el-form-item label="商户描述" prop="descriPtion">
        <el-input size="small" :maxlength="127" resize='vertical' v-model="merchantAuthform.descriPtion"
                   type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容" >
        </el-input>
      </el-form-item>
      <el-form-item label="状态" v-if="merchantAuthform.merchantState !== '' && merchantAuthform.merchantState !== null ">
        <el-radio-group v-model="merchantAuthform.merchantState">
          <el-radio :disabled="radioState!=='1'" label="1">审核中</el-radio>
          <el-radio :disabled="radioState!=='2'" label="2">审核通过</el-radio>
          <el-radio :disabled="radioState!=='3'" label="3">审核失败</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button v-if="merchantAuthform.merchantState == '' || merchantAuthform.merchantState == null "
                   type="primary-apply" @click="onSubmit">申请认证</el-button>
        <el-button v-if="merchantAuthform.merchantState !== '2' && merchantAuthform.merchantState !== '4' "
                   type="primary-apply" @click="editSubmit">重新提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { queryMerchantAuth, addMerchantAuth, editMerchantAuth, queryAddress, editAddress } from '@/api/merchant/auth/merchantAuth'
  import cascaderDataSource from '@/utils/city-data.js'
  export default {
    data() {
      return {
        merchantAuthLoading: true,
        radioState: 1,
        curApplicationCode: '',
        cascaderDataSource: cascaderDataSource,
        merchantAuthform: {
          id: '',
          merchantId: '',
          contactsName: '',
          contactsMobile: '',
          eMail: '',
          merchantName: '',
          businessLicenseFront: '',
          businessLicenseReverse: '',
          descriPtion: '',
          merchantState: '',
          address: '',
          province: '',
          city: '',
          district: '',
          addressId: '',
          provinceCtiyDstrictArray: []
        },
        merchantStateMapObj: {
          '1': '待通过',
          '2': '正常',
          '3': '未通过',
          '4': '已过期'
        },
        isDisabled: false,
        merchantAuthFormRules: {
          merchantName: [{
            required: true,
            message: '请输入商户名称',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }],
          contactsName: [{
            required: true,
            message: '请输入联系人姓名',
            trigger: 'blur'
          }],
          contactsMobile: [{
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          }],
          eMail: [{
            required: true,
            message: '请输入电子邮箱',
            trigger: 'blur'
          }, { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }],
          provinceCtiyDstrictArray: [{
            type: 'array',
            required: true,
            message: '请选择省市区',
            trigger: 'change'
          }]
        }
      }
    },
    updated() {
      this.edit()
    },
    created() {
      const _this = this
      this.$nextTick(function() {
        _this.curApplicationCode = _this.$store.state.app.applicationCode
        _this.getMerchantAuth()
      })
    },
    methods: {
      onSubmit() {
        this.$refs['merchantAuthform'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.$confirm('是否确认提交认证信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.merchantAuthform.province = this.merchantAuthform.provinceCtiyDstrictArray[0]
              this.merchantAuthform.city = this.merchantAuthform.provinceCtiyDstrictArray[1]
              this.merchantAuthform.district = this.merchantAuthform.provinceCtiyDstrictArray[2]
              this.merchantAuthform.curApplicationCode = this.curApplicationCode
              addMerchantAuth(this.merchantAuthform).then(response => {
                if (response.data.error_no === 0) {
                  this.$notify({
                    title: '成功',
                    message: response.data.error_info,
                    type: 'success',
                    duration: 2000
                  })
                  this.$confirm('温馨提醒：工作人员会在2-5个工作日内审核完成，您可以登录查看审核状态', '恭喜您提交成功', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success',
                    center: true
                  })
                  this.getMerchantAuth()
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
          } else {
            return false
          }
        })
      },
      edit() {
        this.isDisabled = false
      },
      merchantAuthSubmit() {
        this.$refs['merchantAuthform'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantAuthform.curApplicationCode = this.curApplicationCode
            editMerchantAuth(this.merchantAuthform).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.getMerchantAuth()
              } else {
                this.$message(response.data.error_info)
              }
              this.listLoading = false
            })
          }
        })
      },
      editSubmit() {
        this.$refs['merchantAuthform'].validate((valid) => {
          if (valid) {
            this.$confirm('是否确认重新提交审核信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.merchantAuthform.province = this.merchantAuthform.provinceCtiyDstrictArray[0]
              this.merchantAuthform.city = this.merchantAuthform.provinceCtiyDstrictArray[1]
              this.merchantAuthform.district = this.merchantAuthform.provinceCtiyDstrictArray[2]
              const param = {
                objCode: this.merchantAuthform.merchantId,
                objType: '00',
                province: this.merchantAuthform.province,
                city: this.merchantAuthform.city,
                district: this.merchantAuthform.district,
                address: this.merchantAuthform.address,
                id: this.merchantAuthform.addressId,
                curApplicationCode: this.curApplicationCode
              }
              editAddress(param).then(response => {
                if (response.data.error_no === 0) {
                  this.merchantAuthSubmit()
                } else {
                  this.$message(response.data.error_info)
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消重新提交'
              })
            })
          } else {
            return false
          }
        })
      },
      getAddressList(val) {
        this.merchantAuthLoading = true
        const param = {
          objCode: val,
          curApplicationCode: this.curApplicationCode
        }
        queryAddress(param).then(response => {
          if (response.data.error_no === 0 && response.data.result.total > 0) {
            this.merchantAuthform.address = response.data.result.records[0].address
            this.merchantAuthform.province = response.data.result.records[0].province
            this.merchantAuthform.city = response.data.result.records[0].city
            this.merchantAuthform.addressId = response.data.result.records[0].id
            this.merchantAuthform.district = response.data.result.records[0].district
            this.merchantAuthform.provinceCtiyDstrictArray[0] = response.data.result.records[0].province
            this.merchantAuthform.provinceCtiyDstrictArray[1] = response.data.result.records[0].city
            this.merchantAuthform.provinceCtiyDstrictArray[2] = response.data.result.records[0].district
            this.merchantAuthLoading = false
          }
        })
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
      getMerchantAuth() {
        this.merchantAuthLoading = true
        this.merchantAuthform.curApplicationCode = this.curApplicationCode
        queryMerchantAuth(this.merchantAuthform).then(response => {
          if (response.data.error_no === 0 && response.data.result) {
            this.merchantAuthform.provinceCtiyDstrictArray[0] = response.data.result.province
            this.merchantAuthform.provinceCtiyDstrictArray[1] = response.data.result.city
            this.merchantAuthform.provinceCtiyDstrictArray[2] = response.data.result.district
            this.merchantAuthform.addressId = response.data.result.addressId
            this.merchantAuthform.address = response.data.result.address
            this.merchantAuthform.province = response.data.result.province
            this.merchantAuthform.city = response.data.result.city
            this.merchantAuthform.district = response.data.result.district
            this.merchantAuthform.id = response.data.result.id
            this.merchantAuthform.merchantId = response.data.result.merchantId
            this.merchantAuthform.contactsName = response.data.result.contactsName
            this.merchantAuthform.contactsMobile = response.data.result.contactsMobile
            this.merchantAuthform.eMail = response.data.result.eMail
            this.merchantAuthform.merchantName = response.data.result.merchantName
            this.merchantAuthform.descriPtion = response.data.result.descriPtion
            this.merchantAuthform.businessLicenseFront = response.data.result.businessLicenseFront
            this.merchantAuthform.businessLicenseReverse = response.data.result.businessLicenseReverse
            this.merchantAuthform.merchantState = response.data.result.merchantState
            this.radioState = response.data.result.merchantState
            this.merchantAuthLoading = false
            this.isDisabled = true
          }
        })
      }
    }
  }

</script>
<style scoped>
  .wrap {
    width: 45%;
    margin: 100px auto;
  }
  h2 {
    position: relative!important;
    left: 42% !important;
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
  .el-cascader {
    width: 100%;
    min-width: inherit;
  }
  .el-button--primary-apply{
    position: relative!important;
    left: 32% !important;
    padding: 12px 50px;
    background-color: #409EFF;
  }
</style>
