import React from 'react';

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: null,
      seen: null
    }
  }

  componentDidMount() {
    console.log('notification:', this.props.notification);
    this.setState({
      notification: this.props.notification,

    })
  }
}

export default Notification;