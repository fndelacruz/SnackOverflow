# == Schema Information
#
# Table name: tags
#
#  id          :integer          not null, primary key
#  name        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  description :text             not null
#

class Tag < ActiveRecord::Base
  validates :name, :description, presence: true
  validates :name, uniqueness: true
  has_many :taggings
  has_many :questions, through: :taggings, source: :question
end
