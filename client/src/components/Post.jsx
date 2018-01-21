import React from 'react';
import { Card, Icon, Button, Label, Comment } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likeCount: 0,
      clickedUsername: '',
      likers: '',
      personalLikeCount: 0,
      profilePicUrl: '',
      authorUsername: props.authorUsername,
      authorId: props.authorId
    };
  }
  componentDidMount() {
    this.getLikeAmount();
    this.getLikers();
  }

  getLikeAmount() {
    axios.get(`/api/likes`, { params: { 'text': this.props.post.post_text }})
      .then((res) => {
        this.setState({
          likeCount: res.data.length
        })
      })
      .catch((err) => {
        console.error('This is the error', err);
      })
  }

  toggleLike() {
    this.executeToggleLike();
  }

  executeToggleLike() {
    let username = this.props.name;
    // Get the author's username
    axios.get(`/api/${username}/post/author`, { params: { 'text': this.props.post.post_text }})
      .then((author) => {
        // Get the number of times you have liked the post
        axios.get(`/api/${username}/likes`, { params: { 'text': this.props.post.post_text }})
          .then((count) => {
            let personalLikeCount = count.data[0].count;
            // If you haven't liked it yet
            if (personalLikeCount < 1) {
              axios.post(`/api/likes/${author.data[0].username}`, { 'text': this.props.post.post_text, 'username': username })
                .then((res) => {
                  this.getLikers();
                  this.getLikeAmount();
                })
                .catch((err) => {
                  console.error('This is the err', err);
                })
            } else { // Time to unlike!
              axios.delete(`/api/likes/${author.data[0].username}`, { params: { 'text': this.props.post.post_text, 'username': username }})
                .then((res) => {
                  this.getLikers();
                  this.getLikeAmount();
                })
                .catch((err) => {
                  console.error('This is the err', err);
                })
            }
          })
          .catch((err) => {
            console.error('Error getting personal like count', err);
          })
      })
      .catch((err) => {
        console.error('Error', err);
      })
  }

  getLikers() {
    axios.get('/api/likers', { params: { 'text': this.props.post.post_text }})
      .then((likers) => {
        let likerStr = ''
        likers.data.map((liker) => {
          likerStr += `${liker.first_name} ${liker.last_name}<br>`
        })
        this.setState({
          likers: likerStr
        })
      })
      .catch((err) => {
        console.log('Error getting likers', err);
      })
  }
  render() {

    let clickedProfilePath = '/profile/' + this.props.post.username;
    return(
      <div className="postCard">
        <Card fluid>
          <div className="postOverall">
            <div className="postHeader">
              <img className="postPic" src={this.props.post.picture_url || '/images/profile_default.jpg'}/>
              <div className="postBody">
                <p className="postName">
                  <Link to={clickedProfilePath}>
                    <span 
                      className="nameLink">
                      <strong>
                        {this.props.post.first_name}&nbsp;{this.props.post.last_name}
                      </strong>
                    </span>
                  </Link>
                  <br />
                  <span className="postTimestamp">{moment(this.props.post.post_timestamp).fromNow()}</span>
                </p>
              </div>
            </div>
            <hr className="postHorizontal" />
            <p className="postText">{this.props.post.post_text}</p>
            
            {this.props.post.post_image_url && 
              <div>
                <img className="post-image" src={this.props.post.post_image_url} />
              </div>
            }

            <div className="postButtonRow">
              <Button onMouseOver={this.getLikers.bind(this)} data-multiline='true' data-tip={this.state.likers}className="likeButton" onClick={this.toggleLike.bind(this)} as='div' labelPosition='right'>
                <Button className="likeHeartButton">
                  <Icon name="heart" />
                  {(this.state.likeCount)}&nbsp;{(this.state.likeCount !== 1) ? 'likes' : 'like'}
                </Button>
              </Button>
              <ReactTooltip />
              <Button className="commentButton">
                0 Comments
              </Button>
            </div>
            <hr className="postBottomHorizontal" />
          </div>
          {/*<div className="postCommentOverall">
            <div className="commentOverall">
              <div className="commentHeader">
                <img className="commentPic" src="https://pbs.twimg.com/profile_images/926008201127931904/MQI9hqOg.jpg"/>
                <div className="commentBody">
                  <p className="commentName">
                    <strong><a href="">Fred Zirdung</a></strong>&nbsp;&nbsp;<span className="postTimestamp">a few minutes ago</span>
                    <br /><span className="commentText">Awesome!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>*/}
        </Card>
      </div>
    )
  }
}

export default Post;