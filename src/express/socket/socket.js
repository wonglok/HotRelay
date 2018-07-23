var srv = require('../../electron/srv');
var state = require('../../electron/state');

module.exports.setup = ({ io }) => {
  io.on('connection', function(socket){

    socket.on('hot-relay-message', function(data){
      io.emit('hot-relay-message', data);
    });

    // one to one
    socket.on('req/state', () => {
      socket.emit('res/state', state);
    });

    socket.on('tell-state', (newState) => {
      Object.keys(newState).forEach((nKey) => {
        state[nKey] = newState[nKey]
      })
      io.emit('res/state', state);
      srv.emit('shall-backup-later', { io })
    })

    // server update all clients
    srv.on('update-all-client-state', () => {
      // console.log(state);
      io.emit('res/state', state);
    })

    // ui request load folder
    socket.on('load-folder', () => {
      srv.emit('load-folder')
    });

    // ui reqeust save to disk
    socket.on('commit-to-disk', () => {
      srv.emit('commit-to-disk', state)
      io.emit('saved-to-disk')
    })

  });
}
