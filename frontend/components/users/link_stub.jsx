var React = require('react');
var hashHistory = require('react-router').hashHistory;

var UserLinkStub = React.createClass({
  handleClick: function() {
    var path = '/users/' + this.props.id;
    hashHistory.push(path);
  },
  render: function() {
    return (
      <span className='link' onClick={this.handleClick}>
        {this.props.display_name}
      </span>
    );
  }
});

module.exports = UserLinkStub;
