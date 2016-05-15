# == Schema Information
#
# Table name: answers
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  question_id :integer          not null
#  content     :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Answer < ActiveRecord::Base
  include Commentable
  include Votable

  attr_accessor :matches

  validates :user, :question, :content, presence: true

  belongs_to :user
  belongs_to :question
  has_many :associated_tags, through: :question, source: :associated_tags

  def self.notifications_for_user_id(user_id)
    Answer.select("answers.*, questions.title, 'Answer' AS category")
      .joins(:question).where(questions: {user_id: user_id})
      .order(created_at: :desc)
  end

  def self.search(query)
    Answer.includes(:associated_tags, :votes)
      .select("answers.*, questions.title AS title")
      .joins(:question)
      .where("lower(answers.content) like :query", query: "%#{query}%")

  end
end
