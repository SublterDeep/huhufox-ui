//组件
import fox_test from "./plugins/components/fox_test/index.js";
import fox_slider from "./plugins/components/fox_slider/index.js";
import fox_button from "./plugins/components/fox_button/index.js";
import fox_collapse from "./plugins/components/fox_collapse/index.js";
import fox_collapse_item from "./plugins/components/fox_collapse_item/index.js";
// 方法
import { throttle } from 'lodash';

//所有组件列表
const components = [
  fox_test,
  fox_slider,
  fox_button,
  fox_collapse,
  fox_collapse_item,
];


//定义install方法，Vue作为参数
const install = Vue => {
  //判断是否安装，安装过就不用继续执行
  if (install.installed) return;
  install.installed = true;
  //遍历注册所有组件
  components.map(component => Vue.component(component.name, component));
  Vue.prototype.$foxEventBus = new Vue();
  Vue.prototype.$foxConfig = new Vue();

  Vue.prototype.$foxEventBus = new Vue();
  Vue.prototype.$foxEventBus.collapseList = [];
  Vue.prototype.$foxEventBus.setList = (node) => {
    Vue.prototype.$foxEventBus.collapseList.push(node);
  }
  Vue.prototype.$foxEventBus.handleScroll = throttle(() => {
    let arr = Vue.prototype.$foxEventBus.collapseList;
    for (let i = 0; i < arr.length; i++) {
      let isActive = true;
      isActive = arr[i]._isMounted;
      isActive = !arr[i]._isDestroyed;
      isActive = !arr[i]._isBeingDestroyed;
      if (isActive) arr[i].handleScroll();
    }
  }, 50);
};

//检测到Vue再执行
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const huhufoxUI = {
  install,
  //所有组件，必须具有install方法才能使用Vue.use()
  ...components
};
export default huhufoxUI;