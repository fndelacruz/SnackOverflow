var React = require('react');
var ApiUtil = require('../../util/api_util');
var BadgeStore = require('../../stores/badge');
var BadgeActions = require('../../actions/badge');
var SortNav = require('../shared/sort_nav');

var _callbackId;
var BADGE_SELECT_TYPES = ['all', 'gold', 'silver', 'bronze'];

var BadgesIndex = React.createClass({
  getInitialState: function() {
    return {
      badges: BadgeStore.all(),
      select: BadgeStore.getSelect()
    };
  },
  componentDidMount: function() {
    _callbackId = BadgeStore.addListener(this.onChange);
    ApiUtil.fetchBadges();
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({
      badges: BadgeStore.all(),
      select: BadgeStore.getSelect()
    });
  },
  handleSelectChange: function(select) {
    BadgeActions.resetBadgesSelect(select);
  },
  render: function() {
    if (!this.state.badges) {
      return (<div />);
    }
    return (
      <div className='badges-index-container'>
        <div className='content-double-main'>
          <SortNav
            tabShift='right'
            links={BADGE_SELECT_TYPES}
            active={this.state.select}
            header='Badges'
            handleSortChange={this.handleSelectChange}/>
          <div className='badges-index-main-help'>
            Besides gaining reputation with your questions and answers, you
            receive badges for being especially helpful. Badges appear on your
            profile page and your posts. TODO: REPLACE THIS WITH NEW TEXT
          </div>
          {this.state.badges.map(function(badge) {
            return (
              <div key={badge.name + '-' + badge.rank}>
                {badge.name}
              </div>
            );
          })}
        </div>
        <div className='content-double-sidebar'>
          BadgesIndexSidebar placeholder
        </div>
      </div>
    );
  }
});

module.exports = BadgesIndex;
