import React from 'react';
import { List, Image, Divider } from 'semantic-ui-react';

class ChatHistoryMessage extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectChat = this.onSelectChat.bind(this);
  }
  
  onSelectChat() {
    let friend = {
      firstName: this.props.chat.firstName,
      lastName: this.props.chat.lastName,
      username: this.props.chat.username,
      id: this.props.chat.friendId
    };
    this.props.onSelectChat(friend);
  }
  
  
  render() {
    
    return (
      <div className='chathistoryitem' onClick={this.onSelectChat}>
        <List.Item >
          <Image avatar src={this.props.chat.pictureUrl} />
          <List.Content>
            <List.Description>{this.props.chat.firstName + ' ' + this.props.chat.lastName}</List.Description>
          </List.Content>
        </List.Item>
      </div>
    );
  }
}

class ChatHistory extends React.Component {
  constructor(props) {
    super(props);
    
    this.onNewMessage = this.onNewMessage.bind(this);
  };
  
  onNewMessage() {
    this.props.newMessage();
  }

  render() {
     
    return (
      <div>
        <List>
          {this.props.chats.map((chat) => (
            <ChatHistoryMessage key={chat.id} chat={chat} onSelectChat={this.props.onSelectChat} />
          ))}
        </List>
        <Divider horizontal />
        <a onClick={this.onNewMessage}>New Message</a>
      </div>
    );
  }
}

export default ChatHistory;