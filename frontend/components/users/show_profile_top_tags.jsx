var React = require('react');
var TagStub = require('../tags/stub');

function handleClick(userId, tagName) {
  alert('TODO clickOverride');
}

var ShowProfleTopTags = React.createClass({

  renderTopTags: function() {
    if (this.props.tags.length === 0) {
      return (
        <div className='user-show-profile-top-tags-main-inactive'>
          This user has not yet posted any questions or answers.
        </div>
      );
    }
    return (
      <div className='user-show-profile-top-tags-main group'>
        {this.props.tags.slice(0, 6).map(function(tag) {
          return (
            <div
              className='user-show-profile-top-tags-main-element'
              key={'tag-' + tag.object.id}>
              <span
                onClick={handleClick.bind(null, this.props.userId, tag.object.name)}
                className='user-show-profile-top-tags-main-element-tag'>
                {tag.object.name}
              </span>
              <div className='user-show-profile-top-tags-main-element-stats group'>
                <div className='user-show-profile-top-tags-main-element-stats-element'>
                  <div className='user-show-profile-top-tags-main-element-stats-label'>
                    SCORE
                  </div>
                  <div className='user-show-profile-top-tags-main-element-stats-value'>
                    1337
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
    return (
      <div className='user-show-profile-top-tags'>
        <div className='user-show-profile-top-tags-header'>
          <span className='user-show-profile-top-tags-header-label'>
            {'Top Tags' + ' '}
          </span>
          <span className='user-show-profile-top-tags-header-count'>
            {'(' + this.props.tags.length +')'}
          </span>
        </div>

        {this.renderTopTags()}

        <div className='user-show-profile-top-tags-footer'>
          <span className='link'>
            View all tags →
          </span>
        </div>
      </div>
    );
  }
});

module.exports = ShowProfleTopTags;
