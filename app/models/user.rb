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
        ) AS sql_reputation
      FROM
        users
      LEFT JOIN
        #{self.user_received_question_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_answer_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_comment_vote_reputations(user_id)}
      LEFT JOIN
        #{user_given_answer_downvote_reputations(user_id)}
      #{user_id ? "WHERE users.id = :user_id" : ""}
    SQL
    user_id ? users.first : users
  end

  def self.find_with_tags(user_id=nil)
    user_tags = User.find_by_sql [<<-SQL, user_id: user_id]
      SELECT
        users.*,
        tag_names.tag_name AS tag_name,
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
        #{self.question_and_answer_tag_names(user_id)}
      LEFT JOIN
        #{self.question_tags_count(user_id)}
      LEFT JOIN
        #{self.question_tags_reputation(user_id)}
      LEFT JOIN
        #{self.answer_tags_count(user_id)}
      LEFT JOIN
        #{self.answer_tags_reputation(user_id)}
      #{user_id ? "WHERE users.id = :user_id" : ""}
      ORDER BY
        id, answer_tag_reputation DESC
    SQL
    user_tags.empty? ? nil : parse_user_tags(user_id, user_tags)
  end

  def self.find_with_reputation_and_tags(user_id=nil)
    user_tags = User.find_by_sql [<<-SQL, user_id: user_id]
      SELECT
        users.*,
        (
          COALESCE(user_received_question_vote_reputations.reputation, 0) +
          COALESCE(user_received_answer_vote_reputations.reputation, 0) +
          COALESCE(user_received_comment_vote_reputations.reputation, 0) +
          COALESCE(user_given_answer_downvote_reputations.reputation, 0)
        ) AS sql_reputation,
        tag_names.tag_name AS tag_name,
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
        #{self.user_received_question_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_answer_vote_reputations(user_id)}
      LEFT JOIN
        #{user_received_comment_vote_reputations(user_id)}
      LEFT JOIN
        #{user_given_answer_downvote_reputations(user_id)}
      LEFT JOIN
        #{self.question_and_answer_tag_names(user_id)}
      LEFT JOIN
        #{self.question_tags_count(user_id)}
      LEFT JOIN
        #{self.question_tags_reputation(user_id)}
      LEFT JOIN
        #{self.answer_tags_count(user_id)}
      LEFT JOIN
        #{self.answer_tags_reputation(user_id)}
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

  # NOTE: for UsersIndex
  def self.index_all
    User.includes(
      { questions: [:votes] },
      { given_answers: :votes },
      :votes,
      { comments: :votes },
      :answer_tags,
      :question_tags,
      received_answer_votes: { votable: :associated_tags },
      received_question_votes: { votable: :associated_tags })
      .all
  end

  def self.show_find(user_id)
    User.includes(
        { questions: :votes },
        { given_answers: [:votes, :question] },
        :votes,
        { comments: :votes },
        :views,
        { badgings: :badge },
        :answer_tags,
        :question_tags,
        received_answer_votes: { votable: :associated_tags },
        received_question_votes: { votable: :associated_tags })
      .find(user_id)
  end

  def associated_tags_score
    @associated_tags_score || (
      tag_score = {
        questions: Hash.new { |hash, key| hash[key] = 0 },
        answers: Hash.new { |hash, key| hash[key] = 0 },
      }

      received_answer_votes.each do |vote|
        vote.votable.associated_tags.each do |tag|
          if vote.value === 1
            tag_score[:answers][tag.id] +=
              User::REPUTATION_SCHEME[:receive_answer_upvote]
          elsif vote.value === -1
            tag_score[:answers][tag.id] +=
              User::REPUTATION_SCHEME[:receive_answer_downvote]
          end
        end
      end

      received_question_votes.each do |vote|
        vote.votable.associated_tags.each do |tag|
          if vote.value === 1
            tag_score[:questions][tag.id] +=
              User::REPUTATION_SCHEME[:receive_question_upvote]
          elsif vote.value === -1
            tag_score[:questions][tag.id] +=
              User::REPUTATION_SCHEME[:receive_question_downvote]
          end
        end
      end

      @associated_tags_score = tag_score
    )
  end

  def associated_tags_sorted_by_answer_score
    tag_counts = Hash.new { |hash, key| hash[key] = 0 }
    answer_tag_counts = Hash.new { |hash, key| hash[key] = 0 }
    question_tag_counts = Hash.new { |hash, key| hash[key] = 0 }

    answer_tags.each do |tag|
      tag_counts[tag] += 1
      answer_tag_counts[tag] += 1
    end

    question_tags.each do |tag|
      tag_counts[tag] += 1
      question_tag_counts[tag] += 1
    end

    tag_counts.map do |tag, post_count|
      {
        object: tag,
        post_count: post_count,
        answer_count: answer_tag_counts[tag],
        question_count: question_tag_counts[tag],
        answer_score: associated_tags_score[:answers][tag.id],
        question_score: associated_tags_score[:questions][tag.id],
      }
    end.sort { |a, b| b[:answer_score] <=> a[:answer_score] }
  end

  def vote_count
    votes.length
  end

  def reputation
    question_rep = questions.map(&:votes).flatten.map do |vote|
      if vote.value == 1
        User::REPUTATION_SCHEME[:receive_question_upvote]
      else
        User::REPUTATION_SCHEME[:receive_question_downvote]
      end
    end.sum

    owned_answer_rep = given_answers.map(&:votes).flatten.map do |vote|
      if vote.value == 1
        User::REPUTATION_SCHEME[:receive_answer_upvote]
      else
        User::REPUTATION_SCHEME[:receive_answer_downvote]
      end
    end.sum

    answer_downvote_rep = votes
      .select do |vote|
        vote.user_id === id &&
        vote.votable_type === 'Answer' &&
        vote.value === -1
      end.map { User::REPUTATION_SCHEME[:give_answer_downvote] }
      .sum

    comment_rep = comments.map(&:votes).flatten.map do |vote|
      if vote.value == 1
        User::REPUTATION_SCHEME[:receive_comment_upvote]
      else
        User::REPUTATION_SCHEME[:receive_comment_downvote]
      end
    end.sum

    [question_rep, owned_answer_rep, answer_downvote_rep, comment_rep].sum
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
