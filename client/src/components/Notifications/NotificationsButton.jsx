import React from 'react';
import { Segment, Container, Popup, Button } from 'semantic-ui-react';

import NotificationHistory from './NotificationHistory.jsx';

import io from 'socket.io-client';
import http from 'axios';


class NotificationsButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: null,
      socket: null,
      userId: props.userId
    };

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    console.log('NotificationsButton loaded');
    this.connect();
    this.getUnseenNotifications();
  }

  connect() {
    const socket = io('/notifications');

    socket.on('connect', () => {
      console.log('logging in to /notifications/login for userId:', this.props.userId);
      socket.emit('login', {userId: this.props.userId });
    });

    socket.on('notifications', notifications => {
      console.log('notifications:', notifications);
      this.setState({
        notifications: notifications
      })
    });

    socket.on('disconnect', (reason) => {
      console.log(`Connection to notifications server was closed, received message "${reason}", attempting to recconect`);
      socket.open();
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Connection to notifications server reestablished after ${attemptNumber} attempts`);
    });

    this.setState({
      socket: socket
    });
  }

  // this gets called on page refresh
  getUnseenNotifications() {
    http.get(`/api/notifications/unseen/${this.props.userId}`)
      .then(response => {
        console.log('here\'s the response.data I got:', response.data);
        this.setState({
          notifications: response.data
        })
      })
  }

  onClose() {
    if (this.state.socket) {
      this.state.socket.close();
    }
    
    this.setState({
      notifications: null,
      socket: null,
      user: props.user,
    });
  }

  render() {

    return (
      <div className='notificationscomponent' >
        <div className='notificationsbutton' >
          <Popup
            trigger={<Button icon='sidebar'/>}
            content={<NotificationHistory notifications={this.state.notifications} />}
            on='click'
          />          
        </div>
      </div>
    )
  }

}

export default NotificationsButton;