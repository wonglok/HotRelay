const srv = require('./srv');

const state = module.exports = {
  data: []
}

const provideArray = () => {
  state.data = state.data || []
  return state.data
}

srv.on('delta-add', (instruction) => {
  const arr = provideArray()
  arr.push(instruction.data)
})

srv.on('delta-remove', (instruction) => {
  const arr = provideArray()
  let idx = arr.findIndex(ari => ari._id === instruction.data._id)
  if (idx !== -1) {
    arr.splice(idx, 1)
  }
})

srv.on('delta-update', (instruction) => {
  const arr = provideArray()
  let idx = arr.findIndex(ari => ari._id === instruction.data._id)
  if (idx !== -1) {
    arr.splice(idx, 1, instruction.data)
  }
})
