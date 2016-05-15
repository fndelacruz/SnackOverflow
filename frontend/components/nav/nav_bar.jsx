var React = require('react');
var CurrentUserStore = require('../../stores/current_user');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;
var NavHeaderLink = require('./header_link');
var QuestionStore = require('../../stores/question');
var NavNotifications = require('./notifications');

var HEADERS = ['questions', 'tags', 'users', 'badges', 'ask'];

var _currentUserStoreCallbackId;
var NavBar = React.createClass({
  getInitialState: function() {
    return {
      currentUser: CurrentUserStore.fetch(),
      query: ''
    };
  },
  componentDidMount: function() {
    _currentUserStoreCallbackId = CurrentUserStore.addListener(this.onChange);
    ApiUtil.fetchCurrentUser();
  },
  componentWillUnmount: function() {
    _currentUserStoreCallbackId.remove();
  },
  onChange: function() {
    this.setState({ currentUser: CurrentUserStore.fetch() });
  },
  navigate: function(destination) {
    hashHistory.push(destination);
  },
  handleCurrentUserClick: function() {
    hashHistory.push('/users/' + this.state.currentUser.id);
  },
  renderCurrentUser: function() {
    var currentUser = this.state.currentUser;
    if (this.state.currentUser) {
      var currentUserDisplayName = currentUser.display_name;
      var currentUserReputation = currentUser.reputation;
      return (
        <li
          title={currentUser.display_name}
          className='nav-current-user-container'
          onClick={this.handleCurrentUserClick}>
          <div id='current-user-display-container'>
            <div className='current-user-display-name'>
              {currentUserDisplayName}
            </div>
            <img
              className='nav-current-user-icon'
              src={'https://robohash.org/' + currentUser.id + '?bgset=any'}/>
            <div className='current-user-reputation'>
              {currentUserReputation}
            </div>
          </div>
        </li>
      );
    }
  },
  handleSearchChange: function(e) {
    console.log('onChange');
    this.setState({ query: e.currentTarget.value });
  },
  handleSearchKeyDown: function(e) {
    console.log('onKeyDown');
    if (e.keyCode === 13) {
      var path = '/search/' + this.state.query;
      this.state.query = '';
      document.getElementById('nav-search-bar').blur();
      hashHistory.push(path);
    }
  },
  render: function() {
    var currentUser = this.state.currentUser;
    if (!currentUser) {
      return <div />;
    }
    var currentUserDisplayName = currentUser.display_name;
    var currentUserReputation = currentUser.reputation;
    var NavHeaderLinks = HEADERS.map(function(name) {
      return (
        <NavHeaderLink
          key={'header-' + name}
          link={name}
          navigate={this.navigate}
          currentPath={this.props.location.pathname} />);
    }.bind(this));

    var unreadNotifications = currentUser.notifications.filter(function(item) {
      return item.unread;
    }).length;

    return (
      <div>
        <div className='nav-container'>
          <div className='main-content group'>
            <ul className='nav-left-container base'>
              <NavNotifications
                unreadCount={unreadNotifications}
                toggleDisplay={this.toggleNotifications}
                currentPath={this.props.location.pathname}
                items={currentUser.notifications} />
            </ul>
            <ul className='nav-right-container base'>
              {this.renderCurrentUser()}
              <li id='nav-search-container'>
                <div>
                  <input
                    id='nav-search-bar'
                    onChange={this.handleSearchChange}
                    onKeyDown={this.handleSearchKeyDown}
                    value={this.state.query}
                    className='nav-search'
                    type='text'
                    placeholder="? Search Q&A"/>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className='nav-header main-content group'>
          <ul className='nav-left-container base'>
            <li onClick={this.navigate.bind(null, '/')}>
              <h1 className='logo'>SnackOverflow</h1>
            </li>
          </ul>
          <ul className='nav-right-container base'>
            {NavHeaderLinks}
          </ul>
        </div>

        <main id='main-panel' className='main-content group'>
          {this.props.children}
        </main>
      </div>
    );
  }
});

module.exports = NavBar;
