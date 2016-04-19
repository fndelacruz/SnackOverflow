var React = require('react');
var SortNav = require('../shared/sort_nav');
var QuestionStore = require('../../stores/question');
var QuestionActions = require('../../actions/question');
var AnswersIndexItem = require('./index_item');

function answerHeader(answersLength) {
  return answersLength + ' Answer' + (answersLength === 1 ? '' : 's');
}
var ANSWER_SORT_TYPES = ['active', 'oldest', 'votes'];

var AnswersIndex = React.createClass({
  handleSortChange: function(sortBy) {
    if (sortBy !== this.props.answerSortBy) {
      QuestionActions.changeAnswerSort(sortBy);
    }
  },
  render: function() {
    return (
      <div>
        <SortNav
          links={ANSWER_SORT_TYPES}
          active={this.props.answerSortBy}
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
