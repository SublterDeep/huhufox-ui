<template>
  <div class="root" ref="root" @mouseenter="handleMouseHover(true)" @mouseleave="handleMouseHover(false)"
    :style="{ borderRadius: borderRadius + (typeof borderRadius === 'string' ? '' : 'px') }">
    <section class="coverArea" v-if="disable"></section>
    <section class="picArea" @click.stop.prevent @mousedown.prevent.stop="handleMousestart" @mousemove.prevent.stop="handleMousemove" @mouseup.prevent.stop="handleMouseend" @touchstart="handleTouchstart" @touchmove="handleTouchmove" @touchend="handleTouchend" :style="{ height: picHeight + (typeof picHeight === 'string' ? '' : 'px'), borderRadius: borderRadius + (typeof borderRadius === 'string' ? '' : 'px') }">
      <div class="picArrowArea" :style="{opacity: ((alwaysShowArrow || currentAlwaysShowArrow) ? 1 : 0)}"  v-if="arrData.length > 1 && showArrow">
        <div @click.stop="handleArrowBTNclick(false)" class="picArrowArea_leftBTN">
          <slot name="leftBTN"></slot>
          <div v-if="!('leftBTN' in $slots)" class="arrowBTN nsel iconfont icon-arrow-left-bold flex-center"></div>
        </div>
        <div @click.stop="handleArrowBTNclick(true)" class="picArrowArea_rightBTN">
          <slot name="rightBTN"></slot>
          <div v-if="!('rightBTN' in $slots)" class="arrowBTN nsel iconfont icon-arrow-right-bold flex-center"></div>
        </div>
      </div>
      <div class="pic_container" ref="pic_container">
        <section id="left_container"
          :style="{ width: `${containerWidth}px`, left: `${container_pos[0]+touchDis}px`, transition: (transitionAnim ? transitionTime : 0) + 's' }">
          <div class="imgContainer" v-for="(item, idx) in arrData" :key="idx" :style="{ background: item.color }">{{ idx
            + 1
            }}</div>
        </section>
        <section id="center_container"
          :style="{ width: `${containerWidth}px`, left: `${container_pos[1]+touchDis}px`, transition: (transitionAnim ? transitionTime : 0) + 's' }">
          <div class="imgContainer" v-for="(item, idx) in arrData" :key="idx" :style="{ background: item.color }">{{ idx
            + 1
            }}</div>
        </section>
        <section id="right_container"
          :style="{ width: `${containerWidth}px`, left: `${container_pos[2]+touchDis}px`, transition: (transitionAnim ? transitionTime : 0) + 's' }">
          <div class="imgContainer" v-for="(item, idx) in arrData" :key="idx" :style="{ background: item.color }">{{ idx
            + 1
            }}</div>
        </section>
      </div>
    </section>
    <section class="ctrlArea" :style="{ height: ctrlHeight + (typeof ctrlHeight === 'string' ? '' : 'px') }">
      <div class="btnGroupArea" v-if="showGroup"  @click.stop.prevent>
        <slot v-if="customGroup" name="groupBTN" :handleGroupClick="handleCtrlBTNclick"></slot>
        <div class="btnGroupArea nsel" v-else><div @click.stop="handleCtrlBTNclick(idx)" :class="getCtrlBTNactiveClass(idx)" v-for="(item, idx) in arrData"
          :key="idx"></div></div>
      </div>
    </section>
  </div>

</template>

