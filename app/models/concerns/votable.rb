module Votable
  extend ActiveSupport::Concern

  included do
    # NOTE: used dependent delete_all instead of dependent destroy since votes
    # have no child associations
    has_many :votes, as: :votable, dependent: :delete_all
  end

  # TODO: prevent user from upvoting own items
  # NOTE: time argument is only used for seeding
  def upvote(user, time=nil)
    if time
      votes.create!(user: user, value: 1, created_at: time, updated_at: time)
    else
      votes.create!(user: user, value: 1)
    end
  end

  # TODO: prevent user from downvoting own items
  # NOTE: time argument is only used for seeding
  def downvote(user, time=nil)
    if time
      votes.create!(user: user, value: -1, created_at: time, updated_at: time)
    else
      votes.create!(user: user, value: -1)
    end
  end

  # TODO: remove user argument after implementing current_user
  def cancel_vote(user)
    # TODO: validation for vote existence
    votes.find_by_user_id(user.id).destroy
  end

  def vote_count
    votes.map(&:value).sum
  end

  def vote_reputation
    votes.inject(0) do |sum, vote|
      if vote.value === 1
        case self.class.to_s
        when 'Answer'
          sum += User::REPUTATION_SCHEME[:receive_answer_upvote]
        when 'Comment'
          sum += User::REPUTATION_SCHEME[:receive_comment_upvote]
        when 'Question'
          sum += User::REPUTATION_SCHEME[:receive_question_upvote]
        end
      elsif vote.value === -1
        case self.class.to_s
        when 'Answer'
          sum += User::REPUTATION_SCHEME[:receive_answer_upvote]
        when 'Comment'
          sum += User::REPUTATION_SCHEME[:receive_comment_upvote]
        when 'Question'
          sum += User::REPUTATION_SCHEME[:receive_question_upvote]
        end
      end
    end
  end

  def user_vote(user)
    votes.find { |vote| vote.user_id == user.id }
  end

end
