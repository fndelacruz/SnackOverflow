var React = require('react');
var CurrentUserStore = require('../../stores/current_user');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;
var NavHeaderLink = require('./header_link');
var QuestionStore = require('../../stores/question');
var NavNotifications = require('./notifications');
var AuthModal = require('./auth_modal');
var CurrentUserActions = require('../../actions/current_user');

var HEADERS = ['questions', 'tags', 'users', 'badges', 'ask'];
var MODAL_TABS = ['Log In', 'Sign Up'];

var _currentUserStoreCallbackId;
var NavBar = React.createClass({
  getInitialState: function() {
    return {
      currentUser: CurrentUserStore.fetch(),
      query: '',
      signupModalOn: false,
      modalActiveTab: 'Log In'
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
    this.setState({
      currentUser: CurrentUserStore.fetch(),
      signupModalOn: CurrentUserStore.getSignupModalOnStatus()
    });
  },
  navigate: function(destination) {
    hashHistory.push(destination);
  },
  handleCurrentUserClick: function() {
    hashHistory.push('/users/' + this.state.currentUser.id);
  },
  handleSignupClick: function() {
    this.state.modalActiveTab = 'Sign Up';
    CurrentUserActions.toggleSignupModalOn(false);
  },
  handleLoginClick: function() {
    this.state.modalActiveTab = 'Log In';
    CurrentUserActions.toggleSignupModalOn(false);
  },
  renderCurrentUser: function() {
    var currentUser = this.state.currentUser;
    if (currentUser) {
      if (currentUser.id) {
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
      } else {
        return (
          <li>
            <ul className='base'>
              <li>
                <div onClick={this.handleLoginClick}>
                  Log in
                </div>
              </li>
              <li>
                <div onClick={this.handleSignupClick}>
                  Sign up
                </div>
              </li>
            </ul>
          </li>
        );
      }
    }
  },
  handleSearchChange: function(e) {
    this.setState({ query: e.currentTarget.value });
  },
  handleSearchKeyDown: function(e) {
    if (e.keyCode === 13) {
      var path = '/search/' + this.state.query;
      this.state.query = '';
      document.getElementById('nav-search-bar').blur();
      hashHistory.push(path);
    }
  },
  handleModalTabClick: function(tab) {
    this.setState({ modalActiveTab: tab });
  },
  resetModal: function() {
    this.state.modalActiveTab = 'Log In';
    CurrentUserActions.toggleSignupModalOn();
  },
  render: function() {
    var currentUser = this.state.currentUser, currentUserDisplayName,
        currentUserReputation, unreadNotifications, notifications;
    if (!currentUser) {
      return <div />;
    }

    if (currentUser.id) {
      currentUserDisplayName = currentUser.display_name;
      currentUserReputation = currentUser.reputation;
      unreadNotifications = currentUser.notifications.filter(function(item) {
        return item.unread;
      }).length;

      notifications = (
        <NavNotifications
          unreadCount={unreadNotifications}
          toggleDisplay={this.toggleNotifications}
          currentPath={this.props.location.pathname}
          items={currentUser.notifications} />
      );
    } else {
      notifications = (
        <NavNotifications notAuthenticated={true} />
      );
    }

    var NavHeaderLinks = HEADERS.map(function(name) {
      return (
        <NavHeaderLink
          key={'header-' + name}
          link={name}
          navigate={this.navigate}
          currentPath={this.props.location.pathname} />);
    }.bind(this));

    var signupModal;
    if (this.state.signupModalOn && !this.state.currentUser.id) {
      signupModal = (
        <AuthModal
          resetModal={this.resetModal}
          handleModalTabClick={this.handleModalTabClick}
          active={this.state.modalActiveTab}
          {...this.state.signupModalOn} />);
    }

    return (
      <div className='application-container'>
        <div className='nav-container'>
          <div className='main-content group'>
            <ul className='nav-left-container base'>
              {notifications}
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
        {signupModal}
      </div>
    );
  }
});

module.exports = NavBar;