<script>
const SHOT_SWIPE_TIME = 200; // 判定为快速滑动屏幕的最大时长
const SHOT_SWIPE_DIS = 0.08; // 判定为快速滑动屏幕的最小距离(计算方式为组件宽度*该值)
const LONG_SWIPE_DIS = 0.24; // 判定为普通滑动屏幕的最小距离(计算方式为组件宽度*该值)
import { setTimeout } from 'core-js';
import '../../style.css';
export default {
  name: 'fox_slider',
  props: {
    picHeight: {
      type: String || Number,
      default: '200px',
    },
    ctrlHeight: {
      type: String || Number,
      default: '25px',
    },
    disable: { // 关闭
      type: Boolean,
      default: false,
    },
    borderRadius: { // 圆角默认为0
      type: String || Number,
      default: '0px',
    },
    arrData: { // 图片数据
      type: Array,
      default: (data=[''])=>{return data},
    },
    transitionTime: { // 切换轮播图时过渡动画时长
      type: Number,
      default: 0.5,
    },
    autoScroll: { // 是否自动轮播
      type: Boolean,
      default: true
    },
    scrollTime: { // 自动轮播停留时长
      type: Number,
      default: 2000,
    },
    customGroup: { // 自定义底部按钮控制栏
      type: Boolean,
      default: false,
    },
    btnStyle: { // 箭头按钮和组按钮样式集
      type: Object,
      default: (data={})=>{return data}
      /* 
        {
          arrowColor: '#CACACA',
          arrowColor_hover: '#999',
          arrowColor_active: '#707070',
          arrowColor_arrow: '#fff',
          groupColor: '#CACACA',
          groupColor_hover: '#999',
          groupColor_active: '#707070',
          ...this.btnStyle,
        } 
      */
    },
    showArrow: { // 是否显示箭头按钮
      type: Boolean,
      default: true,
    },
    alwaysShowArrow: { // 是否一直显示箭头按钮
      type: Boolean,
      default: true,
    },
    showGroup: { // 是否显示组按钮
      type: Boolean,
      default: true,
    },
    mouseSwipe: { // 是否开启鼠标滑动控制轮播图翻页
      type: Boolean, 
      default: true,
    }
  },
  model: {
    data: {
      prop: "arrData",
      event: "handleDataChange",
    }
  },
  data() {
    return {
      nowSelect: 0, // 轮播图当前项下标
      intervalTimer: null, // 自动轮播计时器对象
      containerIndex: 0, // [左，中，右]容器对应[-1，0，1]
      containerWidth: 0, // [左，中，右]容器宽度
      singleContainerWidth: 0, // 容器中单个图片宽度
      container_pos: [0, 0, 0], // [左，中，右]容器x坐标
      container_timer: null,
      transitionAnim: true, // 是否启用翻页动画
      currentStyle: {}, // 计算后的按钮样式设定集
      currentAutoScroll: true, // 本地是否启用自动轮播
      currentAlwaysShowArrow: false, // 本地是否一直显示箭头按钮
      resizeObserver: null, // 组件大小变化监听器
      touchDuration: 0, // 触摸持续时间
      touchTimer: [null, null], // 触摸时长计时器
      touchPos: [{x: 0, y: 0}, {x: 0, y: 0}], // 触摸起始/结束位置
      touchDis: 0, // 触摸移动的距离
      isMouseDown: false, // 鼠标是否正在按下
    };
  },
  mounted() {
    const dom = this.$refs.root;
    window.addEventListener("resize", this.handleResize);
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(dom, { box: "border-box" });
    this.init();
  },
  beforeDestory() {
    this.resizeObserver.disconnect();
    this.handleInterval(false);
    this.clearTimeout(this.container_timer);
  },
  deactivated() {
    this.resizeObserver.disconnect();
    this.handleInterval(false);
    this.clearTimeout(this.container_timer);
  },
  watch: {
    currentAutoScroll(nval, oval) {
      this.handleInterval(nval);
    },
    // 轮播图分为 [左,中,右] 完全相等的三个部分,每个部分显示所有要轮播的图片 默认为中间部分轮播 当涉及跨度较大的轮播变化时 从中间轮播转到左/右轮播对应位置
    nowSelect(nval, oval) {
      if (nval === oval) return;
      let isRight = true;
      let domIndex = 0; // [左=-1，中=0，右=1]
      // 分别计算向左/向右滑动到选中项所需的步数 选择步数最少的一侧为滑动方向
      let leftStepNum = 0;
      let rightStepNum = 0;
      if (nval > oval) {
        leftStepNum = (oval - 0) + (this.arrData.length - nval);
        rightStepNum = nval - oval;
        domIndex = rightStepNum > leftStepNum ? -1 : 0;
      }
      else {
        leftStepNum = oval - nval;
        rightStepNum = (nval - 0) + (this.arrData.length - oval);
        domIndex = leftStepNum > rightStepNum ? 1 : 0;
      }
      isRight = rightStepNum > leftStepNum ? false : true;
      this.handleContainerPos(domIndex);
    },
    arrData: {
      handler(nval, oval) {
        // 图片数组数据有变化 
        if (this.nowSelect > nval.length) this.nowSelect = 0;
        this.init();
      },
      deep: true
    }
  },
  methods: {
    init() {
      if (_.isUndefined(this.arrData) || _.isNull(this.arrData) || this.arrData.length === 0) {
        console.log('轮播图组件：请在标签携带图片数组变量！(arrData: [])');
        return;
      }
      this.getContainerWidth();
      this.handleInterval(this.currentAutoScroll);
      this.handleData();
      this.handleBtnStyle();
      this.handleContainerPos(0);
    },
    handleMousestart(ev) {
      if (!this.mouseSwipe) return;
      this.isMouseDown =  true;
      this.transitionAnim = false;
      this.touchTimer[0] = new Date().getTime();
      this.touchPos[0] = {
        x: ev.clientX,
        y: ev.clientY
      };
    },
    handleMousemove(ev) {
      if (!this.isMouseDown || !this.mouseSwipe) return;
      this.touchPos[1] = {
        x: ev.clientX,
        y: ev.clientY
      };
      this.touchDis = Math.floor(this.touchPos[1].x - this.touchPos[0].x);
    },
    handleMouseend(ev) {
      if (!this.mouseSwipe) return;
      this.isMouseDown =  false;
      this.transitionAnim = true;
      this.touchTimer[1] = new Date().getTime();
      this.touchDuration = this.touchTimer[1] - this.touchTimer[0];
      this.touchPos[1] = {
        x: ev.clientX,
        y: ev.clientY
      };
      this.touchDis = Math.floor(this.touchPos[1].x - this.touchPos[0].x);
      // 快速滑动判定
      if (this.touchDuration < SHOT_SWIPE_TIME && (Math.abs(this.touchDis) > this.singleContainerWidth * SHOT_SWIPE_DIS)) {
        this.handleArrowBTNclick(this.touchDis <= 0 ? true : false);
        this.touchDis = 0;
        return;
      }
      // 普通滑动判定
      if (this.touchDuration >= SHOT_SWIPE_TIME && (Math.abs(this.touchDis) > this.singleContainerWidth * LONG_SWIPE_DIS)) {
        this.handleArrowBTNclick(this.touchDis <= 0 ? true : false);
        this.touchDis = 0;
        return;
      }
      this.$nextTick(()=>{
        this.touchDis = 0;
      });
    },
    // 移动端滑动屏幕处理函数
    handleTouchstart(ev) {
      this.transitionAnim = false;
      this.touchTimer[0] = new Date().getTime();
      this.touchPos[0] = {
        x: ev.targetTouches[0].clientX,
        y: ev.targetTouches[0].clientY
      };
    },
    handleTouchmove(ev) {
      this.touchPos[1] = {
        x: ev.targetTouches[0].clientX,
        y: ev.targetTouches[0].clientY
      };
      this.touchDis = Math.floor(this.touchPos[1].x - this.touchPos[0].x);
    },
    handleTouchend(ev) {
      this.transitionAnim = true;
      this.touchTimer[1] = new Date().getTime();
      this.touchDuration = this.touchTimer[1] - this.touchTimer[0];
      this.touchPos[1] = {
        x: ev.changedTouches[0].clientX,
        y: ev.changedTouches[0].clientY
      };
      this.touchDis = Math.floor(this.touchPos[1].x - this.touchPos[0].x);
      // 快速滑动判定
      if (this.touchDuration < SHOT_SWIPE_TIME && (Math.abs(this.touchDis) > this.singleContainerWidth * SHOT_SWIPE_DIS)) {
        this.handleArrowBTNclick(this.touchDis <= 0 ? true : false);
        this.touchDis = 0;
        return;
      }
      // 普通滑动判定
      if (this.touchDuration >= SHOT_SWIPE_TIME && (Math.abs(this.touchDis) > this.singleContainerWidth * LONG_SWIPE_DIS)) {
        this.handleArrowBTNclick(this.touchDis <= 0 ? true : false);
        this.touchDis = 0;
        return;
      }
      this.$nextTick(()=>{
        this.touchDis = 0;
      });
    },
    // 组件大小变动处理函数
    handleResize (ev) {
      this.getContainerWidth();
      this.handleContainerPos(0);
    },
    handleMouseHover (hover) {
      this.isMouseDown = false;
      this.currentAutoScroll = !hover;
      this.currentAlwaysShowArrow = hover;
      if (!hover) this.touchDis = 0;
    },
    // 初始化组件样式函数
    handleBtnStyle () {
      let btnStyle = {
        arrowColor: '#CACACA',
        arrowColor_hover: '#999',
        arrowColor_active: '#707070',
        arrowColor_arrow: '#fff',
        groupColor: '#CACACA',
        groupColor_hover: '#999',
        groupColor_active: '#707070',
        ...this.btnStyle,
      }
      this.currentStyle = btnStyle;
    },
    // 获取单个容器内容宽度
    getContainerWidth() {
      let elm = this.$refs.pic_container;
      if (_.isUndefined(elm) || _.isNull(this.$refs.pic_container)) return;
      let width = window.getComputedStyle(this.$refs.pic_container).width;
      this.singleContainerWidth = parseInt(width);
      return parseInt(width);
    },
    // 处理[左, 中, 右]容器位置
    handleContainerPos(idx) {
      // 获取容器宽度
      // let width = this.getContainerWidth();
      let width = this.singleContainerWidth;
      let containerWidth = width * this.arrData.length;
      let offsetWidth = -(width * this.nowSelect);
      // 优先检测快速翻页 --待完成
      if (!_.isNull(this.container_timer) && idx === 0) {
        /* console.log('快速翻页');
        clearTimeout(this.container_timer);
        this.container_timer = null;
        this.transitionAnim = false;
        let defaultPos = [-(containerWidth + offsetWidth), offsetWidth, (containerWidth + offsetWidth)];
        if (this.nowSelect !== 0) defaultPos
        this.container_pos = defaultPos = defaultPos;
        setTimeout(()=>{
          // 设置位置
          let arrPos = [-(containerWidth + offsetWidth), offsetWidth, (containerWidth + offsetWidth)];
          this.transitionAnim = true;
          this.container_pos = arrPos;
          this.containerWidth = containerWidth;
        }, 10);
        return; */
      }
      // 设置位置
      let arrPos = [-(containerWidth + offsetWidth), offsetWidth, (containerWidth + offsetWidth)];
      switch (idx) {
        case -1:
          arrPos = [offsetWidth, (containerWidth + offsetWidth), (containerWidth + offsetWidth) * 2];
          break;
        case 1:
          arrPos = [-((containerWidth + offsetWidth) * 2), -(containerWidth + offsetWidth), offsetWidth];
          break;
      }
      this.transitionAnim = true;
      this.container_pos = arrPos;
      this.containerWidth = containerWidth;
      if (_.isNull(this.container_timer) && idx !== 0) {
        this.container_timer = setTimeout(() => {
          this.transitionAnim = false;
          this.container_pos = [-(containerWidth + offsetWidth), offsetWidth, (containerWidth + offsetWidth)];
          this.container_timer = null;
        }, this.transitionTime * 1000);
      }
      else {
        clearTimeout(this.container_timer);
        this.container_timer = null;
      }
    },
    // 按钮点击事件
    handleCtrlBTNclick(idx) {
      this.nowSelect = idx;
      let n = idx - this.nowSelect;
    },
    // 左右箭头点击事件
    handleArrowBTNclick(plus) {
      if (plus) {
        // 下一页
        this.nowSelect = (this.nowSelect + 1) % this.arrData.length;
      }
      else {
        // 上一页
        if (this.nowSelect === 0) this.nowSelect = this.arrData.length - 1;
        else this.nowSelect = Math.abs(this.nowSelect - 1) % this.arrData.length;
      }
    },
    // 开启/关闭自动轮播计时器
    handleInterval(autoscroll = true) {
      if (autoscroll && this.autoScroll) {
        if (_.isNull(this.intervalTimer)) {
          let time = Math.abs(parseInt(this.scrollTime)) * 1000;
          if (time === 0 || _.isNaN(time)) {
            time = 2000;
            console.log('轮播停留时长值错误！请检查参数scrollTime');
          }
          this.intervalTimer = setInterval(() => {
            this.nowSelect = (this.nowSelect + 1) % this.arrData.length;
          }, time);
        }
      }
      else {
        clearInterval(this.intervalTimer);
        this.intervalTimer = null;
      }
    },
    // 获取当前选中样式
    getCtrlBTNactiveClass(idx) {
      if (idx === this.nowSelect) return 'ctrlBTN ctrlBTN_active';
      else return 'ctrlBTN';
    },
    // 处理图片数组
    handleData() {
      for (let i = 0; i < this.arrData.length; i++) {
        this.arrData[i] = {
          text: this.arrData[i],
          color: this.randomHexColor()
        }
      }
    },
    //随机生成十六进制颜色
    randomHexColor() {
      var hex = Math.floor(Math.random() * 16777216).toString(16);
      while (hex.length < 6) {
        hex = '0' + hex;
      }
      return '#' + hex;
    },
  },
}
</script>

