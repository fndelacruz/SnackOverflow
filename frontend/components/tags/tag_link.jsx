var React = require('react');
var hashHistory = require('react-router').hashHistory;

var TagLink = React.createClass({
  handleClick: function() {
    var path = '/questions/tagged/' + this.props.tag.name;
    hashHistory.push(path);
  },
  render: function() {
    return (
      <span onClick={this.handleClick} className='tag-link'>
        {this.props.tag.name}
      </span>
    );
  }
});

module.exports = TagLink;
