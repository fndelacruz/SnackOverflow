var React = require('react');

var MiniNav = React.createClass({
  renderTabs: function() {
    return this.props.links.map(function(link) {
      var className = 'mini-nav-link';
      if (this.props.active === link) {
        className += ' mini-nav-link-active';
      }
      return (
        <li
          onClick={this.props.handleClick.bind(null, link)}
          className={className}
          key={link}>
          {link}
        </li>
      );
    }.bind(this));
  },
  render: function() {
    return (
      <ul className='mini-nav-container'>
        {this.renderTabs()}
      </ul>
    );
  }
});

module.exports = MiniNav;
