var React = require('react');
var ApiUtil = require('../../util/api_util');
var CurrentUserStore = require('../../stores/current_user');
var CurrentUserActions = require('../../actions/current_user');

var _callbackId;

var UserShowSettings = React.createClass({
  getInitialState: function() {
    return {
      email: this.props.email,
      displayName: this.props.display_name,
      location: this.props.location,
      bio: this.props.bio,
      password: '',
      isSubmitting: false,
      submissionComplete: false,
      errors: []
    };
  },
  componentDidMount: function() {
    _callbackId = CurrentUserStore.addListener(this.onChange);
  },
  onChange: function () {
    this.setState({
      isSubmitting: false,
      errors: CurrentUserStore.getUpdateSubmissionErrors(),
      submissionComplete: CurrentUserStore.getSubmissionComplete()
    });
  },
  componentWillUnmount: function() {
    // reset SubmissionOK in store here?
    _callbackId.remove();
  },
  handleChange: function(type, e) {
    switch (type) {
      case 'password':
        this.setState({ password: e.currentTarget.value });
        break;
      case 'email':
        this.setState({ email: e.currentTarget.value });
        break;
      case 'displayName':
        this.setState({ displayName: e.currentTarget.value });
        break;
      case 'location':
        this.setState({ location: e.currentTarget.value });
        break;
      case 'bio':
        this.setState({ bio: e.currentTarget.value });
        break;
    }
  },
  handleSubmit: function() {
    this.setState({
      isSubmitting: true,
      errors: [],
      password: '',
    });
    CurrentUserActions.resetUpdateSubmissionStatus();
    ApiUtil.updateCurrentUser($.extend({ id: this.props.id }, this.state));
  },
  render: function() {
    var onClick = this.handleSubmit, buttonClassName, loading, submissionStatus;
    if (this.state.isSubmitting) {
      buttonClassName = 'button-disabled';
      onClick = null;
      loading = <div className='icon-loading' />;
    }
    if (this.state.submissionComplete) {
      if (!this.state.errors.length) {
        submissionStatus = (
          <div className='show-settings-submission-status-container status-success'>
            <div className='show-settings-submission-status-header'>
              User Profile Updated.
            </div>
          </div>
        );
      } else {
        submissionStatus = (
          <div className='show-settings-submission-status-container status-fail'>
            <div className='show-settings-submission-status-header'>
              User Profile Update Failed.
            </div>
            <ul className='show-settings-status-failures'>
              {this.state.errors.map(function(error, idx) {
                return (<li key={'error-' + idx}>{error}</li>);
              })}
            </ul>
          </div>
        );
      }
    }
    return (
      <div className='show-settings-container'>
        <div className='show-settings-inputs'>
          <div className='show-settings-display-name-container'>
            <div className='show-settings-label'>
              Email
            </div>
            <input
              onChange={this.handleChange.bind(null, 'email')}
              type='text'
              value={this.state.email} />
          </div>

          <div className='show-settings-display-name-container'>
            <div className='show-settings-label'>
              Display Name
            </div>
            <input
              onChange={this.handleChange.bind(null, 'displayName')}
              type='text'
              value={this.state.displayName} />
          </div>

          <div className='show-settings-location-container'>
            <div className='show-settings-label'>
              Location
            </div>
            <input
              onChange={this.handleChange.bind(null, 'location')}
              type='text'
              value={this.state.location}/>
          </div>

          <div className='show-settings-bio-container'>
            <div className='show-settings-label'>
              About Me
            </div>
            <textarea
              onChange={this.handleChange.bind(null, 'bio')}
              value={this.state.bio} />
          </div>

          <div className='show-settings-location-container'>
            <div className='show-settings-label'>
              Verify Password
            </div>
            <input
              onChange={this.handleChange.bind(null, 'password')}
              type='password'
              value={this.state.password}/>
          </div>
        </div>

        <div className='show-settings-submit-container'>
          <button
            className={buttonClassName}
            onClick={onClick}>
            Update Profile
          </button>
          {loading}
        </div>
        {submissionStatus}
      </div>
    );
  }
});

module.exports = UserShowSettings;
