<template>
  <div class="hello">
    <button @click="send">Hea Hea Hea</button>
  </div>
</template>

<script>
import * as SOC from '../socket.io.js'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    send () {
      SOC.$emit('chat message', {
        haha: Math.random()
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
