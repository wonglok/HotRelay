import io from 'socket.io-client'

export const socket = io('http://' + window.location.hostname + ':2328')
export const $emit = socket.emit.bind(socket)
export const $on = socket.on.bind(socket)

$on('connect', () => {
  console.log('connected')
})
$on('chat-message', (data) => {
  console.log(data)
})
$on('disconnect', () => {
  console.log('disconnected')
})
