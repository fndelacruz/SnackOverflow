# == Schema Information
#
# Table name: questions
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  title      :string           not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Question < ActiveRecord::Base
  include Commentable
  include Votable
  include Viewable
  include Badgeable

  validates :user, :title, :content, presence: true
  # validate tag_ids?

  belongs_to :user

  has_many :answers, dependent: :destroy
  has_many :responders, -> { distinct }, through: :answers, source: :user

  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings, source: :tag

  has_many :favorites, dependent: :destroy
  has_many :favorite_users, through: :favorites, source: :user

  USER_DETAILS = {user: [{ questions: :votes }, { given_answers: :votes }, :votes,
    { comments: :votes }]}

  def self.detailed_all
    self
      .includes(USER_DETAILS, :votes, :answers, :views, :tags, :favorites).all
  end

  def self.detailed_find(id)
    self
      .includes(USER_DETAILS, :votes, {answers: [USER_DETAILS, :votes, {comments: [USER_DETAILS, :votes]}]}, :views, :tags,
        {comments: [USER_DETAILS, :votes]}, :favorites)
      .find(id)
  end

  def user_answered?(user)
    question.answers.map(&:user_id).include?(user.id)
  end


  def owned_favorite(user)
    favorites.find { |favorite| favorite.user_id == user.id }
  end

  def question
    self
  end

  def answer_count
    answers.length
  end

  def favorite_count
    favorites.length
  end

  # NOTE: ajax may eliminate the need for #add/remove_favorite on this model
  # NOTE: #add_favorite and #remove_favorite are only used for seeding
  def add_favorite(user)
    Favorite.create!(user: user, question: self)
  end

  def remove_favorite(user)
    favorite = Favorite.find_by_user_id_and_question_id(user, id)
    if favorite
      favorite.destroy
    else
      debugger
      # TODO: handle favorite not found
    end
  end
end
