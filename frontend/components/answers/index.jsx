var React = require('react');
var SortNav = require('../shared/sort_nav');
// var AnswerActions = require('../../actions/answer');
var QuestionStore = require('../../stores/question');
var QuestionActions = require('../../actions/question');
var AnswersIndexItem = require('./index_item');

function answerHeader(answersLength) {
  return answersLength + ' Answer' + (answersLength === 1 ? '' : 's');
}
var ANSWER_SORT_TYPES = ['active', 'oldest', 'votes'];

var AnswersIndex = React.createClass({
  getInitialState: function() {
    return {
      // answers: QuestionStore.allAnswers(this.props.questionId),
      answerSortBy: QuestionStore.getAnswerSortBy()
     };
  },
  handleSortChange: function() {
    alert('TODO');
  },
  render: function() {
    return (
      <div>
        <SortNav
          links={ANSWER_SORT_TYPES}
          active={this.state.answerSortBy}
          header={answerHeader(this.props.answers.length)}
          handleSortChange={this.handleSortChange} />
        {this.props.answers.map(function(answer) {
          return (
            <AnswersIndexItem
              answer={answer}
              key={'answer-' + answer.id} />
          );
        })}
      </div>
    );
  }
});

module.exports = AnswersIndex;
