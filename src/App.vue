<template>
  <div id="app">
    <div class="testArea">
      <fox_slider :arrData="arr_1" />
    </div>
    <div class="testArea">
      <fox_collapse>
        <fox_collapse_item :label="'文本1'">
          <fox_collapse>
            <fox_collapse_item :label="'文本1'">1_1</fox_collapse_item>
            <fox_collapse_item :label="'文本2'" :position="'left'">1_2</fox_collapse_item>
          </fox_collapse>
        </fox_collapse_item>
        <fox_collapse_item :label="'文本2'" :position="'left'">2</fox_collapse_item>
        <fox_collapse_item :label="'文本3'">
          <fox_collapse>
            <fox_collapse_item :label="'文本1'">3_1</fox_collapse_item>
            <fox_collapse_item :label="'文本2'" :position="'left'">3_2</fox_collapse_item>
          </fox_collapse>
        </fox_collapse_item>
        <fox_collapse_item :label="'文本4'" :position="'bottom'">3</fox_collapse_item>
      </fox_collapse>
    </div>
  </div>
</template>

<script>
import fox_slider from '../plugins/components/slider/fox_slider.vue'
import fox_collapse from '../plugins/components/collapse/fox_collapse.vue'
import fox_collapse_item from '../plugins/components/collapse_item/fox_collapse_item.vue';

export default {
  name: 'App',
  components: {
    fox_slider,
    fox_collapse,
    fox_collapse_item,
  },
  data() {
    return {
      arr_1: ['01', '02', '03', '04'],
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.testArea {
  width: 100%; padding: 15px 0;
  box-sizing: border-box;
  background-color: #eaeaea;
  margin-bottom: 30px;
}
</style>
