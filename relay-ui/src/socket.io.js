import io from 'socket.io-client'

export const socket = io('http://' + window.location.hostname + ':2328')
export const $emit = socket.emit.bind(socket)
export const $on = socket.on.bind(socket)

$on('hot-relay-message', (data) => {
  console.log(data)
})
$on('connect', () => {
  console.log('connected')
})
$on('disconnect', () => {
  console.log('disconnected')
})

$emit('req/state')
$on('res/state', (data) => {
  console.log(data)
})
