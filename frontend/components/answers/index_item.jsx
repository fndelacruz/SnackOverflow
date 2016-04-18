var React = require('react');

var AnswersIndexItem = React.createClass({
  render: function() {
    return (
      <div>
        {JSON.stringify(this.props.answer)}
      </div>
    );
  }
});

module.exports = AnswersIndexItem;
