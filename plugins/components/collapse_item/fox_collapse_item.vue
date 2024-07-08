<template>
  <div class="root">
    <header @click="open=!open">
      <span>文本</span>
      <span v-if="position==='left' || position==='right'">图标</span>
    </header>
    <section :style="{height: open ? height : '0px'}">
      <div class="container" ref="container"><slot></slot></div>
    </section>
    <footer @click="open=!open"  v-if="position==='bottom'">label footer</footer>
  </div>
</template>

<script>
export default {
  name: 'fox_collapse_item',
  data() {
    return {
      index: -1,
      height: '100px',
      open: false,
    }
  },
  props: {
    label: { type: String, },
    position: {
      type: String,
      default: 'right',
    },
  },
  watch: {
    open(nval) {
      this.$parent.onChange(this.index, nval);
    }
  },
  mounted() {
    this.height = this.$refs.container.getBoundingClientRect().height + 'px';
  },
  methods: {
    setIndex(idx) {
      this.index = idx;
    },
    setOpen(op) {
      this.open = op;
    },
  },
}
</script>
<style scoped lang="scss">
.root {
  // background-color: #f60;
}
header,footer {
  padding: 15px 0;
}
section {
  transition: .2s;
  overflow: hidden;
}
.container {
  box-sizing: border-box;
  padding: 10px 0;
  border-top: 1px solid #eee;
}
</style>
