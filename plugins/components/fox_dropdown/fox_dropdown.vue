<template>
  <div class="fox_dropdown" ref="fox_dropdown">
    <slot></slot>
    <div v-if="true" class="dropdownWrap" ref="dropdownWrap" :style="{
      width: `${mySize.w}px`,
      height: `${mySize.h}px`,
      top: `${myPos.y}px`,
      left: `${myPos.x}px`,
      opacity: show ? '1' : '0.2'
    }">
      <slot v-if="('item' in $slots)" name="item"></slot>
      <div v-else>
        <span>列表数据容器</span>
        <span>{{ show ? '显示' : '隐藏' }}下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框</span>
      </div>
    </div>
  </div>
</template>

<script>
const ELM_GAP = 5;
const DEF_WIDTH = 170;
const DEF_HEIGHT = 300;
import '../../style.css';
export default {
  name: 'fox_dropdown',
  props: {
    width: { // 宽度 - auto为自动检测父元素 或者传入数字(默认单位px)或带单位的字符串
      default: 'auto',
    },
    height: { // 高度 - auto为自动检测父元素 或者传入数字(默认单位px)或带单位的字符串
      default: 'auto',
    },
    // 菜单展开位置 - 优先级低于是否超出显示区范围的计算结果
    top: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    position: null,
    darkMode: { // 暗色模式
      type: Boolean,
      default: false,
    },
    show: { // 是否显示下拉框
      default: false,
    },
    padding: {
      default: '10px 15px',
    },
    gap: { // 选项列表整体与父元素的间距
      type: Number,
      default: null,
    },
  },
  model: {
    prop: "show",
    event: "handelShow",
  },
  data() {
    return {
      pDom: null, // 绑定的父节点
      myPos: { x: 0, y: 0 }, // 元素位置
      mySize: { w: 0, h: 0 }, // 元素大小
      myDir: 'B', // 计算后的方向
    }
  },
  watch: {
    show(nval) {
      // console.log(nval);
      this.$nextTick(() => {
        this.initPosition(this.myDir); // 初始化自身位置
        this.initSize(); // 初始化自身大小`
      })
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initParentDOM(); // 初始化父节点
      this.initDirection(); // 初始化方位
      this.initPosition(this.myDir); // 初始化自身位置
      this.initSize(); // 初始化自身大小
    },
    // 初始化父节点
    initParentDOM() {
      this.pDom = this.$slots.default[0].elm;
    },
    // 初始化方位
    initDirection() {
      if (_.isUndefined(this.position)) {
        let arr = [];
        let xStr = null;
        let yStr = null;
        if (this.top) yStr = 'T';
        if (this.bottom) yStr = 'B';
        if (this.left) xStr = 'L';
        if (this.right) xStr = 'R';
        if (!(_.isNull(xStr))) arr.push(xStr);
        if (!(_.isNull(yStr))) arr.push(yStr);
        let str = arr.join('');
        this.myDir = str;
      }
      else {
        this.myDir = this.position;
      }
    },
    // 初始化自身位置
    initPosition(pos='B') {
      pos = pos.toUpperCase();
      let pWidth = parseInt(window.getComputedStyle(this.pDom).width);
      let pHeight = parseInt(window.getComputedStyle(this.pDom).height);
      let pXaxis = 0;
      let pYaxis = 0;
      let yMult = 1;
      // 计算x, y坐标
      if (pos === 'T') {
        pXaxis = this.pDom.offsetLeft;
        pYaxis = this.getSize().h + (parseInt(this.gap) || ELM_GAP);
        yMult = -1;
      }
      else if (pos === 'B') {
        pXaxis = this.pDom.offsetLeft;
        pYaxis = pHeight + (parseInt(this.gap) || ELM_GAP);
        yMult = 1;
      }
      else if (pos === 'L') {
        pXaxis = this.pDom.offsetLeft - this.getSize().w - (parseInt(this.gap) || ELM_GAP);
        pYaxis = this.pDom.offsetTop;
      }
      else if (pos === 'R') {
        pXaxis = this.pDom.offsetLeft + pWidth + (parseInt(this.gap) || ELM_GAP);
        pYaxis = this.pDom.offsetTop;
      }
      else if (pos === 'LT' || pos === 'TL') {
        pXaxis = this.pDom.offsetLeft - this.getSize().w - (parseInt(this.gap) || ELM_GAP);
        pYaxis = this.getSize().h + (parseInt(this.gap) || ELM_GAP);
        yMult = -1;
      }
      else if (pos === 'LB' || pos === 'BL') {
        pXaxis = this.pDom.offsetLeft - this.getSize().w - (parseInt(this.gap) || ELM_GAP);
        pYaxis = pHeight + (parseInt(this.gap) || ELM_GAP);
      }
      else if (pos === 'RT' || pos === 'TR') {
        pXaxis = this.pDom.offsetLeft + pWidth + (parseInt(this.gap) || ELM_GAP);
        pYaxis = this.getSize().h + (parseInt(this.gap) || ELM_GAP);
        yMult = -1;
      }
      else if (pos === 'RB' || pos === 'BR') {
        pXaxis = this.pDom.offsetLeft + pWidth + (parseInt(this.gap) || ELM_GAP);
        pYaxis = pHeight + (parseInt(this.gap) || ELM_GAP);
      }
      else {
        console.log('请检查position值');
        pXaxis = this.pDom.offsetLeft;
        pYaxis = pHeight + (parseInt(this.gap) || ELM_GAP);
        yMult = 1;
      }
      this.myPos.x = pXaxis;
      this.myPos.y = pYaxis * yMult;
    },
    // 初始化自身大小
    initSize() {
      // 优先检测是否存在指定大小 - width
      if (this.width === 'auto') {
        // 获取元素宽度
        let pWidth = this.pDom.clientWidth;
        let myWidth = 0;
        if (pWidth > 1000) myWidth = DEF_WIDTH;
        else myWidth = pWidth;
        this.mySize.w = myWidth;
      }
      else {
        this.mySize.w = this.width;
      }
      // 优先检测是否存在指定大小 - height
      if (this.height === 'auto') {
        this.mySize.h = DEF_HEIGHT;
      }
      else {
        this.mySize.h = this.height;
      }
    },
    getSize() {
      if (this.mySize.w === 0 && this.mySize.h === 0) this.initSize();
      return this.mySize;
    },
    handelShow(d) {
      console.log(d);
    },
  },
}
</script>
<style scoped lang="scss">
.fox_dropdown {
  position: relative;
  display: inline-block;
  background-color: lightcyan;
}

.dropdownWrap {
  background-color: lightsalmon;
  position: absolute;
  overflow: auto;
  transition: .2s opacity;
}
</style>