var React = require('react');
var ApiUtil = require('../../util/api_util');
var QuestionStore = require('../../stores/question');
var AnswersIndex = require('../answers/index');
var ShowItem = require('./show_item');

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
    this.setState({
      question: QuestionStore.getQuestion(this.props.params.questionId),
      answerSortBy: QuestionStore.getAnswerSortBy()
    });
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

    return (
      <div className='question-show'>
        <div className='question-show-header'>
          {question.title}
        </div>

        <div className='content-double-main'>
          <ShowItem
            type='Question'
            item={question}
            handleVote={this.handleVote}
            handleUserClick={this.handleUserClick}
            handleFavorite={this.handleFavorite}
            handleTagClick={this.handleTagClick}
            handleToolClick={this.handleToolClick} />
          <AnswersIndex
            answers={question.answers}
            answerSortBy={this.state.answerSortBy} />
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
