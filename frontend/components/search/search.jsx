var React = require('react');
var SearchStore = require('../../stores/search');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;
var SortNav = require('../shared/sort_nav');

var _callbackId;

var POST_SORT_TYPES = ['relevance', 'newest', 'votes'];

var Search = React.createClass({
  getInitialState: function() {
    return {
      query: this.props.params.query || '',
      posts: null,
      sortBy: SearchStore.getSortBy()
    };
  },
  componentDidMount: function() {
    _callbackId = SearchStore.addListener(this.receivePosts);
    if (this.props.params.query) {
      ApiUtil.searchPosts(this.props.params.query);
    }
  },
  componentWillReceiveProps: function(newProps) {
    this.state.posts = null;
    this.state.query = newProps.params.query;
    ApiUtil.searchPosts(newProps.params.query);
  },
  receivePosts: function() {
    this.setState({ posts: SearchStore.all() });
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  handleChange: function(e) {
    this.setState({ query: e.currentTarget.value });
  },
  handleKeyDown: function(e) {
    if (e.keyCode === 13) {
      var path = '/search/' + this.state.query;
      hashHistory.push(path);
    }
  },
  handleSubmit: function() {
    if (this.state.query) {
      var path = '/search/' + this.state.query;
      hashHistory.push(path);
    }
  },
  handleSortChange: function() {
    alert('TODO handleSortChange search');
  },
  render: function() {
    var posts, sortNavHeader, postWord;
    if (this.state.posts) {
      posts = (
        <div>
          {this.state.posts.map(function(post) {
            var key = post.id;
            if (post.view_count) {
              key = 'question-' + key;
            } else {
              key = 'answer-' + key;
            }
            return (
              <div key={key}>
                <div>{post.title}</div>
                <div>{post.content}</div>
              </div>);
          })}
        </div>
      );

      postWord = this.state.posts === 1 ? 'post' : 'posts';
      sortNavHeader = this.state.posts.length + ' ' + postWord + ' found';
    }

    return (
      <div className='search-container'>
        <div className='content-double-main'>
          <div className='search-bar-container'>
            <input
              value={this.state.query}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown} />
            <button onClick={this.handleSubmit}>Search</button>
          </div>
          <SortNav
            tabShift='right'
            links={POST_SORT_TYPES}
            active={this.state.sortBy}
            header={sortNavHeader}
            handleSortChange={this.handleSortChange}/>
          {posts}
        </div>
      </div>
    );
  }
});

module.exports = Search;
