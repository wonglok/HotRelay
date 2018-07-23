import io from 'socket.io-client'

export const socket = io('http://' + window.location.hostname + ':2328')
export const $emit = socket.emit.bind(socket)
export const $on = socket.on.bind(socket)
export const root = {
  $forceUpdate () {},
  get ready () {
    return !!this.state.time
  },
  state: {
  }
}

$on('connect', () => {
  console.log('connected')
})
$on('disconnect', () => {
  console.log('disconnected')
})

$emit('req/state')
$on('res/state', (state) => {
  root.state = state
})

$on('not-yet-saved-to-disk', () => {
  root.unsaved = true
})
$on('saved-to-disk', () => {
  root.unsaved = false
})
