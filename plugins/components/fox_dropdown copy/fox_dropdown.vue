<template>
  <div v-if="false" class="fox_dropdown" ref="fox_dropdown" :style="{
    width: `${mySize.w}px`,
    height: `${mySize.h}px`,
    backgroundColor: `red`,
    top: `${myPos.y}px`,
    left: `${myPos.x}px`,
  }">
    <div style="background-color: lightpink; height: 100px;">
      <span>{{ show ? '显示' : '隐藏' }}下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框下拉框</span>
    </div>
  </div>
</template>

<script>
const ELM_GAP = 10;
const DEF_WIDTH = 170;
const DEF_HEIGHT = 300;
export default {
  name: 'fox_dropdown',
  props: {
    father: { // 绑定一个父元素 - 如果不传入父元素则默认绑定该标签外一层的元素
      default: null,
    },
    width: { // 宽度 - auto为自动检测父元素 或者传入数字(默认单位px)或带单位的字符串
      default: 'auto',
    },
    height: { // 高度 - auto为自动检测父元素 或者传入数字(默认单位px)或带单位的字符串
      default: 'auto',
    },
    darkMode: { // 暗色模式
      type: Boolean,
      default: false,
    },
    show: { // 是否显示下拉框
      default: false,
    },
    padding: {
      default: '10px 15px',
    }
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
    }
  },
  watch: {
    show(nval) {
      // console.log(nval);
      // this.initPosition(); // 初始化自身位置
      // this.initSize(); // 初始化自身大小
    }
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      this.initParentDOM(); // 初始化父节点
      this.initPosition(); // 初始化自身位置
      this.initSize(); // 初始化自身大小
    },
    // 初始化父节点
    initParentDOM() {
      // 如果指定了父元素，优先绑定指定元素
      if (!(_.isNull(this.father))) {
        this.pDom = this.father;
      }
      else {
        // 没有指定父元素则优先检测前一个兄弟节点
        let pDom = this.$refs.fox_dropdown.ParentNode;
        if (_.isNull(pDom)) {
          console.log(`下拉框_uid: ${this._uid}的父元素绑定错误！请检查标签书写位置或father属性`);
          pDom = document;
        }
        this.pDom = pDom;
      }
      // console.log(this.pDom);
    },
    // 初始化自身位置
    initPosition() {
      /* // 获取父元素高度
      let pHeight = this.pDom.clientHeight;
      // 获取父元素相对位置
      let pYaxis = this.pDom.offsetTop;
      let pXaxis = this.pDom.getBoundingClientRect().left;
      let myYaxis = pYaxis + pHeight + ELM_GAP;
      let myXaxis = pXaxis;
      // 获取滚动位置和可视区高度
      let scrollPos = this.$foxEventBus.public.scrollPos;
      let docHeight = document.documentElement.clientHeight;
      // 判断是否展开后超出屏幕下方
      if (scrollPos + docHeight > myYaxis + DEF_HEIGHT) {
        console.log('超出显示区 - 下');
      }

      this.myPos.y = myYaxis;
      this.myPos.x = myXaxis;
      console.log(`元素Y轴：${this.myPos.y}，X轴${this.myPos.x}`); */
      this.myPos.y = 100;
      this.myPos.x = 100;
    },
    // 初始化自身大小
    initSize() {
      // 优先检测是否存在指定大小 - width
      if (this.width === 'auto') {
        // 获取父元素宽度
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
    handelShow(d) {
      console.log(d);
    },
  },
}
</script>
<style src="../../style.css" scoped></style>
<style scoped lang="scss">
.fox_dropdown {
  position: absolute;
  padding: v-bind('padding');
  overflow: auto;
  display: block;
  flex-direction: column;
  flex-wrap: wrap;
}
</style>