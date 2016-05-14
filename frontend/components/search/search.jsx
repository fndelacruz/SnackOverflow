var React = require('react');
var SearchStore = require('../../stores/search');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;

var _callbackId;

var Search = React.createClass({
  getInitialState: function() {
    return {
      query: this.props.params.query || '',
      posts: null
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
  handleSubmit: function() {
    if (this.state.query) {
      var path = '/search/' + this.state.query;
      hashHistory.push(path);
    }
  },
  render: function() {
    var posts;
    if (this.state.posts) {
      posts = (
        <div>
          <div>
            {this.state.posts.length + ' posts found.'}
          </div>
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
    }
    return (
      <div className='search-container'>
        <input value={this.state.query} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Search</button>
        {posts}
      </div>
    );
  }
});

module.exports = Search;
