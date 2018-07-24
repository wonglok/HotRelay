<template>
<div>
  <h2>Item maker</h2>
  <select class="selector" v-model="newFileType">
    <option :value="type._id" :key="type._id" v-for="type in DS.DataTypes">{{ type.name }}</option>
  </select>

  <button @click="makeOne({ newFileType })">Make One</button>
</div>
</template>

<script>
import * as DS from '@/relay/data-structure.js'
import * as SOC from '@/relay/socket.io.js'

export default {
  data () {
    return {
      newFileType: DS.DataTypes[0]._id,
      DS
    }
  },
  methods: {
    makeOne ({ newFileType }) {
      var maker = DS.DataTypes.find(dt => dt._id === newFileType)
      if (maker) {
        let newItem = maker.makeOne()
        SOC.sync.add(newItem)
      }
    }
  }
}
</script>

<style scoped>

.selector{
  font-size: 18px;
}
</style>
