<template>
<div>
  <h2>Items List</h2>
  Confirm before delete: <input type="checkbox" v-model="isProtected" />

  <ol>
    <li :key="item._id" v-for="item in root.state.data">
      {{ item.name }}
      <button @click="remove(item)">Remove</button>
      <button @click="edit(item)">Edit</button>

      <br />
      <input class="pather" type="text" v-model="item.path" @input="touched(item)" />

    </li>
  </ol>
</div>
</template>

<script>
import * as SOC from '@/relay/socket.io.js'

export default {
  data () {
    return {
      isProtected: true,
      root: SOC.root
    }
  },
  methods: {
    touched (item) {
      SOC.sync.update(item)
    },
    edit (item) {
      this.$emit('itemID', item._id)
    },
    remove (v) {
      if (!this.isProtected || (window.prompt('Please type delete to confirm delete\n' + v.path + '.') || '').toUpperCase() === 'DELETE') {
        SOC.sync.remove(v)
      }
    }
  }
}
</script>

<style scoped>
.pather{
  width: 95%;
}
</style>
