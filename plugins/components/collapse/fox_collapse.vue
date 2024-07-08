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
      default: false,
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
  },
}
</script>
<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  // gap: 5px 0;
}
.root>div {
  border-top: 1px solid #ccc;
}
.root>div:last-child {
  border-bottom: 1px solid #ccc;
}
</style>
