<template>
  <ul class="topNavList">
    <li v-for="item in list">
      {{item}}
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'topNavi',
    data() {
      return {
        list: ['首页', '运营平台', '基础管理', '菜单管理']
      }
    }
  }
</script>
<style scoped>
  .topNavList {
    float: right;
    display: block;
    width: auto;
    height: 50px;
    margin: 0;
  }
  .topNavList li {
    position: relative;
    display: inline-block;
    width: 111px;
    height: 50px;
    text-align: center;
    color: #f1f1f1;
    line-height: 50px;
    cursor: pointer;
  }
  .topNavList li:after {
    content: '';
    position: absolute;
    width: 1px;
    height: 50px;
    background-color: #3d4448;
    left: -2px;
    top: 0;
  }
  .topNavList li:before {
    content: '';
    position: absolute;
    width: 1px;
    height: 50px;
    background-color: #1c1f21;
    right: -1px;
    top: 0;
  }
  .topNavList li:hover {
    color: #fff;
    background-color: #384044;
  }

</style>
