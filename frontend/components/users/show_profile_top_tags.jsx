var React = require('react');
var TagStub = require('../tags/stub');

function handleClick(userId, tagName) {
  alert('TODO clickOverride');
}

function handleTitle(tag) {
  var title = [];
  var questionWord = tag.question_count === 1 ? 'question' : 'questions';
  var answerWord = tag.answer_count === 1 ? 'answer' : 'answers';
  if (tag.question_count) {
    title.push('Asked ' + tag.question_count + ' ' + questionWord +
      ' with a total score of ' + tag.question_score + '.');
  }
  if (tag.answer_count) {
    title.push('Gave ' + tag.answer_count + ' ' + answerWord +
      ' with a total score of ' + tag.answer_score + '.');
  }
  return title.join(' ');
}

var ShowProfleTopTags = React.createClass({

  renderTopTags: function() {
    if (this.props.tags.length === 0) {
      return (
        <div className='user-show-profile-top-tags-main-inactive'>
          This user has not yet posted any questions or answers.
        </div>
      );
    }
    return (
      <div className='user-show-profile-top-tags-main group'>
        {this.props.tags.slice(0, 6).map(function(tag) {
          return (
            <div
              title={handleTitle(tag)}
              className='user-show-profile-top-tags-main-element'
              key={'tag-' + tag.object.id}>
              <span
                title=''
                onClick={handleClick.bind(null, this.props.userId, tag.object.name)}
                className='user-show-profile-top-tags-main-element-tag'>
                {tag.object.name}
              </span>
              <div className='user-show-profile-top-tags-main-element-stats group'>
                <div className='user-show-profile-top-tags-main-element-stats-element'>
                  <div className='user-show-profile-top-tags-main-element-stats-label'>
                    SCORE
                  </div>
                  <div className='user-show-profile-top-tags-main-element-stats-value'>
                    {tag.answer_score}
                  </div>
                </div>

                <div className='user-show-profile-top-tags-main-element-stats-element'>
                  <div className='user-show-profile-top-tags-main-element-stats-label'>
                    POSTS
                  </div>
                  <div className='user-show-profile-top-tags-main-element-stats-value'>
                    {tag.post_count}
                  </div>
                </div>
              </div>
            </div>
          );
        }.bind(this))}
      </div>
    );
  },
  render: function() {
    return (
      <div className='user-show-profile-top-tags'>
        <div className='user-show-common-header'>
          <span className='user-show-common-header-label'>Top Tags</span>
          <span className='user-show-common-header-count'>
            {this.props.tags.length}
          </span>
        </div>

        {this.renderTopTags()}

        <div className='user-show-profile-main-footer'>
          <span className='link'>
            View all tags →
          </span>
        </div>
      </div>
    );
  }
});

module.exports = ShowProfleTopTags;
