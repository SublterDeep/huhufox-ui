<template>
  <div class="root" @click.stop.prevent>
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
    },
    borderColor: {
      type: String,
      default: '#DCDFE6',
    },
    hoverColor: {
      type: String,
      default: '#409EFF',
    },
    contentColor: {
      type: String,
      default: null,
    },
    bottomText: { // 当position属性设置为bottom后，footer中的文本
      default: null,
    },
    showIcon: { // 是否显示图标
      type: Boolean,
      default: true,
    },
    lockContent: { // 锁定内容区域
      type: Boolean,
      default: false,
    },
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
    // 设置每个列表项的id和边框颜色
    for (let i=0 ; i<this.$slots.default.length ; i++) {
      this.$slots.default[i].child.setIndex(i);
      this.$slots.default[i].child.setColor('borderColor', this.borderColor);
      this.$slots.default[i].child.setColor('hoverColor', this.hoverColor);
      if (!(_.isNull(this.contentColor))) this.$slots.default[i].child.setColor('contentColor', this.contentColor);
    }
    for (let i=0 ; i<this.$slots.default.length ; i++) {
      if (!(_.isNull(this.bottomText))) this.$slots.default[i].child.setButtonText(this.bottomText); // 设置每个列表项的底部按钮文本
      if (!(_.isNull(this.showIcon))) this.$slots.default[i].child.setShowIcon(this.showIcon); // 设置每个列表项的图标显示状态
      if (!(_.isNull(this.lockContent))) this.$slots.default[i].child.setLockContent(this.lockContent); // 设置每个列表项的内容锁定状态
    }
    // 设置列表的父节点(如果父节点为列表项)
    if (this.$parent.$options._componentTag === "fox_collapse_item") {
      if ('header' in this.$parent.$slots) {
        let inHeader = false;
        for (let i=0 ; i<this.$parent.$slots.header.length ; i++) {
          if (this.$vnode.context._uid === this.$parent.$slots.header[i].context._uid) {
            inHeader = true;
            return;
          }
        }
        if (!inHeader) this.pNode = this.$parent;
      }
      else this.pNode = this.$parent;
    }
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
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.root>div {
  border-top: 1px solid v-bind('borderColor');
}
.root>div:last-child {
  border-bottom: 1px solid v-bind('borderColor');
}
</style>
