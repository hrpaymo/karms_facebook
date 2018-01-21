DROP DATABASE IF EXISTS therebasebook;
CREATE DATABASE therebasebook;

\c therebasebook;

-- SERIAL- adds not null constraint, should increment by 1 for each new entry
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR (25) NOT NULL UNIQUE,
    password VARCHAR (25) NOT NULL,
    first_name VARCHAR (25),
    last_name VARCHAR (25),
    picture_url VARCHAR (255)
);

INSERT INTO users (username, first_name, last_name, picture_url) VALUES ('mattupham', 'Matt', 'Upham', 'https://data.whicdn.com/images/14922648/large.jpg');
INSERT INTO users (username, first_name, last_name, picture_url) VALUES ('albertchanged', 'Albert', 'Chang', 'https://img.buzzfeed.com/buzzfeed-static/static/2017-07/5/14/enhanced/buzzfeed-prod-fastlane-03/enhanced-17346-1499278727-21.jpg?downsize=715:*&output-format=auto&output-quality=auto');
INSERT INTO users (username, first_name, last_name, picture_url) VALUES ('rayango', 'Ryan', 'Ngo', 'http://cdn.litlepups.net/2015/08/02/cute-small-dog-breeds-in-india-sweet.jpg');
INSERT INTO users (username, first_name, last_name, picture_url) VALUES ('kmenghini', 'Kaitlyn', 'Menghini', 'https://lh4.ggpht.com/4nDELzdauqt2pyNaf-JI-ZDo6Ur87KgtQi9ASUaQF-l8qMIfufBXz0FLh1BV5oxGbDw=h900');
INSERT INTO users (username, first_name, last_name, picture_url) VALUES ('sjain', 'Shubhra', 'Jain', 'https://petcube.com/blog/content/images/2017/04/kitten-supplies-cover-1.jpg');

DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    post_text VARCHAR (1000) NOT NULL,
    post_image_url VARCHAR (255),
    post_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO posts (user_id, post_text) VALUES (1, 'matt upham post');
INSERT INTO posts (user_id, post_text) VALUES (2, 'albert chang post');
INSERT INTO posts (user_id, post_text) VALUES (3, 'ryan ngo post');
INSERT INTO posts (user_id, post_text) VALUES (4, 'kaitlyn menghini post');
INSERT INTO posts (user_id, post_text) VALUES (5, 'shubhra jain post');

DROP TABLE IF EXISTS users_friendships CASCADE;
CREATE TABLE users_friendships (
    id SERIAL PRIMARY KEY UNIQUE,
    user_id_from INT REFERENCES USERS(id),
    user_id_to INT REFERENCES USERS(id),
    state varchar(15),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users_friendships (user_id_from, user_id_to, state) VALUES (1, 2, 'request');

DROP TABLE IF EXISTS user_posts_liked CASCADE;
CREATE TABLE user_posts_liked (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id)
);

INSERT INTO user_posts_liked (user_id, post_id) VALUES (2, 1);

DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id),
    user_data jsonb
);

INSERT INTO user_profiles (user_id, user_data) VALUES (1,
  '{
    "profile_picture": "https://data.whicdn.com/images/14922648/large.jpg", 
    "cover_picture": "https://static.pexels.com/photos/210186/pexels-photo-210186.jpeg",
    "intro": "I like to play tag", 
    "residence": "San Francisco", 
    "education": "Hack Reactor",
    "work": "Student", 
    "relationship_status": "Single", 
    "birthday": "January 1, 2008"
  }'
);

INSERT INTO user_profiles (user_id, user_data) VALUES (2,
  '{
    "profile_picture": "https://img.buzzfeed.com/buzzfeed-static/static/2017-07/5/14/enhanced/buzzfeed-prod-fastlane-03/enhanced-17346-1499278727-21.jpg?downsize=715:*&output-format=auto&output-quality=auto", 
    "cover_picture": "http://cdn.mos.cms.futurecdn.net/FUE7XiFApEqWZQ85wYcAfM.jpg",
    "intro": "I like to play frisbee", 
    "residence": "San Francisco", 
    "education": "Hack Reactor",
    "work": "Student", 
    "relationship_status": "Single", 
    "birthday": "December 11, 2017"
  }'
);

