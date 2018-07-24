<template>
<div class="editor">
  <span class="title"><span class="link" @click="$parent.$emit('close')">Home</span> / Shader Editor</span>
  <input type="text" class="pather" v-model="item.path" @input="onKeyStroke(item)" autofocus @keydown.esc="$parent.$emit('close')">
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
    }
  }
}
</script>

<style scoped>
.se{
  width: 100%;
  display: flex;
}
@media screen and (max-width: 769px) {
  .se{
    flex-direction: column;
  }
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

.editor{
  width: 100%;
  overflow-x: hidden;
}
</style>
