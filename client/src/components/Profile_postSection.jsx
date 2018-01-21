import React from 'react';
import CreatePost from './CreatePost.jsx';
import Post from './Post.jsx';
import { List } from 'semantic-ui-react';
import FadeIn from 'react-fade-in';

class Profile_postSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: props.view
    }
  }

  render() {
    return (
      <div className={this.props.view === 'Timeline' ? "postSection" : "hide"}>
        {this.props.isOwner && 
          <CreatePost 
            userId={this.props.loggedInUserId}
            getAllPosts={this.props.getUserPosts.bind(this)}
            name={this.props.username}/>}
        
        {this.props.isOwner ? 
          <List className="items">
          {
            this.props.posts.map((post, index) => (
              <FadeIn key={index}>
                <div key={index} className="profilePostBorder">
                  <Post 
                    userId={this.props.loggedInUserId}
                    post={post} 
                    authorId={post.user_id}
                    authorUsername= {post.username}
                    profile={this.props.profile}/>
                  <br />
                </div>
              </FadeIn>
            ))
          }
          </List>

          :

          <List className="visitorView">
          {
            this.props.posts.map((post, index) => (
              <FadeIn key={index}>
                <div key={index} className="profilePostBorder" profile={this.props.profile}>
                  <Post
                    userId={this.props.loggedInUserId}
                    post={post}
                    authorId={post.user_id}
                    authorUsername= {post.username}/>
                  <br />
                </div>
              </FadeIn>
            ))
          }
          </List>  
        }  
      </div>
    );
  }
}

export default Profile_postSection;