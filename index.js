//组件
import fox_test from "./plugins/components/fox_test/index.js";
import fox_slider from "./plugins/components/fox_slider/index.js";
import fox_button from "./plugins/components/fox_button/index.js";
import fox_collapse from "./plugins/components/fox_collapse/index.js";
import fox_collapse_item from "./plugins/components/fox_collapse_item/index.js";

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