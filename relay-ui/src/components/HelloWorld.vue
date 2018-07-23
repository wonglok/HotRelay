<template>
  <div class="hello">
    <button @click="load">Select Folder on PC / Mac</button>

    <div class="fun" v-if="root.ready">

      <input type="range" step="0.000001" min="-100" max="100" v-model="root.state.slider" @input="tell">
      <button @click="saveToDisk">Save to Disk</button><span v-if="root.unsaved">File Unsaved</span>
      <pre>{{ root.state }}</pre>
    </div>

  </div>
</template>

<script>
import * as SOC from '../socket.io.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      root: SOC.root,
      slider: 0,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
  },
  methods: {
    load () {
      SOC.$emit('load-folder')
    },
    saveToDisk () {
      SOC.$emit('commit-to-disk')
    },
    tell () {
      SOC.$emit('tell-state', this.root.state)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
