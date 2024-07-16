<template>
  <div class="root">
    <header class="flex-center" :class="position" @click.stop="setOpen(!open)">
      <div v-if="('header' in $slots)" style="width: 100%"><slot name="header"></slot></div>
      <div v-else>{{label}}</div>
      <span v-if="(position==='left' || position==='right') && !('icon' in $slots)">
        <span v-if="showIconLoc" :class="(open ? 'iconfont icon-arrow-right nsel active' : 'iconfont icon-arrow-right nsel')"></span>
      </span>
      <span v-else-if="('icon' in $slots)"><slot name="icon"></slot></span>
    </header>
    <section :style="{height: open ? height : '0px'}">
      <div class="container" ref="container"><slot></slot></div>
    </section>
    <footer @click.stop="setOpen(!open)"  v-if="(position==='bottom') && !('bottom' in $slots)">
      <span v-if="!('icon' in $slots) && showIconLoc" :class="(open ? 'iconfont icon-arrow-down active_bottom nsel' : 'iconfont icon-arrow-down nsel')"></span>
      <span v-else><slot name="icon"></slot></span>
      <span v-if="!('bottomText' in $slots)"class="desc">{{ open?bottomTextLoc[1]:bottomTextLoc[0] }}</span>
      <span v-else class="desc"><slot name="bottomText"></slot></span>
    </footer>
    <footer @click.stop="setOpen(!open)"  v-else-if="('bottom' in $slots)"><slot name="bottom"></slot></footer>
  </div>
</template>

<script>
const DEFAULT_BOTTOM_TEXT = ['展开', '收起'];
import '../../style.css';
export default {
  name: 'fox_collapse_item',
  data() {
    return {
      index: -1,
      height: '100px',
      open: false,
      borderColorLoc: '#DCDFE6',
      hoverColorLoc: '#409EFF',
      contentColorLoc: '#FAFAFA',
      bottomTextLoc: DEFAULT_BOTTOM_TEXT,
      showIconLoc: true,
      lockContentLoc: false,
    }
  },
  props: {
    label: {  }, // 列表项标题文字
    position: { // 展开图标位置
      type: String,
      default: 'right',
    },
    borderColor: { // 边框颜色
      type: String,
      default: null,
    },
    hoverColor: { // 鼠标悬浮后按钮图标和文字的颜色
      type: String,
      default: null,
    },
    contentColor: { // 内容区域颜色
      type: String,
      default: null,
    },
    bottomText: { // 当position属性设置为bottom后，footer中的文本
      default: null,
    },
    showIcon: { // 是否显示图标
      type: Boolean,
      default: null,
    },
    lockContent: { // 锁定内容区域
      type: Boolean,
      default: null,
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
    this.init();
  },
  methods: {
    init() {
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.setColor('borderColor', this.borderColor);
      this.setColor('hoverColor', this.hoverColor);
      this.setButtonText();
    },
    setIndex(idx) {
      this.index = idx;
    },
    setOpen(op) {
      if (this.lockContentLoc) return;
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.open = op;
    },
    setHeight(m, h) {
      this.height = (parseInt(this.height) + (parseInt(h) * m)) + 'px';
    },
    setColor(name, color) {
      if (_.isNull(this[name])) this[`${name}Loc`] = color;
      else this[`${name}Loc`] = this[name]
    },
    setButtonText(target) {
      if (!_.isNull(this.bottomText)) target = this.bottomText; // 如果列表项自身接收到参数，则优先按照自身参数进行设置
      if (_.isArray(target)) {
        if (target.length === 0) this.bottomTextLoc = DEFAULT_BOTTOM_TEXT;
        else if (target.length === 1) this.bottomTextLoc = [target[0], target[0]];
        else this.bottomTextLoc = [...target];
      }
      else {
        this.bottomTextLoc = [String(target), String(target)];
      }
    },
    setShowIcon(target) {
      if (!_.isNull(this.showIcon)) target = this.showIcon; // 如果列表项自身接收到参数，则优先按照自身参数进行设置
      this.showIconLoc = target;
    },
    setLockContent(target) {
      if (!_.isNull(this.lockContent)) target = this.lockContent; // 如果列表项自身接收到参数，则优先按照自身参数进行设置
      this.lockContentLoc = target;
    },
  },
}
</script>
<style scoped lang="scss">
.root {
  width: 100%;
  // position: relative;
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
  border-top: 1px solid v-bind('borderColorLoc');
}
.desc {
  cursor: pointer;
  transition: .15s;
}
footer:hover .desc,footer:hover {
  color: v-bind('hoverColorLoc');
}
section {
  box-sizing: border-box;
  padding: 0 10px;
  transition: .15s;
  overflow: hidden;
}
.container {
  box-sizing: border-box;
  padding: 10px 15px;
  border-top: 1px solid v-bind('borderColorLoc');
  background-color: v-bind('contentColorLoc');
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
  cursor: pointer;
}
.iconfont:hover {
  color: v-bind('hoverColorLoc');
}
.active {
  transform: rotate(90deg);
}
.active_bottom {
  transform: rotate(180deg);
}
</style>