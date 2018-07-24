<template>
<div class="full outermost">
  <div class="container" ref="container">
    <canvas class="cancan" ref="drawboard" :refresher="linesLength" @touchstart="ts" @mousedown="ts" @touchmove="tm" @mousemove="tm" @mouseup="te" @mouseout="te" @touchend="te" @touchcancel="te"></canvas>
  </div>

  <div class="tools">
    Color: <input type="color" v-model="now.color">
    <button :style="{ 'background-color': '#ff0000' }" @click="now.color = '#ff0000'; now.lineWidth = now.defaultWidth;">[R]</button>
    <button :style="{ 'background-color': '#00ff00' }" @click="now.color = '#00ff00'; now.lineWidth = now.defaultWidth;">[G]</button>
    <button :style="{ 'background-color': '#0000ff' }" @click="now.color = '#0000ff'; now.lineWidth = now.defaultWidth;">[B]</button>
    <button :style="{ 'background-color': '#000000' }" @click="now.color = '#000000'; now.lineWidth = now.defaultWidth;">[]</button>
    <button :style="{ 'background-color': 'white' }" @click="now.color = 'white'; now.lineWidth = 20;">[eraser]</button>

    <button :style="{ 'background-color': 'rgba(100,100,100, 0.5)' }" @click="now.color = 'rgba(100,100,100, 0.5)'; now.lineWidth = 20;">[]</button>
    <button :style="{ 'background-color': 'rgba(255,255,0, 0.5)' }" @click="now.color = 'rgba(255,255,0, 0.5)'; now.lineWidth = 20;">[]</button>
    <button :style="{ 'background-color': 'rgba(100,255,100, 0.5)' }" @click="now.color = 'rgba(100,255,100, 0.5)'; now.lineWidth = 20;">[]</button>
    <button :style="{ 'background-color': 'rgba(100,100,255, 0.5)' }" @click="now.color = 'rgba(100,100,255, 0.5)'; now.lineWidth = 20;">[]</button>
    <button :style="{ 'background-color': 'rgba(255,100,100, 0.5)' }" @click="now.color = 'rgba(255,100,100, 0.5)'; now.lineWidth = 20;">[]</button>
    <button :style="{ 'background-color': 'rgba(255,100,255, 0.5)' }" @click="now.color = 'rgba(255,100,255, 0.5)'; now.lineWidth = 20;">[]</button>

    Pen Size: <input type="range" v-model="now.lineWidth" step="0.0001" min="1.0" max="20.0">
    <button v-if="info.lines.length > 0" @click="undo(info)">undo</button>
    <button v-if="info.undo.length > 0" @click="redo(info)">redo</button>
    <button v-if="info.undo.length > 0" @click="cleanTrash(info)">empty trash</button>
    <button v-if="info.lines.length > 0" @click="clearBoard(info)">reset</button>
  </div>
</div>
</template>

<script>
import * as DC from './DrawCalls.js'
import * as SOC from '@/relay/socket.io.js'
var simplify = require('simplify-path')

