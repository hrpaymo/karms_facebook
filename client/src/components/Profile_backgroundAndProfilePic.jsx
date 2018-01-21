import React from 'react';
import { Header, Icon, Image, Button } from 'semantic-ui-react';
import FriendUserButton from './FriendUserButton.jsx';

class Profile_backgroundAndProfilePic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <div className={this.props.profilePageInfo.cover_picture ? "backgroundAndProfilePic" : "backgroundAndProfilePic defaultBackground"}>
        <Image className="backgroundPicture" src={this.props.profilePageInfo.cover_picture}></Image>
        <Image className="profilePicture" src={this.props.profilePageInfo.profile_picture || '/images/profile_default.jpg'}></Image>
        <Header size="large" inverted color="grey" textAlign="center" className="name"> 
          {this.props.userInfo.first_name} {this.props.userInfo.last_name} 
        </Header>
        {this.props.isOwner || 
          <FriendUserButton 
            profileUserId={this.props.profileUserId}
            friendshipStatus={this.props.friendshipStatus}
            removeFriend={this.props.removeFriend} 
            addFriend={this.props.addFriend} />} 
      </div>
    );
  }
}

export default Profile_backgroundAndProfilePic;