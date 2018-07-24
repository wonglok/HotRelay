<template>
<div>
  <div v-if="item">
    <!-- <button class="close-btn" @click="$emit('close')">X</button> -->
    <ShaderEditor :item="item" v-if="item && item.type === 'vs-fs-shader'"/>
    <SliderEditor :item="item" v-if="item && item.type === 'sliders'" />
  </div>
</div>
</template>

<script>
import * as SOC from '@/relay/socket.io.js'
import ShaderEditor from './ShaderEditor.vue'
import SliderEditor from './SliderEditor.vue'

export default {
  props: {
    itemID: {}
  },
  components: {
    ShaderEditor,
    SliderEditor
  },
  data () {
    return {
      root: SOC.root
    }
  },
  computed: {
    state () {
      return this.root.state
    },
    item () {
      return this.state.data.find(d => d._id === this.itemID)
    }
  }
}
</script>

<style scoped>

</style>
