<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-input size="small" placeholder="关键词搜索" v-model="filterShiftForm.searchWord" @change="searchMerchantShift" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchMerchantShift"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <!-- 支持多选的表格-->
    <el-table v-if="multiple" ref="multipleTable" :data="shiftList" size='mini'
              v-loading="shiftListLoading"
              @selection-change="selectionChange"
              element-loading-text="加载中..." style="width: 100%; margin-top: 10px">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column header-align="center" width="100" align="center" show-overflow-tooltip label="班次名称" prop='shiftName'>
        <template slot-scope="scope">
          <span>{{scope.row.shiftName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" show-overflow-tooltip label="考勤时间">
        <template slot-scope="scope">
          <span v-html="renderShiftTimes(scope.row)">
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 支持单选的表格-->
    <el-table v-else ref="singleTable" :data="shiftList" size='mini'
              highlight-current-row
              @current-change="submitSeletedShift"
              v-loading="shiftListLoading"
              element-loading-text="加载中..." style="width: 100%; margin-top: 10px">
      <el-table-column header-align="center" width="100" align="center" show-overflow-tooltip label="班次名称" prop='shiftName'>
        <template slot-scope="scope">
          <span>{{scope.row.shiftName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" show-overflow-tooltip label="考勤时间">
        <template slot-scope="scope">
                <span v-html="renderShiftTimes(scope.row)">
                </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具栏-->
    <el-row>
      <el-col :span="24" style="text-align: right">
        <el-pagination v-show="!shiftListLoading" @current-change="currentPageChange" :current-page.sync="filterShiftForm.current" :page-size="filterShiftForm.pageSize"
                       layout="total, prev, next"
                       :total="shiftTotal">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getMerchantShiftList } from '@/api/merchant/work/merchantShift'

  export default {
    name: 'SelectShift',
    props: ['curApplicationCode', 'curProjectCode', 'multiple'],
    data() {
      return {
        shiftList: [],
        shiftTotal: 0,
        shiftListLoading: false,
        filterShiftForm: {
          searchWord: '',
          curProjectCode: '',
          current: 1,
          pageSize: 5
        },
        timeTypeEnum: {
          COMMONLY: 0, // 通用
          DST: 1, // 夏令时
          WT: 2 // 冬令时
        }
      }
    },
    created() {
      this.getMerchantShiftList()
    },
    mounted() {
      // 此时通过$on进行监听中间桥接函数setDefaultSelected
      this.$on('setDefaultSelected', (val) => {
        if (this.multiple) {
          this.toggleRowSelection(val)
        } else {
          this.setCurrentRow(val)
        }
      })
    },
    methods: {
      findById(id) {
        if (id) {
          for (let i = 0; i < this.shiftList.length; i++) {
            if (this.shiftList[i].id === id) {
              return this.shiftList[i]
            }
          }
        }
        return null
      },
      setCurrentRow(id) {
        const obj = this.findById(id)
        if (obj) {
          this.$refs.singleTable.setCurrentRow(obj)
        } else {
          this.$refs.singleTable.setCurrentRow()
        }
      },
      toggleRowSelection(ids) {
        this.$refs.multipleTable.clearSelection(this.$refs.multipleTable.selection)
        ids.map(id => {
          const obj = this.findById(id)
          if (obj) {
            this.$refs.multipleTable.toggleRowSelection(obj, true)
          }
        })
      },
      renderShiftTimes(row) {
        const merchantShiftTimeList = row.merchantShiftTimeList
        const shiftTimeData = {
          commonlyTimeList: [],
          dstTimeList: [],
          wtTimeList: []
        }
        shiftTimeData.commonlyTimeList = merchantShiftTimeList.filter((item) => {
          return item.timeType === this.timeTypeEnum.COMMONLY
        })

        shiftTimeData.dstTimeList = merchantShiftTimeList.filter((item) => {
          return item.timeType === this.timeTypeEnum.DST
        })

        shiftTimeData.wtTimeList = merchantShiftTimeList.filter((item) => {
          return item.timeType === this.timeTypeEnum.WT
        })

        const htmlStrArray = []
        let i = 0
        if (shiftTimeData.commonlyTimeList.length > 0) {
          shiftTimeData.commonlyTimeList.map(time => {
            htmlStrArray.push(`${time.inWorkTime.substr(0, 5)} - ${time.offWorkTime.substr(0, 5)}`)
            if (i < shiftTimeData.commonlyTimeList.length - 1) {
              htmlStrArray.push('&nbsp;&nbsp;')
            }
            i += 1
          })
        } else {
          htmlStrArray.push('夏令时')
          shiftTimeData.dstTimeList.map(time => {
            htmlStrArray.push(`${time.inWorkTime.substr(0, 5)} - ${time.offWorkTime.substr(0, 5)}`)
            if (i < shiftTimeData.dstTimeList.length - 1) {
              htmlStrArray.push('&nbsp;&nbsp;')
            }
            i += 1
          })
          htmlStrArray.push('<br/>')
          htmlStrArray.push('冬令时')
          i = 0
          shiftTimeData.wtTimeList.map(time => {
            htmlStrArray.push(`${time.inWorkTime.substr(0, 5)} - ${time.offWorkTime.substr(0, 5)}`)
            if (i < shiftTimeData.wtTimeList.length - 1) {
              htmlStrArray.push('&nbsp;&nbsp;')
            }
            i += 1
          })
        }

        return htmlStrArray.join('')
      },
      getMerchantShiftList() {
        this.filterShiftForm.curApplicationCode = this.curApplicationCode
        this.filterShiftForm.curProjectCode = this.curProjectCode
        this.shiftListLoading = true
        getMerchantShiftList(this.filterShiftForm).then(response => {
          if (response.data.error_no === 0) {
            this.shiftList = response.data.result.records
            this.shiftTotal = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.shiftListLoading = false
        })
      },
      searchMerchantShift() {
        this.filterShiftForm.current = 1
        this.getMerchantShiftList()
      },
      currentPageChange(val) {
        this.filterShiftForm.current = val
        this.getMerchantShiftList()
      },
      submitSeletedShift(shiftObj) {
        this.$emit('callback', shiftObj)
      },
      selectionChange(selection) {
        const selectShifts = []
        for (let i = 0; i < selection.length; i++) {
          selectShifts.push(selection[i])
        }

        this.$emit('callback', selectShifts)
      }
    }
  }
</script>

<style scoped>
</style>
