var evt = require('../../electron/evt');
var state = require('../../electron/state');

module.exports.setup = ({ io }) => {
  io.on('connection', function(socket){

    socket.on('hot-relay-message', function(data){
      io.emit('hot-relay-message', data);
    });

    socket.on('req/state', () => {
      socket.emit('res/state', state);
    });



    // when folder is selected then update all client for info.
    evt.on('folder-selected', () => {
      socket.emit('res/state', state);
    })

    // ui request load folder
    socket.on('load-folder', () => {
      evt.emit('load-folder')
    });

    // ui reqeust save to disk
    socket.on('commit-to-disk', () => {
      evt.emit('commit-to-disk', state)
    })

  });
}
