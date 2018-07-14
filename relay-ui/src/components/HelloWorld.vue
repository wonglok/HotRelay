<template>
  <div class="hello">
    <button @click="send">Hea Hea Hea</button>
    <input type="range" step="0.000001" min="-100" max="100" v-model="slider" @input="send">
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
  methods: {
    send () {
      SOC.$on('chat-message', (data) => {
        this.slider = data.slider
      })
      SOC.$emit('chat-message', {
        haha: Math.random(),
        slider: this.slider
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
