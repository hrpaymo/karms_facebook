const route = require('express').Router();
const db = require('../database-posgtres/index.js');
const notifications = require('./notifications.js');
const passport = require ('passport');
const multer  = require('multer');
const aws = require('aws-sdk');
const md5 = require('md5');
const moment = require('moment');

// Set up S3 
var s3 = new aws.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: 'us-west-2'
})

var grabImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 },
});



let uploadImage = function(image) {
  let originalFileName = image.originalname;
  // Make unique filename with timestamp
  let timestamp = moment().format();
  let hash = md5(originalFileName + timestamp).substring(0, 10);
  let fileNameWithHash = hash + '-' + originalFileName;

  let params = {
    Bucket: 'rebasebook/images',
    ContentType: image.mimetype,
    Key: fileNameWithHash,
    Body: image.buffer
  };

  return s3.putObject(params).promise()
  .then(result => {
    return `https://rebasebook.s3.amazonaws.com/images/${fileNameWithHash}`;
  })
}

// ---- 

const api = {

  user: {
    // login: function(req, res) {


    //   // If this function gets called, authentication was successful.
    //   // `req.user` contains the authenticated user.
    //   res.redirect('/profile/' + req.user.username);
    // },

    getProfile: function (req, res) {
      db.searchSomeone(req.params.user, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      });
    },

    getProfilePage: function(req, res) {
      var username = req.params.username;
      db.getProfilePageInfo(username, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      });
    },

    getLiked: function (req, res) {
      db.getPersonalLikeAmount(req.params.username, req.query.text, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      })
    },

    getLikers: function (req, res) {
      db.getLikers(req.query.text, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.status(200).json(data);
        }
      })
    },

    getUser: function(req, res) {
      var username = req.params.username;
      if (username !== 'favicon.ico') {
        db.getUser(username, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).json(data);
          }
        })
      }
    },

    getUserById: function(req, res) {
      db.getUserById(req.params.userId, (err, data) => {
        if (err) {
          res.status(500).send(err.message);
          console.log(err.message);
        } else {
          res.status(200).send(data);
        }
      })
    },

    getUsername: function(req, res) {
      db.getUsername(req.params.firstname, req.params.lastname, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.status(200).json(data);
        }
      })
    },

    createUser: function(req, res) {
      var username = req.params.username;
      if (username !== 'favicon.ico') {
        var newUserData = {
          username: req.body.username,
          password: req.body.password,
          pictureUrl: req.body.pictureUrl,
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }
        db.addUser(newUserData, (err, data) => { // line 221
          if (err) {
            res.status(500).json(err);
          } else {
            db.addNewUserProfileInfo(newUserData, (err, data) => { // line 230
              if (err) {
                res.status(404).send(err);
              } else {
                res.status(200).json(data);
              }
            });
          }
        })
      }
    },

    addFriend: function(req, res) {
      var username = req.params.username;
      var friendToAdd = req.params.friendToAdd;
      db.addFriend(username, friendToAdd, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      });
    },

    getFriendsList: function(req, res) {
      var username = req.params.username;
      var otherUsername = req.params.otherUsername;
      db.getFriendsList(otherUsername, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      });
    },

    removeFriend: function(req, res) {
      var username = req.params.username;
      var friendToRemove = req.params.friendToRemove;
      db.removeFriend(username, friendToRemove, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      });
    },

    updateProfile: function(req, res) {
      var username = req.params.username;
      var changes = req.body;
      db.updateProfilePageInfo(username, changes, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(data);
        }
      });
    },

    addFriendship: function(req, res) {
      // This endpoint creates a new friendship from userId to friendId. It will complete
      // the friendship if a pending relationship is in place

      let userId = parseInt(req.body.userId);
      let friendId = parseInt(req.body.friendId);

      db.addFriendship(userId, friendId)
        .then((results) => {
          res.sendStatus(200);
          // TODO: streamline to do getNotifications in parallel w/ Promise.all
          return db.getNotifications(userId);
        })
        .then(userNotifications => {
          if(userNotifications.length) {
            notifications.sendNotifications(userId, userNotifications);
          }
          return db.getNotifications(friendId);
        })
        .then(friendNotifications => {
          if(friendNotifications.length) {
            notifications.sendNotifications(friendId, friendNotifications);
          }
        })
        .catch((err) => {
          console.error('addfriendship err:', err);
          res.status(500).json('unexpected server error');
        });
    },

    destroyFriendship: function(req, res) {
      // This endpoint removes a friendship from userId to friendId. 
      let type = req.body.type;
      let userId = parseInt(req.body.userId);
      let friendId = parseInt(req.body.friendId);

      if (!userId || !friendId || type !== 'remove') {
        res.status(400).json('bad request');
        return;
      }

      db.removeFriendship(userId, friendId)
        .then((results) => {
          res.sendStatus(200);
          // TODO: streamline to do getNotifications in parallel w/ Promise.all
          return db.getNotifications(userId);
        })
        .then(userNotifications => {
          if(userNotifications.length) {
            notifications.sendNotifications(userId, userNotifications);
          }
          return db.getNotifications(friendId);
        })
        .then(friendNotifications => {
          if(friendNotifications.length) {
            notifications.sendNotifications(friendId, friendNotifications);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json('unexpected server error');
        });
    },

    getFriendship: function(req, res) {
       // This endpoint returns the status of an existing friendship request between two users.
      // It always describes from the point of view of the logged in user (userId). 
      // Return options: 
      // * "friends"
      // * "null"
      // * "response needed"  -- logged-in user needs to respond to friend request
      // * "response pending" -- logged-in user is waiting for friend to respond
      // * friendship request ignored -- logged-in user has ignored/declined friendship 
      let userId = parseInt(req.query.userId);
      let friendId = parseInt(req.query.friendId);
      
      if (userId === friendId || !userId || !friendId) {
        res.status(400).json('bad request');
      } else {
        db.getFriendship(userId, friendId)
          .then((results) => {

            let friendshipStatus = results;

            if (friendshipStatus === undefined) {
              // This should not occur. Send server error and capture edge cases.
              res.status(500).json('unexpected server error');
            } else {
              res.status(200).json({'friendship_status': friendshipStatus});
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json('unexpected server error');
          }); 
      }
    },

    getAllFriends: function(req, res) {
      // This endpoint returns the list of friendships for a user.
      // It accepts options 'friends' (default)  or 'requests'
      // Friends returns confirmed bi-drectional friends.
      // Requests returns the un-answered (non-ignored) requests the userId can respond to.

      let userId = parseInt(req.query.userId);
      let type = req.query.type === 'requests' ? 'request' : 'friend';

      if (!userId) {
        res.status(400).json('bad request');
      } else {
        db.returnFriendships(userId, type)
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json('unexpected server error');
          });  
      }

    }
  },

  users: {

    getUsers: function (req, res) {
      db.getAllUsers((err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to retrieve all Users');
        } else {
          res.status(200).json(data);
        }
      });
    }
  },

  post: {
    createPost: function(req, res) {
      db.createPost(req.params.username, req.body.text, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to create Post');
        } else {
          res.status(200).json(data);
        }
      })
    },

    createPostNonImage: function(req, res) {
      let userId = parseInt(req.body.authorId);
      let postText = req.body.postText;


      if (!userId) {
        res.status(400).json('bad request');
      } else {
        db.createPostById(userId, postText)
          .then((post_id) => {
            res.status(200).json({"post_id": post_id})
          })
          .catch((err) => {
            console.error('error creating post', err);
            res.status(500).json('unexpected server error');
          });
      }
    },

    createPostImage: function(req, res) {
      let userId = parseInt(req.body.authorId);
      let postText = req.body.postText || null;

      if (!userId || !req.file || !req.file.fieldname === 'sharedImage') {
        res.status(400).json('bad request');
      } else {
        uploadImage(req.file)
          .then((url) => {
            return db.createPostById(userId, postText, url)
              .then((post_id) => {
                res.status(200).json({"post_id": post_id})
              })
            
          })
          .catch((err) => {
            console.error('error creating image post', err);
            res.sendStatus(500).json('unexpected server error');
          })    
      }
    },

    getAuthor: function(req, res) {
      db.getPostAuthor(req.query.text, (err, data) => {
        if (err) {
          res.status(400).send('Unable to retrieve author of Post');
        } else {
          res.status(200).json(data);
        }
      })
    },

    unlikePost: function (req, res) {

      db.unlikePost(req.params.author, req.query.text, req.query.username, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to unlike post');
        } else {
          res.status(200).json(data);
        }
      })
    },

    likePost: function(req, res) {

      db.likePost(req.params.author, req.body.text, req.body.username, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to like Post');
        } else {
          res.status(200).json(data);
        }
      })
    },

    getNumLikes: function (req, res) {
      db.getLikeAmount(req.query.text, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to retrieve number of likes');
        } else {
          res.status(200).json(data);
        }
      })
    },
  },

  notifications: {
    // called when page refreshes
    getNotifications: (req, res) => {
      db.getNotifications(req.params.userId)
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          console.error('Cannot send notifications:', err);
          res.status(400).send('Unable to send notifications');
        });
    }
  },

  chats: {

    getChatSessions: function (req, res) {

      let filter = {};
      if (req.query) {
        filter = req.query;
      }

      db.getUserChatSessions(req.params.userId, filter, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to retrieve users chat sessions');
        } else {
          res.status(200).send(data);
        }
      });
    }
  },

  chat: {

    getChatMessages: function(req, res) {

      if (!req.params.userId || !req.query.friendId) {
        res.status(400).send('Please send as GET /api/chat/<userId>?friendId=<friendId>');
        return;
      }

      db.getChatMessages(req.params.userId, req.query.friendId, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to retrieve users chat sessions');
        } else {
          res.status(200).send(data);
        }
      })
    }
  },

  posts: {

    getPostsByAuthorId: function(req, res) {
      let authorId = req.params.authorId;

      if (!authorId) {
        res.status(400).json('bad request');
      } else {
        db.getPostByAuthorId(authorId)
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json('unexpected server error');
          })    
      }

    },

    getPosts: function (req, res) {
      db.getAllPosts((err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to retrieve all Posts');
        } else {
          res.status(200).json(data);
        }
      })
    },
      
    getUserPosts: function(req, res) {
      db.getUserPosts(req.params.certainUser, (error, data) => {
        if (error) {
          console.log(error.message);
          res.status(400).send(`Error retrieving ${req.params.certainUser}'s posts`);
        } else {
          res.status(200).json(data);
        }
      });
    },

    getFriendsPosts: function (req, res) {
      db.findPostsByFriends(req.params.username, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send(`Unable to retrieve Posts by ${req.params.username}`);
        } else {
          res.status(200).json(data);
        }
      })
    },

    getNonFriendsPosts: function (req, res) {

      db.findPostsByNonFriends(req.params.username, (err, data) => {
        if (err) {
          console.log(err.message);
          res.status(400).send('Unable to retrieve Posts by Non Friends');
        } else {
          res.status(200).json(data);
        }
      })
    },

    getFeed: function(req, res) {
      // Main Feed currently returns posts by Friends Only
      let userId = parseInt(req.query.userId);
      let friendsOnly = req.query.type === 'friends';

      if (!userId) {
        res.status(400).json('bad request');
        return;
      }

      if (friendsOnly) {
        db.getPostsFromFriends(userId)
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json('unexpected server error');
          })    
      } else {
        db.getAllPosts()
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json('unexpected server error');
          }) 
      }
    }
  }
};


