const server = require('http').createServer();

var io = require('socket.io').listen(server, {path: '/properties/camera/subs', resource: '/properties/camera/subs/socket.io'});

server.listen(3001);

module.exports = {
  io
}