import React from 'react';
import { Divider, Header, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Profile_allFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: props.view,
      friendList: props.friendList
    }
  }

  render() {
    return (
      <div className={this.props.view === 'friends' ? "friendsContainer" : "hide"}>
        <div className="friends">  
          <div className="title">
            <Header>             
              <Icon name="users"></Icon>
              &nbsp;Friends 
            </Header>
          </div>
          <div className="allFriends">
            {this.props.friendList.slice(0, 9).map((friend) => {
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
      </div>
    );
  }
}

export default Profile_allFriends;