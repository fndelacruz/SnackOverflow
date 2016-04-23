var React = require('react');
var CommentsIndex = require('../comments/index');
var CommentsForm = require('../comments/form');
var TagStub = require('../tags/stub');
var TagStubIndex = require('../tags/stub_index');
var UserLinkStub = require('../users/link_stub');
var hashHistory = require('react-router').hashHistory;

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

function renderTagStubs(questionId, tags) {
  return tags.map(function(tag) {
    return (
      <TagStub
        key={'question-' + questionId + '-tag-' + tag.id}
        tagName={tag.name} />
    );
  });
}

function renderFavoriteContainer(item) {
  if (this.props.handleFavorite) {
    return (
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
    );
  }
}

var ShowItem = React.createClass({ // used for question show and answers index item
  handleUserClick: function() {
    var path = '/users/' + this.props.item.user.id;
    hashHistory.push(path);
  },
  render: function() {
    var item = this.props.item, type = this.props.type, tags, id, tools;
    if (item.tags && item.tags.length) {

      tags = (
        <TagStubIndex
          tagPrePushCallback={this.props.tagPrePushCallback}
          currentPathTagName={this.props.currentPathTagName}
          tags={item.tags}
          questionId={item.id} />
      );
    }

    if (this.props.type === 'Question') {
      id = 'question-show-question';
    }

    if (item.owned) {
      tools = (
        <div className='question-show-item-main-footer-tools'>
          <span onClick={this.props.handleToolClick
            .bind(null, 'edit', type, item.id)}>
            edit
          </span>
          <span onClick={this.props.handleToolClick
            .bind(null, 'delete', type, item.id)}>
            delete
          </span>
        </div>
      );
    }
    var createdAt = item.created_at.toLocaleString();
    if (type === 'Question') {
      createdAt = 'asked ' + createdAt;
    } else if (type === 'Answer') {
      createdAt = 'answered ' + createdAt;
    }
    var updatedAt = 'edited ' + item.updated_at.toLocaleString();
    return (
      <div className='question-show-item-container group' id={id}>
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
          {renderFavoriteContainer.call(this, item)}
        </div>

        <div className='question-show-item-main'>
          <div className='question-show-item-main-content'>
            {item.content}
          </div>
          <div className='question-show-item-tags-container group'>
            {tags}
          </div>
          <div className='content-double-footer group'>
            {tools}
            <div className='stub-date-user-container stub-date-user-container-created-at'>
              <div className='stub-date'>
                {createdAt}
              </div>
              <div className='question-index-item-user-container'>
                <div
                  className='question-index-item-user-pic'
                  onClick={this.handleUserClick} />
                <div className='question-index-item-user-display-name-container'>
                  <UserLinkStub {...item.user} />
                </div>
                <div className='question-index-item-user-score'>
                  {item.user.reputation}
                </div>
              </div>
            </div>

            <div className='stub-date-user-container'>
              <div className='stub-date'>
                {updatedAt}
              </div>
              <div className='question-index-item-user-container'>
                <div
                  className='question-index-item-user-pic'
                  onClick={this.handleUserClick} />
                <div className='question-index-item-user-display-name-container'>
                  <UserLinkStub {...item.user} />
                </div>
                <div className='question-index-item-user-score'>
                  {item.user.reputation}
                </div>
              </div>
            </div>
          </div>
          <CommentsIndex
            comments={item.comments}
            handleVote={this.props.handleVote}/>
          <CommentsForm type={this.props.type} id={this.props.item.id} />
        </div>
      </div>
    );
  }
});

module.exports = ShowItem;
