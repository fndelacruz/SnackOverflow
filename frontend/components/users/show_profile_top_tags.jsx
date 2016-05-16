var React = require('react');
var TagStub = require('../tags/stub');
var Util = require('../../util/util');
var hashHistory = require('react-router').hashHistory;

function handleClick(tagName) {
  var path = '/questions/tagged/' + tagName;
  hashHistory.push(path);
}

var ShowProfileTopTags = React.createClass({

  renderTopTags: function() {
    if (this.props.tags.length === 0) {
      return (
        <div className='user-show-profile-top-tags-main-inactive'>
          This user has not posted any tagged questions or answers.
        </div>
      );
    }
    return (
      <div className='user-show-profile-top-tags-main group'>
        {this.props.tags.slice(0, 6).map(function(tag) {
          return (
            <div
              title={Util.handleTagTitleAttr(tag)}
              className='user-show-profile-top-tags-main-element'
              key={'tag-' + tag.name}>
              <span
                title=''
                onClick={handleClick.bind(null, tag.name)}
                className='user-show-profile-top-tags-main-element-tag'>
                {tag.name}
              </span>
              <div className='user-show-profile-top-tags-main-element-stats group'>
                <div className='user-show-profile-top-tags-main-element-stats-element'>
                  <div className='user-show-profile-top-tags-main-element-stats-label'>
                    SCORE
                  </div>
                  <div className='user-show-profile-top-tags-main-element-stats-value'>
                    {tag.answer_reputation}
                  </div>
                </div>

                <div className='user-show-profile-top-tags-main-element-stats-element'>
                  <div className='user-show-profile-top-tags-main-element-stats-label'>
                    POSTS
                  </div>
                  <div className='user-show-profile-top-tags-main-element-stats-value'>
                    {tag.post_count}
                  </div>
                </div>
              </div>
            </div>
          );
        }.bind(this))}
      </div>
    );
  },
  render: function() {
    var footer;
    if (this.props.tags.length) {
      footer = (
        <div className='user-show-profile-main-footer'>
          <span
            onClick={this.props.handleViewMoreClick.bind(null, 'tags')}
            className='link'>
            View all tags →
          </span>
        </div>
      );
    }
    return (
      <div className='user-show-profile-top-tags'>
        <div className='user-show-common-header'>
          <span className='user-show-common-header-label'>Top Tags</span>
          <span className='user-show-common-header-count'>
            {this.props.tags.length}
          </span>
        </div>
        {this.renderTopTags()}
        {footer}
      </div>
    );
  }
});

module.exports = ShowProfileTopTags;
