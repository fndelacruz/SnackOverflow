var React = require('react');
var QuestionStore = require('../../stores/question');
var CurrentUserStore = require('../../stores/current_user');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;
var NotFound = require('../shared/not_found');
var QuestionsForm = require('./form');

var _callbackId;

function redirect(question) {
  var path = '/questions/' + question.id;
  hashHistory.push(path);
}
var QuestionNew = React.createClass({
  CurrentUserStore: CurrentUserStore,

  getInitialState: function() {
    return {
      question: QuestionStore.getQuestion(this.props.params.questionId)
    };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    ApiUtil.fetchQuestion(this.props.params.questionId);
  },
  isOwner: function() {
    return this.CurrentUserStore.fetch().id === this.state.question.user.id;
  },
  componentWillReceiveProps: function(newProps) {
    ApiUtil.fetchQuestion(this.props.params.questionId);
  },
  onChange: function() {
    var question = QuestionStore.getQuestion(this.props.params.questionId);
    if (this.CurrentUserStore.fetch()) {
      this.setState({ question: question });
    }
  },
  componentWillUnmount: function() {
    if (_callbackId) {
      _callbackId.remove();
    }
  },
  render: function() {
    if (!this.state.question) {
      return <div />;
    }

    if (!this.isOwner()) {
      return <NotFound />;
    }
    return (
      <QuestionsForm {...this.state.question} />
    );
  }
});

module.exports = QuestionNew;
