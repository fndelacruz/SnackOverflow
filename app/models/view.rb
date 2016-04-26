# == Schema Information
#
# Table name: views
#
#  id            :integer          not null, primary key
#  user_id       :integer          not null
#  viewable_type :string           not null
#  viewable_id   :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class View < ActiveRecord::Base
  validates :user, :viewable, presence: true

  belongs_to :user
  belongs_to :viewable, polymorphic: true

  after_create :handle_badges

  private

  def handle_badges
    badging = Badging.joins(:badge)
      .where(badgeable_type: viewable_type, badgeable_id: viewable_id,
        badges: { name: [
          Badge.SCHEMA[:questions][:views][:bronze][:label],
          Badge.SCHEMA[:questions][:views][:silver][:label],
          Badge.SCHEMA[:questions][:views][:gold][:label]
        ]}
      ).first
    if viewable_type == 'Question'
      handle_question_view_badges(badging)
    end
  end

  def handle_question_view_badges(badging)
    reload
    if badging
      if badging.badge.rank == 'silver' && viewable.view_count ==
          Badge.question_views[:gold][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(
            user: viewable.user,
            badgeable_id: viewable_id,
            badgeable_type: viewable_type,
            badge: Badge.find_by_name(Badge.question_views[:gold][:label]),
            created_at: created_at,
            updated_at: updated_at
          )
        end
      elsif badging.badge.rank == 'bronze' && viewable.view_count ==
          Badge.question_views[:silver][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          Badging.create!(
            user: viewable.user,
            badgeable_id: viewable_id,
            badgeable_type: viewable_type,
            badge: Badge.find_by_name(Badge.question_views[:silver][:label]),
            created_at: created_at,
            updated_at: updated_at
          )
        end
      end
    else
      if viewable.view_count == Badge.question_views[:bronze][:criteria]
        Badging.create!(
          user: viewable.user,
          badgeable_id: viewable_id,
          badgeable_type: viewable_type,
          badge: Badge.find_by_name(Badge.question_views[:bronze][:label]),
          created_at: created_at,
          updated_at: updated_at
        )
      end
    end
  end
end
