var React = require('react');
var MiniNav = require('../shared/mini_nav');
var Util = require('../../util/util');

var SUB_TABS = {
  answers: ['votes', 'newest'],
  questions: ['votes', 'newest', 'views', 'favorites'],
  tags: ['votes', 'name'],
  badges: ['newest', 'rank', 'name'],
  favorites: ['votes', 'newest', 'views']
};

var ShowActivityDetail = React.createClass({
  getInitialState: function() {
    if (SUB_TABS[this.props.title]) {
      return { active: SUB_TABS[this.props.title][0] };
    } else {
      return { active: null };
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.title !== 'reputation' &&
        SUB_TABS[newProps.title].indexOf(this.state.active) === -1) {
      this.setState({ active: SUB_TABS[newProps.title][0] });
    }
  },
  onChange: function(link) {
    this.setState({ active: link });
  },
  renderMiniNav: function() {
    if (SUB_TABS[this.props.title]) {
      return (
        <MiniNav
          links={SUB_TABS[this.props.title]}
          handleClick={this.onChange}
          active={this.state.active} />
      );
    }
  },
  renderShowActivityDetailItems: function() {
    switch (this.props.title) {
      case 'answers':
        return (
          this.props.items.map(function(item) {
            return (
              <div
                key={'item-' + item.id}
                className='show-activity-detail-answer-item-container'>
                <div className='show-activity-summary-item-line-item group'>
                  <div className='show-activity-summary-item-line-item-counter'>
                    {item.vote_count}
                  </div>
                  <div className='show-activity-summary-item-line-item-title link'>
                    {item.title}
                  </div>
                  <div className='show-activity-detail-answer-item-date'>
                    {item.created_at.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        );
      case 'questions':
        return (
          this.props.items.map(function(item) {
            return (
              <div key={'item-' + item.id}>
                {JSON.stringify(item)}
              </div>
            );
          })
        );
      case 'tags':
        return (
          this.props.items.map(function(item) {
            return (
              <div key={'item-' + item.id}>
                {JSON.stringify(item)}
              </div>
            );
          })
        );
      case 'badges':
        return (
          this.props.items.map(function(item) {
            return (
              <div key={'item-' + item.id}>
                {JSON.stringify(item)}
              </div>
            );
          })
        );
      case 'favorites':
        return (
          this.props.items.map(function(item) {
            return (
              <div key={'item-' + item.id}>
                {JSON.stringify(item)}
              </div>
            );
          })
        );
      case 'reputation':
        return (
          this.props.items.map(function(item) {
            return (
              <div key={'item-' + item.id + '-rep-' + item.reputation}>
                {JSON.stringify(item)}
              </div>
            );
          })
        );
    }
  },
  render: function() {
    if (!this.props.items) {
      return <div />;
    }

    switch (this.state.active) {
      case 'votes':
        Util.sortBy(this.props.items, 'vote_count', true);
        break;
      case 'newest':
        Util.sortBy(this.props.items, 'created_at', true);
        break;
      case 'rank':
        Util.sortBy(this.props.items, 'rank', true);
        break;
      case 'name':
        Util.sortBy(this.props.items, 'name');
        break;
      case 'views':
        // TODO;
        break;
      case 'favorites':
        // TODO;
        break;
    }

    return (
      <div className='show-activity-detail-container'>
        <div className='show-activity-header'>
          <span className='show-activity-header-value'>
            {this.props.items.length + ' '}
          </span>
          <span className='show-activity-header-label'>
            {Util.handleSigularize(
                Util.capitalize(this.props.title), this.props.items.length)}
          </span>
          {this.renderMiniNav()}
        </div>
        <div className='show-activity-detail-main'>
          {this.renderShowActivityDetailItems()}
        </div>
      </div>
    );
  }
});

module.exports = ShowActivityDetail;
