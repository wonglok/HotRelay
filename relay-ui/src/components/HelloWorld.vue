<template>
  <div class="hello">
    <div class="relay"  v-show="!itemID">
      <h2>Hot Relay Configuration</h2>
      <button @click="loadFolder">Select Server's Hot Realy Folder then Load Data</button>

      <div class="fun" v-if="root.ready">

        <!-- <input type="range" step="0.000001" min="-100" max="100" v-model="root.state.slider" @input="tell"> -->
        <button @click="saveToDisk">Commit To Server's Disk</button><span v-if="!root.saved">haven't commit to server's disk</span>

        <ItemMaker />
        <ItemList @itemID="(v) => { itemID = v }" />

        <pre class="pre">{{ root }}</pre>
      </div>
    </div>

    <ItemEditor class="item-editor" v-if="itemID" :itemID="itemID" @close="() => { itemID = false }" />

  </div>
</template>

<script>
import * as SOC from '@/relay/socket.io.js'
import ItemList from './pages/ItemList/ItemList.vue'
import ItemMaker from './pages/ItemMaker/ItemMaker.vue'
import ItemEditor from './pages/ItemEditor/ItemEditor.vue'
export default {
  components: {
    ItemList,
    ItemMaker,
    ItemEditor
  },
  name: 'HelloWorld',
  data () {
    return {
      itemID: false,
      root: SOC.root
    }
  },
  mounted () {
  },
  methods: {
    loadFolder () {
      SOC.sync.loadFolder()
    },
    saveToDisk () {
      SOC.sync.commitToDisk()
    }
    // tell () {
    //   SOC.sync.tell(this.root.state)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.item-editor{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: rgba(255,255,255,0.8);
}

.pre{
  overflow-x: auto;
}
</style>
