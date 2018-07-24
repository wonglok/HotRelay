import * as Struc from './data-structure.js'
import io from 'socket.io-client'

export const socket = io('http://' + window.location.hostname + ':2328')
export const $emit = socket.emit.bind(socket)
export const $on = socket.on.bind(socket)
export const root = {
  $forceUpdate () {},
  ready: false,
  saved: false,
  state: {
  }
}

var hydrate = () => {
  $emit('hydrate/state')
  $emit('hydrate/ready')
  $emit('hydrate/state-saved')
}

window.addEventListener('focus', () => {
  hydrate()
}, false)

$on('connect', () => {
  hydrate()
  console.log('connected')
})
$on('disconnect', () => {
  console.log('disconnected')
})

$on('res/state', (state) => {
  root.state = state
})
$on('root-ready', (ready) => {
  root.ready = ready
})
$on('state-saved', (saved) => {
  root.saved = saved
})

export const sync = {
  loadFolder () {
    $emit('load-folder')
  },
  commitToDisk () {
    $emit('commit-to-disk')
  },

  //
  tellTimer: 0,
  tellAll (state) {
    $emit('tell-state', state)
  },
  tell (state) {
    clearTimeout(this.tellTimer)
    this.tellTimer = setTimeout(() => {
      sync.tellAll(state)
    }, 1000 / 60)
  },

  // delta
  add (value) {
    let newValue = JSON.parse(JSON.stringify(value))
    newValue._id = Struc.makeID()

    let instruction = {
      id: value._id,
      data: newValue
    }
    sync.onAdd(instruction)
    $emit('delta-add', instruction)
  },
  remove (value) {
    let instruction = {
      id: value._id,
      data: value
    }
    sync.onRemove(instruction)
    $emit('delta-remove', instruction)
  },

  updateTimer: 0,
  update (value) {
    let instruction = {
      id: value._id,
      data: value
    }
    sync.onUpdate(instruction)
    $emit('delta-update', instruction)
  },
  onAdd: (instruction) => {
    const arr = provideArray()
    arr.push(instruction.data)
  },
  onRemove: (instruction) => {
    const arr = provideArray()
    let idx = arr.findIndex(ari => ari._id === instruction.data._id)
    if (idx !== -1) {
      arr.splice(idx, 1)
    }
  },
  onUpdate: (instruction) => {
    const arr = provideArray()
    let idx = arr.findIndex(ari => ari._id === instruction.data._id)
    if (idx !== -1) {
      arr.splice(idx, 1, instruction.data)
    }
  }
}

const provideArray = () => {
  root.state.data = root.state.data || []
  return root.state.data
}

$on('delta-add', sync.onAdd)
$on('delta-remove', sync.onRemove)
$on('delta-update', sync.onUpdate)
