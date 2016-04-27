var React = require('react');
var ShowProfileHeaderPortrait = require('./show_profile_header_portrait');
var ShowProfileTopTags = require('./show_profile_top_tags');
var ShowProfileTopPosts = require('./show_profile_top_posts');
var ShowProfileBadges = require('./show_profile_badges');

function handleBio(bio) {
  if (bio) {
    return bio;
  } else {
    return 'This user has not entered a bio.';
  }
}

function handleLocation(location) {
  if (location) {
    return (
      <div className='user-show-profile-header-stats-row group'>
        <div className='icon-small icon-location' />
        <div className='user-show-profile-header-stats-row-content'>
          {location}
        </div>
      </div>
    );
  }
}

var UserShowProfile = React.createClass({
  render: function() {
    if (!this.props.id || !this.props.questions) {
      // if user not yet stored in UserStore
      return (<div />);
    }

    return (
      <div className='user-show-profile-container group'>
        <div className='user-show-profile-header group'>
          <ShowProfileHeaderPortrait
            badgings={this.props.badgings}
            reputation={this.props.reputation}
            id={this.props.id} />

          <div className='user-show-profile-header-bio-container'>
            <div className='user-show-profile-header-bio-header'>
              {this.props.display_name}
            </div>
            <div className='user-show-profile-header-bio-content'>
              {handleBio(this.props.bio)}
            </div>
          </div>

          <div className='user-show-profile-header-stats-container'>
            <div className='user-show-profile-header-stats-header'>
              <div className='user-show-profile-header-stats-header-group'>
                <div className='user-show-profile-header-stats-header-group-value'>
                  {this.props.given_answers.length}
                </div>
                <div className='user-show-profile-header-stats-header-group-label'>
                  {this.props.given_answers.length === 1 ? 'answer' : 'answers'}
                </div>
              </div>

              <div className='user-show-profile-header-stats-header-group'>
                <div className='user-show-profile-header-stats-header-group-value'>
                  {this.props.questions.length}
                </div>
                <div className='user-show-profile-header-stats-header-group-label'>
                  {this.props.questions.length === 1 ? 'question' : 'questions'}
                </div>
              </div>

              <div className='user-show-profile-header-stats-header-group'>
                <div className='user-show-profile-header-stats-header-group-value'>
                  9000
                </div>
                <div className='user-show-profile-header-stats-header-group-label'>
                  people reached
                </div>
              </div>
            </div>
            <div className='user-show-profile-header-stats-row-container'>

              {handleLocation(this.props.location)}

              <div className='user-show-profile-header-stats-row group'>
                <div className='icon-small icon-time' />
                <div className='user-show-profile-header-stats-row-content'>
                  {'member since ' + this.props.created_at.toLocaleDateString()}
                </div>
              </div>

              <div className='user-show-profile-header-stats-row group'>
                <div className='icon-small icon-interface' />
                <div className='user-show-profile-header-stats-row-content'>
                  {this.props.view_count + ' profile view' +
                    (this.props.view_count === 1 ? '' : 's')}
                </div>
              </div>

              <div className='user-show-profile-header-stats-row group'>
                <div className='icon-small icon-clock' />
                <div className='user-show-profile-header-stats-row-content'>
                  {this.props.updated_at_words}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='user-show-profile-main-container group'>
          <ShowProfileBadges badgings={this.props.badgings} />
          <ShowProfileTopTags
            userId={this.props.id}
            tags={this.props.associated_tags_sorted_by_answer_score} />
          <ShowProfileTopPosts
            posts={this.props.posts} />
        </div>
      </div>
    );
  }
});

module.exports = UserShowProfile;
