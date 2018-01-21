import React from 'react';
import { Divider, Header, List, Icon, Grid, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Profile_friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: props.view,
      redirect: false,
      username: ''
    }
  }

  render() {

    let countOfFriends = `  ·  ${this.props.friendList.length} ${(this.props.friendList.length === 1) ? 'friend' : 'friends'}`
    
    return (
      <div 
        className={this.props.view === 'Timeline' ? "friendsList" : "hide"}>
        <Header className="header"> 
          <Icon name="users"></Icon>
          Friends
        </Header>
        <span className="friendsCount">
          {countOfFriends}
        </span>
        <div className="friends">
          {this.props.friendList.slice(0, 9).map((friend, index) => {
            let friendUrl = '/profile/' + friend.username;
            return (
              <div key={friend.id} className="friend">
                <Link to={friendUrl}>
                  <img src={friend.picture_url || '/images/profile_default.jpg'} id={friend.username}/>
                </Link>
                <Link to={friendUrl}>
                  <span className="friendName" id={friend.username}>
                    <strong> {friend.first_name} {friend.last_name} </strong>
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default Profile_friends;