import React from 'react';
import { List, Button, Image } from 'semantic-ui-react';

const ChatOnlineUser = (props) => {


  let onSelectChat = function() {
    let friend = {
      id: props.user.id
    };
    props.onSelectChat(friend);
  }

  return (
    <div className='onlineuseritem' onClick={onSelectChat}>
      <List.Item>
        <Image avatar src={props.user.pictureUrl} />
        <List.Content>
          <List.Header as='a'>{props.user.firstName + ' ' + props.user.lastName}</List.Header>
        </List.Content>
      </List.Item>
    </div>
  );
};

const ChatOnlineUsers = (props) => {

  return (
    <div className="chatonlineusers" >
      <div className='chatHeader'>
        Online Users
        <Button className='chatCloseButton' floated='right' icon='close' onClick={props.onClose} />
      </div>
      <div className="onlineList">
      <List>
          {props.users.map((user) => (
            <ChatOnlineUser key={user.id} user={user} onSelectChat={props.onSelectChat}/>
          ))}
        </List>
      </div>
    </div>
  );
}

export default ChatOnlineUsers;