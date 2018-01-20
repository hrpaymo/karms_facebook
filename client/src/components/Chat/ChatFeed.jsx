import React from 'react';
import { Feed } from 'semantic-ui-react'
import ChatMessage from './ChatMessage.jsx';

const ChatFeed  = (props) => {
  return (
    <div className='chatFeed'>
      <Feed>
        {props.messages.map((message, index) => (
          <ChatMessage key={index} currentUserId={props.userId} message={message} />
        ))}
      </Feed> 
    </div>
  );
}

export default ChatFeed;