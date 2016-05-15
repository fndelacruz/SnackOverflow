# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  user_id          :integer          not null
#  commentable_id   :integer          not null
#  commentable_type :string           not null
#  content          :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  unread           :boolean          default("true")
#

class Comment < ActiveRecord::Base
  include Votable

  validates :user, :commentable, :content, presence: true

  belongs_to :user
  belongs_to :commentable, polymorphic: true

  def self.notifications_for_user_id(user_id)
    comments = (
      Comment.select("comments.*, questions.title, questions.id AS question_id, " +
          "'Comment' AS category")
        .joins("JOIN questions ON comments.commentable_id = questions.id AND " +
            "comments.commentable_type = 'Question'")
        .where(questions: {user_id: user_id})
      .union_all Comment.select("comments.*, questions.title, questions.id AS question_id, " +
          "'Comment' AS category")
        .joins("JOIN answers ON comments.commentable_id = answers.id AND " +
            " comments.commentable_type = 'Answer'")
        .joins("JOIN questions ON answers.question_id = questions.id")
        .where(answers: {user_id: user_id})
    ).order(created_at: :desc)
  end

  def question
    commentable_type == 'Question' ? commentable : commentable.question
  end
end
