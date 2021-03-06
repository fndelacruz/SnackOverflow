var React = require('react');
var Util = require('../../util/util');
var NavHeaderLink = React.createClass({
  render: function() {
    var destinationUrl = '/' + this.props.link + '/', id;
    var match = new RegExp('^/' + this.props.link);
    if (this.props.currentPath.match(match) ||
        (this.props.link === 'questions' && this.props.currentPath === '/')) {
      id = 'header-nav-active';
    }
    return (
      <li
        className='no-highlight'
        id={id}
        onClick={this.props.navigate.bind(null, destinationUrl)}>
        {this.props.link === 'ask' ?
          'Ask Question' : Util.capitalize(this.props.link)}
      </li>
    );
  }
});

module.exports = NavHeaderLink;
