const express = require('express');
let app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./chat').init(io);
require('./notifications').init(io);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('../database-posgtres/index.js');
const api = require('./api');
// app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport //
//////////////////////////////////////
const passport = require('passport') 
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.getUser(username, function(err, user) {
      if (err) { return done(err); }
      if (!user.length) {
        return done(null, { type: 'username', message: 'Incorrect username.' });
      }
      if (user[0].password !== password) {
        return done(null, { type: 'password', message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.post('/login',
  passport.authenticate('local'), 
  function(req, res) {
    res.json(req.user)
});
/////////////////////////////////////

//serve static pages
app.use(express.static(__dirname + '/../client/dist'));
app.use('/:username', express.static(__dirname + '/../client/dist'));

//handle /api endpoints
app.use('/api', api.route);


let port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log(`listening on port ${port}`);
});


