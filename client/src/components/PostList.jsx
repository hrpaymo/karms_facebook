import React from 'react';
import Post from './Post.jsx';
import CreatePost from './CreatePost.jsx';
import axios from 'axios';
import UserList from './UserList.jsx';
import Header from './Header.jsx';
import FadeIn from 'react-fade-in';

class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedText: ''
    }
  }
  getAllPosts() {
    this.props.getAllPosts();
  }
  receivePostText(text) {
    this.setState({
      receivedText: text
    })
  }
  render() {
    return (
      <div>
        <CreatePost 
          getAllPosts={this.getAllPosts.bind(this)}
          userId={this.props.userId}
          name={this.props.name} />
        <br />
        {
          this.props.postList.map((post) => (
            <FadeIn key={post.post_id}>
              <div>
                <Post
                  username={this.props.name}
                  post={post}
                  authorId = {post.user_id}
                  authorUsername= {post.username}
                  name={this.props.name}
                />
                <br />
              </div>
            </FadeIn>
          ))
        }
      </div>
    )
  }
}

export default PostList;