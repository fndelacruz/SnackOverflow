var React = require('react');
var hashHistory = require('react-router').hashHistory;
var ApiUtil = require('../../util/api_util');
var util = require('../../util/util');

var SortNav = React.createClass({
  handleLogout: function() {
    ApiUtil.destroySession();
    hashHistory.push('/');
  },
  render: function() {
    var liLinks = this.props.links.map(function(link) {
      var className = 'sort-nav';
      if (this.props.active === link) {
        className += ' active';
      }
      return (
        <li
          key={'link-' + link}
          className={className}
          onClick={this.props.handleSortChange.bind(null, link)}>
          {link}
        </li>
      );
    }.bind(this));

    var ulClass;
    if (this.props.tabShift === 'left') {
      ulClass = 'nav-left-container';
    } else if (this.props.tabShift === 'right') {
      ulClass = 'nav-right-container';
    }

    var rightContainer;
    if (this.props.displayLogout) {
      rightContainer = (
        <div className='sort-nav-right-container'>
          <button onClick={this.handleLogout}>Log out</button>
        </div>
      );
    } else if (this.props.userInfo && this.props.userInfo.displayName) {
      var userPath = '/users/' + this.props.userInfo.id;
      rightContainer = (
        <div className='sort-nav-right-container'>
          <span className='sort-nav-user-display-name'>
            {this.props.userInfo.displayName}
          </span>
          <img
            onClick={hashHistory.push.bind(this, userPath)}
            className='sort-nav-user-icon link'
            src={util.avatarSrc(this.props.userInfo.id)} />
        </div>
      );
    }
    return (
      <div className='subheader group'>
        <h1>{this.props.header}</h1>
        <ul className={ulClass}>
          {liLinks}
        </ul>
        {rightContainer}
      </div>
    );
  }
});

module.exports = SortNav;
