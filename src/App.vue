<template>
  <div id="app">
    <div class="testArea">
      <fox_collapse>
        <fox_collapse_item :position="'bottom'">
          <template v-slot:header>
            <fox_slider :customGroup="false" :arrData="arr_2" ref="fox_slider">
              <!-- <template v-slot:leftBTN>
                <div>left</div>
                <div>left</div>
                <div>left</div>
              </template> -->
              <!-- <template v-slot:rightBTN>
                <div>right</div>
                <div>right</div>
                <div>right</div>
              </template> -->
              <template #groupBTN="{handleGroupClick}">
                <div @click="handleGroupClick(idx);" v-for="(item, idx) in arr_2">{{ idx+1 }}</div>
              </template>
            </fox_slider>
          </template>
          content
        </fox_collapse_item>
      </fox_collapse>
    </div>
    <div class="testArea">
      <fox_collapse>
        <fox_collapse_item :label="'文本1'" :position="'right'">
          <fox_collapse>
            <fox_collapse_item :label="'文本1_1'" :position="'left'">1_1</fox_collapse_item>
            <fox_collapse_item :label="'文本1_2'" :position="'left'">1_2</fox_collapse_item>
          </fox_collapse>
        </fox_collapse_item>
        <fox_collapse_item :label="'文本2'" :borderColor="'red'" :hoverColor="'red'">2</fox_collapse_item>
        <fox_collapse_item :label="'文本3'">
          <fox_collapse>
            <fox_collapse_item :label="'文本3_1'" :position="'left'">3_1</fox_collapse_item>
            <fox_collapse_item :label="'文本3_2'" :position="'left'">
              <fox_collapse>
                <fox_collapse_item :label="'文本3_2_1'" :position="'left'">3_2_1</fox_collapse_item>
                <fox_collapse_item :label="'文本3_2_2'" :position="'left'">
                  <fox_collapse>
                    <fox_collapse_item :label="'文本3_2_2_1'" :position="'left'">3_2_2_1</fox_collapse_item>
                    <fox_collapse_item :label="'文本3_2_2_2'" :position="'left'">3_2_2_2</fox_collapse_item>
                  </fox_collapse>
                </fox_collapse_item>
              </fox_collapse>
            </fox_collapse_item>
          </fox_collapse>
        </fox_collapse_item>
        <fox_collapse_item :label="'文本4'" :position="'bottom'">
          <template v-slot:header>
            <div style="width: 100px;height: 100px; background-color: red;">header_3</div>
          </template>
          <div style="width: 100px;height: 100px; background-color: red;">content_3</div>
        </fox_collapse_item>
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
      arr_1: ['01', '02', '03', '04', '01', '02', '03', '04'],
      arr_2: ['01', '02', '03', '04'],
    }
  },
  methods: {
    handleClick(idx) {
      console.log(idx);
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
}
.testArea {
  width: 100%; padding: 15px 0;
  box-sizing: border-box;
  background-color: #eaeaea;
  margin-bottom: 30px;
}
</style>
