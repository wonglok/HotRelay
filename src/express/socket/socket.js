var srv = require('../../electron/srv');
var state = require('../../electron/state');
var memory = require('../../electron/memory');

module.exports.setup = ({ io }) => {
  io.on('connection', function(socket){

    let HOT_RELAY_ROOM = 'hot-relay-room'
    socket.join(HOT_RELAY_ROOM, function(){});

    socket.on('hot-relay-message', function(data){
      socket.broadcast.to(HOT_RELAY_ROOM).emit('hot-relay-message', data);
    });

    // one to one
    socket.on('hydrate/state', () => {
      socket.emit('res/state', state);
    });

    // init to say
    io.emit('root-ready', memory.ready)
    socket.on('hydrate/ready', () => {
      socket.emit('root-ready', memory.ready)
    })
    srv.on('root-ready', () => {
      socket.broadcast.to(HOT_RELAY_ROOM).emit('root-ready', memory.ready);
    })

    // state saved
    io.emit('state-saved', memory.saved)
    socket.on('hydrate/state-saved', () => {
      socket.emit('state-saved', memory.saved)
    })
    srv.on('state-saved', () => {
      socket.broadcast.to(HOT_RELAY_ROOM).emit('state-saved', memory.saved);
    })

    var touched = () => {
      memory.saved = false
      srv.emit('shall-backup-later')
    }

    // receive keystroke from ui
    socket.on('tell-state', (newState) => {
      Object.keys(newState).forEach((nKey) => {
        state[nKey] = newState[nKey]
      })

      socket.broadcast.to(HOT_RELAY_ROOM).emit('res/state', state);

      touched()
    })

    // server update all clients
    srv.on('update-all-client-state', () => {
      // console.log(state);
      socket.broadcast.to(HOT_RELAY_ROOM).emit('res/state', state);
    })

    // ui request load folder
    socket.on('load-folder', () => {
      srv.emit('load-folder')
    });

    // ui reqeust save to disk
    socket.on('commit-to-disk', () => {
      srv.emit('commit-to-disk', state)
      socket.broadcast.to(HOT_RELAY_ROOM).emit('saved-to-disk')
    })

    // sync API
    socket.on('delta-add', (instruction) => {
      srv.emit('delta-add', instruction)
      socket.broadcast.to(HOT_RELAY_ROOM).emit('delta-add', instruction)
      touched()
    })
    socket.on('delta-remove', (instruction) => {
      srv.emit('delta-remove', instruction)
      socket.broadcast.to(HOT_RELAY_ROOM).emit('delta-remove', instruction)
      touched()
    })
    socket.on('delta-update', (instruction) => {
      srv.emit('delta-update', instruction)
      socket.broadcast.to(HOT_RELAY_ROOM).emit('delta-update', instruction)
      touched()
    })

    socket.on('drawboard-draw', (instruction) => {
      socket.broadcast.to(HOT_RELAY_ROOM).emit('drawboard-draw', instruction)
      touched()
    })
  })
}
