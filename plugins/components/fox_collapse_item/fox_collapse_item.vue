<template>
  <div class="root" ref="root">
    <!-- 标题区 -->
    <header class="flex-center" :class="position" @click.stop="setOpen(!open)">
      <div v-if="('header' in $slots)" style="width: 100%">
        <slot name="header"></slot>
      </div>
      <div v-else>{{label}}</div>
      <!-- <div v-else>{{ _uid }}</div> -->
      <span v-if="(position === 'left' || position === 'right') && !('icon' in $slots)">
        <span v-if="showIconLoc"
          :class="(open ? 'iconfont icon-arrow-right nsel active' : 'iconfont icon-arrow-right nsel')"></span>
      </span>
      <span v-else-if="('icon' in $slots)">
        <slot name="icon"></slot>
      </span>
    </header>
    <!-- 内容区 -->
    <section :style="{ height: open ? height : '0px' }" ref="sectionContainer">
      <div class="container" ref="container">
        <slot></slot>
      </div>
    </section>
    <!-- 底部展开按钮区 -->
    <footer @click.stop="setOpen(!open)" :class="stickyOn ? 'fixed' : ''"
      v-if="(position === 'bottom') && !('bottom' in $slots)">
      <span v-if="!('icon' in $slots) && showIconLoc"
        :class="(open ? 'iconfont icon-arrow-down active_bottom nsel' : 'iconfont icon-arrow-down nsel')"></span>
      <span v-else>
        <slot name="icon"></slot>
      </span>
      <span v-if="!('bottomText' in $slots)" class="desc">{{ open ? bottomTextLoc[1] : bottomTextLoc[0] }}</span>
      <span v-else class="desc">
        <slot name="bottomText"></slot>
      </span>
    </footer>
    <footer @click.stop="setOpen(!open)" :class="stickyOn ? 'fixed' : ''" v-else-if="('bottom' in $slots)">
      <slot name="bottom"></slot>
    </footer>
  </div>
</template>

<script>
const DEFAULT_BOTTOM_TEXT = ['展开', '收起'];
export default {
  name: 'fox_collapse_item',
  props: {
    label: {}, // 列表项标题文字
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
    expand: { // 默认展开
      type: Boolean,
      default: null,
    },
    sticky: { // 吸底效果 接受布尔值(影响所有直接子列表项)
      default: null,
    },
  },
  data() {
    return {
      index: -1, // 每个折叠列表项会被初始化一个唯一id
      height: '100px', // 内容区高度
      open: false, // 是否展开
      borderColorLoc: '#DCDFE6',
      hoverColorLoc: '#409EFF',
      contentColorLoc: '#FAFAFA',
      bottomTextLoc: DEFAULT_BOTTOM_TEXT, // footer按钮文本
      showIconLoc: true, // 是否显示图标
      lockContentLoc: false, // 锁定内容区
      stickyLoc: false, // 是否开启了吸底效果功能
      stickyOn: false, // footer是否满足了吸底效果开启条件
      stickyPos: '0px', // 吸底效果开始时可能同时存在多个footer，每个footer距离屏幕可视区底部的距离 - 待完成
      footerWidth: 0, // 吸底效果开启时footer的宽度 - 开启吸底效果前重新计算此项
      footerLeft: 0, // 吸底效果开启时footer距离左边可视区的距离 - 开启吸底效果前重新计算此项
      footerBgcolor: null, // 吸底效果开启时footer的背景色
    }
  },
  watch: {
    open(nval) {
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.$parent.onResize(nval ? 1 : -1, this.height);
      this.$parent.onChange(this.index, nval);
      if (this.stickyLoc) {
        setTimeout(() => {
          this.$parent.handleStickyItem();
        }, 150);
      }
    },
    // 吸底效果变动后提交给父组件 标明吸底效果打开状态/自身_uid
    stickyOn(nval) {
      if (this.stickyLoc) {
        setTimeout(() => {
          this.$parent.handleStickyItem();
        }, 150);
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.setColor('borderColor', this.borderColor);
      this.setColor('hoverColor', this.hoverColor);
      this.setButtonText(DEFAULT_BOTTOM_TEXT);
      this.setExpand((_.isNull(this.expand)) ? false : this.expand);
      this.setSticky((_.isNull(this.sticky)) ? false : this.sticky);
    },
    setIndex(idx) {
      this.index = idx;
    },
    setExpand(ex) {
      if (this.lockContentLoc) return;
      this.height = this.$refs.container.getBoundingClientRect().height + 'px';
      this.open = (_.isNull(this.expand)) ? ex : this.expand;
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
    setSticky(target) {
      if (!_.isNull(this.sticky)) target = this.sticky; // 如果列表项自身接收到参数，则优先按照自身参数进行设置
      this.stickyLoc = target || false;
      if (this.stickyLoc) {
        this.$parent.registStickyChild(this);
      }
    },
    judgeStickyState() {
      if (!this.stickyLoc) return false;
      let docHeight = document.documentElement.clientHeight; // 窗口可视区高度
      let containerTopDis = this.$refs.sectionContainer.getBoundingClientRect().top - docHeight; // 内容区顶部距离页面顶距离
      let containerBotDis = this.$refs.sectionContainer.getBoundingClientRect().top + this.$refs.sectionContainer.clientHeight - docHeight; // 内容区底部距离页面顶距离

      // 当 内容区顶部距离页面顶距离 < 0 且 内容区底部距离页面顶距离 > 0 且 折叠列表项为打开状态 时
      if (containerTopDis < 0 && containerBotDis > 0 && this.open) {
        // 触发footer吸底效果
        this.footerWidth = this.$refs.sectionContainer.offsetWidth + 'px';
        this.footerLeft = this.$refs.sectionContainer.getBoundingClientRect().left + 'px';
        return true;
      }
      else {
        return false;
      }
    },
    setStickyOn(focusOff = false) {
      if (!this.stickyLoc) return;
      this.stickyOn = focusOff;
      // document.querySelector
      let dom = this.$refs.root;
      let color = '#fff';
      if (dom) {
        let style = window.getComputedStyle(dom, 'background-color');
        color = style.backgroundColor === 'rgb(255, 255, 255)' ? '#fff' : style.backgroundColor;
        this.footerBgcolor = color;
      }
      return;
    },
    setStickyPos(pos) {
      this.stickyPos = pos;
    },
  },
}
</script>
<style src="../../style.css" scoped></style>
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

footer:hover .desc,
footer:hover {
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

.bottom {
  width: 100%;
  justify-content: flex-start;
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

.fixed {
  width: v-bind('footerWidth');
  background-color: v-bind('footerBgcolor');
  position: fixed;
  bottom: v-bind('stickyPos');
  left: v-bind('footerLeft');
  z-index: 9;
}
</style>