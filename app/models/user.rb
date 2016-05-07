# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  email           :string           not null
#  display_name    :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  bio             :text
#  location        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base
  extend UserSQLHelper
  include Viewable

  REPUTATION_SCHEME = {
    receive_question_upvote: 10,
    receive_answer_upvote: 20,
    receive_question_downvote: -4,
    receive_answer_downvote: -4,
    give_answer_downvote: -2,
    receive_comment_upvote: 1,
    receive_comment_downvote: -1
  }

  attr_reader :password
  attr_accessor :tags

  validates :email, :display_name, :password_digest, :session_token, presence: true
  validates :email, :session_token, uniqueness: true
  validates :password, length: { minimum: 6, allow_nil: true}

  after_initialize :ensure_session_token!

  has_many :questions
  has_many :received_answers, through: :questions, source: :answers
  has_many :answer_givers, -> { distinct }, through: :received_answers, source: :user

  has_many :given_answers, class_name: 'Answer'
  has_many :answer_receivers, -> { distinct }, through: :given_answers, source: :user

  has_many :favorites
  has_many :favorite_questions, through: :favorites, source: :question

  has_many :votes

  has_many :comments

  has_many :answer_tags, through: :given_answers, source: :associated_tags
  has_many :question_tags, through: :questions, source: :associated_tags

  has_many :badgings
  has_many :badges, through: :badgings, source: :badge

  has_many :received_answer_votes, through: :given_answers, source: :votes
  has_many :received_question_votes, through: :questions, source: :votes

  def self.find_with_reputation(user_id=nil)
    users = User.find_by_sql [<<-SQL, user_id: user_id]
      SELECT
        users.*,
        (
          COALESCE(user_received_question_vote_reputations.reputation, 0) +
          COALESCE(user_received_answer_vote_reputations.reputation, 0) +
          COALESCE(user_received_comment_vote_reputations.reputation, 0) +
          COALESCE(user_given_answer_downvote_reputations.reputation, 0)
        ) AS reputation
      FROM
        users
      LEFT JOIN
        #{user_received_question_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_answer_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_comment_vote_reputations(user_id)}
      LEFT JOIN
        #{user_given_answer_downvote_reputations(user_id)}
      #{user_id ? "WHERE #{where_user_id_helper(user_id)}" : ""}
      ORDER BY
        users.id
    SQL
    user_id.is_a?(Array) ? users : users.first
  end

  def self.find_with_reputation_hash(user_ids)
    users_hash = {}
    self.find_with_reputation(user_ids).each do |user|
      users_hash[user.id] = user
    end
    users_hash
  end

  def self.find_with_tags(user_id=nil)
    user_tags = User.find_by_sql [<<-SQL, user_id: user_id]
      SELECT
        users.*,
        tag_names.tag_name AS tag_name,
        tag_names.tag_id AS tag_id,
        COALESCE(sq_q_tag_count.q_tag_count, 0)
          AS question_tag_count,
        COALESCE(sq_q_tag_reputation.q_tag_reputation, 0)
          AS question_tag_reputation,
        COALESCE(sq_a_tag_count.a_tag_count, 0)
          AS answer_tag_count,
        COALESCE(sq_a_tag_reputation.a_tag_reputation, 0)
          AS answer_tag_reputation,
        COALESCE(sq_q_tag_count.q_tag_count, 0) +
          COALESCE(sq_a_tag_count.a_tag_count, 0)
          AS post_tag_count,
        COALESCE(sq_q_tag_reputation.q_tag_reputation, 0) +
          COALESCE(sq_a_tag_reputation.a_tag_reputation, 0)
          AS post_tag_reputation
      FROM
        users
      LEFT JOIN
        #{question_and_answer_tag_names(user_id)}
      LEFT JOIN
        #{question_tags_count(user_id)}
      LEFT JOIN
        #{question_tags_reputation(user_id)}
      LEFT JOIN
        #{answer_tags_count(user_id)}
      LEFT JOIN
        #{answer_tags_reputation(user_id)}
      #{user_id ? "WHERE users.id = :user_id" : ""}
      ORDER BY
        id, answer_tag_reputation DESC
    SQL
    user_tags.empty? ? nil : parse_user_tags(user_id, user_tags)
  end

  def self.find_with_reputation_and_tags_and_vote_count(user_id=nil)
    user_tags = User.find_by_sql [<<-SQL, user_id: user_id]
      SELECT
        users.*,
        user_vote_counts.count AS vote_count,
        (
          COALESCE(user_received_question_vote_reputations.reputation, 0) +
          COALESCE(user_received_answer_vote_reputations.reputation, 0) +
          COALESCE(user_received_comment_vote_reputations.reputation, 0) +
          COALESCE(user_given_answer_downvote_reputations.reputation, 0)
        ) AS reputation,
        tag_names.tag_name AS tag_name,
        tag_names.tag_id AS tag_id,
        COALESCE(sq_q_tag_count.q_tag_count, 0)
          AS question_tag_count,
        COALESCE(sq_q_tag_reputation.q_tag_reputation, 0)
          AS question_tag_reputation,
        COALESCE(sq_a_tag_count.a_tag_count, 0)
          AS answer_tag_count,
        COALESCE(sq_a_tag_reputation.a_tag_reputation, 0)
          AS answer_tag_reputation,
        COALESCE(sq_q_tag_count.q_tag_count, 0) +
          COALESCE(sq_a_tag_count.a_tag_count, 0)
          AS post_tag_count,
        COALESCE(sq_q_tag_reputation.q_tag_reputation, 0) +
          COALESCE(sq_a_tag_reputation.a_tag_reputation, 0)
          AS post_tag_reputation
      FROM
        users
      LEFT JOIN
        #{user_received_question_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_answer_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_comment_vote_reputations(user_id)}
      LEFT JOIN
        #{user_given_answer_downvote_reputations(user_id)}
      LEFT JOIN
        #{question_and_answer_tag_names(user_id)}
      LEFT JOIN
        #{question_tags_count(user_id)}
      LEFT JOIN
        #{question_tags_reputation(user_id)}
      LEFT JOIN
        #{answer_tags_count(user_id)}
      LEFT JOIN
        #{answer_tags_reputation(user_id)}
      JOIN
        #{user_vote_counts(user_id)}
      #{user_id ? "WHERE users.id = :user_id" : ""}
      ORDER BY
        id, answer_tag_reputation DESC
    SQL
    parse_user_tags(user_id, user_tags)
  end

  def self.find_by_credentials(email, password)
    user = User.find_by_email(email)
    user if user && user.is_password?(password)
  end

  def self.index_all
    self.find_with_reputation_and_tags_and_vote_count
  end

  def self.show_find(user_id)
    self.find_with_reputation_and_tags_and_vote_count(user_id)
  end

  def password=(password)
    self.password_digest = BCrypt::Password.create(password)
    @password = password
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end

  def reset_session_token!
    self.session_token = SecureRandom::urlsafe_base64(16)
    self.save!
    session_token
  end

  def to_s
    display_name
  end

  private

  def ensure_session_token!
    self.session_token ||= SecureRandom::urlsafe_base64(16)
  end
end
