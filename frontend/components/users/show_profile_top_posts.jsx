var React = require('react');
var UserStore = require('../../stores/user');

var SHOW_PROFILE_TOP_POSTS_SELECTORS = ['All', 'Questions', 'Answers'];

var ShowProfileTopPosts = React.createClass({
  getInitialState: function() {
    return {
      select: SHOW_PROFILE_TOP_POSTS_SELECTORS[0],
      sortBy: UserStore.getPostsSortBy()
    };
  },
  handleHeaderLabel: function() {
    return this.state.select === 'All' ? 'Posts' : this.state.select;
  },
  handleHeaderCount: function() {
    switch (this.state.select) {
      case 'All':
        return this.props.posts.length;
      case 'Questions':
        return this.props.posts.filter(function(post) {
          return post.type === 'Question';
        }).length;
      case 'Answers':
        return this.props.posts.filter(function(post) {
          return post.type === 'Answer';
        }).length;
    }
  },
  renderTopPosts: function() {
    var posts;
    switch (this.state.select) {
      case 'All':
        posts = this.props.posts;
        break;
      case 'Questions':
        posts = this.props.posts.filter(function(post) {
          return post.type === 'Question';
        });
        break;
      case 'Answers':
        posts = this.props.posts.filter(function(post) {
          return post.type === 'Answer';
        });
        break;
    }
    return (
      <div className='user-show-profile-top-posts-main'>
        {posts.map(function(post) {
          return (
            <div
              className='user-show-profile-top-posts-main-element'
              key={post.type + '-' + post.id}>
              {post.type + ' ' + post.vote_score + ' ' + post.title + ' ' +
                post.created_at.toLocaleDateString()}
            </div>
          );
        })}
      </div>
    );
  },
  render: function() {
    return (
      <div className='user-show-profile-top-posts'>
        <div className='user-show-profile-main-header'>
          <span className='user-show-profile-main-header-label'>
            {'Top ' + this.handleHeaderLabel() + ' '}
          </span>
          <span className='user-show-profile-main-header-count'>
            {'(' + this.handleHeaderCount() + ')'}
          </span>
        </div>

        {this.renderTopPosts()}
      </div>
    );
  }
});

module.exports = ShowProfileTopPosts;
