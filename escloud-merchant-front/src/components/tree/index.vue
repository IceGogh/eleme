<template>
  <div>
  <el-input
    placeholder="输入关键字进行过滤"
    v-model="filterText" size="small">
  </el-input>
  <el-tree
    class="filter-tree"
    highlight-current
    @node-click="handleNodeClick"
    @save-edit="CanSaveNext"
    @del-node="CanDelNext"
    style="overflow:auto;"
    :style="proSearchStatus ? 'height: 732px' : ''"
    :data="tableTree"
    :filter-node-method="filterNode"
    :props="defaultProps"
    ref="tree"
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :render-content="renderContent">
  </el-tree>
</div>
</template>

<script>
import TreeItem from './treeItems.vue'
export default {
  props: {
    tableTree: {
      type: Array,
      default() {
        return []
      }
    },
    width: {
      type: String,
      default: '200px'
    },
    proSearchStatus: {
      default: 'proSearchStatus'
    }
  },
  name: 'systemMenu',
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      runParam: {}
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(nodeData) {
      this.$emit('NodeClick', nodeData)
    },
    renderContent(h, { node, data, store }) {
      return h(TreeItem, {
        props: {
          value: data,
          treeNode: node
        },
        on: {
          input: (node) => {
            data = node
          },
          // 增加节点
          // Append:() => {
          //   node.expanded = true
          //   data.children.push({ id: this.$utilHelper.generateUUID(), label: '请输入模块名称', children: [], status: 1, isAdd: true })
          // },
          Append: (nodeData) => {
            var parentNode = this.$utilHelper.getNode(this.tableTree, data.id).parentNode
            this.runParam.parentNode = parentNode
            this.runParam.data = data
            this.runParam.nodeData = nodeData
            this.$emit('Append', parentNode, data)
          },
          OpenEdit: (nodeData) => {
            var parentNode = this.$utilHelper.getNode(this.tableTree, data.id).parentNode
            this.runParam.parentNode = parentNode
            this.runParam.data = data
            this.runParam.nodeData = nodeData
            this.$emit('OpenEdit', parentNode, data)
          },
          // 删除节点
          Delete: (nodeData) => {
            // 递归查找父节点
            var parentNode = this.$utilHelper.getNode(this.tableTree, data.id).parentNode
            this.runParam.parentNode = parentNode
            this.runParam.data = data
            this.runParam.nodeData = nodeData
            this.$emit('DelNode', parentNode, data, this.CanDelNext)
          },
          // 保存节点
          SaveEdit: (nodeData) => {
            // 递归查找父节点
            var parentNode = this.$utilHelper.getNode(this.tableTree, data.id).parentNode
            this.runParam.parentNode = parentNode
            this.runParam.data = data
            this.runParam.nodeData = nodeData
            this.$emit('SaveEdit', parentNode, data, this.CanSaveNext)
          },
          // 撤销修改
          CancelEdit: (nodeData) => {
            // 递归查找父节点
            var parentNode = this.$utilHelper.getNode(this.tableTree, data.id).parentNode
            if (data.isAdd) {
              parentNode.children.forEach((v, i) => {
                if (v.id === data.id) {
                  parentNode.children.splice(i, 1)
                }
              })
            } else {
              parentNode.children.forEach((v, i) => {
                if (v.id === data.id) {
                  parentNode.children.splice(i, 1, JSON.parse(JSON.stringify(nodeData)))
                }
              })
            }
          }
        }
      })
    },
    CanSaveNext(isNext, nodeId) {
      const parentNode = this.runParam.parentNode
      const nodeData = this.runParam.nodeData
      const data = this.runParam.data
      if (isNext) {
        parentNode.children.forEach((v, i) => {
          if (v.id === data.id) {
            if (this.HOST !== 'static' && data.isAdd) {
              data.value = nodeId
            }
            data.status = 0
            parentNode.children.splice(i, 1, data)
          }
        })
      } else {
        if (!data.isAdd) {
          parentNode.children.forEach((v, i) => {
            if (v.id === nodeData.id) {
              data.label = nodeData.label
              parentNode.children.splice(i, 1, data)
            }
          })
        }
      }
      this.runParam = {}
    },
    CanDelNext(isNext) {
      const parentNode = this.runParam.parentNode
      const data = this.runParam.data
      if (isNext) {
        parentNode.children.forEach((v, i) => {
          if (v.id === data.id) {
            parentNode.children.splice(i, 1)
          }
        })
      }
      this.runParam = {}
    }
    // CanAppendNext(isNext) {
    //   if (isNext) {
    //   }
    // },
    // CanOpenEditNext(isNext) {
    //   if (isNext) {
    //   }
    // }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    treeData: {
      handler: function(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
