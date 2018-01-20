import React from 'react';
import { Segment, Container, Popup, Button } from 'semantic-ui-react';

import ChatHeader from './ChatHeader.jsx';
import ChatFriendSearch from './ChatFriendSearch.jsx';
import ChatFeed from './ChatFeed.jsx';
import ChatMessageInput from './ChatMessageInput.jsx';
import ChatHistory from './ChatHistory.jsx';
import ChatOnlineUsers from './ChatOnlineUsers.jsx';
import io from 'socket.io-client';
import http from 'axios';
 

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friend: null,
      socket: null,
      messages: [],
      user: props.username,
      displayChat: false,
      onlineUsers: [],
      chatHistory: []
    }

    this.onClose = this.onClose.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.openChat = this.openChat.bind(this);
  }

  componentDidMount() {
    this.connect();
    this.getChatHistory();
  }

  getChatHistory() {
    http.get(`/api/chats/${this.props.userId}`)

      .then((response) => {
        this.setState({
          chatHistory: response.data
        })
      })
  }

  connect() {
    const socket = io('/chat');

    socket.on('connect', () => {
      socket.emit('login', { userId: this.props.userId });
    });

    socket.on('message', (message) => {

      if (!this.state.friend) {
        
        this.openChat({id: message.from});

      } else {
        let messages = this.state.messages;
        messages.push(message.message);
        this.setState({
          messages: messages
        })
      }
      
    });

    socket.on('onlineusrs', (data) => {
      this.setState({
        onlineUsers: data
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`Connection to Chat server was closed, received message "${reason}", attempting to recconect`);
      socket.open();
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Connection to Chat server reestablished after ${attemptNumber} attempts`);
    });

    this.setState({
      socket: socket
    });
  }

  onClose() {    
    this.setState({
      friend: null,
      messages: [],
      displayChat: false
    });
  }

  openChat(friend) {
    if (friend) {
      Promise.all([
        //fetch freind details
        http.get(`/api/user/${friend.id}`),      
        //fetch chat history
        http.get(`/api/chat/${this.props.userId}`, {
          params: {
            friendId: friend.id
          }
        })
      ])

      .then((results) => {
        this.setState({
          displayChat: true,
          friend: results[0].data[0],
          messages: results[1].data
        })
      })
      .catch((err) => {
        console.log(err.message);
      });

    } else {
      //set displayChat to true
      this.setState({
        friend: null,
        displayChat: true,
        messages: []
      })
    }
  }

  
  sendMessage(text) {
    this.state.socket.emit('message', {
      to: this.state.friend.id,
      message: text,
      from: this.props.userId,
    });

    let messages = this.state.messages;
    let message = {
      text: text,
      authorId: this.props.userId
    };
    messages.push(message);

    this.setState({
      messages: messages
    });
  }

  renderOnlineUsers(users) {
    return <ChatOnlineUsers users={users} />
  }

  renderChatWindow(active) {

    let chatHeaderText,
      chatFriendSearch,
      chatMessageInput;

    if (this.state.friend) {
      chatHeaderText = this.state.friend.firstName + ' ' + this.state.friend.lastName;
      chatFriendSearch = null;
      chatMessageInput = <div className='chatinput'><ChatMessageInput onSubmit={this.sendMessage} socket={this.state.socket} /></div>
    } else {
      chatHeaderText = 'New Message';
      chatFriendSearch = <ChatFriendSearch onSelect={this.openChat} />
      chatMessageInput = null;
    }

    return active && (
      <div className='chatcontainer'>
        <Segment >
          <ChatHeader text={chatHeaderText} onClose={this.onClose} />
          {chatFriendSearch}
          <ChatFeed messages={this.state.messages} userId={this.props.userId}/>
          {chatMessageInput}
        </Segment>
      </div>
    );
  }

  render() {

    return (
      <div className='chatcomponent' >
        <div className='chatbutton' >
          <Popup
            trigger={<Button icon='comments'/>}
            content={<ChatHistory newMessage={this.openChat} chats={this.state.chatHistory} onSelectChat={this.openChat}/>}
            on='click'
          />          
        </div>
        {this.renderChatWindow(this.state.displayChat)}
      </div>
    )
  }
}

ChatWindow.Header = ChatHeader;
ChatWindow.FriendSearch = ChatFriendSearch;
ChatWindow.Feed = ChatFeed;
ChatWindow.MessageInput = ChatMessageInput;

export default ChatWindow;