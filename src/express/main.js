module.exports.run = ({ port, mode }) => {
  var path = require('path');
  var express = require('express');
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  if (mode === 'api') {
    io.on('connection', function(socket){
      socket.on('chat-message', function(msg){
        io.emit('chat-message', msg);
      });
    });
  } else {
    app.use(express.static(path.join(__dirname, '../dist')));
  }

  http.listen(port, function(){
    console.log('listening on *:' + port);
  });
}
