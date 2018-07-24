<template>
<div class="editor">
  <div class="header">
    <span class="title"><span class="link" @click="$parent.$emit('close')">Home</span> / Shader Editor</span>
    <input type="text" class="pather" v-model="item.path" @input="onKeyStroke(item)" autofocus @keydown.esc="$parent.$emit('close')">
  </div>
  <div class="se">

    <ACE
      v-if="item"
      @save="onSave(item)"
      :path="'fun.vert'"
      v-model="item.vs"
      @input="onKeyStroke(item)"
      theme="chrome"
      :height="height"
      :width="width"
      @esc="$parent.$emit('close')"
    >
    </ACE>

    <ACE
      v-if="item"
      @save="onSave(item)"
      :path="'fun.frag'"
      v-model="item.fs"
      @input="onKeyStroke(item)"
      theme="chrome"
      :height="height"
      :width="width"
      @esc="$parent.$emit('close')"
    >
    </ACE>

  </div>
</div>

</template>

<script>
import * as SOC from '@/relay/socket.io.js'

import ACE from '@/components/shared/ACE/ACE.vue'
export default {
  components: {
    ACE
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
      this.height = window.innerHeight - 70
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
    }
  }
}
</script>

<style scoped>
@import url(./shared.css);

.se{
  height: calc(100vh - 70px * 2.0);
  width: 100%;
  display: flex;
}
@media screen and (max-width: 769px) {
  .se{
    height: calc(100vh - 70px * 2.0);
    flex-direction: column;
  }
}
</style>
