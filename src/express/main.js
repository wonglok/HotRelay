module.exports.run = ({ port, mode }) => {
  var path = require('path');
  var express = require('express');
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  if (mode === 'api') {
    require('./socket/socket.js').setup({ io })
  } else {
    app.use(express.static(path.join(__dirname, '../dist')));
  }

  http.listen(port, function(){
    console.log('listening on *:' + port);
  });

  process.on( 'SIGTERM', function () {
    http.close(function () {
      console.log( "Closed out remaining connections.");
    });
  });
}
