# == Schema Information
#
# Table name: favorites
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  question_id :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Favorite < ActiveRecord::Base
  validates :user, :question, presence: true
  validates :user, uniqueness:
    { scope: :question, message: 'already favorited this question.'}

  belongs_to :user
  belongs_to :question

  after_create :handle_badges

  private

  def handle_badges
    # TODO:
  end
end
