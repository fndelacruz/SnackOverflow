var React = require('react');
var Util = require('../../util/util');
var NavHeaderLink = React.createClass({
  render: function() {
    var destinationUrl = '/' + this.props.link + '/', id;
    if (this.props.currentPath === destinationUrl) {
      id = 'header-nav-active';
    }
    return (
      <li
        id={id}
        onClick={this.props.navigate.bind(null, destinationUrl)}>
        {Util.capitalize(this.props.link)}
      </li>
    );
  }
});

module.exports = NavHeaderLink;
