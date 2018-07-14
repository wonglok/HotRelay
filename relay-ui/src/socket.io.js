import io from 'socket.io-client'

export const socket = io('http://localhost:2328')
export const $emit = socket.emit.bind(socket)
export const $on = socket.on.bind(socket)

$on('connect', (data) => {
  console.log(data)
})
$on('chat message', (data) => {
  console.log(data)
})
$on('disconnect', (data) => {
  console.log(data)
})
