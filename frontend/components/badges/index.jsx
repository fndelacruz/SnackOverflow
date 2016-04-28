var React = require('react');
var ApiUtil = require('../../util/api_util');
var BadgeStore = require('../../stores/badge');
var BadgeActions = require('../../actions/badge');
var SortNav = require('../shared/sort_nav');
var BadgeStub = require('../badges/stub');

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
  renderBadges: function(category, subcategory) {
    return (this.state.badges[category][subcategory].map(function(badge) {
      return (
        <div
          key={'badge-' + badge.id}
          className='badges-index-subcategory-element'>
          <BadgeStub badge={badge} />
          <div className='badges-index-subcategory-element-badge-description'>
            {badge.description}
          </div>
          <div className='badges-index-subcategory-element-badgings-count'>
            {badge.badgings_count + ' awarded'}
          </div>
        </div>
      );
    }));
  },
  renderSubcategories: function(category) {
    var subcategories = Object.keys(this.state.badges[category]).sort();
    return (subcategories.map(function(subcategory) {
      return (
        <div
          key={'badge-' + category + '-subcategory-' + subcategory}
          className='badges-index-subcategory-collection'>
          {this.renderBadges(category, subcategory)}
        </div>
      );
    }.bind(this)));
  },
  renderCategories: function() {
    var tagCategories = Object.keys(this.state.badges);

    // NOTE: ensures Tag is last category rendered
    tagCategories =
      tagCategories.concat(tagCategories.splice(tagCategories.indexOf('Tag'),1));

    return (tagCategories.map(function(category) {
      return (
        <div
          key={'badge-' + category}
          className='badges-index-category-element'>
          <div className='badges-index-category-element-header'>
            {category + ' Badges'}
          </div>
          {this.renderSubcategories(category)}
        </div>
      );
    }.bind(this)));
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
            Besides gaining reputation with good questions and answers, you
            also receive badges for being extra helpful. Badges appear on your
            profile page and your posts. Most badges can be awarded multiple
            times.
          </div>
          <div className='badges-index-category-container'>
            {this.renderCategories()}
          </div>
        </div>
        <div className='content-double-sidebar'>
          <div className='badge-index-sidebar-element'>
            <div className='badge-index-sidebar-element-label'>
              <BadgeStub badge={{name: 'bronze_badge', rank: 'bronze'}}/>
            </div>
            <div className='badge-index-sidebar-element-description'>
              Bronze badges encourage users to make quality posts. They are not
              too hard to get if you try!
            </div>
          </div>

          <div className='badge-index-sidebar-element'>
            <div className='badge-index-sidebar-element-label'>
              <BadgeStub badge={{name: 'silver_badge', rank: 'silver'}}/>
            </div>
            <div className='badge-index-sidebar-element-description'>
              Silver badges are less common than bronze badges. You'll have to
              make a quality post to get these.
            </div>
          </div>

          <div className='badge-index-sidebar-element'>
            <div className='badge-index-sidebar-element-label'>
              <BadgeStub badge={{name: 'gold_badge', rank: 'gold'}}/>
            </div>
            <div className='badge-index-sidebar-element-description'>
              Gold badges are the hardest badge to earn. These are rarely awarded
              and signify a great contribution to the SnackOverflow community.
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BadgesIndex;
