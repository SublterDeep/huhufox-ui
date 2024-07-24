import Vue from 'vue';
import App from './App.vue';
import _ from 'lodash';
import { throttle } from 'lodash';

Vue.config.productionTip = false;

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

new Vue({
  render: h => h(App),
}).$mount('#app')
