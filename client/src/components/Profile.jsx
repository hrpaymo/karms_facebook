import React from 'react';
import CreatePost from './CreatePost.jsx';
import Post from './Post.jsx';
import PostList from './PostList.jsx';
import FBHeader from './Header.jsx';
import Profile_friends from './Profile_friends.jsx';
import Profile_photos from './Profile_photos.jsx';
import Profile_intro from './Profile_intro.jsx';
import Profile_about from './Profile_about.jsx';
import Profile_allFriends from './Profile_allFriends.jsx';
import Profile_navigation from './Profile_navigation.jsx';
import Profile_backgroundAndProfilePic from './Profile_backgroundAndProfilePic.jsx';
import Profile_postSection from './Profile_postSection.jsx';
import axios from 'axios';
import { Image, Button, Header, List, Item, Divider, Icon, Menu } from 'semantic-ui-react';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Timeline',
      username: props.loggedInUsername, // not an error, do not change
      loggedInUserId: props.loggedInUserId,
      profilePageUsername: props.match.params.friendname, // not an error, do not change
      profileUserId: null,
      isOwner: null,
      friendshipStatus: null,
      authorPosts: [],
      profilePageInfo: '',
      profileInfo: {},
      friendList: []
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadProfileInfo(this.state.profilePageUsername);
    this.loadSupplementaryProfileInfo(this.state.profilePageUsername);
  }  

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        profilePageUsername: nextProps.match.params.friendname
      });
      this.loadProfileInfo(nextProps.match.params.friendname);
      this.loadSupplementaryProfileInfo(nextProps.match.params.friendname);
    }
  }

  loadProfileInfo(profileName) {

    axios.get(`/api/${profileName}`)
      .then((responseUserInfo) => {

        let profileUserId=responseUserInfo.data[0].id;

        let onOwnPage = this.state.username === profileName;
        this.setState({
          profileInfo: responseUserInfo.data[0],
          profileUserId: profileUserId,
          isOwner: onOwnPage
        });

        this.getFriends(profileUserId);
        this.getUserPosts(profileUserId);

        if (!onOwnPage) {
          this.getFriendshipStatus(profileUserId);   
        }
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  loadSupplementaryProfileInfo(user) {
    axios.get(`/api/${user}/profilePage`)
      .then((responseUserProfileInfo) => {
        this.setState({
          profilePageInfo: responseUserProfileInfo.data['0'].user_data
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  getUserPosts(profileId) {
    let profileUserId = profileId || this.state.profileUserId;

    axios.get(`/api/posts/${profileUserId}`)
      .then((results) => {
        this.setState({
          authorPosts: results.data
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  getFriends(profileId) {

    let params = {
      userId: profileId,
      type: 'friend'
    }

    axios.get('/api/friend_list', {params: params})
      .then((results) => {
        this.setState({
          friendList: results.data
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getFriendshipStatus(profileId) {
    let loggedInUserId = this.state.loggedInUserId;

    let params = {
      userId: loggedInUserId,
      friendId: profileId
    }

    axios.get('/api/friendship', {params: params})
      .then((results) => {
        let friendshipStatus = results.data && results.data.friendship_status;
        this.setState({
          friendshipStatus: friendshipStatus
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addFriend(friendId) {
    let data = {
      userId: this.state.loggedInUserId,
      friendId: friendId
    }

    axios.post('/api/friendship', data)
      .then((response) => {
        this.getFriendshipStatus(friendId);
      })
      .catch((error) => {
        console.error(error);
      })
  } 

  removeFriend(friendId) {
    let data = {
      type: 'remove',
      userId: this.state.loggedInUserId,
      friendId: friendId
    }

    axios.patch('/api/friendship', data)
      .then((response) => {
        this.getFriendshipStatus(friendId);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  handleNavigation(event) {
    this.setState({
      view: event.target.id
    });
  }

  updateProfile(changes) {
    var username = this.state.profilePageUsername;
    axios.patch(`/api/${username}/updateProfile`, changes)
      .then((response) => {
        this.getUserProfileInfo(this.state.profilePageUsername);
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  render() {
    return (
      <div className="profile">
        <Profile_backgroundAndProfilePic 
          userInfo={this.state.profileInfo}
          addFriend={this.addFriend.bind(this)}
          removeFriend={this.removeFriend.bind(this)}
          isOwner={this.state.isOwner}
          friendshipStatus={this.state.friendshipStatus}
          profilePageInfo={this.state.profilePageInfo} 
          profileUserId={this.state.profileUserId}/>
        <Profile_navigation
          handleNavigation={this.handleNavigation.bind(this)}
          view={this.state.view} />
        <Profile_about
          view={this.state.view}
          profilePageInfo={this.state.profilePageInfo}
          updateProfile={this.updateProfile.bind(this)}
          isOwner={this.state.isOwner} />
        <Profile_allFriends
          view={this.state.view}
          friendList={this.state.friendList}
          friends={this.state.friends} />
        <Profile_intro
          view={this.state.view}
          profilePageInfo={this.state.profilePageInfo} />
        <Profile_friends
          friendList={this.state.friendList}
          view={this.state.view}
          owner={this.state.profilePageUsername}
          user={this.state.username} />
        <Profile_photos 
          view={this.state.view} />
        <Profile_postSection 
          loggedInUserId={this.state.loggedInUserId}
          getUserPosts={this.getUserPosts.bind(this)} 
          username={this.state.profilePageUsername} 
          posts={this.state.authorPosts}
          view={this.state.view} 
          isOwner={this.state.isOwner} />
      </div>
    );
  }
}

export default Profile;