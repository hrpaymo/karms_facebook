import React from 'react';
import { Feed } from 'semantic-ui-react';
import moment from 'moment';


const ChatMessage = (props) => {

  if (props.message.authorId === props.currentUserId) {
    return (
        <Feed.Event>
          <Feed.Content content={<div className='chatmessageuser'>{props.message.text}</div>}/>
        </Feed.Event>
    );
  } else {
    return (
      <Feed.Event>
        <Feed.Label image={props.message.pictureUrl} />
        <Feed.Content content={<div className='chatmessagefriend'>{props.message.text}</div>} />
      </Feed.Event>
    );
  }
}

export default ChatMessage;