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
  # validate :spam_view

  belongs_to :user
  belongs_to :viewable, polymorphic: true

  private

  # def spam_view
  #   most_recent_view = View
  #     .where(user: user, viewable: viewable)
  #     .order(:created_at)
  #     .reverse_order
  #     .limit(1)
  #     .first
  #   if most_recent_view && most_recent_view.created_at > 5.minutes.ago
  #     errors.add(:base, "View only created once per 5 minutes.")
  #   end
  # end
end
