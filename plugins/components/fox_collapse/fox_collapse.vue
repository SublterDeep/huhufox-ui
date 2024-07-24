<template>
  <div class="root" @click.stop.prevent>
    <slot @onchange="onChange"></slot>
  </div>
</template>

<script>
const FOOTER_HEIGHT = 50;
import '../../style.css';
export default {
  name: 'fox_collapse',
  props: {
    accordion: { // 手风琴效果
      type: Boolean,
      default: false,
    },
    borderColor: {
      type: String,
      default: '#DCDFE6',
    },
    hoverColor: {
      type: String,
      default: '#409EFF',
    },
    contentColor: {
      type: String,
      default: null,
    },
    bottomText: { // 当position属性设置为bottom后，footer中的文本
      default: null,
    },
    showIcon: { // 是否显示图标
      type: Boolean,
      default: true,
    },
    lockContent: { // 锁定内容区域
      type: Boolean,
      default: false,
    },
    expand: { // 默认展开
      default: false,
    },
    sticky: { // 吸底效果 接受数组[所有添加吸底效果的列表项下标] 或 布尔值(影响所有直接子列表项) 或 数字/可转换成数字的下标字符串
      default: null,
    },
  },
  data() {
    return {
      index: -1,
      pNode: null, // 父指针(只指向外层的折叠面板)
      stickyChildList: [], // 所有开启吸底效果的子列表项集合
      stickyOnObj: {}, // 正在开启吸底效果的子列表项id集合
      scrollListener: null, // 滚动监听器对象
      scrollContainer: document, // 吸底效果滚动监听的对象(默认为document)
    }
  },
  watch: {
  },
  beforeMount() {
    this.initPnode();
  },
  mounted() {
    this.init();
  },
  deactivated() {
    this.handleDocScrollListener(false);
  },
  beforeDestroy() {
    this.handleDocScrollListener(false);
  },
  methods: {
    init() {
      this.initStyle();
      this.initPnode();
      setTimeout(() => {
        this.setScrollContainer();
        this.handleDocScrollListener(true);
      }, 0);
    },
    initStyle() {
      let arrExpand = this.analysisExpand();
      let arrSticky = this.analysisSticky();
      for (let i = 0; i < this.$slots.default.length; i++) {
        this.$slots.default[i].child.setIndex(i); // 设置每个列表项的id
        this.$slots.default[i].child.setColor('borderColor', this.borderColor); // 设置每个列表项的边框颜色
        this.$slots.default[i].child.setColor('hoverColor', this.hoverColor); // 设置每个列表项的悬浮颜色
        if (arrExpand[i]) this.$slots.default[i].child.setExpand(true); // 为每个列表项设置默认展开
        if (arrSticky[i]) this.$slots.default[i].child.setSticky(true); // 设置每个列表项的吸底效果
        if (!(_.isNull(this.contentColor))) this.$slots.default[i].child.setColor('contentColor', this.contentColor);
        if (!(_.isNull(this.bottomText))) this.$slots.default[i].child.setButtonText(this.bottomText); // 设置每个列表项的底部按钮文本
        if (!(_.isNull(this.showIcon))) this.$slots.default[i].child.setShowIcon(this.showIcon); // 设置每个列表项的图标显示状态
        if (!(_.isNull(this.lockContent))) this.$slots.default[i].child.setLockContent(this.lockContent); // 设置每个列表项的内容锁定状态
      }
    },
    // 解析expand参数
    analysisExpand() {
      let arrRes = [];
      // 处理expand默认展开参数
      if (_.isArray(this.expand)) {
        for (let i = 0; i < this.$slots.default.length; i++) {
          arrRes.push(false);
        }
        for (let i = 0; i < this.expand.length; i++) {
          if (this.expand[i] < this.$slots.default.length) arrRes[this.expand[i]] = true;
        }
      }
      else if (_.isBoolean(this.expand)) {
        for (let i = 0; i < this.$slots.default.length; i++) arrRes.push(this.expand);
      }
      return arrRes;
    },
    // 解析sticky参数
    analysisSticky() {
      let arrRes = [];
      // 处理expand默认展开参数
      if (_.isArray(this.sticky)) {
        for (let i = 0; i < this.$slots.default.length; i++) {
          arrRes.push(false);
        }
        for (let i = 0; i < this.sticky.length; i++) {
          if (this.sticky[i] < this.$slots.default.length) arrRes[this.sticky[i]] = true;
        }
      }
      else if (_.isBoolean(this.sticky)) {
        for (let i = 0; i < this.$slots.default.length; i++) arrRes.push(this.sticky);
      }
      return arrRes;
    },
    // 设置列表的父节点(如果父节点为列表项)
    initPnode() {
      if (this.$parent.$options._componentTag === "fox_collapse_item") {
        if ('header' in this.$parent.$slots) {
          let inHeader = false;
          for (let i = 0; i < this.$parent.$slots.header.length; i++) {
            if (this.$vnode.context._uid === this.$parent.$slots.header[i].context._uid) {
              inHeader = true;
              return;
            }
          }
          if (!inHeader) this.pNode = this.$parent;
        }
        else this.pNode = this.$parent;
      }
    },
    // 设置自定义容器滚动监听
    setScrollContainer(obj = null) {
      let defaultObj = null;
      if (_.isUndefined(this.$foxConfig.scrollContainer) || (typeof this.$foxConfig.scrollContainer !== 'object')) defaultObj = document;
      else defaultObj = this.$foxConfig.scrollContainer;
      if (_.isNull(obj) || (typeof obj !== 'object')) {
        this.scrollContainer = defaultObj;
      }
      else this.scrollContainer = obj;
      // console.log(this.scrollContainer);
    },
    // 列表项展开折叠触发
    onChange(id, status) {
      if (status && this.accordion) this.handleChildListStatus(id);
    },
    // 手风琴效果函数
    handleChildListStatus(id) {
      for (let i = 0; i < this.$slots.default.length; i++) {
        this.$slots.default[i].child.setOpen(i === id ? true : false);
      }
    },
    // 列表项内容大小改变
    onResize(mut, height) {
      if (!_.isNull(this.pNode)) {
        this.pNode.setHeight(mut, height);
        // 三层及以上嵌套高度依然有bug，也许需要递归
        this.pNode.$parent.onResize(mut, height);
      }
    },
    // 注册所有开启了吸底效果的子组件
    registStickyChild(node) {
      if (_.isNull(this.pNode)) { // 找到最外层的折叠面板组件
        this.stickyChildList.push(node);
      }
      else {
        this.pNode.$parent.registStickyChild(node);
      }
    },
    // 当直接子列表项吸底效果状态变化
    handleStickyItem() {
      if (_.isNull(this.pNode)) { // 找到最外层的折叠面板组件
        // console.log('重新计算所有子组件的位置和开关状态');
        let arr = [];
        for (let elm in this.stickyChildList) {
          let p = this.stickyChildList[elm].$parent.pNode;
          let puid = (_.isNull(p)) ? null : p._uid;
          let obj = {
            _uid: this.stickyChildList[elm]._uid,
            pNode: p,
            _puid: puid,
          }
          if (this.stickyChildList[elm].open && this.stickyChildList[elm].judgeStickyState() && this.stickyChildList[elm].stickyLoc) arr.push(obj);
          this.stickyChildList[elm].setStickyOn(false); // 关闭所有
        }
        // 创建一个空对象，用于存储层级结构
        this.stickyOnObj = this.buildHierarchy(arr);
        console.log(this._uid + ' : ' + JSON.stringify(this.stickyOnObj));
        // 创建一个空数组，扁平化层级结构并记录每个节点的层级深度
        const flattenedResult = this.flattenObject(this.stickyOnObj);
        const resultArray = Object.entries(flattenedResult).map(([key, value]) => ({ [key]: value }));
        this.setChildStickyPos(resultArray);
      }
      else this.pNode.$parent.handleStickyItem();
    },
    // 按照嵌套层级设置每个子组件的吸底位置
    setChildStickyPos(resArr) {
      let sortArr = resArr.sort((a, b) => {
        let aKey = Object.keys(a);
        let bKey = Object.keys(b);
        return a[aKey[0]] - b[bKey[0]];
      })
      for (let i = 0; i < sortArr.length; i++) {
        let e = sortArr[i];
        let uid = Object.keys(e);
        // 单独设置每一个展开的子组件的位置
        for (let y = 0; y < this.stickyChildList.length; y++) {
          if (this.stickyChildList[y]._uid == uid[0]) {
            let pos = `${i * FOOTER_HEIGHT}px`;
            this.stickyChildList[y].setStickyPos(pos);
            this.stickyChildList[y].setStickyOn(true);
            break;
          }
        }
      }
    },
    // 扁平化处理嵌套对象
    flattenObject(obj, depth = 0, result = {}) {
      for (const key in obj) {
        result[key] = depth;
        this.flattenObject(obj[key], depth + 1, result);
      }
      return result;
    },
    // 构建带有嵌套层级的对象
    buildHierarchy(data) {
      const nestedStructure = {};
      const nodeMap = {};
      data.forEach(item => {
        nodeMap[item._uid] = { ...item, children: {} };
      });
      data.forEach(item => {
        if (item._puid === null) {
          nestedStructure[item._uid] = nodeMap[item._uid];
        } else {
          if (!(_.isUndefined(nodeMap[item._puid]))) nodeMap[item._puid].children[item._uid] = nodeMap[item._uid];
        }
      });
      function stripProperties(node) {
        const { _uid, children } = node;
        const strippedChildren = {};
        for (const key in children) {
          strippedChildren[key] = stripProperties(children[key]);
        }
        return strippedChildren;
      }
      const result = {};
      for (const key in nestedStructure) {
        result[key] = stripProperties(nestedStructure[key]);
      }
      return result;
    },

    // 页面滚动监听 - 触发方式为子 组件调用 / 参数sticky传递了数值
    handleDocScrollListener(open) {
      this.$foxEventBus.setList(this);
      if (open) {
        this.scrollContainer.addEventListener('scroll', this.$foxEventBus.handleScroll); // 添加监听
      }
      else {
        this.scrollContainer.removeEventListener('scroll', this.$foxEventBus.handleScroll); // 取消监听
      }
    },
    // 刷新所有开启吸底效果的吸底检测
    handleScroll() {
      console.log(this._uid);
      this.handleStickyItem();
    },
  },
}
</script>
<style scoped lang="scss">
.root {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.root>div {
  border-top: 1px solid v-bind('borderColor');
}

.root>div:last-child {
  border-bottom: 1px solid v-bind('borderColor');
}
</style>
