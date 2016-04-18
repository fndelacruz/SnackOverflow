var React = require('react');
var ApiUtil = require('../../util/api_util');
var QuestionStore = require('../../stores/question');
var AnswersIndex = require('../answers/index');

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

function voteClass(user_vote, type) {
  var className;
  switch (type) {
    case 'upArrow':
      className = 'arrow arrow-up-large';
      if (user_vote && user_vote.value === 1) {
        className += ' arrow-up-large-active';
      }
      break;
    case 'downArrow':
      className = 'arrow arrow-down-large';
      if (user_vote && user_vote.value === -1) {
        className += ' arrow-down-large-active';
      }
      break;
    case 'score':
      className = 'question-show-question-vote-count';
      if (user_vote) {
        className += ' question-show-question-vote-count-active';
      }
      break;
  }
  return className;
}

var _callbackId;
var QuestionShow = React.createClass({
  getInitialState: function() {
    return { question: QuestionStore.getQuestion(this.props.params.questionId) };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    ApiUtil.fetchQuestion(this.props.params.questionId);
  },
  componentWillReceiveProps: function(nextProps) {
    ApiUtil.fetchQuestion(nextProps.params.questionId);
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState(
      { question: QuestionStore.getQuestion(this.props.params.questionId) }
    );
  },
  handleVote: function(votable, id, value) {
    if (!this.state.question.user_vote) {
      ApiUtil.createVote({
        'vote[votable_type]': votable,
        'vote[votable_id]': id,
        'vote[value]': value
      });
    } else if (this.state.question.user_vote) {
      ApiUtil.destroyVote(this.state.question.user_vote.id);
    }
  },
  handleFavorite: function() {
    var question = this.state.question;
    if (!question.favorite) {
      ApiUtil.createFavorite(question.id);
    } else {
      ApiUtil.destroyFavorite(question.favorite.id);
    }
  },
  handleTagClick: function() {
    alert('TODO');
  },
  handleToolClick: function(type) {
    switch (type) {
      case 'share':
        break;
      case 'edit':
        break;
      case 'flag':
        break;
    }
    alert('TODO');
  },
  handleUserClick: function(userId) {
    alert('TODO');
  },
  render: function() {
    var question = this.state.question, tags;
    if (Object.keys(question).length === 0) {
      return (<div />);
    }
    if (question.tags && question.tags.length) {
      tags = (
        <ul className='tags'>
          {liTagsMap.call(this, question.id, question.tags)}
        </ul>
      );
    }

    return (
      <div className='question-show'>
        <div className='question-show-header'>
          {question.title}
        </div>

        <div className='content-double-main' id='dev-border'>
          <div className='question-show-question-container group'>
            <div className='question-show-question-sidebar'>
              <div className='question-show-question-vote-container'>
                <div
                  onClick={this.handleVote.bind(null, 'Question', question.id, 1)}
                  className={voteClass(question.user_vote, 'upArrow')} />
                <div className={voteClass(question.user_vote, 'score')}>
                 {question.vote_count}
                </div>
                <div
                  onClick={this.handleVote.bind(null, 'Question', question.id, -1)}
                  className={voteClass(question.user_vote, 'downArrow')} />
              </div>
              <div className='question-show-favorite-container'>
                <span
                  onClick={this.handleFavorite}
                  className={'question-show-favorite-icon' +
                    (question.favorite ? ' question-show-favorite-icon-active' : '')}>
                  ★
                </span>
                <div className={'question-show-favorite-count' +
                  (question.favorite ? ' question-show-favorite-count-active' : '')} >
                  {question.favorite_count}
                </div>
              </div>
            </div>

            <div className='question-show-question-main'>
              <div className='question-show-question-main-content'>
                {question.content}
              </div>
              <div className='question-show-question-tags-container group'>
                {tags}
              </div>
              <div className='content-double-footer group'>
                <div className='question-show-question-main-footer-tools'>
                  <span onClick={this.handleToolClick.bind(null, 'share')}>
                    share
                  </span>
                  <span onClick={this.handleToolClick.bind(null, 'edit')}>
                    improve this question
                  </span>
                  <span onClick={this.handleToolClick.bind(null, 'flag')}>
                    flag
                  </span>
                </div>

                <div className='stub-date-user-container stub-date-user-container-created-at'>
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

                <div className='stub-date-user-container'>
                  <div className='stub-date'>
                    {question.updated_at_words}
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
          <div className='question-show-question-comments-container'>
            comments placeholder
          </div>

        </div>

        <div className='content-double-sidebar'>
          <div className='question-show-sidebar-infostub-element group'>
            <div className='question-show-sidebar-infostub-element-label'>asked</div>
            <div className='question-show-sidebar-infostub-element-value'>
              {question.created_at_words.replace(/^(asked )?(about)?/, '')}
            </div>
          </div>

          <div className='question-show-sidebar-infostub-element group'>
            <div className='question-show-sidebar-infostub-element-label'>viewed</div>
            <div className='question-show-sidebar-infostub-element-value'>
              {question.view_count +
                (question.view_count === 1 ? ' time' : ' times')}
            </div>
          </div>

          <div className='question-show-sidebar-infostub-element group'>
            <div className='question-show-sidebar-infostub-element-label'>active</div>
            <div className='question-show-sidebar-infostub-element-value'>
              TODO
            </div>
          </div>
        </div>
      </div>

    );
  }
});

module.exports = QuestionShow;