<style lang="scss" scoped>
.coverArea {
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: .4;
  cursor: not-allowed;
  position: absolute;
  z-index: 2;
  transition: .15s;
}

.picArea {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.picArrowArea {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: .15s;
}

.picArrowArea_leftBTN {}

.picArrowArea_rightBTN {}

.arrowBTN {
  width: 30px;
  height: 55px;
  line-height: 55px;
  font-size: 24px;
  background-color: v-bind('currentStyle.arrowColor');
  color: v-bind('currentStyle.arrowColor_arrow');
  cursor: pointer;
  transition: .15s;
}

.arrowBTN:hover {
  background-color: v-bind('currentStyle.arrowColor_hover');
}

.arrowBTN:active {
  background-color: v-bind('currentStyle.arrowColor_active');
  transform: scale(0.95);
}

.pic_container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.ctrlArea {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btnGroupArea {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 0 20px;
}

.ctrlBTN {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: v-bind('currentStyle.groupColor');
  cursor: pointer;
  transition: .15s;
}

.ctrlBTN_active {
  background-color: v-bind('currentStyle.groupColor_active') !important;
}

.ctrlBTN:hover {
  background-color: v-bind('currentStyle.groupColor_hover');
}

.ctrlBTN:active {
  background-color: v-bind('currentStyle.groupColor_active') !important;
  transform: scale(0.95);
}

#left_container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  display: flex;
  // background-color: orange;
}

#center_container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  display: flex;
  // background-color: orangered;
}

#right_container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  display: flex;
  // background-color: orchid;
}

.imgContainer {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 33px;
  color: white;
}
</style>