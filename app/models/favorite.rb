# == Schema Information
#
# Table name: favorites
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  question_id :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Favorite < ActiveRecord::Base
  validates :user, :question, presence: true
  validates :user, uniqueness:
    { scope: :question, message: 'already favorited this question.'}

  belongs_to :user
  belongs_to :question

  after_create :handle_badges

  private

  def handle_badges
    question.reload
    badging = Badging.joins(:badge)
      .where(badgeable_type: 'Question', badgeable_id: question_id,
        badges: { name: [
          Badge.SCHEMA[:questions][:favorites][:bronze][:label],
          Badge.SCHEMA[:questions][:favorites][:silver][:label],
          Badge.SCHEMA[:questions][:favorites][:gold][:label]
        ]}
      ).first
    if badging
      if badging.badge.rank == 'silver' && question.favorite_count ==
          Badge::question_favorites[:gold][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(
            user: question.user,
            badgeable_id: question_id,
            badgeable_type: 'Question',
            badge: Badge.find_by_name(Badge::question_favorites[:gold][:label]),
            created_at: created_at,
            updated_at: updated_at
          )
        end
      elsif badging.badge.rank == 'bronze' && question.favorite_count ==
          Badge::question_favorites[:silver][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(
            user: question.user,
            badgeable_id: question_id,
            badgeable_type: 'Question',
            badge: Badge.find_by_name(Badge::question_favorites[:silver][:label]),
            created_at: created_at,
            updated_at: updated_at
          )
        end
      end
    else
      if question.favorite_count == Badge::question_favorites[:bronze][:criteria]
        Badging.create!(
          user: question.user,
          badgeable_id: question_id,
          badgeable_type: 'Question',
          badge: Badge.find_by_name(Badge::question_favorites[:bronze][:label]),
          created_at: created_at,
          updated_at: updated_at
        )
      end
    end
  end
end
