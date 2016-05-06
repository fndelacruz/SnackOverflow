var React = require('react');

var UserShowSettings = React.createClass({
  render: function() {
    return (
      <div>
        UserShowSettings. currentUser is {this.props.currentUser.display_name}
      </div>
    );
  }
});

module.exports = UserShowSettings;
