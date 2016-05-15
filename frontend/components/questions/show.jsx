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
    return {
      question: QuestionStore.getQuestion(this.props.params.questionId),
      firstLoad: true,
      firstPageLoad: true
    };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    ApiUtil.fetchQuestion(this.props.params.questionId);
  },
  componentWillReceiveProps: function(nextProps) {
    ApiUtil.fetchQuestion(nextProps.params.questionId);
    this.state.question.given_answers = [];
    this.state.firstPageLoad = true;
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({
      question: QuestionStore.getQuestion(this.props.params.questionId),
      answerSortBy: QuestionStore.getAnswerSortBy(),
      firstLoad: false
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
  render: function() {
    var question = this.state.question, tags, answerSection;

    if (!question) {
      return (<div />);
    }

    if (this.props.params.answerId || this.props.params.commentId) {
      var activeId;
      if (this.props.params.answerId) {
        activeId = 'answer-' + this.props.params.answerId;
      } else {
        activeId = 'comment-' + this.props.params.commentId;
      }

      var activeEl = document.getElementById(activeId);
      if (activeEl && this.state.firstPageLoad) {
        var activeElClassName = activeEl.getAttribute('class');
        activeEl.setAttribute('class', activeElClassName + ' active-show-item');
        activeEl.scrollIntoView();
        setTimeout(function() {
          activeEl.setAttribute('class', activeElClassName);
        }, 0);
        this.state.firstPageLoad = false;
      }
    } else {
      if (this.state.firstLoad) {
        window.scrollTo(0,0);
      }
    }

    if (question.answers) {
      answerSection = (
        <div className='answers-container'>
          <AnswersIndex
            answers={question.answers}
            answerSortBy={this.state.answerSortBy}
            handleVote={this.handleVote} />
          <AnswersNew question={question} />
        </div>
      );
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
            handleFavorite={this.handleFavorite} />
          {answerSection}
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
        </div>
      </div>

    );
  }
});

module.exports = QuestionShow;
