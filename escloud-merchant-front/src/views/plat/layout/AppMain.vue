<template>
	<section class="app-main" style="min-height: 100%">
		<transition name="fade" mode="out-in">
			<router-view :key="key"></router-view>
		</transition>
	</section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .main-container {
    .el-menu--horizontal {
      border-bottom: none!important;
    }
  }
  .app-main {
    .app-container {
      box-shadow: 0 0 0.06rem rgba(117, 208, 255, 0.6);
    }
    .filter-container, .simpleFilter {
      padding: 20px;
      margin: 5px 20px 20px;
      box-shadow: 0 0 0.06rem rgba(117, 208, 255, 0.6);
    }
    .filter-container .searchProBtn {
      padding-right: 18px;
    }
    .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
      width: 95%!important;
      height: 34px;
      padding: 0 10px;
      input.el-range-input {
        width: 41%;
        font-size: 13px;
      }
      span.el-range-separator {
        width: auto;
      }
    }
    .el-table__body-wrapper.is-scroll-left table {
      border-collapse: separate;
      /*border-spacing: 0 10px;*/
    }
    .el-table__fixed-body-wrapper table {
      border-collapse: separate;
      /*border-spacing: 0 10px;*/
    }
    .el-table__fixed-body-wrapper table tr {
      border-radius: 6px!important;
    }
    .el-table__row td:first-child{
      border-radius: 6px 0 0 6px;
    }
    .el-table__row td:last-child{
      border-radius: 0 6px 6px 0;
    }
    .el-table__row {
      background-color: #eef3f7;
      padding: 0!important;
      min-height: 60px!important;
    }
    /*table button.el-button {*/
      /*width: 94px;*/
      /*color: #249ede;*/
      /*background: #fff;*/
      /*border: 1px #27abf1 solid;*/
    /*}*/
    /*table button.el-button:hover {*/
      /*color: #fff;*/
      /*background: linear-gradient(to bottom, #29b6ff, #249fdf);*/
    /*}*/

    .el-table{
      color: #363535!important;
      font-size: 14px;
    }
    .el-table thead {
      color: #323232!important;
    }
    .el-dialog {
      border-radius: 8px!important;
      overflow: hidden;
      .el-dialog__header {
        text-align: left;
        padding: 15px 15px 10px;
        background: linear-gradient(to bottom, #29b5ff, #249ede);
        span {
          color: #fff;
        }
        .el-dialog__close.el-icon.el-icon-close {
          color: #fff;
        }
        .el-dialog__close.el-icon.el-icon-close:hover {
          color: #eef3f7;
          transform-origin: center center;
          transform: rotateZ(90deg);
          transition: all .3s;
        }
      }
      .el-button.el-button--primary {
        background: linear-gradient(to bottom, #29b5ff, #249ede);
        color: #fff;
      }
      .dialog-footer {
        button.el-button {
          border-radius: 5px;
        }
      }
    }
    .el-transfer__button {
      border-radius: 5px;
    }
    .el-tree {
      height: 684px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
    .el-tree-node button.el-button {
      width: 45px;
    }
  }
</style>
