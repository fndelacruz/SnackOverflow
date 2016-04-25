# == Schema Information
#
# Table name: badgings
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  badge_id   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Badging < ActiveRecord::Base
  validates :user, :badge, presence: true
end
