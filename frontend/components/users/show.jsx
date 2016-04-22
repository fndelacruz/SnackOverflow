var React = require('react');
var UserStore = require('../../stores/user');
var ApiUtil = require('../../util/api_util');

var _callbackId;
var UserShow = React.createClass({
  getInitialState: function() {
    return { user: UserStore.getUser(this.props.params.userId) };
  },
  componentDidMount: function() {
    _callbackId = UserStore.addListener(this.onChange);
    ApiUtil.fetchUser(this.props.params.userId);
  },
  componentWillReceiveProps: function(newProps) {
    ApiUtil.fetchUser(newProps.params.userId);
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({ user: UserStore.getUser(this.props.params.userId) });
  },
  render: function() {
    return (
      <div>
        {JSON.stringify(this.state.user)}
      </div>
    );
  }
});

module.exports = UserShow;
