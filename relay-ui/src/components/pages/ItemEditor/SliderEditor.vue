<template>
<div class="editor">
  <span class="title"><span class="link" @click="$parent.$emit('close')">Home</span> / Slider Editor</span>
  <input type="text" class="pather" v-model="item.path" @input="onKeyStroke(item)" autofocus @keydown.esc="$parent.$emit('close')">
  <div class="se">
    <div class="slider" :key="iS" v-for="(slider, iS) in item.sliders">
      <input type="text" class="vb" v-model="slider.id" @input="onKeyStroke(item)" />
      <input type="text" class="vb" v-model="slider.min" @input="onKeyStroke(item)" />
      <input type="text" class="vb" v-model="slider.max" @input="onKeyStroke(item)" />
      <input type="text" class="vb" v-model="slider.value" @input="onKeyStroke(item)" />

      <button @click="clone(slider)">Clone</button>
      <button v-if="item.sliders.length > 1" @click="remove(slider)">Remove</button>
      <br />
      <input @input="onKeyStroke(item)" type="range" class="vs" :min="slider.min" :max="slider.max" v-model="slider.value" :step="0.01" />

    </div>
  </div>
</div>

</template>

<script>
import * as SOC from '@/relay/socket.io.js'

export default {
  components: {
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
      newItem.id = 's' + (Math.random() * 10000).toFixed(0)
      this.item.sliders.push(newItem)

      SOC.sync.update(this.item)
    }
  }
}
</script>

<style scoped>
.se{
  margin: 30px;
  width: calc(100% - 30px * 2);
}
.pather{
  width: calc(100% - 12px);
  font-size: 35px;
  border: none;
  outline: none;
  background-color: transparent;
  outline: transparent 1px;
  appearance: none;
  padding-left: 10px;
  margin-bottom: 10px;
  text-decoration: underline;
}
.title{
  display: block;
  margin-top: 10px;
  font-size: 10px;
  padding-left: 10px;
}

.link{
  cursor: pointer;
  color: rgb(98, 98, 218);
  text-decoration: underline;
}

.slider{
  width: 100%;
}

.vb{
  font-size: 17px;
  width: 30px;
}
.vs{
  margin: 20px 0px;
  width: calc(100%);
}
.editor{
  width: 100%;
  overflow-x: hidden;
}
</style>
