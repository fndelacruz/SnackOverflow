var React = require('react');

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
      <div className='user-show-profile-container'>
        <div className='user-show-profile-header group'>
          <div className='user-show-profile-header-portrait-container'>
            <div className='user-show-profile-header-portrait-content'>
              <img
                className=''
                src={'https://robohash.org/' + this.props.id + '?bgset=any'}
                alt='user-pic' />
              <div className='user-show-profile-header-portrait-reputation-container'>
                <span className='user-show-profile-header-portrait-reputation-number'>
                  {this.props.reputation + ' '}
                </span>
                <span className='user-show-profile-header-portrait-reputation-label'>
                  REPUTATION
                </span>
              </div>
              <div className='user-show-profile-header-portrait-badges-container'>
                BADGES PLACEHOLDER
              </div>
            </div>
          </div>

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
                  {'1337' + ' profile views'}
                </div>
              </div>

              <div className='user-show-profile-header-stats-row group'>
                <div className='icon-small icon-time' />
                <div className='user-show-profile-header-stats-row-content'>
                  {'last seen ' + this.props.updated_at.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='user-show-profile-top-tags'>
          top-tags placeholder
        </div>

        <div className='user-show-profile-top-answers'>
          top-answers placeholder
        </div>

        <div className='user-show-profile-badges'>
          badges placeholder
        </div>
      </div>
    );
  }
});

module.exports = UserShowProfile;
