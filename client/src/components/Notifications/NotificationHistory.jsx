import React from 'react';
import { List, Image, Divider } from 'semantic-ui-react';

const NotificationHistoryMessage = props => (
  <List.Item>
  <Image avatar src={props.notification.fromUserPictureUrl} />
  <List.Content>
    <List.Header>{props.notification.fromUserFirstName} {props.notification.fromUserLastName}</List.Header>
    <List.Description>{props.notification.friendshipState === 'friend'
                        ? `Accepted your friend request!`
                        : `Requested you as a friend!`
                      }
    </List.Description>
  </List.Content>
</List.Item>
);

const NotificationHistory = props => {
  return (
    <div>
      <List>
        {props.notifications.map((notification) => (
          <NotificationHistoryMessage key={notification.id} notification={notification} />
        ))}
      </List>
    {/* <Divider horizontal /> */}
    {/* <a onClick={props.newMessage}>New Message</a> */}
  </div>

  );
}


export default NotificationHistory;