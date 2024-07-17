<template>
  <div id="app">
    <div v-if="false"class="testArea">
      <fox_slider :arrData="arr_1"></fox_slider>
    </div>
    <div v-if="false" class="testArea">
      <fox_button :label="`点击切换${dmode?'白天':'深色'}模式`" @onClick="handleClick(...arguments, dmode)" :darkMode="dmode"></fox_button>
      <fox_button :label="'BUTTON'" :iconPosition="'left'">
        <template #icon>
          <span class="iconfont icon-arrow-down"></span>
        </template>
        <template #label>
          <span>BTN</span>
        </template>
      </fox_button>
      <fox_button :label="'BUTTON'" customInner darkMode>
        <template #customInner>
          <div style="width: 100px; height: 10px;" class="flex-center">BTN</div>
        </template>
      </fox_button>
      <fox_button :label="'BUTTON'"  :borderRadius="'20px'" :bgColor="'white'" :themeColor="'red'"></fox_button>
      <fox_button :label="'BUTTON'" darkMode :themeColor="'red'" :borderRadius="'20px'"></fox_button>
      <fox_button :label="'BUTTON'" darkMode :themeColor="'white'" :borderRadius="'20px'"></fox_button>
      <fox_button :label="'BUTTON'" darkMode mini :themeColor="'aqua'" :borderRadius="'auto'"></fox_button>
      <fox_button :label="'BUTTON'" darkMode large :themeColor="'pink'" :borderRadius="'auto'"></fox_button>
    </div>
    <div v-if="false" class="testArea">
      <fox_collapse>
        <fox_collapse_item :position="'bottom'">
          <template v-slot:header>
            <fox_slider :customGroup="false" :arrData="arr_2" ref="fox_slider">
            </fox_slider>
          </template>
          content
        </fox_collapse_item>
      </fox_collapse>
    </div>
    <div v-if="true" class="testArea">
      <fox_collapse :bottomText="'114444'" :showIcon="true" :lockContent="false" :expand="[0, 2, 1.5, 11]">
        <fox_collapse_item :label="'test11'" :position="'bottom'">
          <template v-slot:header1>
            <div>test bottom</div>
          </template>
          <template #bottom1>ttt</template>
          <template #icon1>icon</template>
          <template #bottomText1>ddd</template>
          content1
        </fox_collapse_item>
        <fox_collapse_item :label="'label 2'" :position="'bottom'" :bottomText="[123, 222]">label 2</fox_collapse_item>
        <fox_collapse_item :label="'label 3'" :position="'bottom'" :showIcon="true" :lockContent="false">label 3</fox_collapse_item>
        <fox_collapse_item :label="'label 4'" :position="'bottom'">label 4</fox_collapse_item>
      </fox_collapse>
    </div>
    <div v-if="false" class="testArea">
      <fox_collapse>
        <fox_collapse_item :position="'bottom'"  class="displayArea">
          <template v-slot:header>
            <div>
              
            <!-- 展示内容 -->
            <fox_collapse>
              <fox_collapse_item :label="'文本1：嵌套两层折叠面板'" :position="'right'">
                <fox_collapse>
                  <fox_collapse_item :label="'文本1_1'" :position="'left'">1_1</fox_collapse_item>
                  <fox_collapse_item :label="'文本1_2'" :position="'left'">1_2</fox_collapse_item>
                </fox_collapse>
              </fox_collapse_item>
              <fox_collapse_item :label="'文本2'">2</fox_collapse_item>
              <fox_collapse_item :label="'文本3：多层嵌套'">
                <div class="desc m_b">设置了手风琴效果</div>
                <fox_collapse accordion>
                  <fox_collapse_item :label="'文本3_1'" :position="'left'">3_1</fox_collapse_item>
                  <fox_collapse_item :label="'文本3_2'" :position="'left'">
                    <fox_collapse>
                      <fox_collapse_item :label="'文本3_2_1'" :position="'left'">3_2_1</fox_collapse_item>
                      <fox_collapse_item :label="'文本3_2_2'" :position="'left'">
                        <fox_collapse>
                          <fox_collapse_item :label="'文本3_2_2_1'" :position="'left'">3_2_2_1</fox_collapse_item>
                          <fox_collapse_item :label="'文本3_2_2_2'" :position="'left'">3_2_2_2：看晕了吗？别嵌套太多层比较好</fox_collapse_item>
                        </fox_collapse>
                      </fox_collapse_item>
                    </fox_collapse>
                  </fox_collapse_item>
                </fox_collapse>
              </fox_collapse_item>
              <fox_collapse_item :label="'文本4'" :position="'bottom'">
                <template v-slot:header><div class="tal">文本4：展开按钮图标在下方</div></template>4
              </fox_collapse_item>
            </fox_collapse>
            </div>
          </template>
          <!-- 代码放这 -->
          <p class="tal">Template:</p>

        </fox_collapse_item>
      </fox_collapse>
    </div>
  </div>
</template>

<script>
import fox_slider from '../plugins/components/fox_slider/fox_slider.vue'
import fox_collapse from '../plugins/components/fox_collapse/fox_collapse.vue'
import fox_collapse_item from '../plugins/components/fox_collapse_item/fox_collapse_item.vue';
import fox_button from '../plugins/components/fox_button/fox_button.vue';

export default {
  name: 'App',
  components: {
    fox_slider,
    fox_button,
    fox_collapse,
    fox_collapse_item,
  },
  data() {
    return {
      arr_1: ['01', '02', '03', '04', '01', '02', '03', '04'],
      arr_2: ['01', '02', '03', '04'],
      dmode: false,
    }
  },
  mounted() {
    /* setInterval(() => {
      this.dmode = !this.dmode;
      console.log(this.dmode);
    }, 1000); */
  },
  methods: {
    handleClick(ev, d) {
      console.log(ev);
      console.log('上次按钮状态:' + (d?'深色模式':'白天模式'));
      this.dmode = !d;
      console.log('变更状态为:' + (this.dmode?'深色模式':'白天模式'));
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