INSERT INTO user_profiles (user_id, user_data) VALUES (3,
  '{
    "profile_picture": "http://cdn.litlepups.net/2015/08/02/cute-small-dog-breeds-in-india-sweet.jpg", 
    "cover_picture": "https://www.nationalgeographic.com/content/dam/photography/photos/000/000/6.jpg",
    "intro": "I like to run around", 
    "residence": "San Francisco", 
    "education": "Hack Reactor",
    "work": "Student",  
    "relationship_status": "Single", 
    "birthday": "February 27, 2017"
  }'
);  

  INSERT INTO user_profiles (user_id, user_data) VALUES (4,
  '{
    "profile_picture": "https://lh4.ggpht.com/4nDELzdauqt2pyNaf-JI-ZDo6Ur87KgtQi9ASUaQF-l8qMIfufBXz0FLh1BV5oxGbDw=h900", 
    "cover_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg/1200px-Half_Dome_from_Glacier_Point%2C_Yosemite_NP_-_Diliff.jpg",
    "intro": "I like to jump", 
    "residence": "San Francisco", 
    "education": "Hack Reactor",
    "work": "Student",  
    "relationship_status": "Single", 
    "birthday": "February 5, 2017"
  }'
);  

  INSERT INTO user_profiles (user_id, user_data) VALUES (5,
  '{
    "profile_picture": "https://petcube.com/blog/content/images/2017/04/kitten-supplies-cover-1.jpg", 
    "cover_picture": "https://fthmb.tqn.com/Eynp5TR-E6oyLoepG69ZgBrfw8M=/3666x2444/filters:fill(auto,1)/MtWhitney_PinyaPhotography_GettyImages_2-56e04db03df78c5ba054f849.jpg",
    "intro": "I like to skip", 
    "residence": "San Francisco", 
    "education": "Hack Reactor",
    "work": "Student",  
    "relationship_status": "Single", 
    "birthday": "February 10, 2017"
  }'
);

  DROP TABLE IF EXISTS CHATS CASCADE;
  CREATE TABLE CHATS (
    id SERIAL PRIMARY KEY,
    user_1 INT REFERENCES USERS(id), -- make this an index
    user_2 INT REFERENCES USERS(id) -- make this an index
  );

  DROP TABLE IF EXISTS MESSAGES CASCADE;
  CREATE TABLE MESSAGES (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    chat_id INT REFERENCES CHATS(id), -- make this an index
    text VARCHAR(1000) NOT NULL,
    author_id INT REFERENCES USERS(id)
  );

  DROP TABLE IF EXISTS NOTIFICATIONS CASCADE;
  CREATE TABLE NOTIFICATIONS (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id INT REFERENCES USERS(id),
    seen BOOLEAN NOT NULL DEFAULT FALSE
  );

  DROP TABLE IF EXISTS NOTIFICATIONS_FRIENDSHIPS CASCADE;
  CREATE TABLE NOTIFICATIONS_FRIENDSHIPS (
    id SERIAL PRIMARY KEY,
    notifications_id INT REFERENCES NOTIFICATIONS(id),
    friendships_id INT REFERENCES USERS_FRIENDSHIPS(id),
    type VARCHAR(50) DEFAULT NULL
  );

  DROP TABLE IF EXISTS NOTIFICATIONS_MESSAGES CASCADE;
  CREATE TABLE NOTIFICATIONS_MESSAGES (
    id SERIAL PRIMARY KEY,
    notifications_id INT REFERENCES NOTIFICATIONS(id),
    messages_id INT REFERENCES MESSAGES(id),
    read BOOLEAN NOT NULL DEFAULT FALSE
  );

