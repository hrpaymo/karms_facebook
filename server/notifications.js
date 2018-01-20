const notification = require('socket.io')();
// const api = require('./api.js');
// const db = require('../database-posgtres/index');

const connections = {};

let init = io => {

  io.of('/notifications')
    .on('connection', function (socket) {
      console.log('incomming connection');
      socket.on('login', (data) => {
        connections[data.userId] = {
          userId: data.userId,
          socket: socket,
          connected: true
        };
        console.log('user', data, 'signed in');
        console.log('signed in users are:', Object.keys(connections));
        // get new notifications on login
          // get username, first name, last name, profile pic and info on notification type
        // let notifications = getUnseenNotifications(data.userId);
        // console.log('got login. sending notifications:', notifications);
        // socket.emit('notifications', notifications)

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
    console.log('sending notifications to userId:', userId);
    console.log(notifications);
    socket.emit('notifications', notifications);
  } else {
    console.log('userId', userId, 'does not exist in the notifications connections table');
  }
}

module.exports = {
  init: init,
  sendNotifications: sendNofications
};