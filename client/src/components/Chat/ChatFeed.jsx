import React from 'react';
import { Feed } from 'semantic-ui-react'
import ChatMessage from './ChatMessage.jsx';

class ChatFeed extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var elem = document.getElementById('chatScrollContainer');
    elem.scrollTop = elem.scrollHeight;    
  }
  componentDidUpdate() {
    var elem = document.getElementById('chatScrollContainer');
    elem.scrollTop = elem.scrollHeight;
  }

  render() {
    return (
      <div id='chatScrollContainer' className='chatFeed'>
        <Feed>
          {this.props.messages.map((message, index) => (
            <ChatMessage key={index} currentUserId={this.props.userId} message={message} />
          ))}
        </Feed>
      </div>
    );
  }
}

export default ChatFeed;