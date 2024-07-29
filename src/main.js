import Vue from 'vue';
import App from './App.vue';
import _ from 'lodash';
import { throttle } from 'lodash';
const THROTTLE_GAP = 50;

Vue.config.productionTip = false;

Vue.prototype.$foxEventBus = new Vue();
Vue.prototype.$foxEventBus.public = {
  scrollPos: 0,
  handleScroll: throttle((ev)=>{
    if (Vue.prototype.$foxConfig.scrollContainer === document) Vue.prototype.$foxEventBus.public.scrollPos = window.scrollY;
    else Vue.prototype.$foxEventBus.public.scrollPos = Vue.prototype.$foxConfig.scrollContainer.scrollTop;
    console.log(Vue.prototype.$foxEventBus.public.scrollPos);
  }, THROTTLE_GAP),
};

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
}, THROTTLE_GAP);

Vue.prototype.$foxConfig = new Vue();
Vue.prototype.$foxConfig.setScrollContainer = function(target) {
  Vue.prototype.$foxConfig.scrollContainer = target;
  target.addEventListener('scroll', Vue.prototype.$foxEventBus.public.handleScroll);
};

new Vue({
  render: h => h(App),
}).$mount('#app')
