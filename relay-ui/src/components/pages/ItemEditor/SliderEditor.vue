<template>
  <div class="editor">
    <div class="header">
      <span class="title"><span class="link" @click="$parent.$emit('close')">Home</span> / Slider Editor</span>
      <input type="text" class="pather" v-model="item.path" @input="onKeyStroke(item)" autofocus @keydown.esc="$parent.$emit('close')">
    </div>
    <div class="slider-container">

      <div class="slider" :key="iS" v-for="(slider, iS) in item.sliders">
        <input type="text" class="vb" v-model="slider.id" @input="onKeyStroke(item)" />
        <input type="number" step="0.1" class="vb" v-model="slider.min" @input="onKeyStroke(item)" />
        <input type="number" step="0.1" class="vb" v-model="slider.max" @input="onKeyStroke(item)" />
        <input type="number" step="0.1" class="vb" v-model="slider.value" @input="onKeyStroke(item)" />

        <button @click="clone(slider)">Clone</button>
        <button v-if="item.sliders.length > 1" @click="remove(slider)">Remove</button>
        <br />

        <vue-slider :tooltip="false" :dot-size="36" @drag-end="onKeyStroke(item)" @input="onInput(item)" type="range" class="vs" :min="slider.min" :max="slider.max" v-model="slider.value" :interval="0.1" />

      </div>

      <div class="taller"></div>
    </div>
  </div>

</template>

<script>
import * as SOC from '@/relay/socket.io.js'
import vueSlider from 'vue-slider-component'
var throttle = require('lodash.throttle')

export default {
  components: {
    vueSlider
  },
  props: {
    item: {}
  },
  data () {
    return {
      height: 500,
      width: '49%'
    }
  },
  mounted () {
    var resizer = () => {
      this.height = window.innerHeight - 100
      this.width = window.innerWidth <= 769 ? '100%' : '49%'
      this.$forceUpdate()
    }
    resizer()
    window.addEventListener('resize', () => {
      resizer()
    }, false)
  },
  methods: {
    onInput: throttle((item) => {
      SOC.sync.update(item)
    }, 100),
    onKeyStroke (item) {
      SOC.sync.update(item)
    },
    onSave (item) {
      SOC.sync.update(item)
      SOC.sync.commitToDisk()
    },
    remove (iS) {
      this.item.sliders.splice(iS, 1)
      SOC.sync.update(this.item)
    },
    clone (slider) {
      let newItem = JSON.parse(JSON.stringify(slider))
      newItem.id = 's' + (this.item.sliders.length + 1)
      this.item.sliders.push(newItem)

      SOC.sync.update(this.item)
    }
  }
}
</script>

<style scoped>
@import url(./shared.css);

.slider{
  width: 100%;
}
.vb{
  font-size: 17px;
  width: 55px;
}
.vs{
  margin: 20px 0px;
  width: calc(100%);
}
.slider-container{
  margin: 0px 30px;
  width: calc(100% - 30px * 2);
  height: calc(100% - 70px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.taller{
  height: 70px;
}
</style>
