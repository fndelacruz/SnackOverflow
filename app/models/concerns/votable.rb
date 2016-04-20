module Votable
  extend ActiveSupport::Concern

  included do
    # NOTE: used dependent delete_all instead of dependent destroy since votes
    # have no child associations
    has_many :votes, as: :votable, dependent: :delete_all
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
    votes.map(&:value).sum
  end

  def user_vote(user_id)
    votes.find { |vote| vote.user_id == user_id}
  end

end
