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

  attr_accessor :tag_names, :matches

  validates :user, :title, :content, presence: true
  # validate tag_ids?

  belongs_to :user

  has_many :answers, dependent: :destroy
  has_many :responders, -> { distinct }, through: :answers, source: :user

  has_many :taggings, dependent: :destroy
  has_many :associated_tags, through: :taggings, source: :tag
  has_many :tags, through: :taggings, source: :tag

  has_many :favorites, dependent: :destroy
  has_many :favorite_users, through: :favorites, source: :user

  USER_DETAILS = { user: [{ questions: :votes }, { given_answers: :votes }, :votes,
    { comments: :votes }]}

  def self.search(query)
    Question.includes(:associated_tags, :votes, :views, :answers)
        .where("lower(content) like :query OR lower(title) like :query",
        query: "%#{query}%")
  end

  def self.with_stats_and_tags_by_user_id(user_id)
    Question
      .select(
        "questions.*, " +
        "COALESCE(favorite_count.count, 0) AS favorite_count_joins, " +
        "COALESCE(answer_count.count, 0) AS answer_count_joins, " +
        "COALESCE(view_count.count, 0) AS view_count_joins, " +
        "COALESCE(vote_score.score, 0) AS vote_count_joins, " +
        "(SELECT ARRAY( " +
          "SELECT tags.name FROM tags " +
          "JOIN taggings ON tags.id = taggings.tag_id " +
          "JOIN questions AS q2 ON taggings.question_id = q2.id " +
          "WHERE questions.id = q2.id" +
        ")) AS tags_joins")
      .joins(
          "LEFT JOIN (" +
          "SELECT questions.id AS question_id, COUNT(favorites.id) AS count " +
          "FROM questions JOIN favorites ON questions.id = favorites.question_id " +
          "GROUP BY questions.id" +
          ") AS favorite_count ON questions.id = favorite_count.question_id")
      .joins(
          "LEFT JOIN (" +
          "SELECT questions.id AS question_id, COUNT(answers.id) AS count " +
          "FROM questions JOIN answers ON questions.id = answers.question_id " +
          "GROUP BY questions.id" +
          ") AS answer_count ON questions.id = answer_count.question_id")
      .joins(
          "LEFT JOIN (" +
          "SELECT questions.id AS question_id, COUNT(views.id) AS count " +
          "FROM questions JOIN views ON questions.id = views.viewable_id AND " +
            "views.viewable_type = 'Question' " +
          "GROUP BY questions.id" +
          ") AS view_count ON questions.id = view_count.question_id")
      .joins(
          "LEFT JOIN (" +
          "SELECT questions.id AS question_id, SUM(votes.value) AS score " +
          "FROM questions JOIN votes ON questions.id = votes.votable_id AND " +
            "votes.votable_type = 'Question' " +
          "GROUP BY questions.id" +
          ") AS vote_score ON questions.id = vote_score.question_id")
      .where(user_id: user_id)
      .group("questions.id, favorite_count.count, answer_count.count, view_count.count, vote_score.score")
      .order("questions.id")
  end

  def self.index_all
    self.includes(:user, :votes, { answers: :user }, :views, :associated_tags,
      :favorites).all
  end

  def self.show_find(id)
    self
      .includes(:user, :votes, :views, :associated_tags, :favorites,
        { answers: [:user, :votes, { comments: [:user, :votes] }] },
        { comments: [:user, :votes] })
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