// POSTS NEW
route.post('/uploadImagePost', grabImage.single('sharedImage'), api.post.createPostImage); // uploads image to CDN and returns URL
route.post('/createPost', api.post.createPostNonImage);
route.get('/posts/:authorId', api.posts.getPostsByAuthorId); // CG - gets posts by authorID
route.get('/myFeed', api.posts.getFeed); // CG - gets the ideal logged in feed for a user 

//USERS
route.get('/search/users', api.users.getUsers); //get all users
route.get('/likes', api.post.getNumLikes); // get number of likes
route.post('/likes/:author', api.post.likePost); //like a post
route.delete('/likes/:author', api.post.unlikePost); //unlike a post
route.get('/likers', api.user.getLikers); // get all likers of a particular user
route.post('/friendship', api.user.addFriendship); // CG: ginger's new friendship endpoint
route.get('/friendship', api.user.getFriendship); // CG: This endpoint returns the status of an existing friendship request between two users.
route.get('/friend_list', api.user.getAllFriends);

// Notifications
route.get('/notifications/:userId', api.notifications.getNotifications); 

//CHATS
route.get('/chats/:userId', api.chats.getChatSessions); //retrieve chat history of user
route.get('/chat/:userId', api.chat.getChatMessages); //retrieve messages from a chat session
//USER
// route.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }),api.user.login); // varifies identity on login
route.get('/user/:userId', api.user.getUserById); // gets user by user Id
route.post('/friendship', api.user.addFriendship); // add a friendship between 2 users
route.patch('/friendship', api.user.destroyFriendship); // destroy a friendship or a friendship request
route.get('/friendship', api.user.getFriendship); // returns the status of an existing friendship between two users.
route.get('/friend_list', api.user.getAllFriends); // returns a user's friends list, or if the type requests is sent, a friends-request list

route.get('/:username/profilePage', api.user.getProfilePage); // get profilePage info for user
route.get('/:firstname/:lastname', api.user.getUsername); //gets the username of a user by first name, last name
route.get('/likers', api.user.getLikers); // get all likers of a particular user

route.get('/:username/likes', api.user.getLiked); //get liked users of user
route.get('/:username/profile/:user', api.user.getProfile); //get profile of a specific user
route.get('/:username', api.user.getUser); //gets a user

route.post('/:username', api.user.createUser); //creates a new user
route.patch('/:username/updateProfile', api.user.updateProfile); //update current user's profile


//POST
route.get('/:username/post/author', api.post.getAuthor); // gets the auther of a post
route.post('/:username/posts', api.post.createPost); // create new post

//POSTS
route.get('/:username/posts', api.posts.getPosts); //get posts for the user
route.get('/:username/posts/:certainUser', api.posts.getUserPosts); // get posts for a specified user

route.get('/:firstname/:lastname', api.user.getUsername); //gets the username of a user by first name, last name

module.exports = {
  route: route,
  api: api
};
