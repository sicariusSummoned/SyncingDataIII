const xxh = require('xxhashjs');

const User = require('./classes/User.js');

const physics = require('./physics.js');

const users = {};

let io;

const setupSockets = (ioServer) =>{
  io = ioServer;
  
  io.on('connection', (sock) =>{
    const socket = sock;
    
    socket.join('room1');
    
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBADE).toString(16);
    
    users[hash] = new User(hash);
    
    socket.hash = hash;
    
    socket.emit('joined', users[hash]);
    
    socket.on('movementUpdate', (data) =>{
      users[socket.hash] = data;
      
      users[socket.hash].lastUpdate = new Date().getTime();
      
      physics.setCharacter(users[socket.hash]);
      
      io.sockets.in('room1').emit('updatedMovement', users[socket.hash]);
    });
    
    socket.on('disconnect', () =>{
      io.sockets.in('room1').emit('left', users[socket.hash]);
      
      delete users[socket.hash];
      
      physics.setCharacterList(users);
      
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
