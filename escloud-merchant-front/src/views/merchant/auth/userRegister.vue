<template>
  <div class="wrap2">
    <div class="wrap">
      <h2 style="color:#409EFF">欢迎注册环卫云</h2>
      <el-form ref="userRegisterForm" :model="userRegisterForm" label-width="100px" :rules="userRegisterFormRules">
        <el-row>
          <el-col :span="15">
            <el-form-item label="会员名" prop="userName">
              <el-input v-model="userRegisterForm.userName" placeholder="请输入会员名" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="请输入手机号" prop="phone">
              <el-input v-model.number="userRegisterForm.phone" placeholder="请输入手机号" :maxlength="11"></el-input>
            </el-form-item >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="登录密码" prop="passWord">
              <el-input type="password" v-model="userRegisterForm.passWord" placeholder="请输入登录密码"  :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="请确认密码" prop="confirmPassWord">
              <el-input type="password" v-model="userRegisterForm.confirmPassWord" placeholder="请再次输入密码" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item prop="verifyCode" label="验证码">
              <el-input name="verifyCode" type="text" v-model="userRegisterForm.verifyCode" placeholder="验证码" style="width: 72%" :maxlength="4"/>
              <span class='verify_code' @click='getCode'><img class="verify_code_img" :src=verifyCodeAvatar></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="button">
          <el-button @click="sendVerificationCode" type="primary" :disabled="!userRegisterForm.checkList">同意条款并注册</el-button>
        </el-form-item>
        <el-form-item prop="tiaokuan">
          <el-row>
            <el-col>
              <el-checkbox v-model="userRegisterForm.checkList"></el-checkbox>
              <a @click="hwyDialogVisible = true">《环卫云网站服务条款》</a>
              <a @click="hwyDialogVisible = true">《法律声明和隐私权政策》</a>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="发送手机验证码" :visible.sync="dialogVisible" size="small" :before-close='closeDialog' width="35%">
      <el-form :model="verificationCodeForm" :rules="verificationCodeFormRules" ref="verificationCodeForm" label-width="80px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="绑定手机">
              <span>{{this.userRegisterForm.phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input size="small" v-model="verificationCodeForm.verificationCode" style="width: 20%" clearable></el-input>
            <el-button v-show="verificationCodeForm.sendMessageDisabled" type="primary-sms" style="width: 20%" @click="sendMessage">发送短信</el-button>
            <span  v-show="!verificationCodeForm.sendMessageDisabled">
              {{this.userRegisterForm.buttonName}}秒后可重新发送
            </span>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" @click="onSubmit">提交注册</el-button>
    </el-dialog>
    <el-dialog title="环卫云网站服务条款" :visible.sync="hwyDialogVisible" width="70%" center>
      <el-button @click="hwyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="hwyDialogVisible = false">确 定</el-button>
    </el-dialog>
    <el-dialog title="法律声明和隐私权政策" :visible.sync="flsmDialogVisible" width="70%" center>
      <el-button @click="flsmDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="flsmDialogVisible = false">确 定</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import { addUserRegister, queryPhoneNumberRepeat, sendSms } from '@/api/merchant/auth/userRegister'
  import { registerNewComponent } from '@/api/resignComponent'
  import {
    validator
  } from '@/utils/validate'
  export default {
    data() {
      var reg = /^[A-Za-z0-9]{6,20}$/
      var validatePass = (rule, value, callback) => {
        console.log('reg.test(value)', reg.test(value))
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userRegisterForm.passWord) {
          callback(new Error('两次输入密码不一致!'))
        } else if (!reg.test(value)) {
          callback(new Error('密码不符合规则必须为6-20位字母数字组合!'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        const validatorResult = validator(rule, value)
        if (!validatorResult.pass) {
          callback(new Error(validatorResult.msg))
        } else {
          callback()
        }
      }
      return {
        curApplicationCode: '',
        verificationCodeForm: {
          verificationCode: '',
          sendMessageDisabled: true
        },
        verificationCodeFormRules: {
          verificationCode: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }]
        },
        userRegisterForm: {
          confirmPassWord: '',
          userName: '',
          passWord: '',
          phone: '',
          checkList: true,
          verificationCode: '',
          verifyCode: '',
          buttonName: '获取验证码'
        },
        dialogVisible: false,
        isDisabled: false,
        hwyDialogVisible: false,
        flsmDialogVisible: false,
        sytemCode: '',
        verifyCodeAvatar: '',
        verifyUrl: '/edenep/plat/code/get?code_time=',
        userRegisterFormRules: {
          userName: [{
            required: true,
            message: '请输入会员名称',
            trigger: 'blur'
          }],
          passWord: [{
            validator: validatePass,
            required: true,
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            trigger: 'blur',
            fieldName: '手机号',
            fieldType: 'mobile',
            validator: validatePhone
          }],
          checkList: [{
            type: 'array',
            required: true,
            message: '请勾选同意协议',
            trigger: 'change'
          }],
          confirmPassWord: [{
            validator: validatePass,
            required: true,
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.userRegisterForm.code_time = new Date().getTime()
      this.verifyCodeAvatar = process.env.BASE_API + this.verifyUrl + this.userRegisterForm.code_time
      this.$router.addRoutes(
        [
          registerNewComponent('/login', 'plat/login/index', false)
        ]
      )
    },
    methods: {
      login() {
        this.$router.push('/login')
      },
      getCode() {
        this.userRegisterForm.code_time = new Date().getTime()
        this.verifyCodeAvatar = process.env.BASE_API + this.verifyUrl + this.userRegisterForm.code_time
      },
      sendMessage() {
        const param = {
          phone: this.userRegisterForm.phone,
          curApplicationCode: this.curApplicationCode
        }
        this.$refs['userRegisterForm'].validate((valid) => {
          if (valid) {
            sendSms(param).then(response => {
              if (response.data.error_no === 0) {
                this.sytemCode = response.data.result
                this.$message({
                  message: '短信发送成功',
                  type: 'success',
                  duration: 10000
                })
              } else {
                this.$message(response.data.error_info)
              }
            })
          }
        })
        this.verificationCodeForm.sendMessageDisabled = false
        this.userRegisterForm.buttonName = 90
        var num = window.setInterval(() => {
          if (this.userRegisterForm.buttonName > 0) {
            this.userRegisterForm.buttonName -= 1
          } else {
            this.userRegisterForm.buttonName = '发送验证码'
            this.verificationCodeForm.sendMessageDisabled = true
            this.sytemCode = ''
            window.clearInterval(num)
          }
        }, 1000)
      },
      closeDialog() {
        this.verificationCodeForm.verificationCode = ''
        this.dialogVisible = false
        this.userRegisterForm.buttonName = '发送验证码'
        this.verificationCodeForm.sendMessageDisabled = true
      },
      sendVerificationCode() {
        const param = {
          phone: this.userRegisterForm.phone,
          curApplicationCode: this.curApplicationCode
        }
        this.$refs['userRegisterForm'].validate((valid) => {
          if (valid) {
            queryPhoneNumberRepeat(param).then(response => {
              if (response.data.error_no === 0) {
                this.dialogVisible = true
              } else {
                this.$message(response.data.error_info)
              }
            })
          }
        })
      },
      onSubmit() {
        this.$refs['verificationCodeForm'].validate((valid) => {
          if (valid) {
            if (this.verificationCodeForm.verificationCode !== this.sytemCode) {
              this.$message.error('验证码不正确或者超时，请重新输入')
            } else {
              const param = {
                phone: this.userRegisterForm.phone,
                curApplicationCode: this.curApplicationCode
              }
              this.$refs['verificationCodeForm'].validate((valid) => {
                if (valid) {
                  queryPhoneNumberRepeat(param).then(response => {
                    if (response.data.error_no === 0) {
                      this.addUser()
                    } else {
                      this.$message(response.data.error_info)
                    }
                  })
                }
              })
            }
          }
        })
      },
      addUser() {
        this.$refs['userRegisterForm'].validate((valid) => {
          if (valid) {
            this.userRegisterForm.curApplicationCode = this.curApplicationCode
            this.listLoading = true
            addUserRegister(this.userRegisterForm).then(response => {
              if (response.data.error_no === 0) {
                this.userRegisterForm.confirmPassWord = ''
                this.userRegisterForm.userName = ''
                this.userRegisterForm.passWord = ''
                this.userRegisterForm.phone = ''
                this.userRegisterForm.buttonName = '获取验证码'
                this.verificationCodeForm.sendMessageDisabled = true
                this.$notify({
                  title: '恭喜您注册成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.login()
              } else {
                this.$message(response.data.error_info)
              }
              this.listLoading = false
            })
          } else {
            return false
          }
        })
      }
    },
    wipeData() {
      this.userRegisterForm.confirmPassWord === ''
      this.userRegisterForm.userName === ''
      this.userRegisterForm.passWord === ''
      this.userRegisterForm.phone === ''
      this.userRegisterForm.verificationCode === ''
    }
  }

</script>
<style scoped>
  .wrap {
    width: 50%;
    margin: 100px auto;
  }
  .wrap2 {
  }
  h2 {
    position: relative!important;
    left: 42% !important;
  }
  .el-row > div {
    position: relative!important;
    left: 17% !important;
  }
  .el-form-item__label {
    text-align: right!important;
  }
  .el-button{
    position: relative!important;
    left: 38% !important;
  }
  .el-checkbox {
    position: relative!important;
    left: 0% !important;
  }
  .el-button--primary-sms {
    position: relative!important;
    background-color: #409EFF;
    color: #fff;
    left: 2% !important;
  }
  .verify_code {
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 16px;
    cursor: pointer;
  }
  .verify_code_img {
    border-radius: 0px 4px 4px 0px;
    height: 38px;
    width: 100%;
    margin-top: 1px;
  }
</style>
