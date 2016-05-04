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
  render: function() {
    if (!this.props.items) {
      return <div />;
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
        <div className="show-activity-detail-main">
          {JSON.stringify(this.props.items)}
        </div>
      </div>
    );
  }
});

module.exports = ShowActivityDetail;
