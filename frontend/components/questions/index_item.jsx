var React = require('react');
var hashHistory = require('react-router').hashHistory;

function liTagsMap(questionId, tags) {
  return tags.map(function(tag) {
    return (
      <li
        onClick={this.handleTagClick}
        key={'question-' + questionId + '-tag-' + tag.id}>
        {tag.name}
      </li>
    );
  }.bind(this));
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
  handleTagClick: function() {
    alert('TODO');
  },
  handleUserClick: function() {
    alert('TODO');
  },
  render: function() {
    var question = this.props, tags;
    if (question.tags.length) {
      tags = (
        <ul className='tags'>
          {liTagsMap.call(this, question.id, question.tags)}
        </ul>
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
                <div
                  className='question-index-item-user-pic'
                  onClick={this.handleUserClick} />
                <div className='question-index-item-user-display-name'>
                  <span onClick={this.handleUserClick}>
                    {question.user.display_name}
                  </span>
                </div>
                <div className='question-index-item-user-score'>
                  over 9000!
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
