var React = require('react');
var BadgeStore = require('../../stores/badge');
var ApiUtil = require('../../util/api_util');
var BadgeStub = require('../badges/stub');
var BadgingItem = require('../badgings/item');

var _callbackId;

var BadgeShow = React.createClass({
  getInitialState: function() {
    return { badge: BadgeStore.getBadge(this.props.params.badgeId) };
  },
  componentDidMount: function() {
    _callbackId = BadgeStore.addListener(this.onChange);
    ApiUtil.fetchBadge(this.props.params.badgeId);
  },
  onChange: function() {
    this.setState({ badge: BadgeStore.getBadge(this.props.params.badgeId) });
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  render: function() {
    if (!this.state.badge) {
      return <div />;
    }

    var badgings;
    if (this.state.badge.badgings) {
      badgings = (
        <div className='badging-items-container group'>
          {this.state.badge.badgings.map(function(badging) {
            return <BadgingItem key={'badging-' + badging.id} {...badging} />;
          }.bind(this))}
        </div>
      );
    }

    var timeWord = this.state.badge.badgings_count === 1 ? 'time' : 'times';
    var flavorText = '';
    if (this.state.badge.badgings_count === 0) {
      flavorText = ' Will you be the first?';
    }
    return (
      <div className='badge-show-container'>
        <div className='badge-show-header'>
          <BadgeStub badge={this.state.badge} />
          <div className='badge-show-count'>
            {'Awarded ' + this.state.badge.badgings_count + ' ' + timeWord + '.' +
              flavorText}
          </div>
          <div className='badge-show-description'>
            {this.state.badge.description}
          </div>
        </div>
        <div className='badge-show-main'>
          {badgings}
        </div>
      </div>
    );
  }
});

module.exports = BadgeShow;
