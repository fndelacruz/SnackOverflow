var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <div className='nav-container'>
          <div className='nav-main group'>
            <ul className='nav-left-container base'>
              <li><span>SnackOverflow</span></li>
              <li>Inbox</li>
              <li>Notifications</li>
            </ul>
            <ul className='nav-right-container base'>
              <li>currentUser</li>
              <li>help</li>
              <li id='nav-search-container'>
                <input className='nav-search' type='text' placeholder="? Search"/>
              </li>
            </ul>
          </div>
        </div>

        <div className='nav-header nav-main group'>
          <ul className='nav-left-container base'>
            <li><h1 className='logo'>SnackOverflow</h1></li>
          </ul>
          <ul className='nav-right-container base'>
            <li>Questions</li>
            <li>Jobs</li>
            <li>Tags</li>
            <li>Users</li>
            <li>Badges</li>
            <li>Ask Question</li>
          </ul>
        </div>
      </div>
    );
  }
});
