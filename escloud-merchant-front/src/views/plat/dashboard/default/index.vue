<template>
	<div class="dashboard-editor-container">
		<el-row :gutter="20">
			<el-col :span="12">
				<line-chart></line-chart>
			</el-col>
			<el-col :span="12">
				<todo-list></todo-list>
			</el-col>
		</el-row>

	</div>
</template>

<script>
import countTo from 'vue-count-to'
import todoList from '@/components/TodoList'
import lineChart from './lineChart'

export default {
  name: 'dashboard-default',
  components: { countTo, todoList, lineChart },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
    margin: 30px;
    .btn-group {
        margin-bottom: 60px;
    }
    .box-card-header {
        position: relative;
        height: 160px;
    }
    .panThumb {
        z-index: 100;
        height: 150px;
        width: 150px;
        position: absolute;
        left: 0px;
        right: 0px;
        margin: auto;
    }
    .display_name{
        font-size: 30px;
        display: block;
    }
    .info-item{
        display: inline-block;
        margin-top: 10px;
        font-size: 14px;
        &:last-of-type{
            margin-left: 15px;
        }
    }
}
</style>
