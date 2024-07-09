<template>
  <div class="root">
    <header :class="position" @click="setOpen(!open)">
      <span>{{label}}</span>
      <span v-if="position==='left' || position==='right'">
        <span :class="(open ? 'iconfont icon-arrow-right active' : 'iconfont icon-arrow-right')"></span>
      </span>
    </header>
    <section :style="{height: open ? height : '0px'}">
      <div class="container" ref="container"><slot></slot></div>
    </section>
    <footer @click="setOpen(!open)"  v-if="position==='bottom'">
      <span :class="(open ? 'iconfont icon-arrow-down active_bottom' : 'iconfont icon-arrow-down')"></span>
      <span class="desc">展开</span>
    </footer>
  </div>
</template>

<script>
import '../../style.css';
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
    label: {  },
    position: {
      type: String,
      default: 'right',
    },
  },
  watch: {
    open(nval) {
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.$parent.onResize(nval?1:-1, this.height);
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
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.open = op;
    },
    setHeight(m, h) {
      this.height = (parseInt(this.height) + (parseInt(h) * m)) + 'px';
    },
  },
}
</script>
<style scoped lang="scss">
.root {
  position: relative;
}
header {
  box-sizing: border-box;
  padding: 15px;
}
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 10px;
  font-size: 12px;
  box-sizing: border-box;
  padding: 15px;
  border-top: 1px solid #ccc;
}
.desc {
  cursor: pointer;
  transition: .15s;
}
footer:hover .desc,footer:hover {
  color: aqua;
}
section {
  box-sizing: border-box;
  padding: 0 10px;
  transition: .2s;
  overflow: hidden;
}
.container {
  box-sizing: border-box;
  padding: 10px 15px;
  border-top: 1px solid #ccc;
  background-color: #eaeaea;
  margin-bottom: 5px;
}
.left {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-end;
  gap: 0 15px;
}
.right {
  display: flex;
  justify-content: space-between;
}
.iconfont {
  transition: .15s;
  display: inline-block;
}
.active {
  transform: rotate(90deg);
}
.active_bottom {
  transform: rotate(180deg);
}
</style>