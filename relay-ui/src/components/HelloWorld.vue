<template>
  <div class="hello">
    <button @click="send">Hea Hea Hea</button>
    <input type="range" step="0.000001" min="-100" max="100" v-model="slider" @input="send">
    <button @click="load">Load</button>
    <button @click="save">Save to disk</button>
  </div>
</template>

<script>
import * as SOC from '../socket.io.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      slider: 0,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    SOC.$on('hot-relay-message', (data) => {
      this.slider = data.slider
    })
  },
  methods: {
    load () {
      SOC.$emit('load-folder')
    },
    save () {
      SOC.$emit('commit-to-disk')
    },
    send () {
      SOC.$emit('hot-relay-message', {
        haha: Math.random(),
        slider: Number(this.slider)
      })
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
