import React from 'react';
import { Card, Icon, Button, Label, Comment, Input } from 'semantic-ui-react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postText: '',
      accepted: [],
      rejected: []
    }
  }

  handlePostInput(event) {
    const value = event.target.value;

    this.setState({
      postText: value
    });
  }

  onDrop(accepted, rejected) {
    this.setState(
      { accepted, rejected }
    ); 
  }

  createPostNew() {
    let postInput = this.state.postText || ' ';
    let authorId = this.props.userId;
    let hasImage = Boolean(this.state.accepted[0]);

    let options = null;
    let endpoint = '/api/createPost';
    let basicPostBody = {
      'postText': postInput,
      'authorId': authorId
    } 

    let imagePostBody;

    if (hasImage) {
      endpoint='/api/uploadImagePost';

      // Define Post body
      imagePostBody = new FormData();
      imagePostBody.append('sharedImage', this.state.accepted[0]);
      imagePostBody.append('postText', postInput);
      imagePostBody.append('authorId', authorId);

      let contentType = this.state.accepted[0].type;

      let options = {
        headers: {
          'Content-Type': contentType
        }
      }
    }

    axios.post(endpoint, hasImage ? imagePostBody : basicPostBody, hasImage && options)
      .then((result) => {

        // after successful post, clear out state
        this.setState({
          postText: '',
          accepted: [],
          rejected: []
        });

        // render any new posts 
        this.props.getAllPosts();

      })
      .catch((err) => {
        console.log(err);
      });
  }

  sendPostText(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="createPostBody">
        <Card fluid>
          <div className="createPostHeader">
          <h2 className="createPostLabel">Create New Post</h2>
          </div>
          <form onSubmit={this.sendPostText.bind(this)}>
            <Input 
              className="createPostInput"
              type="text" 
              onChange={this.handlePostInput.bind(this)}
            />
            <div className='post-imageSelectContainer'>
              
              <Dropzone 
                className='post-imageSelect'
                multiple={false}
                acceptClassName='post-imageSelect post-imageSelect-accepted'
                accept='image/jpeg'
                onDrop={this.onDrop.bind(this)}>
                <p>Drop a .jpg image, or click to upload</p>
                <Icon name='photo'/>
              </Dropzone>
              {this.state.accepted[0] &&  
                <div className='post-imageSelect-aside'>
                  <strong>Image attached! </strong>
                  <span>{this.state.accepted[0].name} </span>
              </div>}
              {this.state.rejected[0] && 
                <div className='post-imageSelect-aside'>
                  <strong>Please upload an image with a jpg file-type!</strong>
                </div>
              }
            </div>

            <div className="createPostButtonRow">
              <Button 
                className="createPostButton"
                onClick={this.createPostNew.bind(this)}>
                Post
              </Button>
              {/*<Button className="cancelPostButton">Cancel</Button>*/}
            </div>
          </form>
        </Card>
      </div>
    )
  }
}

export default CreatePost;
