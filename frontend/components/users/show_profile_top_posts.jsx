var React = require('react');
var UserStore = require('../../stores/user');
var hashHistory = require('react-router').hashHistory;
var MiniNav = require('../shared/mini_nav');
var UserActions = require('../../actions/user');

var SHOW_PROFILE_TOP_POSTS_SELECTORS = ['All', 'Questions', 'Answers'];
var SHOW_PROFILE_TOP_POSTS_SORT_TYPES = ['Votes', 'Newest'];

var ShowProfileTopPosts = React.createClass({
  getInitialState: function() {
    return {
      select: UserStore.getPostsSelect(),
      sortBy: UserStore.getPostsSortBy()
    };
  },
  handlePostClick: function(primaryId, questionId) {
    var path = '/questions/';
    if (questionId) {
      path += questionId + '/answer/' + primaryId;
    } else {
      path += primaryId;
    }
    hashHistory.push(path);
  },
  handleSelectClick: function(select) {
    UserActions.changeUserPostsSelect(select);
    this.setState({ select: select });
  },
  handleSortByClick: function(sortBy) {
    UserActions.changeUserPostsSortBy(sortBy);
    this.setState({ sortBy: sortBy });
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
          return !post.question_id;
        }).length;
      case 'Answers':
        return this.props.posts.filter(function(post) {
          return post.question_id;
        }).length;
    }
  },
  renderTopPosts: function() {
    var posts = this.props.posts;
    if (!posts.length) {
      var message = 'This user has not ';
      switch (this.state.select) {
        case 'All':
          message += ' posted yet.';
          break;
        case 'Questions':
          message += ' asked any questions yet.';
          break;
        case 'Answers':
          message += ' posted any answers yet.';
          break;
      }
      return (<div className='user-show-empty-content'>{message}</div>);
    }
    return (
      <div className='user-show-profile-top-posts-main'>
        {posts.slice(0,10).map(function(post) {

          var postTitle;
          if (post.title.length > 100) {
            postTitle = post.title.slice(0, 100) + '...';
          } else {
            postTitle = post.title;
          }
          return (
            <div
              onClick={this.handlePostClick.bind(null, post.id, post.question_id)}
              className='user-show-profile-top-posts-main-element group'
              key={(post.question_id ? 'answer' : 'question') + '-' + post.id}>
              <div className='user-show-profile-top-posts-main-element-type'>
                {post.question_id ? 'A:' : 'Q:'}
              </div>
              <div className='user-show-profile-top-posts-main-element-vote-count'>
                <span>{post.vote_count}</span>
              </div>
              <div className='user-show-profile-top-posts-main-element-post-title'>
                {postTitle}
              </div>
              <div className='user-show-profile-top-posts-main-element-create-date'>
                {post.created_at.toLocaleDateString()}
              </div>
            </div>
          );
        }.bind(this))}
      </div>
    );
  },
  render: function() {
    return (
      <div className='user-show-profile-top-posts'>
        <div className='user-show-common-header'>
          <span className='user-show-common-header-label'>
            {'Top ' + this.handleHeaderLabel()}
          </span>
          <span className='user-show-common-header-count'>
            {this.handleHeaderCount()}
          </span>
          <div className='mini-nav-group-container group'>
            <MiniNav
              links={SHOW_PROFILE_TOP_POSTS_SORT_TYPES}
              handleClick={this.handleSortByClick}
              active={this.state.sortBy}/>
            <MiniNav
              links={SHOW_PROFILE_TOP_POSTS_SELECTORS}
              handleClick={this.handleSelectClick}
              active={this.state.select}/>
          </div>
        </div>
        {this.renderTopPosts()}
        <div className='user-show-profile-main-footer'>
          {'View all '}
          <span
            onClick={this.props.handleViewMoreClick.bind(null, 'questions')}
            className='link'>
            questions
          </span>
          {' and '}
          <span
            onClick={this.props.handleViewMoreClick.bind(null, 'answers')}
            className='link'>
            answers
          </span>
          {' →'}
        </div>
      </div>
    );
  }
});

module.exports = ShowProfileTopPosts;
