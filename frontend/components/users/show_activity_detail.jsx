var React = require('react');
var MiniNav = require('../shared/mini_nav');
var TagStubIndex = require('../tags/stub_index');
var Util = require('../../util/util');
var hashHistory = require('react-router').hashHistory;
var ShowActivityTagItem = require('./show_activity_tag_item');
var ShowActivityBadgeItem = require('./show_activity_badge_item');

var SUB_TABS = {
  answers: ['votes', 'newest'],
  questions: ['votes', 'newest', 'views', 'favorites'],
  tags: ['votes', 'name'],
  badges: ['newest', 'rank', 'name'],
  favorites: ['votes', 'newest', 'views', 'favorites']
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
      case 'questions': case 'favorites':
        return (
          this.props.items.map(function(item) {
            var voteLabel = Util.handleSigularize('votes', item.vote_count);
            var answerLabel = Util.handleSigularize('answers', item.answer_count);
            var viewLabel = Util.handleSigularize('views', item.view_count);
            var favoriteCountClass;

            if (this.props.title === 'questions') {
              favoriteCountClass = "show-activity-detail-question-item-favorite-count";
              if (item.favorite_count === 0) {
                favoriteCountClass += "hidden";
              }
            } else if (this.props.title === 'favorites') {
              favoriteCountClass = "show-activity-detail-favorite-item-favorite-count";
            }

            var pushPath = '/questions/' + item.id;

            return (
              <div
                key={'item-' + item.id}
                className='quick-question-container group'>
                <div className='show-activity-detail-question-item-favorite-container'>
                 <div className={favoriteCountClass}>
                   {item.favorite_count}
                 </div>
                </div>

                <div
                  data-label={voteLabel}
                  className='quick-question-stats-container'>
                  <div className='quick-question-stats-count'>
                    {item.vote_count}
                  </div>
                </div>

                <div
                  data-label={answerLabel}
                  className='quick-question-stats-container'>
                  <div className='quick-question-stats-count'>
                    {item.answer_count}
                  </div>
                </div>

                <div
                  data-label={viewLabel}
                  className='quick-question-stats-container'>
                  <div className='quick-question-stats-count'>
                    {item.view_count}
                  </div>
                </div>

                <div className='quick-question-title-tags-container'>
                 <div
                   onClick={hashHistory.push.bind(this, pushPath)}
                   className='quick-question-title link'>
                  {item.title}
                 </div>
                 <div className='quick-question-tags'>
                   <TagStubIndex tags={item.tags} questionId={item.id} />
                 </div>
                </div>

                <div className='show-activity-detail-item-date'>
                  {item.created_at.toLocaleString()}
                </div>
              </div>
            );
          }.bind(this))
        );
      case 'tags':
        return (
          this.props.items.map(function(item) {
            return (
              <ShowActivityTagItem
                key={'item-' + item.id}
                handleClick={function() {alert('TODO handleTagClick');}}
                {...item} />
            );
          })
        );
      case 'badges':
        return (
          this.props.items.map(function(item) {
            return (
              <ShowActivityBadgeItem key={'badge-' + item.name} badge={item} />
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
        if (this.props.title === 'tags') {
          Util.sortBy(this.props.items, 'answer_reputation', true);
        } else {
          Util.sortBy(this.props.items, 'vote_count', true);
        }
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
        Util.sortBy(this.props.items, 'view_count', true);
        break;
      case 'favorites':
        Util.sortBy(this.props.items, 'favorite_count', true, 'vote_count');
        break;
    }

    var headerValue = this.props.items.length;
    if (this.props.title === 'badges') {
      headerValue = 0;
      this.props.items.forEach(function(item) {
        headerValue += item.count;
      });
    }

    return (
      <div className='show-activity-detail-container'>
        <div className='show-activity-header'>
          <span className='show-activity-header-value'>
            {headerValue + ' '}
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
