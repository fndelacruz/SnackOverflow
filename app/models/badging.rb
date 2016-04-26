# == Schema Information
#
# Table name: badgings
#
#  id             :integer          not null, primary key
#  user_id        :integer          not null
#  badge_id       :integer          not null
#  badgeable_type :string
#  badgeable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Badging < ActiveRecord::Base
  validates :user, :badge, presence: true

  belongs_to :user
  belongs_to :badge
  belongs_to :badgeable, polymorphic: true
end
