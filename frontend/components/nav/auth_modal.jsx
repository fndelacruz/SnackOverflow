var React = require('react');
var ApiUtil = require('../../util/api_util');
var CurrentUserActions = require('../../actions/current_user');
var SortNav = require('../shared/sort_nav');
var CurrentUserStore = require('../../stores/current_user');

var MODAL_TABS = ['Log In', 'Sign Up'];

var _callbackId;

var AuthModal = React.createClass({
  getInitialState: function() {
    return {
      displayName: '',
      email: '',
      password: '',
      authStatus: null,
      currentUser: null,
      errors: []
    };
  },
  componentDidMount: function() {
    _callbackId = CurrentUserStore.addListener(this.onChange);
  },
  onChange: function() {
    var currentUser = CurrentUserStore.fetch();
    if (currentUser.errors) {
      this.setState({ errors: currentUser.errors });
    }
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  handleGuestLogin: function() {
    ApiUtil.createSession({
      email: 'ann@ann.ann',
      password: 'annann'
    });
  },
  handleChange: function(type, e) {
    switch (type) {
      case 'displayName':
        this.setState({ displayName: e.currentTarget.value });
        break;
      case 'email':
        this.setState({ email: e.currentTarget.value });
        break;
      case 'password':
        this.setState({ password: e.currentTarget.value });
        break;
    }
  },
  handleSubmit: function() {
    this.setState({ errors: [], password: '' });
    if (this.props.active === 'Sign Up') {
      ApiUtil.createUser(this.state);
    } else if (this.props.active === 'Log In') {
      ApiUtil.createSession(this.state);
    }
  },
  handleModalTabClick: function(tab) {
    this.props.handleModalTabClick(tab);
    this.setState({ errors: [] });
  },
  render: function() {
    var displayNameInput, footer, displayNamePlaceholder, emailPlaceholder,
      passwordPlaceholder, warning, authFormErrorsHeader;
    if (this.props.active === 'Sign Up') {
      displayNamePlaceholder = 'Zero Cool';
      emailPlaceholder = 'user@email.net';
      passwordPlaceholder = 'hunter2';
      displayNameInput = (
        <div className='auth-form-group'>
          <div className='auth-form-label'>
            Display Name
          </div>
          <input
            type='text'
            placeholder={displayNamePlaceholder}
            onChange={this.handleChange.bind(this, 'displayName')}
            value={this.state.displayName} />
        </div>
      );
      authFormErrorsHeader = 'Sign Up failed.';
    } else {
      if (this.props.warning) {
        warning = (
          <div className='auth-warning-container'>
            <div className='auth-warning-header'>
              Oops! You must be logged in to use that...
            </div>
            After logging in, you can continue where you left off.
          </div>
        );
      }
      footer = (
        <div className='auth-footer'>
          <div>{"Don't have an account? "}</div>
          <div>
            <span className='link'>Sign up</span>
            {" or "}
            <span
              className='link'
              onClick={this.handleGuestLogin}>
              Log In as a guest.
            </span>
          </div>
        </div>
      );
    }

    var errors;
    if (this.state.errors.length) {
      errors = (
        <div className='auth-form-errors'>
          <div className='auth-form-errors-header'>
            {authFormErrorsHeader}
          </div>
          <ul>
            {this.state.errors.map(function(error, idx){
              return (<li key={'error-' + idx}>{error + '.'}</li>);
            })}
          </ul>
        </div>
      );
    }
    return (
      <div className='authentication-modal'>
        <div
          onClick={this.props.resetModal}
          className='authentication-modal-backdrop' />
        <div className='authentication-modal-main'>
          {warning}
          <SortNav
            tabShift='left'
            links={MODAL_TABS}
            active={this.props.active}
            handleSortChange={this.handleModalTabClick} />
          <div className='auth-form-container'>
            <div className='auth-form-group'>
              <div className='auth-form-label'>
                Email
              </div>
              <input
                type='text'
                placeholder={emailPlaceholder}
                onChange={this.handleChange.bind(this, 'email')}
                value={this.state.email} />
            </div>
            {displayNameInput}
            <div className='auth-form-group'>
              <div className='auth-form-label'>
                Password
              </div>
              <input
                type='password'
                placeholder={passwordPlaceholder}
                onChange={this.handleChange.bind(this, 'password')}
                value={this.state.password} />
            </div>
            <button onClick={this.handleSubmit}>
              {this.props.active === 'Sign Up' ? 'Sign up' : 'Log in'}
            </button>
            {errors}
            {footer}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AuthModal;
