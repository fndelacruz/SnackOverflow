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
    badging = Badging.includes(:badge)
      .find_by_badgeable_type_and_badgeable_id(votable_type, votable_id)
    if votable_type == 'Question'
      handle_question_vote_badges(badging)
    elsif votable_type == 'Answer'
      handle_answer_vote_badges(badging)
    end
  end

  def handle_question_vote_badges(badging)
    votable.reload
    if badging
      if badging.badge.rank == 'silver' && votable.vote_count ==
          Badge.question_votes[:gold][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(user: votable.user, badgeable_id: votable_id,
            badgeable_type: votable_type, created_at: created_at, badge: Badge
            .find_by_name(Badge.question_votes[:gold][:label])
          )
        end
      elsif badging.badge.rank == 'bronze' && votable.vote_count ==
          Badge.question_votes[:silver][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(user: votable.user, badgeable_id: votable_id,
            badgeable_type: votable_type, created_at: created_at, badge: Badge
            .find_by_name(Badge.question_votes[:silver][:label])
          )
        end
      end
    else
      if votable.vote_count == Badge.question_votes[:bronze][:criteria]
        Badging.create!(user: votable.user, badgeable_id: votable_id,
          badgeable_type: votable_type, created_at: created_at, badge: Badge
          .find_by_name(Badge.question_votes[:bronze][:label])
        )
      end
    end
  end

  def handle_answer_vote_badges(badging)
    votable.reload
    if badging
      if badging.badge.rank == 'silver' && votable.vote_count ==
          Badge.answer_votes[:gold][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(user: votable.user, badgeable_id: votable_id,
            badgeable_type: votable_type, created_at: created_at, badge: Badge
            .find_by_name(Badge.answer_votes[:gold][:label])
          )
        end
      elsif badging.badge.rank == 'bronze' && votable.vote_count ==
          Badge.answer_votes[:silver][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(user: votable.user, badgeable_id: votable_id,
            badgeable_type: votable_type, created_at: created_at, badge: Badge
            .find_by_name(Badge.answer_votes[:silver][:label])
          )
        end
      end
    else
      if votable.vote_count == Badge.answer_votes[:bronze][:criteria]
        Badging.create!(user: votable.user, badgeable_id: votable_id,
          badgeable_type: votable_type, created_at: created_at, badge: Badge
          .find_by_name(Badge.answer_votes[:bronze][:label])
        )
      end
    end
  end
end
