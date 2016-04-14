var React = require('react');

var NavBar = React.createClass({
  render: function() {
    return (
      <div className='nav-container'>
        <div className='nav group'>
          <ul className='nav-left-container base'>
            <li><span>SnackOverflow</span></li>
            <li>Inbox</li>
            <li>Notifications</li>
          </ul>
          <ul className='nav-right-container base'>
            <li>currentUser</li>
            <li>help</li>
            <li>
              <input className='nav-search' type='text' placeholder="? Search"/>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