export default {
  props: {
    root: {},
    info: {}
  },
  created () {
    this.info.undo = this.info.undo || []
  },
  mounted () {
    let canvas = this.canvas = this.$refs['drawboard']
    let con = this.container = this.$refs['container']
    let info = DC.setup({ canvas })
    this.ctx = info.ctx
    let conRect = this.conRect = con.getBoundingClientRect()

    if (!this.info.width) {
      this.info.width = conRect.width
    }
    if (!this.info.height) {
      this.info.height = conRect.height
    }

    canvas.width = this.info.width
    canvas.height = this.info.height

    this.rect = canvas.getBoundingClientRect()
    this.needsRender = true
    window.addEventListener('resize', () => {
      this.conRect = con.getBoundingClientRect()
      this.rect = canvas.getBoundingClientRect()
      this.needsRender = true
    }, false)

    let rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      if (this.needsRender) {
        this.needsRender = false
        this.draw()
      }
    }

    this.rAFID = window.requestAnimationFrame(rAF)

    SOC.$on('drawboard-draw', (instruction) => {
      console.log('omg')
      let nowLine = this.info.lines.find(l => l.id === instruction.id)
      if (nowLine) {
        let x = instruction.x
        let y = instruction.y
        nowLine.points.push({
          x, y
        })
        this.needsRender = true
      }
    })
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  },
  data () {
    return {
      rAFID: 0,
      needsRender: false,
      state: {
        rect: false,
        down: false
      },
      now: {
        defaultWidth: 4,
        line: false,
        lineWidth: 4,
        color: 'red'
      }
    }
  },
  watch: {
    linesLength () {
      this.$nextTick(() => {
        this.draw()
      })
    }
  },
  computed: {
    linesLength () {
      return JSON.stringify(this.info.lines.length)
    }
  },
  methods: {
    undo () {
      this.info.undo.push({
        line: this.info.lines.pop()
      })
      this.$emit('draw-update', this.info)
    },
    redo () {
      let saved = this.info.undo.pop()
      let line = saved.line
      this.info.lines.push(line)
      this.$emit('draw-update', this.info)
    },
    cleanTrash () {
      if (!window.confirm('empty trash?')) { return }
      this.info.undo = []
      this.$emit('draw-update', this.info)
    },
    clearBoard () {
      if (!window.confirm('empty trash?')) { return }
      this.info.lines = []
      this.needsRender = true
      this.$emit('draw-update', this.info)
    },
    remove () {
      this.$emit('draw-remove', this.info)
      this.$emit('draw-backup', this.info)
    },
    draw () {
      let ctx = this.ctx
      DC.clearAll({ ctx })
      DC.drawLines({ ctx: this.ctx, lines: this.info.lines, width: this.canvas.width, height: this.canvas.height })
    },
    ts (evt) {
      evt.preventDefault()
      this.down = true
      this.now.line = {
        id: '_' + Math.random().toString(36).substring(2, 15),
        width: this.rect.width,
        height: this.rect.height,
        top: this.rect.top,
        left: this.rect.left,
        aspect: this.rect.width / this.rect.height,
        points: [],
        lineWidth: this.now.lineWidth,
        strokeStyle: this.now.color
      }
      this.info.lines.push(this.now.line)
      this.$emit('draw-update', this.info)
    },
    tm (evt) {
      evt.preventDefault()
      if (this.down) {
        let x = 0
        let y = 0

        let nowLine = this.now.line

        if (evt.touches && evt.touches[0]) {
          x = ((evt.touches[0].pageX - nowLine.left - nowLine.width * 0.5) / (nowLine.width * 0.5))
          y = ((-evt.touches[0].pageY + nowLine.top + nowLine.height * 0.5) / (nowLine.height * 0.5))
        } else {
          x = ((evt.pageX - nowLine.left - nowLine.width * 0.5) / (nowLine.width * 0.5))
          y = ((-evt.pageY + nowLine.top + nowLine.height * 0.5) / (nowLine.height * 0.5))
        }
        console.log(x, y)

        nowLine.points.push({
          x, y
        })

        SOC.$emit('drawboard-draw', {
          id: this.now.line.id,
          x: Number(x.toFixed(4)),
          y: Number(y.toFixed(4))
        })
        this.needsRender = true
      }
    },
    te (evt) {
      if (!this.now.line) {
        return
      }
      let oldPts = this.now.line.points.map(pt => [pt.x, pt.y])
      var newPts = simplify.radialDistance(oldPts, 0.00333333)
      this.now.line.points = newPts.map(pt => { return { x: Number(pt[0].toFixed(3)), y: Number(pt[1].toFixed(3)) } })

      this.$emit('draw-update', this.info)

      this.down = false
      this.needsRender = true
    }
  }
}
</script>

<style scoped>
.full{
  position: relative;
  width: 100%;
  height: 100%;
}
.full.outermost{
  height: calc(100% - 70px - 1px);
}
.tools{
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 30px;
}
.container{
  position: absolute;
  top: 0px;
  left: 0px;
  width:100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;

  /* background-color: rgba(0,0,0,0.5); */
}
.cancan{
  /* width: 100%;
  height: 100%; */
  display: inline-block;

  max-width: 100%;
  max-height: calc(100% - 30px);

  margin-top: 30px;
  border: black solid 1px;
  /* background-color: rgba(255,255,255,1.0); */
}
.two-cols{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
