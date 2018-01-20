const express = require('express');
let app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./chat')(io);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('../database-posgtres/index.js');
const api = require('./api');
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport //
//////////////////////////////////////
const passport = require('passport') 
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//        User.findOrCreate({ googleId: profile.id }, function (err, user) {
//          return done(err, user);
//        });
//   }
// ));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/login');
  });


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
app.use('/api', api);


let port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log(`listening on port ${port}`);
});


