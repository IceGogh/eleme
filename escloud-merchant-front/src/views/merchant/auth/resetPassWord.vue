<template>
  <div class="wrap">
    <h3 style="color:#409EFF">账号密码重置</h3>
    <el-steps :active="step" align-center>
      <el-step title="发送手机验证码" icon="el-icon-plat-yun"></el-step>
      <el-step title="重置密码" icon="el-icon-plat-password"></el-step>
      <el-step title="完成" icon="el-icon-plat-good-filling"></el-step>
    </el-steps>
    <div>
      <el-form v-show="step==1" class="resetPassWordForm" :model="resetPassWordForm" :rules="resetPassWordFormRules" ref="resetPassWordForm">
        <el-form-item>
          <a style="cursor:default;font-size:15px">请输入您绑定的手机号码</a>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input name="phone" type="text" v-model="resetPassWordForm.phone" placeholder="请输入您的手机号码" :maxlength="11"/>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-input name="verifyCode" type="text" v-model="resetPassWordForm.verifyCode" placeholder="验证码" style="width: 70%" :maxlength="4"/>
          <span class='verify_code' @click='getCode'><img class="verify_code_img" :src=verifyCodeAvatar></span>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input name="verificationCode" type="text" v-model="resetPassWordForm.verificationCode" placeholder="请输入验证码" style="width: 70%" :maxlength="4"/>
          <el-button v-show="!isDisabled" type="primary" style="width:28%" :disabled="isDisabled" @click="sendMessage">发送短信</el-button>
          <span  v-show="isDisabled">
            {{this.buttonName}}秒后重新发送
          </span>
        </el-form-item>
        <el-button type="primary-next" style="width:100%;margin-bottom:30px;" @click="nextStep">下一步</el-button>
       </el-form>
      <el-form class="resetPassWordForm" v-show="step==2" :model="passWordForm" :rules="passWordFormRules" ref="passWordForm">
        <el-form-item>
          <a style="cursor:default;font-size:15px">重置密码</a>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input type="password" v-model="passWordForm.passWord" placeholder="请输入密码" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassWord">
          <el-input type="password" v-model="passWordForm.confirmPassWord" placeholder="请确认密码" :maxlength="20"></el-input>
        </el-form-item>
        <el-button type="primary-next" style="width:100%;margin-bottom:30px;" @click="resetPassWord">下一步</el-button>
      </el-form>
      <el-form class="resetPassWordForm" v-show="step==3">
        <el-form-item>
          <a style="cursor:default;font-size:18px">修改完成</a>
        </el-form-item>
        <el-form-item>
          <h2 style="color:#409EFF">恭喜您！密码修改成功！</h2>
        </el-form-item>
        <el-button type="primary-next" style="width:100%;margin-bottom:30px;" @click="goLogin">去登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
  import { sendSms } from '@/api/merchant/auth/userRegister'
  import {
    validator
  } from '@/utils/validate'
  export default {
    data() {
      var reg = /^[A-Za-z0-9]{6,20}$/
      var validatePassWord = (rule, value, callback) => {
        console.log(reg.test(value))
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passWordForm.passWord) {
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
        buttonName: '',
        sytemCode: '',
        isDisabled: false,
        step: 1,
        passWordForm: {
          passWord: '',
          confirmPassWord: ''
        },
        passWordFormRules: {
          passWord: [{
            validator: validatePassWord,
            required: true,
            trigger: 'blur'
          }],
          confirmPassWord: [{
            validator: validatePassWord,
            required: true,
            trigger: 'blur'
          }]
        },
        resetPassWordForm: {
          phone: '',
          code_time: '',
          verifyCode: '',
          verificationCode: ''
        },
        resetPassWordFormRules: {
          verificationCode: [{
            required: true,
            message: '请输入短信验证码',
            trigger: 'blur'
          }, {
            min: 4,
            max: 4,
            message: '短信验证码长度为 4 个字符',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            trigger: 'blur',
            fieldName: '手机号',
            fieldType: 'mobile',
            validator: validatePhone
          },
          {
            min: 11,
            max: 11,
            message: '请输入手机号码必须11位',
            trigger: 'blur'
          }],
          verifyCode: [{
            required: true,
            message: '请输入图片验证码',
            trigger: 'blur'
          }, {
            min: 4,
            max: 4,
            message: '图片验证码长度为 4 个字符',
            trigger: 'blur'
          }]
        },
        verifyCodeAvatar: '',
        verifyUrl: '/edenep/plat/code/get?code_time=',
        pwdType: 'password',
        loading: false,
        showDialog: false
      }
    },
    updated() {
    },
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.resetPassWordForm.code_time = new Date().getTime()
      this.verifyCodeAvatar = process.env.BASE_API + this.verifyUrl + this.resetPassWordForm.code_time
    },
    methods: {
      goLogin() {
        this.$router.push('/login')
      },
      getCode() {
        this.resetPassWordForm.code_time = new Date().getTime()
        this.verifyCodeAvatar = process.env.BASE_API + this.verifyUrl + this.resetPassWordForm.code_time
      },
      resetPassWord() {
        this.$refs['passWordForm'].validate((valid) => {
          if (valid) {
            this.step = 3
          }
        })
      },
      nextStep() {
        this.resetPassWordFormRules.verificationCode[0].required = true
        this.$refs['resetPassWordForm'].validate((valid) => {
          if (valid) {
            if (this.resetPassWordForm.verificationCode === this.sytemCode) {
              this.step = 2
            } else {
              this.$message.error('验证码不正确或者超时，请重新输入')
            }
          }
        })
      },
      sendMessage() {
        this.resetPassWordFormRules.verificationCode[0].required = false
        const param = {
          phone: this.resetPassWordForm.phone,
          curApplicationCode: this.curApplicationCode
        }
        this.$refs['resetPassWordForm'].validate((valid) => {
          if (valid) {
            sendSms(param).then(response => {
              if (response.data.error_no === 0) {
                this.sytemCode = response.data.result
                this.$message({
                  message: '短信发送成功',
                  type: 'success',
                  duration: 10000
                })
                this.isDisabled = true
                this.buttonName = 90
                var num = window.setInterval(() => {
                  if (this.buttonName > 0) {
                    this.buttonName -= 1
                  } else {
                    this.isDisabled = false
                    this.sytemCode = ''
                    window.clearInterval(num)
                  }
                }, 1000)
              } else {
                this.$message(response.data.error_info)
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .resetPassWordForm {
    width: 350px;
    margin: 50px auto;
  }
  .wrap {
    width: 80%;
    margin: 100px auto;
  }
  h3 {
    position: relative!important;
    left: 12.5% !important;
  }
  .el-button--primary-apply{
    position: relative!important;
    left: 32% !important;
    padding: 12px 50px;
    background-color: #409EFF;
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
    height: 42px;
    width: 100%;
    margin-top: 1px;
  }
  .el-button--primary-next{
    position: relative!important;
    background-color: #409EFF;
    margin: 30px 0px;
    color: #fff;
  }
</style>
