# == Schema Information
#
# Table name: badges
#
#  id          :integer          not null, primary key
#  name        :string           not null
#  rank        :string           not null
#  description :text             not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Badge < ActiveRecord::Base
  validates :name, :description, presence: true
  validates :name, uniqueness: { scope: [:rank] }
  validates :rank, inclusion: ['bronze', 'silver', 'gold']
end
