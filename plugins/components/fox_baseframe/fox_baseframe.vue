<template>
  <div class="fox_baseframe"
    @mouseenter="showLightEffect=true"
    @mouseleave="showLightEffect=false"
    @mousemove="handlePos"
    >
    <div class="borderContainer flex-center">
      <div :style="{opacity: showLightEffect?'1':'0', left: `${pos.x}px`, top: `${pos.y}px`}" class="lightEffect"></div>
      <div class="innerContainer">
        <div :style="{opacity: showLightEffect?'0.25':'0', left: `${pos.x}px`, top: `${pos.y}px`}" class="lightEffect innerLight"></div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import '../../style.css';
export default {
  name: 'fox_baseframe',
  props: {
    themeColor: { // 主题色
      type: String,
      default: null,
    },
    bgColor: { // 背景色
      type: String,
      default: null,
    },
    borderRadius: { // 外边框圆角 - 不给单位默认px
      default: 'auto',
    },
    mini: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'normal', // large > normal > mini
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      themeColor_loc: '',
      bgColor_loc: '',
      borderRadius_loc: ['', ''],
      size_loc: 0, // 0 = normal  1 = mini  2 = large
      size_arr: [
        { // normal
          innerPadding: '10px 35px',
          lightEffectSize: '100px',
          innerLightEffectSize: '90px',
          autoBorderRadius: ['20px', '17px'], // outer inner
        },
        { // mini
          innerPadding: '5px 15px',
          lightEffectSize: '50px',
          innerLightEffectSize: '60px',
          autoBorderRadius: ['15px', '13px'], // outer inner
        },
        { // large
          innerPadding: '12px 45px',
          lightEffectSize: '150px',
          innerLightEffectSize: '130px',
          autoBorderRadius: ['40px', '37px'], // outer inner
        },
      ],
      pos: {x: 0, y: 0},
      showLightEffect: false,
    }
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
      this.initThemeColor();
      this.initBgColor();
      this.initBoderRadius();
    },
    initColor(cname) {
      this[`${cname}_loc`] = this[cname];
    },
    initThemeColor() {
      if (_.isNull(this.themeColor)) this.themeColor_loc = 'aqua';
      else this.themeColor_loc = this.themeColor;
    },
    initBgColor() {
      if (_.isNull(this.bgColor)) {
        this.bgColor_loc = this.darkMode ? '#2D2D2D' : '#fff';
      }
      else this.bgColor_loc = this.bgColor;
    },
    initBoderRadius() {
      if (this.borderRadius === 'auto') {
        switch (this.size_loc) {
          case 0:
            this.borderRadius_loc = this.size_arr[0].autoBorderRadius;
            break;
          case 1:
            this.borderRadius_loc = this.size_arr[1].autoBorderRadius;
            break;
          case 2:
            this.borderRadius_loc = this.size_arr[2].autoBorderRadius;
            break;
        }
      }
      else {
        if (typeof this.borderRadius === 'string') {
          let num = parseInt(this.borderRadius);
          let arr = this.borderRadius.split('');
          let danwei = arr.filter((elm)=>{return (_.isNaN(Number(elm)))});
          this.borderRadius_loc[0] = num + '' + danwei.join('');
          this.borderRadius_loc[1] = num + (-4) + '' + danwei.join('');
        }
        else {
          this.borderRadius_loc[0] = this.borderRadius + 'px';
          this.borderRadius_loc[1] = this.borderRadius + (-4) + 'px';
        }
      }
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
      // console.log(this.size_loc);
    },
    handlePos(ev) {
      this.pos.x= ev.offsetX;
      this.pos.y= ev.offsetY;
    }
  },
}
</script>
<style scoped lang="scss">
.fox_baseframe {
  display: inline-block;
  overflow: hidden;
}
.borderContainer {
  padding: 3px;
  box-sizing: border-box;
  background-color: v-bind('bgColor_loc');
  position: relative;
  overflow: hidden;
  border-radius: v-bind('borderRadius_loc[0]');
  transition: .2s;
}
.innerContainer {
  background-color: v-bind('bgColor_loc');
  padding: v-bind('size_arr[size_loc].innerPadding');
  // padding: 10px 35px;
  position: relative;
  overflow: hidden;
  border-radius: v-bind('borderRadius_loc[1]');
  pointer-events: none;
  transition: .2s;
}
.lightEffect {
  width: v-bind('size_arr[size_loc].lightEffectSize');height: v-bind('size_arr[size_loc].lightEffectSize');
  position: absolute;
  background: radial-gradient(
    v-bind('themeColor_loc') ,
    transparent 85%,
  );
  transform: translateX(-50%) translateY(-50%);
  pointer-events: none;
  transition: .3s opacity;
}
.innerLight {
  width: v-bind('size_arr[size_loc].innerLightEffectSize');height: v-bind('size_arr[size_loc].innerLightEffectSize');
  background: radial-gradient(
    v-bind('themeColor_loc') ,
    transparent 85%,
  );
}
</style>
