import React from 'react';
import $ from 'jquery';
import {Input, Button, Card, Image, Form, Field, Icon} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import Dropzone from 'react-dropzone';


class NewUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      pictureUrl: '/images/profile_default.jpg',
      redirect: false,
      invalidInput: false,
      duplicateUsername: false
    }
  }

  onDrop(accepted, rejected) {
    this.setState({
      accepted, rejected
    })
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    if (name === 'pictureUrl' && value === '') {
      this.setState({
        pictureUrl: '/images/profile_default.jpg'
      })
    } else {
        this.setState({
          [name]: value,
          duplicateUsername: false,
          invalidInput: false
        });
    }
  }

  handleSubmit() {
    // If required fields are missing, throw error
    var {username, password, firstName, lastName, pictureUrl} = this.state;
    if (!username || !password || !firstName || !lastName) {
      this.setState({
        invalidInput: true
      });

    // Post to the signup endpoint
    } else {

      $.post(`/api/${username}`, this.state, () => {
        this.props.logUserIn(username, password);
      })
      .fail((err) => {
        // on failure, if error was duplicate username, show that error
        if (err.responseJSON.includes('Key (username)=') && err.responseJSON.includes('already exists.')) {
          this.setState({
            duplicateUsername: true
          });
        }
      });
    }
  }
  
  render() {
    
    if (this.state.redirect) {
      let newUserFeedPath = '/' + this.state.username + '/feed';
      return <Redirect push to={newUserFeedPath} />;
    }

    return (
      <div className="newUser">
        {this.props.usernameError && <h3><font color="red"><Icon name="warning circle"/>Username '{this.props.username}' doesn't match any account.</font></h3>}
        
        <h4 id="new-account-title">Create a New Account</h4>
        <Card className="new-user-card">
          <Image className="ui tiny images" src="/images/profile_default.jpg"/>
          <Form 
            className="input-form"
            onSubmit={this.handleSubmit.bind(this)}>
          
            {this.state.invalidInput && <h5 className="undefined-user-error"><Icon name="warning circle"/>All fields are required. Please enter your info and try again.</h5>}
            
            {this.state.duplicateUsername && <h5 className="undefined-user-error"><Icon name="warning circle"/>Username is already in the system. Please log in above or choose a different username.</h5>}
            
            <Input 
              className="newUserInput" 
              name="username" 
              type="text" 
              autoComplete='username'
              onChange={this.handleInputChange.bind(this)} 
              placeholder="Username"/>
            <Input 
              className="newUserInput" 
              name="password" 
              type="password" 
              autoComplete='new-password'
              onChange={this.handleInputChange.bind(this)} 
              placeholder="Password"/>
            <Input 
              className="newUserInput"
              name="firstName"
              type="text"
              onChange={this.handleInputChange.bind(this)} 
              placeholder="First name"/>
            <Input 
              className="newUserInput"
              name="lastName"
              type="text"
              onChange={this.handleInputChange.bind(this)}
              placeholder="Last name"/>
            <Input 
              className="newUserInput"
              name="pictureUrl"
              type="text"
              onChange={this.handleInputChange.bind(this)}
              placeholder="Profile picture url (optional)"/>
            <div id="terms">By clicking Create Account, you agree to our Terms and that you have read our Data Policy, including our Cookie Use.</div>
            <Input 
              className="login-button"
              id="create-account"
              type="submit"
              value="Create Account"
            />
          </Form>
        </Card>
      </div>
    );
  }
}

export default NewUser;

