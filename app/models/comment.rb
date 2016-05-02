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
#

class Comment < ActiveRecord::Base
  include Votable

  validates :user, :commentable, :content, presence: true

  belongs_to :user
  belongs_to :commentable, polymorphic: true

  def question
    commentable_type == 'Question' ? commentable : commentable.question
  end
end
