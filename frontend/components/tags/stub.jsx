var React = require('react');
var hashHistory = require('react-router').hashHistory;

var TagStub = React.createClass({
  handleClick: function() {
    var path = '/questions/tagged/' + this.props.tagName;
    hashHistory.push(path);
  },
  render: function() {
    return (
      <li className='tag-stub' onClick={this.handleClick}>
        {this.props.tagName}
      </li>
    );
  }
});

module.exports = TagStub;
