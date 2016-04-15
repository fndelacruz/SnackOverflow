var React = require('react');
var CurrentUserStore = require('../../stores/current_user');
var ApiUtil = require('../../util/api_util');
var hashHistory = require('react-router').hashHistory;

var _callbackId;
module.exports = React.createClass({
  getInitialState: function() {
    return { currentUser: CurrentUserStore.fetch() };
  },
  componentDidMount: function() {
    _callbackId = CurrentUserStore.addListener(this.onChange);
    ApiUtil.fetchCurrentUser();
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({ currentUser: CurrentUserStore.fetch() });
  },
  navigate: function(destination) {
    hashHistory.push(destination);
  },
  render: function() {
    return (
      <div>
        <div className='nav-container'>
          <div className='main-content group'>
            <ul className='nav-left-container base'>
              <li>SnackOverflow</li>
              <li>Inbox</li>
              <li>Notifications</li>
            </ul>
            <ul className='nav-right-container base'>
              <li>{this.state.currentUser.display_name}</li>
              <li>help</li>
              <li id='nav-search-container'>
                <input className='nav-search' type='text' placeholder="? Search"/>
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
            <li onClick={this.navigate.bind(null, '/questions/')}>Questions</li>
            <li>Jobs</li>
            <li>Tags</li>
            <li>Users</li>
            <li>Badges</li>
            <li>Ask Question</li>
          </ul>
        </div>

        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});
