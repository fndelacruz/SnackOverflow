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

  def self.index_all
    Tag.includes(:questions).all
  end

  def question_count
    questions.length
  end

  def weekly_question_count
    questions.select { |question| question.created_at >= 7.days.ago }.length
  end

  def monthly_question_count
    questions.select { |question| question.created_at >= 1.month.ago }.length
  end

  private

  def generate_tag_badges
    Badge.create!([
      {
        name: "#{name}",
        rank: 'bronze',
        category: 'Tag',
        subcategory: "#{name}",
        description: "Awarded for having at least #{Badge.SCHEMA[:tags][:post_tag_reputation][:bronze][:criteria]} total score in the #{snake_case_to_camel_space(name)} tag.",
      }, {
        name: "#{name}",
        rank: 'silver',
        category: 'Tag',
        subcategory: "#{name}",
        description: "Awarded for having at least #{Badge.SCHEMA[:tags][:post_tag_reputation][:silver][:criteria]} total score in the #{snake_case_to_camel_space(name)} tag.",
      }, {
        name: "#{name}",
        rank: 'gold',
        category: 'Tag',
        subcategory: "#{name}",
        description: "Awarded for having at least #{Badge.SCHEMA[:tags][:post_tag_reputation][:gold][:criteria]} total score in the #{snake_case_to_camel_space(name)} tag.",
      }
    ])
  end

  private

  def snake_case_to_camel_space(string)
    words = string.split('_')
    words.map { |word| word.capitalize }.join(' ')
  end
end
