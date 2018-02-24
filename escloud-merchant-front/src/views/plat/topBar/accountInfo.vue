<template>
  <div class="account-info" @mouseover="mouseOver" @mouseleave="mouseLeave">
    <img :src="people_png"/>
    <div class="name">
      {{user.name}}
    </div>
    <div class="icon-url" v-show="iconAreaStatus">
      <ul class="clearfix">
        <li v-for="item in iconArea">
          <i :class="item.iconClass"></i>
          <div @click="onClick(item.iconOnChange)">{{item.title}}</div>
        </li>
      </ul>
      <div class="logout"  v-show="iconAreaStatus" @click="logout">退出登录</div>
    </div>
  </div>
</template>
<script>
  import people_png from '../../../assets/img/people.png'
  import { registerNewComponent } from '@/api/resignComponent'
  export default {
    data() {
      return {
        people_png,
        user: {
          name: '游客'
        },
        iconAreaStatus: false,
        iconArea: [
          {
            iconClass: 'el-icon-plat-code',
            title: '基本资料'
          },
          {
            iconClass: 'el-icon-plat-huiyuanmingdan',
            title: '实名认证',
            iconOnChange: 'goAuth'
          },
          {
            iconClass: 'el-icon-plat-shezhi-tianchong',
            title: '安全设置'
          },
          {
            iconClass: 'el-icon-plat-icon',
            title: '安全管控'
          },
          {
            iconClass: 'el-icon-plat-drxx08',
            title: '访问控制'
          },
          {
            iconClass: 'el-icon-plat-weibiaoti46',
            title: 'accesskeys'
          },
          {
            iconClass: 'el-icon-plat-huiyuan1',
            title: '会员权益'
          },
          {
            iconClass: 'el-icon-plat-huiyuanjifenshixiaobaobiao',
            title: '会员积分'
          },
          {
            iconClass: 'el-icon-plat-yun',
            title: '云大使管理'
          }
        ]
      }
    },
    created() {
      this.user.name = sessionStorage.getItem('EDENEP_SYSTEM_USERNAME')
      this.$router.addRoutes(
        [
          registerNewComponent('/auth/applyForCertiFication', 'merchant/auth/applyForCertiFication', true)
        ]
      )
    },
    methods: {
      onClick(iconOnChange) {
        if (iconOnChange === 'goAuth') {
          this.goAuth()
        }
      },
      goAuth() {
        this.$router.push('/auth/applyForCertiFication')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      },
      mouseOver() {
        this.iconAreaStatus = true
      },
      mouseLeave() {
        this.iconAreaStatus = false
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .account-info {
    position: relative;
    width: 166px;
    height: 50px;
    color: #f1f1f1;
    float: right;
    text-align: center;
    cursor: pointer;
    z-index: 2018;
    img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      position: relative;
      top: 6px;
      left: 5px;
    }
    .name {
      width: 116px;
      padding: 0 8px;
      height: 50px;
      line-height: 50px;
      float: right;
      overflow: hidden;
      word-break: keep-all;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
    }
    .icon-url {
      position: absolute;
      width: 270px;
      height: 322px;
      background: #fff;
      right: 0;
      top: 50px;
      color: #333;
      z-index: 2018;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      ul {
        width: 270px;
        height: 256px;
        margin: 8px 15px;
        padding: 8px 0;
        li{
          margin: 0;
          list-style: none;
          box-sizing: border-box;
          display: block;
          float: left;
          width: 80px;
          height: 80px;
          text-align: center;
          border-radius: 2px;
          div {
            padding-top: 46px;
            font-size: 12px;
          }
        }
        li:hover {
          background: #F5F5F6;
        }
        i, li {
          float: left;
        }
        i {
          position: relative;
          top: 10px;
          left: 30px;
          font-size: 22px;
        }
      }
      .logout {
        width: 270px;
        height: 50px;
        line-height: 50px;
        border-top: 1px #eee solid;
        font-size: 12px;
      }
      .logout:hover {
        background: #eee;
      }
    }
  }
</style>
