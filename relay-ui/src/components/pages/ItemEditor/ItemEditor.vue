<template>
<div class="full">
  <!-- <button class="close-btn" @click="$emit('close')">X</button> -->
  <ShaderEditor class="full" :item="item" v-if="item && item.type === 'vs-fs-shader'"/>
  <SliderEditor class="full" :item="item" v-if="item && item.type === 'sliders'" />
  <DrawEditor class="full" :item="item" v-if="item && item.type === 'drawing'" />
</div>
</template>

<script>
import * as SOC from '@/relay/socket.io.js'
import ShaderEditor from './ShaderEditor.vue'
import SliderEditor from './SliderEditor.vue'
import DrawEditor from './DrawEditor.vue'

export default {
  props: {
    itemID: {}
  },
  components: {
    ShaderEditor,
    SliderEditor,
    DrawEditor
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
.full{
  width: 100%;
  height: 100%;
}
</style>
