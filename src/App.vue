<template>
  <div id="app">
    <fox_slider :arrData="arr_1"></fox_slider>
  </div>
</template>

<script>
import fox_slider from '../plugins/components/slider/fox_slider.vue'

export default {
  name: 'App',
  components: {
    fox_slider
  },
  data() {
    return {
      arr_1: ['01', '02', '03', '04'],
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
