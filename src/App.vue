<template>
  <div id="app" ref="app">
    <div v-if="true" class="testArea" ref="testArea" style="padding-left: 100px;">
      <div v-if="true" style="height: 1000px;background-color: #eee;">超级长一大段内容</div>
      <fox_dropdown v-model="dmode" :height="280" left top >
        <fox_button darkMode @onClick="dmode = !dmode" style="margin-left: 100px;" label="BUTTON">
        </fox_button>
        <template #item>
          <div>
            <p>插槽内容1</p>
            <p>插槽内容1</p>
            <p>插槽内容1</p>
            <p>插槽内容2</p>
            <p>插槽内容2</p>
            <p>插槽内容2</p>
            <p>插槽内容3</p>
            <p>插槽内容3</p>
            <p>插槽内容3</p>
            <p>插槽内容4</p>
            <p>插槽内容4</p>
            <p>插槽内容4</p>
            <p>插槽内容5</p>
            <p>插槽内容5</p>
            <p>插槽内容5</p>
          </div>
        </template>
      </fox_dropdown>
      <fox_dropdown v-model="dmode1" :height="280" right bottom >
        <fox_button darkMode @onClick="dmode1 = !dmode1" style="margin-left: 690px;" label="BUTTON">
        </fox_button>
        <template #item>
          <div>
            <p>插槽内容1</p>
            <p>插槽内容1</p>
            <p>插槽内容1</p>
            <p>插槽内容2</p>
            <p>插槽内容2</p>
            <p>插槽内容2</p>
            <p>插槽内容3</p>
            <p>插槽内容3</p>
            <p>插槽内容3</p>
            <p>插槽内容4</p>
            <p>插槽内容4</p>
            <p>插槽内容4</p>
            <p>插槽内容5</p>
            <p>插槽内容5</p>
            <p>插槽内容5</p>
          </div>
        </template>
      </fox_dropdown>
      <div style="background-color: aqua;width: 939.484375px;height: 50px;">1</div>
      <div v-if="true" style="height: 1000px;background-color: #eee;">超级长一大段内容</div>
    </div>
  </div>
</template>

<script>
import fox_slider from '../plugins/components/fox_slider/fox_slider.vue'
import fox_collapse from '../plugins/components/fox_collapse/fox_collapse.vue'
import fox_collapse_item from '../plugins/components/fox_collapse_item/fox_collapse_item.vue';
import fox_button from '../plugins/components/fox_button/fox_button.vue';
import fox_dropdown from '../plugins/components/fox_dropdown/fox_dropdown.vue';

export default {
  name: 'App',
  components: {
    fox_slider,
    fox_button,
    fox_collapse,
    fox_collapse_item,
    fox_dropdown,
  },
  data() {
    return {
      arr_1: ['01', '02', '03', '04', '01', '02', '03', '04'],
      arr_2: ['01', '02', '03', '04'],
      dmode: false,
      dmode1: false,
    }
  },
  beforeMount() {
    // console.log(this.$refs.scrollArea);
  },
  mounted() {
    // setInterval(() => {
    // this.dmode = !this.dmode;
    // console.log(this.dmode);
    // }, 1000);
    // this.$foxConfig.setScrollContainer(document); // 配置全局默认项滚动容器监听对象
    // this.$foxConfig.setScrollContainer(this.$refs.app); // 配置全局默认项滚动容器监听对象
    // this.$foxConfig.scrollContainer = document; // 配置全局默认项滚动容器监听对象
    // this.$foxConfig.scrollContainer = this.$refs.app; // 配置全局默认项滚动容器监听对象
    // this.$refs.foxcollapse.setScrollContainer(12); // 单独配置滚动容器监听对象
  },
  methods: {
    handleClick(ev, d) {
      console.log(ev);
      console.log('上次按钮状态:' + (d ? '深色模式' : '白天模式'));
      this.dmode = !d;
      console.log('变更状态为:' + (this.dmode ? '深色模式' : '白天模式'));
    },
    handleChange(ev) {
      console.log(ev);
    },
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  height: 600px;
  overflow: auto;
}

.testArea {
  width: 100%;
  padding: 15px 0;
  box-sizing: border-box;
  background-color: #eaeaea;
  margin-bottom: 30px;
}

.scrollArea {
  height: 800px;
  overflow: auto;
  padding: 800px 0;
}

.copWrap {
  margin: 400px 0;
}
</style>