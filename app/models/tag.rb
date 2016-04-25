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
  after_create :generate_tag_badges

  private

  def generate_tag_badges
    Badge.create!([
      {
        name: "#{name}",
        rank: 'bronze',
        description: "Awarded for every 100 reputation earned from answers in the #{name} tag."
      }, {
        name: "#{name}",
        rank: 'silver',
        description: "Awarded for every 500 reputation earned from answers in the #{name} tag."
      }, {
        name: "#{name}",
        rank: 'gold',
        description: "Awarded for every 1000 reputation earned from answers in the #{name} tag."
      }
    ])
  end
end
