var React = require('react');
var hashHistory = require('react-router').hashHistory;
var ApiUtil = require('../../util/api_util');
var CurrentUserActions = require('../../actions/current_user');

var NavNotifications = React.createClass({
  getInitialState: function() {
    return { notificationsOn: false };
  },
  toggleNotifications: function() {
    this.setState({ notificationsOn: !this.state.notificationsOn });
  },
  notificationsOff: function() {
    this.setState({ notificationsOn: false });
  },
  handleClick: function(item) {
    var type = item.category === 'Answer' ? '/answer/' : '/comment/';
    var path = '/questions/' + item.question_id + type + item.id;
    ApiUtil.markItemRead(item);
    this.setState({ notificationsOn: false });
    setTimeout(hashHistory.push.bind(null, path), 0);
  },
  render: function() {
    if (this.props.notAuthenticated) {
      return (
        <li
          className='nav-tab-off'
          id='notifications-container'>
          <div
            onClick={CurrentUserActions.toggleSignupModalOn.bind(null, true)}
            className='notifications-tab'>
            ✉
          </div>
        </li>
      );
    }
    var notificationItems = this.props.items.map(function(item) {
      var itemContentEl, key = 'notification-' + item.category  + '-'+ item.id,
          itemClassName = 'notification-item', itemContent = item.content,
          unreadNotification;

      if (item.unread) {
        itemClassName += ' item-unread';
        unreadNotification = (
          <div className='notification-unread-label'>new</div>
        );
      }

      if (itemContent.length > 150) {
        itemContent = item.content.slice(0, 150) + '...';
      }

      itemContentEl = (
        <div className='notification-item-content'>
          {itemContent}
        </div>
      );
      return (
        <li onClick={this.handleClick.bind(null, item)} className={itemClassName} key={key}>
          <div className='notification-header group'>
            <div className='notification-type'>
              {item.category.toLowerCase()}
            </div>
            {unreadNotification}
            <div className='notification-item-date'>
              {item.created_at.toLocaleString()}
            </div>
          </div>

          <div className='notification-item-title'>{item.title}</div>
          {itemContentEl}
        </li>
      );
    }.bind(this));

    var dropdownClass = 'notification-dropdown';
    var dropdownHeaderClass = 'notification-dropdown-header group';
    var notificationsContainerClass = 'nav-tab-on';
    if (!this.state.notificationsOn) {
      dropdownClass += ' absent';
      dropdownHeaderClass += ' absent';
      notificationsContainerClass = 'nav-tab-off';
    }

    var unreadNotificationsString;
    var notificationsTabClass = 'notifications-tab no-highlight';
    if (this.props.unreadCount) {
      unreadNotificationsString = (
        <div className='notification-dropdown-unread-count'>
          {this.props.unreadCount + ' new'}
        </div>
      );
      notificationsTabClass += ' notifications-tab-unread';
    }
    return (
      <li
        className={notificationsContainerClass}
        id='notifications-container'>
        <div onClick={this.toggleNotifications} className={notificationsTabClass}>
          ✉
        </div>
        <div onMouseLeave={this.notificationsOff} className={dropdownClass}>
          <div className={dropdownHeaderClass}>
            <div className='notificiation-dropdown-header-label'>
              NOTIFICATIONS
            </div>
            {unreadNotificationsString}
          </div>
          <ul className='notification-items-container'>
            {notificationItems}
          </ul>
        </div>
      </li>
    );
  }
});

module.exports = NavNotifications;
