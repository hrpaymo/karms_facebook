import React from 'react';
import { Form } from 'semantic-ui-react';

class ChatMessageInput extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      text: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  onSend(e, {value}) {
    this.setState({
      text: ''
    });
    this.props.onSubmit(this.state.text);
  }

  onChange(e, {value}) {
    this.setState({
      text: value
    });
  }

  render() {

    return (
      <Form>
        <Form.Group inline>
          <Form.Input value={this.state.text} onChange={this.onChange} />
          <Form.Button onClick={this.onSend}>Send</Form.Button>
        </Form.Group>
      </Form>
    );
  }
}

export default ChatMessageInput;