<template>
  <div class="root" @click.stop.prevent>
    <slot @onchange="onChange"></slot>
  </div>
</template>

<script>
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
      scrollListener: null,
      stickyChildList: [], // 所有开启吸底效果的子列表项集合
      stickyOnObj: {}, // 正在开启吸底效果的子列表项id集合
    }
  },
  watch: {
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
      if (!(_.isNull(this.sticky))) this.handleDocScrollListener(true);
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
    initPnode() {
      // 设置列表的父节点(如果父节点为列表项)
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
    // 页面滚动监听 - 触发方式为子 组件调用 / 参数sticky传递了数值
    handleDocScrollListener(open) {
      if (open) {
        if (_.isNull(this.scrollListener)) {
          // 添加监听 -- 吸底效果功能暂不支持嵌套！
          if (_.isNull(this.pNode)) this.scrollListener = document.addEventListener('scroll', this.handleScroll);
        }
        // 初始化所有需要监听的子列表项元素对象列表
        let arrStickyChildList = [];
        for (let i=0 ; i<this.$children.length ; i++) {
          if (this.$children[i]._data.stickyLoc) arrStickyChildList.push(this.$children[i]);
        }
        this.stickyChildList = arrStickyChildList;
        // console.log(this.stickyChildList);
      }
      else {
        if (!(_.isNull(this.scrollListener))) {
          // 取消监听
          document.removeEventListener(this.scrollListener);
        }
      }
    },
    // 刷新所有开启吸底效果的吸底检测
    handleScroll() {
      this.stickyChildList.forEach(elm => {
        if (_.isNull(this.pNode)) elm.setStickyOn(); // document.documentElement.scrollTop
      });
    },
    // 当直接子列表项吸底效果状态变化
    handleStickyItem(state, id, pid=null) {
      if (_.isNull(pid)) {
        // 在当前层对象进行修改
        if (state) {
          if (!(id in this.stickyOnObj)) {
            this.stickyOnObj[id] = {};
          }
        }
        else {
          if (id in this.stickyOnObj) delete this.stickyOnObj[id]
        }
      }
      else {
      }
      // 如果存在父节点，将修改过后的对象传递给父节点
      if (!(_.isNull(this.pNode))) {
        this.pNode.$parent.handleStickyItem(state, id, this.pNode._uid);
      }
      // 如果不存在父节点，开始按从外到内的顺序递归分配每一层每个折叠元素的位置
      else {
        // console.log(JSON.stringify(this.stickyOnObj));
        // this.handleStickyPos(0);
      }
    },
    handleStickyPos(pos) {
      for (let elm in this.stickyChildList) {
        // console.log(this.stickyChildList[elm]);
      }
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
