var React = require('react');

function voteClass(userVote, type) {
  var className;
  switch (type) {
    case 'upArrow':
      className = 'arrow arrow-up-large';
      if (userVote && userVote.value === 1) {
        className += ' arrow-up-large-active';
      }
      break;
    case 'downArrow':
      className = 'arrow arrow-down-large';
      if (userVote && userVote.value === -1) {
        className += ' arrow-down-large-active';
      }
      break;
    case 'score':
      className = 'question-show-item-vote-count';
      if (userVote) {
        className += ' question-show-item-vote-count-active';
      }
      break;
  }
  return className;
}

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

var ShowItem = React.createClass({ // used for question show and answers index item
  render: function() {
    var item = this.props.item, type = this.props.type, tags;
    if (item.tags && item.tags.length) {
      tags = (
        <ul className='tags'>
          {liTagsMap.call(this, item.id, item.tags)}
        </ul>
      );
    }
    return (
      <div className='question-show-item-container group'>
        <div className='question-show-item-sidebar'>
          <div className='question-show-item-vote-container'>
            <div
              onClick={this.props.handleVote.bind(null, type, item.id, 1)}
              className={voteClass(item.user_vote, 'upArrow')} />
            <div className={voteClass(item.user_vote, 'score')}>
             {item.vote_count}
            </div>
            <div
              onClick={this.props.handleVote.bind(null, type, item.id, -1)}
              className={voteClass(item.user_vote, 'downArrow')} />
          </div>
          <div className='question-show-item-favorite-container'>
            <span
              onClick={this.props.handleFavorite}
              className={'question-show-favorite-icon' +
                (item.favorite ? ' question-show-favorite-icon-active' : '')}>
              ★
            </span>
            <div className={'question-show-favorite-count' +
              (item.favorite ? ' question-show-favorite-count-active' : '')} >
              {item.favorite_count}
            </div>
          </div>
        </div>

        <div className='question-show-item-main'>
          <div className='question-show-item-main-content'>
            {item.content}
          </div>
          <div className='question-show-item-tags-container group'>
            {tags}
          </div>
          <div className='content-double-footer group'>
            <div className='question-show-item-main-footer-tools'>
              <span onClick={this.props.handleToolClick.bind(null, 'share')}>
                share
              </span>
              <span onClick={this.props.handleToolClick.bind(null, 'edit')}>
                improve this question
              </span>
              <span onClick={this.props.handleToolClick.bind(null, 'flag')}>
                flag
              </span>
            </div>

            <div className='stub-date-user-container stub-date-user-container-created-at'>
              <div className='stub-date'>
                {item.created_at_words}
              </div>
              <div className='question-index-item-user-container'>
                <div
                  className='question-index-item-user-pic'
                  onClick={this.props.handleUserClick} />
                <div className='question-index-item-user-display-name'>
                  <span onClick={this.props.handleUserClick}>
                    {item.user.display_name}
                  </span>
                </div>
                <div className='question-index-item-user-score'>
                  over 9000!
                </div>
              </div>
            </div>

            <div className='stub-date-user-container'>
              <div className='stub-date'>
                {item.updated_at_words}
              </div>
              <div className='question-index-item-user-container'>
                <div
                  className='question-index-item-user-pic'
                  onClick={this.props.handleUserClick} />
                <div className='question-index-item-user-display-name'>
                  <span onClick={this.props.handleUserClick}>
                    {item.user.display_name}
                  </span>
                </div>
                <div className='question-index-item-user-score'>
                  over 9000!
                </div>
              </div>
            </div>
          </div>
          <div className='question-show-item-comments-container'>
            comments placeholder
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ShowItem;
