<template>
  <div class="root">
    <slot @onchange="onChange"></slot>
  </div>
</template>

<script>
import '../../style.css';
export default {
  name: 'fox_collapse',
  props: {
    accordion: { // 手风琴效果
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      index: -1,
      pNode: null,
    }
  },
  watch: {
  },
  mounted() {
    // 设置每个列表项的id
    for (let i=0 ; i<this.$slots.default.length ; i++) {
      this.$slots.default[i].child.setIndex(i);
    }
    // 设置列表的父节点(如果父节点为列表项)
    if (this.$parent.$options._componentTag === "fox_collapse_item") this.pNode = this.$parent;
  },
  methods: {
    // 列表项展开折叠触发
    onChange(id, status) {
      if (status && this.accordion) this.handleChildListStatus(id);
    },
    // 手风琴效果函数
    handleChildListStatus(id) {
    for (let i=0 ; i<this.$slots.default.length ; i++) {
      this.$slots.default[i].child.setOpen(i===id?true:false);
    }
    },
    // 列表项内容大小改变
    onResize(mut, height) {
      if (!_.isNull(this.pNode)) {
        this.pNode.setHeight(mut, height);
        // 三层及以上嵌套高度依然有bug，也许需要递归
        this.pNode.$parent.onResize(mut, height);
      }
    },
  },
}
</script>
<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.root>div {
  border-top: 1px solid #ccc;
}
.root>div:last-child {
  border-bottom: 1px solid #ccc;
}
</style>
