const notification = require('socket.io')();
// const api = require('./api.js');
// const db = require('../database-posgtres/index');

const connections = {};

let init = io => {

  io.of('/notifications')
    .on('connection', function (socket) {
      socket.on('login', (data) => {
        connections[data.userId] = {
          userId: data.userId,
          socket: socket,
          connected: true
        };
        console.log('signed in users are:', Object.keys(connections));
      });

      socket.on('disconnect', reason => {
        console.log('notifications disconnect:', reason);
      });

      socket.on('seen', data => {
        // TODO: mark messages as seen here in the db
      })
    });
}


const sendNofications = (userId, notifications) => {
  let socket = connections[userId].socket;
  if(socket) {
    socket.emit('notifications', notifications);
  } else {
    console.log('userId', userId, 'does not exist in the notifications connections table. User is probably offline.');
  }
}

module.exports = {
  init: init,
  sendNotifications: sendNofications
};