
const db = require('../database-posgtres');

const connections = {};
const users = {};

let init = function(io) {

  let chat = io.of('/chat');

  chat.on('connection', function (socket) {

    socket.on('login', (data) => {
      connections[data.userId] = {
        userId: data.userId,
        socket: socket,
        connected: true
      };

      socket.emit('onlineusers', getOnlineUsers());

    });

    socket.on('message', (data) => {

      if (connections[data.to]) {
        let s = connections[data.to].socket;
        s.emit('message', data);
      }


      db.addChatMessage(data.from, data.to, data.message)

        .catch(err => console.log(err.message));

    });

    socket.on('disconnect', (reason) => {
    });
  });
}

const getOnlineUsers = function() {
  return Object.keys(connections);
};

module.exports = init;



