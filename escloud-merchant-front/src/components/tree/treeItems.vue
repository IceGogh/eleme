<template>
  <span class="span_item">
    <span @click="Expanded">
      <el-input v-if="node.status == 1" style="width: 100px;" v-model="node.label" size="small" ></el-input>
      <span v-if="node.status != 1">{{node.label}}</span>
    </span>
    <!-- <el-button-group v-if="node.status == 1" class="span_op_btn">
      <el-button  size="small" type="primary" icon="el-icon-checkmark-circled" @click="SaveEdit">确认</el-button>
      <el-button  size="small" type="primary" icon="el-icon-checkmark-circled" @click="CancelEdit">取消</el-button>
    </el-button-group> -->
    <el-button-group class="span_icon">
      <el-button v-if="node.status == 0" size="small" type="primary" icon="el-icon-plus" @click.native="Append"></el-button>
      <el-button v-if="node.status == 0" size="small" type="primary" icon="el-icon-edit" @click.native="OpenEdit"></el-button>
      <el-button v-if="treeNodeCheck(node)" size="small" type="primary" icon="el-icon-delete" @click.native="Delete"></el-button>
    </el-button-group>
  </span>
</template>

<script>
    export default {
      data() {
        return {
          node: this.value,
          nodeData: JSON.parse(JSON.stringify(this.value))
        }
      },
      props: {
        value: {
          default: function() {
            return {}
          }
        },
        treeNode: {
          default: function() {
            return {}
          }
        }
      },
      methods: {
        treeNodeCheck(node) {
          if (!node.children) {
            return true
          }
          if (Array.isArray(node.children)) {
            if (node.children.length < 1 && node.status === 0) {
              return true
            }
          }
        },
        OpenEdit() {
          // this.node.status = 1
          // this.node.isAdd = false
          this.$emit('OpenEdit')
        },
        Append() {
          //  添加节点事件
          this.$emit('Append')
        },
        // SaveEdit() {
        //   //  保存节点事件
        //   this.$emit('SaveEdit', this.nodeData)
        // },
        // CancelEdit() {
        //   this.node.status = 0
        //   this.$emit('CancelEdit', this.nodeData)
        // },
        Delete() {
          this.$emit('Delete', this.nodeData)
        },
        Expanded() {
          this.treeNode.expanded = this.treeNode.expanded === 1
        }
      },
      watch: { // 监听对象 观察数据变化
        value: {
          handler: function(val, oldVal) {
            this.node = val
          },
          deep: true
        },
        node: {
          handler: function(val) {
            this.$emit('input', val)
          },
          deep: true
        }
      }
    }
</script>
<style>
  .span_item:hover .span_icon {
    display: inline-block;
  }
  .span_icon {
    display: none;
  }
  .span_op_btn {
    display: inline-block;
  }
</style>
