<template>
<div class="editor">
  <div class="header">
    <span class="title"><span class="link" @click="$parent.$emit('close')">Home</span> / Slider Editor</span>
    <input type="text" class="pather" v-model="item.path" @input="onKeyStroke(item)" autofocus @keydown.esc="$parent.$emit('close')">
  </div>
  <DrawBoard
    :info="item"
    @draw-update="onKeyStroke(item)"
  />
  <!-- <canvas ref="canvas" class="canvas"></canvas> -->
</div>

</template>

<script>
import * as SOC from '@/relay/socket.io.js'
import DrawBoard from './DrawBoard.vue'

export default {
  components: {
    DrawBoard
  },
  props: {
    item: {}
  },
  data () {
    return {
    }
  },
  mounted () {
    // let resizer = () => {
    //   let canvas = this.$refs['canvas']
    //   var rect = canvas.getBoundingClientRect()
    //   canvas.width = rect.width
    //   canvas.height = rect.height
    // }
    // window.addEventListener('resize', resizer, false)
    // resizer()
  },
  methods: {
    onKeyStroke (item) {
      SOC.sync.update(item)
    },
    onSave (item) {
      SOC.sync.update(item)
      SOC.sync.commitToDisk()
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
@import url(./shared.css);

.canvas{
  width: 100%;
  height: 100%;
  border-top: black solid 1px;
  height: calc(100% - 70px - 10px);
  margin-bottom: -6px;
}

</style>
