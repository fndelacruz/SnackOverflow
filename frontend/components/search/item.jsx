var React = require('react');
var TagStubIndex = require('../tags/stub_index');
var UserLinkStub = require('../users/link_stub');
var hashHistory = require('react-router').hashHistory;
var util = require('../../util/util');

var SearchItem = React.createClass({
  handleTitleClick: function() {
    var path = '/questions/';
    if (typeof this.props.answer_count !== 'undefined') {
      path += this.props.id;
    } else {
      path += this.props.question_id + '/answer/' + this.props.id;
    }
    hashHistory.push(path);
  },
  handleUserClick: function(userId) {
    var path = '/users/' + userId;
    hashHistory.push(path);
  },
  render: function() {
    var post = this.props;

    var answerCount, viewCount, title = post.title,
        dateString = post.created_at.toLocaleString();

    var tags;
    if (post.tags.length) {
      tags = (
        <TagStubIndex
          tags={post.tags}
          questionId={post.answer_count ? post.id : post.question_id} />
      );
    }

    var regExp = new RegExp('(' + this.props.query + ')', 'i');
    var keyBase = post.id;
    if (post.view_count) {
      keyBase = 'question-' + keyBase;
    } else {
      keyBase = 'answer-' + keyBase;
    }

    var postTitleSplit = post.title.split(regExp);
    var postTitle = postTitleSplit.map(function(section, idx) {
      var className, key;
      if (idx % 2 === 1) {
        className = 'search-match';
      }
      key = keyBase + '-title-section-' + idx;
      return <span key={key} className={className}>{section}</span>;
    });

    var postContentSplit = post.content.split(regExp);
    var postContent = postContentSplit.map(function(section, idx) {
      var className, key;
      if (idx % 2 === 1) {
        className = 'search-match';
      }
      key = keyBase + '-content-section-' + idx;
      return <span key={key} className={className}>{section}</span>;
    });

    if (typeof post.answer_count !== 'undefined') {
      answerCount = (
        <div className='question-index-item-stats-element'>
          <div className='question-index-item-stats-number'>{post.answer_count}</div>
          <div className='question-index-item-stats-label'>
            {post.answer_count === 1 ? 'answer' : 'answers'}
          </div>
        </div>
      );
      viewCount = (
        <div className='question-index-item-stats-views'>
          {post.view_count + (post.view_count === 1 ? ' view' : ' views')}
        </div>
      );
      title = 'Q: ' + title;
      dateString = 'Asked ' + dateString;
    } else {
      title = 'A: ' + title;
      dateString = 'Answered ' + dateString;
    }
    return (
      <div className='question-index-item group'>
        <div className='question-index-item-stats'>
          <div className='question-index-item-stats-element'>
            <div className='question-index-item-stats-number'>{post.vote_count}</div>
            <div className='question-index-item-stats-label'>
              {post.vote_count === 1 ? 'vote' : 'votes'}
            </div>
          </div>
          {answerCount}
          {viewCount}
        </div>

        <div className='question-index-item-main'>
          <span
            className='question-index-item-title'
            onClick={this.handleTitleClick}>
            {postTitle}
          </span>
          <p className='question-index-item-content'>
            {postContent}
          </p>

          <div className='content-double-footer group'>
            {tags}
            <div className='stub-date-user-container'>
              <div className='stub-date'>
                {dateString}
              </div>
              <div className='question-index-item-user-container'>
                <img
                  className='question-index-item-user-pic'
                  onClick={this.handleUserClick.bind(null, post.user.id)}
                  src={util.avatarSrc(post.user.id)} />
                <div className='question-index-item-user-display-name-container'>
                  <UserLinkStub {...post.user} />
                </div>
                <div className='user-reputation'>
                  {post.user.reputation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SearchItem;
