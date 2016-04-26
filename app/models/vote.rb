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

  private

  def handle_badges
    if votable_type == 'Question'
      item_votes = Badge.question_votes
      badging = Badging.joins(:badge)
        .where(badgeable_type: votable_type, badgeable_id: votable_id,
          badges: { name: [
            Badge.SCHEMA[:questions][:votes][:bronze][:label],
            Badge.SCHEMA[:questions][:votes][:silver][:label],
            Badge.SCHEMA[:questions][:votes][:gold][:label]
          ]}
        ).first

      handle_question_and_answer_vote_badges(badging, item_votes)
    elsif votable_type == 'Answer'
      item_votes = Badge.answer_votes
      badging = Badging.joins(:badge)
        .where(badgeable_type: votable_type, badgeable_id: votable_id,
          badges: { name: [
            Badge.SCHEMA[:answers][:votes][:bronze][:label],
            Badge.SCHEMA[:answers][:votes][:silver][:label],
            Badge.SCHEMA[:answers][:votes][:gold][:label]
          ]}
        ).first

      handle_question_and_answer_vote_badges(badging, item_votes)
    end
  end

  def handle_question_and_answer_vote_badges(badging, item_votes)
    votable.reload
    if badging
      if badging.badge.rank == 'silver' && votable.vote_count ==
          item_votes[:gold][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(
            user: votable.user,
            badgeable_id: votable_id,
            badgeable_type: votable_type,
            badge: Badge.find_by_name(item_votes[:gold][:label]),
            created_at: created_at,
            updated_at: updated_at
          )
        end
      elsif badging.badge.rank == 'bronze' && votable.vote_count ==
          item_votes[:silver][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(
            user: votable.user,
            badgeable_id: votable_id,
            badgeable_type: votable_type,
            badge: Badge.find_by_name(item_votes[:silver][:label]),
            created_at: created_at,
            updated_at: updated_at
          )
        end
      end
    else
      if votable.vote_count == item_votes[:bronze][:criteria]
        Badging.create!(
          user: votable.user,
          badgeable_id: votable_id,
          badgeable_type: votable_type,
          badge: Badge.find_by_name(item_votes[:bronze][:label]),
          created_at: created_at,
          updated_at: updated_at
        )
      end
    end
  end
end
