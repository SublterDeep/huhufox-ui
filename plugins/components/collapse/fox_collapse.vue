<template>
  <div class="root">
    <slot @onchange="onChange"></slot>
  </div>
</template>

<script>
export default {
  name: 'fox_collapse',
  props: {
    accordion: { // 手风琴效果
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      index: -1,
    }
  },
  watch: {
  },
  mounted() {
    for (let i=0 ; i<this.$slots.default.length ; i++) {
      this.$slots.default[i].child.setIndex(i);
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
      if (this.$parent.$parent.$options._componentTag === "fox_collapse") {
        this.$parent.setHeight(mut, height);
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
