<template>
  <div class="fox_button nsel" @click.stop.prevent="handleClick" @mousedown="handleTimer(true)" @mouseup="handleTimer(false)" @mouseleave="handleTimer(false)" @contextmenu="handleMenu">
    <fox_baseframe
      :themeColor="themeColor"
      :bgColor="bgColor"
      :borderRadius="borderRadius"
      :large="large"
      :mini="mini"
      :size="size"
      :darkMode="darkMode"
      >
      <div v-if="('customInner' in $slots) || customInner" class="flex-center">
        <slot name="customInner"></slot>
      </div>
      <div :class="getIconClass()" :style="{gap: iconGap}" v-else>
        <slot v-if="('icon' in $slots)" name="icon"></slot>
        <slot v-if="('label' in $slots)" name="label"></slot>
        <span v-else>{{ label }}</span>
      </div>
    </fox_baseframe>
  </div>
</template>

<script>
const DARK_TEXT_COLOR = ['#ccc', '#fff', '#fff'];
const LIGHT_TEXT_COLOR = ['#666', '#333', '#000'];
import fox_baseframe from '../fox_baseframe/fox_baseframe.vue';
export default {
  name: 'fox_button',
  props: {
    label: {}, // 按钮内文本
    themeColor: { // 按钮主题色
      type: String,
      default: 'aqua',
    },
    bgColor: { // 背景色
      type: String,
      default: null,
    },
    textColor: { // 文本和图标颜色 接受一个字符串或者数组['默认颜色', '悬浮颜色', '激活颜色']
      default: null,
    },
    borderRadius: { // 按钮外边框圆角 - 不给单位默认px
      default: 'auto',
    },
    customInner: { // 完全自定义按钮内DOM
      type: Boolean,
      default: false,
    },
    mini: { // 按钮尺寸 - 小
      type: Boolean,
      default: false,
    },
    large: { // 按钮尺寸 - 大
      type: Boolean,
      default: false,
    },
    size: { // 按钮尺寸
      type: String,
      default: 'normal', // large > normal > mini
    },
    darkMode: { // 深色模式
      type: Boolean,
      default: false,
    },
    iconPosition: { // 图标与文字相对位置
      type: String,
      default: 'left',
    },
    iconGap: { // 图标与文字间距
      default: '5px',
    },
    longPress: { // 长按按钮
      type: Boolean,
      default: false,
    },
    longPressTime: { // 长按事件触发所需时长
      default: 1000,
    },
    longPressEvent: { // 长按事件触发的回调函数
      type: Function,
      default: ()=>{},
    },
    menuPress: { // 右键按下
      type: Boolean,
      default: false,
    },
    menuPressEvent: { // 右键按下触发的回调函数
      type: Function,
      default: ()=>{},
    },
  },
  data() {
    return {
      fontSize: ['16px', '12px', '22px',],
      textColor_Loc: null,
      size_loc: 0,
      longPressTimer: null, // 长按计时器
    }
  },
  components: {
    fox_baseframe,
  },
  watch: {
    darkMode(nval) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initSize();
      this.initColor();
    },
    initSize() {
      if (this.large || this.mini) {
        if (this.size === 'normal') {
          // 给标签式尺寸参数同时没给参数式尺寸参数
          this.size_loc = this.large ? 2 : 1;
        }
        else {
          // 给标签式尺寸参数同时给参数式尺寸参数 - 以参数式尺寸为准
          this.size_loc = this.size === 'large' ? 2 : 1;
        }
      }
      else {
        switch (this.size) {
          case 'large':
            this.size_loc = 2;
            break;
          case 'normal':
            this.size_loc = 0;
            break;
          case 'mini':
            this.size_loc = 1;
            break;
        }
      }
    },
    initColor() {
      if (_.isNull(this.textColor)) {
        this.textColor_Loc = this.darkMode ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;
        this.textColor_Loc[2] = this.themeColor;
      }
      else {
        if (typeof this.textColor === 'string') {
          this.textColor_Loc = [this.textColor, this.textColor, this.textColor];
          return;
        }
        if (this.textColor.length >= 3) this.textColor_Loc = this.textColor;
        else if (this.textColor.length === 2) {
          this.textColor_Loc = this.textColor;
          this.textColor_Loc.push(this.themeColor);
        }
        else if (this.textColor.length === 1) this.textColor_Loc = [this.textColor[0], this.textColor[0], this.textColor[0]];
        else {
          this.textColor_Loc = this.darkMode ? DARK_TEXT_COLOR : LIGHT_TEXT_COLOR;
          this.textColor_Loc[2] = this.themeColor;
        }
      }
    },
    handleClick(ev) {
      this.$emit('onClick', ev);
    },
    getIconClass() {
      switch (this.iconPosition) {
        case 'left':
          return 'flex-center';
        case 'right':
          return 'flex-center flex-rev';
        case 'top':
          return 'flex-center flex-col';
        case 'bottom':
          return 'flex-center flex-col-rev';
      }
    },
    // 管理长按计时器
    handleTimer(open=false) {
      if (!this.longPress ) return;
      if (open) {
        // console.log('timer on!');
        if (_.isNull(this.longPressTimer)) {
          this.longPressTimer = setTimeout(() => {
            this.handleLongPress();
          }, this.longPressTime);
        }
      }
      else {
        // console.log('timer cancel!');
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    },
    handleLongPress() {
      // console.log('long press active!');
      this.longPressEvent();
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    },
    // 右键事件
    handleMenu(ev) {
      if (!this.menuPress) return;
      ev.preventDefault();
      ev.stopPropagation();
      // console.log('menu click !');
      this.menuPressEvent();
    },
  },
}
</script>
<style src="../../style.css" scoped></style>
<style scoped lang="scss">
.fox_button {
  display: inline-block;
}
.flex-center {
  color: v-bind('textColor_Loc[0]');
  transition: .2s;
  font-size: v-bind('fontSize[size_loc]');
}
.fox_button:hover .flex-center{
  text-shadow: 0 0 5px v-bind('textColor_Loc[1]'),
               0 0 10px v-bind('themeColor'),
               0 0 15px v-bind('themeColor'),
               0 0 35px v-bind('themeColor');
  color: v-bind('textColor_Loc[1]');
}
.fox_button:active .flex-center{
  text-shadow: 0 0 15px v-bind('textColor_Loc[1]'),
               0 0 20px v-bind('themeColor'),
               0 0 25px v-bind('themeColor'),
               0 0 45px v-bind('themeColor');
  color: v-bind('textColor_Loc[2]');
  transform: scale(0.98);
}
</style>