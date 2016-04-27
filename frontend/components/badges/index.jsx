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
  render: function() {
    if (!this.state.badges) {
      return (<div />);
    }

    var NonTagCategories = Object.keys(this.state.badges).filter(function(category) {
      if (category !== 'Tag') {
        return category;
      }
    });

    var BadgeIndexGroups = (
      <div className='badges-index-category-container'>
        {NonTagCategories.map(function(category) {
          var subcategories = Object.keys(this.state.badges[category]);

          return (
            <div
              key={'badge-' + category}
              className='badges-index-category-element'>
              <div className='badges-index-category-element-header'>
                {category + ' Badges'}
              </div>
              {subcategories.map(function(subcategory) {
                return (
                  <div
                    key={'badge-' + category + '-subcategory-' + subcategory}
                    className='badges-index-subcategory-collection'>
                    {this.state.badges[category][subcategory].map(function(badge) {
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
                    })}
                  </div>
                );
              }.bind(this))}
            </div>
          );
        }.bind(this))}
      </div>
    );
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
          {BadgeIndexGroups}
        </div>
        <div className='content-double-sidebar'>
          BadgesIndexSidebar placeholder
        </div>
      </div>
    );
  }
});

module.exports = BadgesIndex;
