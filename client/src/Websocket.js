import io from 'socket.io-client';

var socket = io.connect('https://83.250.202.129:443', {path: '/properties/camera/subs', resource: '/properties/camera/subs/socket.io', 'force new connection': true});

export default socket;