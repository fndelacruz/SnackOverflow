module Votable
  extend ActiveSupport::Concern

  included do
    has_many :votes, as: :votable
  end

  # TODO: remove user argument after implementing current_user
  # TODO: prevent user from upvoting own items
  def upvote(user)
    votes.create!(user: user, value: 1)
  end

  # TODO: remove user argument after implementing current_user
  # TODO: prevent user from downvoting own items
  def downvote(user)
    votes.create!(user: user, value: -1)
  end

  # TODO: remove user argument after implementing current_user
  def cancel_vote(user)
    # TODO: validation for vote existence
    votes.find_by_user_id(user.id).destroy
  end

  def vote_count
    votes.pluck(:value).sum
  end
end
