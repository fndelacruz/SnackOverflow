var React = require('react');
var QuestionStore = require('../../stores/question');
var CurrentUserStore = require('../../stores/current_user');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;

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
    console.log('edit mounted');
    if (!this.state.question) {
      _callbackId = QuestionStore.addListener(this.onChange);
      ApiUtil.fetchQuestion(this.props.params.questionId);
    } else {
      if (!this.isOwner(this.state.question)) {
        redirect(this.state.question);
      }
    }
  },
  isOwner: function(question) {
    return this.CurrentUserStore.fetch().id === question.user.id;
  },
  componentWillReceiveProps: function(newProps) {

  },
  onChange: function() {
    var question = QuestionStore.getQuestion(this.props.params.questionId);
    if (this.CurrentUserStore.fetch()) {
      if (this.isOwner(question)) {
        this.setState({ question: question });
      } else {
        redirect(question);
      }
    }
  },
  componentWillUnmount: function() {
    if (_callbackId) {
      _callbackId.remove();
    }
  },
  render: function() {
    if (!this.state.question) {
      return (
        <div>
          Question NOT loaded
        </div>
      );
    }
    return (
      <div>
        Question is loaded
      </div>
    );
  }
});

module.exports = QuestionNew;
