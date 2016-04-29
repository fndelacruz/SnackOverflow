var React = require('react');
var ApiUtil = require('../../util/api_util');
var QuestionStore = require('../../stores/question');
var AnswersIndex = require('../answers/index');
var ShowItem = require('./show_item');
var AnswersNew = require('../answers/new');
var hashHistory = require('react-router').hashHistory;

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
  handleVote: function(votable, id, value, commentUserVote) {
    var user_vote;
    switch (votable) {
      case 'Question':
        user_vote = this.state.question.user_vote;
        break;
      case 'Answer':
        user_vote = this.state.question.answers.find(function(answer) {
          return answer.id === id;
        }).user_vote;
        break;
      case 'Comment':
        user_vote = commentUserVote;
        break;
    }
    if (!user_vote) {
      ApiUtil.createVote({
        'vote[votable_type]': votable,
        'vote[votable_id]': id,
        'vote[value]': value
      });
    } else {
      ApiUtil.destroyVote(user_vote.id);
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
    alert('TODO handleTagClick');
  },
  handleToolClick: function(toolType, itemType, id) {
    if (toolType === 'edit') {
      switch (itemType) {
        case 'Question':
          var path = '/questions/' + id + '/edit';
          console.log('pushing to:', path);
          hashHistory.push(path);
          break;
        case 'Answer':

          break;
        default:
          alert('TODO handleToolClick edit');
          break;
      }
    } else if (toolType === 'delete') {
      if (itemType === 'Question') {
        ApiUtil.destroyQuestion(id, function() {
          hashHistory.push('/questions/');
        });
      } else if (itemType === 'Answer') {
        ApiUtil.destroyAnswer(id);
      }
    }
  },
  render: function() {
    var question = this.state.question, tags;

    if (!question) {
      return (<div />);
    }

    if (this.props.params.answerId) {
      var answerId = 'answer-' + this.props.params.answerId;
      var answerEl = document.getElementById(answerId);
      if (answerEl) {
        var answerElClassName = answerEl.getAttribute('class');
        answerEl.setAttribute('class', answerElClassName + ' active-show-item');
        answerEl.scrollIntoView();
        answerEl.setAttribute('class', answerElClassName);
      }
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
            handleFavorite={this.handleFavorite}
            handleToolClick={this.handleToolClick} />
          <AnswersIndex
            answers={question.answers}
            answerSortBy={this.state.answerSortBy}
            handleVote={this.handleVote}
            handleToolClick={this.handleToolClick} />
          <AnswersNew question={question} />
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
