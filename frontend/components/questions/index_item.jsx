var React = require('react');
var hashHistory = require('react-router').hashHistory;
var TagStub = require('../tags/stub');
var TagStubIndex = require('../tags/stub_index');
var UserLinkStub = require('../users/link_stub');
var util = require('../../util/util');

function renderTagStubs(questionId, tags) {
  return tags.map(function(tag) {
    return (
      <TagStub
        key={'question-' + questionId + '-tag-' + tag.id}
        tagName={tag.name} />
    );
  });
}


var maxContentLength = 180;
function handleContent(content) {
  if (content.length > maxContentLength) {
    return content.slice(0, maxContentLength) + ' ...';
  } else {
    return content;
  }
}

QuestionsIndexItem = React.createClass({
  handleTitleClick: function() {
    hashHistory.push('/questions/' + this.props.id);
  },
  handleUserClick: function() {
    var path = '/users/' + this.props.user.id;
    hashHistory.push(path);
  },
  render: function() {
    var question = this.props, tags;
    if (question.tags.length) {
      tags = (
        <TagStubIndex
          tagPrePushCallback={this.props.tagPrePushCallback}
          currentPathTagName={this.props.currentPathTagName}
          tags={question.tags}
          questionId={question.id} />
      );
    }

    return (
      <div className='question-index-item group'>
        <div className='question-index-item-stats'>
          <div className='question-index-item-stats-element'>
            <div className='question-index-item-stats-number'>{question.vote_count}</div>
            <div className='question-index-item-stats-label'>
              {question.vote_count === 1 ? 'vote' : 'votes'}
            </div>
          </div>
          <div className='question-index-item-stats-element'>
            <div className='question-index-item-stats-number'>{question.answer_count}</div>
            <div className='question-index-item-stats-label'>
              {question.answer_count === 1 ? 'answer' : 'answers'}
            </div>
          </div>
          <div className='question-index-item-stats-views'>
            {question.view_count + (question.view_count === 1 ? ' view' : ' views')}
          </div>
        </div>

        <div className='question-index-item-main'>
          <span
            className='question-index-item-title'
            onClick={this.handleTitleClick}>
            {question.title}
          </span>
          <p className='question-index-item-content'>
            {handleContent(question.content)}
          </p>

          <div className='content-double-footer group'>
            {tags}
            <div className='stub-date-user-container'>
              <div className='stub-date'>
                {question.created_at_words}
              </div>
              <div className='question-index-item-user-container'>
                <img
                  className='question-index-item-user-pic'
                  onClick={this.handleUserClick}
                  src={util.avatarSrc(question.user.id)} />
                <div className='question-index-item-user-display-name-container'>
                  <UserLinkStub {...question.user} />
                </div>
                <div className='user-reputation'>
                  {question.user.reputation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QuestionsIndexItem;
