# == Schema Information
#
# Table name: votes
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  votable_type :string           not null
#  votable_id   :integer          not null
#  value        :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Vote < ActiveRecord::Base
  validates :user, :votable, presence: true
  validates :user_id, uniqueness:
    { scope: [:votable_type, :votable_id], message: 'already voted on this!'}
  validates :value, inclusion: [-1, 1]
  belongs_to :user
  belongs_to :votable, polymorphic: true

  belongs_to :answer,
    -> { where(votes: {votable_type: 'Answer'}) },
    foreign_key: :votable_id

  belongs_to :question,
    -> { where(votes: {votable_type: 'Question'}) },
    foreign_key: :votable_id

  after_create :handle_badges

  def handle_badges
    # TODO: do this after doing the more simpler view badges
    # case votable_type
    # when 'Question'
    #   return unless badgeable =
    #     Badging.find_by_badgeable_type_and_badgeable_id(votable_type, votable_id)
    #   if badgeable.rank votable.vote_count == 500
    # when 'Answer'
    #
    # end
  end
end
