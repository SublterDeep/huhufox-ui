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
      if (!_.isNull(this.contentColor)) this.$slots.default[i].child.setColor('contentColor', this.contentColor);
    }
    // console.log(Object.keys(this.$parent.$slots).length);
    // console.log(this.$vnode);
    // 设置列表的父节点(如果父节点为列表项)
    if (this.$parent.$options._componentTag === "fox_collapse_item") {
      // 判断父元素有没有插槽，如果父元素没有插槽，直接赋值
      if (Object.keys(this.$parent.$slots).length === 0) this.pNode = this.$parent;
      else {
        // 判断当前折叠列表是否位于父元素的$slots中
        let thisvnode = this.$vnode;
        let parentslots = this.$parent.$slots;
        let isInclude = false;
        for(let elm in parentslots) {
          for (let i=0 ; i<parentslots[elm].length ; i++) {
            if (!(_.isUndefined(parentslots[elm][i].context))) {
              if (_.isEqual(thisvnode.context._uid, parentslots[elm][i].context._uid)) {
                isInclude = true;
                return;
              }
            }
          }
        }
        if (!isInclude) this.pNode = this.$parent;
      }
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
