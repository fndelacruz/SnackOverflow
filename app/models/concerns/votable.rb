module Votable
  extend ActiveSupport::Concern

  included do
    # NOTE: used dependent delete_all instead of dependent destroy since votes
    # have no child associations
    has_many :votes, as: :votable, dependent: :delete_all
  end

  # NOTE: time argument is only used for seeding
  def upvote(user, time=nil)
    create_vote!(user, 1, time)
  end

  def downvote(user, time=nil)
    create_vote!(user, -1, time)
  end

  def cancel_vote(user)
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

  private

  def create_vote!(user, value, time=nil)
    vote = Vote.new(votable: self, user: user, value: value)
    vote.assign_attributes(created_at: time, updated_at: time) if time
    vote.save!
  end
end
