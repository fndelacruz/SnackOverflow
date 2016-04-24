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
  validates :user, :question, :content, presence: true

  belongs_to :user
  belongs_to :question
  has_many :associated_tags, through: :question, source: :tags

  include Commentable
  include Votable
end
