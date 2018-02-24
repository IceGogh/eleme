<template>
<div class="login-container">
  <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
    <h3 class="title">易登科技智慧环卫云平台</h3>

    <el-form-item prop="userAccount">
      <span class="svg-container svg-container_login">
          <icon-svg icon-class="user" />
        </span>
      <el-input name="userAccount" type="text" v-model="loginForm.userAccount" autoComplete="on" placeholder="用户名" />
    </el-form-item>

    <el-form-item prop="passWord">
      <span class="svg-container">
          <icon-svg icon-class="password" />
        </span>
      <el-input name="passWord" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.passWord" autoComplete="on" placeholder="密码" />
      <span class='show-pwd' @click='showPwd'><icon-svg icon-class="eye" /></span>
    </el-form-item>

    <el-form-item prop="verifyCode">
      <el-input name="verifyCode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.verifyCode" autoComplete="on" placeholder="验证码" style="width: 70%"/>
      <span class='verify_code' @click='getCode'><img class="verify_code_img" :src=verifyCodeAvatar></span>
    </el-form-item>
    <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    <el-row>
      <el-col :span="19">
        <a href="#/auth/userRegister" class="register">注册账号</a>
      </el-col>
      <el-col :span="5">
        <a href="#/auth/resetPassWord" class="forgotPassword">忘记密码</a>
      </el-col>
    </el-row>
  </el-form>
</div>
</template>

<script>
import { getAllStaticDictMap } from '@/api/plat/dict'
export default {
  components: {},
  name: 'login',
  data() {
    return {
      loginForm: {
        userAccount: 'admin',
        passWord: '888888',
        code_time: '',
        verifyCode: ''
      },
      loginRules: {
        userAccount: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 4,
          max: 11,
          message: '用户名长度在 4 到 11 个字符',
          trigger: 'blur'
        }],
        passWord: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 20,
          message: '密码长度在 6 到 20 个字符',
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
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    getCode() {
      this.loginForm.code_time = new Date().getTime()
      this.verifyCodeAvatar = process.env.BASE_API + this.verifyUrl + this.loginForm.code_time
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // login
          this.loading = true
          this.$store.dispatch('UserLogin', this.loginForm).then(() => {
            // 判断是否用户simpleRole值 && 缓存数据字典
            getAllStaticDictMap().then(response => {
              const resultData = response.data
              if (typeof resultData !== undefined && resultData.error_no === 0) {
                sessionStorage.setItem('EDENEP_SYSTEM_DICTS', JSON.stringify(resultData.result))
              } else {
                console.log('get dict error!!')
              }
            })
            this.loading = false
            this.$router.push({
              path: '/'
            })
          }).catch((e) => {
//					throw e
            this.loading = false
            this.$message.error(e.message)
          })
          this.loading = true
        } else {
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    this.loginForm.code_time = new Date().getTime()
    this.verifyCodeAvatar = process.env.BASE_API + this.verifyUrl + this.loginForm.code_time
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    @include relative;
    height: 100vh;
    background-color: $bg;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
    }
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 40px;
        text-align: center;
        /*font-weight: bold;*/
    }
    .forgotPassword {
      color: $light_gray;
      float: right;
      margin: 0px auto;
    }
    .register {
      color: $light_gray;
      float: right;
      margin: 0px auto;
      font-size:14px;
    }
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 400px;
        padding: 35px 35px 15px;
        margin: 120px auto;
        font-size:14px;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
    }
    .thirdparty-button {
        position: absolute;
        right: 35px;
        bottom: 28px;
    }
    .verify_code {
      position: absolute;
      right: 0px;
      top: 0px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
    }
    .verify_code_img {
      border-radius: 0px 4px 4px 0px;
      height: 45px;
      width: 100%;
      margin-top: 1px;
    }
}
</style>
