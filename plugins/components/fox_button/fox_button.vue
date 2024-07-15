<template>
  <div class="fox_button" @click.stop.prevent="handleClick">
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
import '../../style.css';
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
    labelColor: { // 文本和图标颜色
      default: null,
    },
    deLabelColor: { // 文本和图标颜色
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
    }
  },
  data() {
    return {
      fontSize: ['16px', '12px', '22px',],
      size_loc: 0,
      labelColor_loc: '',
      deLabelColor_loc: '',
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
      this.initLabelColor();
      this.initDeLabelColor();
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
    initLabelColor() {
      if (_.isNull(this.labelColor)) {
        this.labelColor_loc = this.darkMode ? '#fff' : '#333';
      }
      else this.labelColor_loc = this.labelColor;
    },
    initDeLabelColor() {
      if (_.isNull(this.deLabelColor)) {
        this.deLabelColor_loc = this.darkMode ? '#ccc' : '#666';
      }
      else this.deLabelColor_loc = this.deLabelColor;
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
  },
}
</script>
<style scoped lang="scss">
.fox_button {
  display: inline-block;
  user-select: none;
}
.flex-center {
  color: v-bind('deLabelColor_loc');
  transition: .2s;
  font-size: v-bind('fontSize[size_loc]');
}
.fox_button:hover .flex-center{
  text-shadow: 0 0 5px v-bind('labelColor_loc'),
               0 0 10px v-bind('themeColor'),
               0 0 15px v-bind('themeColor'),
               0 0 35px v-bind('themeColor');
  color: v-bind('labelColor_loc');
}
.fox_button:active .flex-center{
  text-shadow: 0 0 15px v-bind('labelColor_loc'),
               0 0 20px v-bind('themeColor'),
               0 0 25px v-bind('themeColor'),
               0 0 45px v-bind('themeColor');
  color: v-bind('themeColor');
  transform: scale(0.98);
}
</style>