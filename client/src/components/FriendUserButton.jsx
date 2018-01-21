import React from 'react';
import { Header, Icon, Image, Button } from 'semantic-ui-react';

class FriendUserButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    let button;
    if (this.props.friendshipStatus === 'friends') {
      button = <Button compact inverted animated size="small"
        className='removeFriends'
        onClick={() => this.props.removeFriend(this.props.profileUserId)} >
          <Button.Content visible>
            <Icon name='check' />
            Friends
          </Button.Content> 
          <Button.Content hidden>
            <Icon name='remove' />
            Unfriend
          </Button.Content> 
        </Button>

    } else if (this.props.friendshipStatus === 'response needed') {

      button = <Button compact inverted size="small"
        className='approveFriendship'
        onClick={() => this.props.addFriend(this.props.profileUserId)} >
          <Button.Content visible>
            <Icon name='add circle'/>
            Approve Friend Request
          </Button.Content> 
        </Button>

    } else if (this.props.friendshipStatus === 'response pending') {

      button = <Button compact inverted animated size="small"
        className='removeFriends'
        onClick={() => this.props.removeFriend(this.props.profileUserId)} >
          <Button.Content visible>
            <Icon name='check' />
            Friend request sent!
          </Button.Content> 
          <Button.Content hidden>
            Cancel friend request
          </Button.Content> 
        </Button>

    } else {

      button = <Button compact inverted size="small"
        className='addFriend'
        onClick={() => this.props.addFriend(this.props.profileUserId)} >
          <Button.Content visible>
            <Icon name='add circle'/>
            Add Friend
          </Button.Content> 
        </Button>
    } 

    return (
      <span className="friendStatus">
        {button}
      </span>
    )
  }
}

export default FriendUserButton;