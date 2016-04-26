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
  has_many :question_tags, through: :questions, source: :tags

  has_many :badgings
  has_many :badges, through: :badgings, source: :badge

  include Viewable

  def self.find_by_credentials(email, password)
    user = User.find_by_email(email)
    user if user && user.is_password?(password)
  end

  def self.current_user_find(userId)
    User.includes({ questions: :votes }, { given_answers: :votes }, :votes,
        { comments: :votes })
      .find(userId)
  end

  # NOTE: for UsersIndex
  def self.index_all
    User.includes({ questions: :votes }, { given_answers: :votes }, :votes,
        { comments: :votes }, :answer_tags, :question_tags)
      .all
  end

  def self.show_find(userId)
    User.includes({ questions: :votes }, { given_answers: [:votes, :question] },
        :votes, { comments: :votes }, :views, badgings: :badge)
      .find(userId)
  end

  def associated_tags_votes
    question_tag_ids = question_tags.map(&:id).uniq
    answer_tag_ids = answer_tags.map(&:id).uniq
    Vote.find_by_sql (
      [<<-SQL, user_id: id, question_tag_ids: question_tag_ids, answer_tag_ids: answer_tag_ids]
        SELECT
          votes.*,
          COALESCE (t1.tag_id, t2.tag_id) AS tag_id
        FROM
          votes
        LEFT JOIN
          questions AS q1
            ON (votes.votable_id = q1.id AND votes.votable_type = 'Question')
        LEFT JOIN
          answers ON (votes.votable_id = answers.id AND votes.votable_type = 'Answer')
        LEFT JOIN
          questions AS q2 ON answers.question_id = q2.id
        LEFT JOIN
          taggings AS t1 ON q1.id = t1.question_id
        LEFT JOIN
          taggings AS t2 ON q2.id = t2.question_id
        WHERE
          (q1.user_id = :user_id AND t1.tag_id IN (:question_tag_ids)) OR
          (answers.user_id = :user_id AND t2.tag_id IN (:answer_tag_ids))
        GROUP BY
          votes.id, q1.id, answers.id, q2.id, t1.id, t2.id
      SQL
    )
  end

  def associated_tags_score
    @associated_tags_score || (
      tag_score = {
        questions: Hash.new { |hash, key| hash[key] = 0 },
        answers: Hash.new { |hash, key| hash[key] = 0 },
      }
      associated_tags_votes.each do |vote|
        if vote.votable_type === 'Question'
          if vote.value === 1
            tag_score[:questions][vote.tag_id] +=
              User::REPUTATION_SCHEME[:receive_question_upvote]
          elsif vote.value === -1
            tag_score[:questions][vote.tag_id] +=
              User::REPUTATION_SCHEME[:receive_question_downvote]
          end
        elsif vote.votable_type === 'Answer'
          if vote.value === 1
            tag_score[:answers][vote.tag_id] +=
              User::REPUTATION_SCHEME[:receive_answer_upvote]
          elsif vote.value === -1
            tag_score[:answers][vote.tag_id] +=
              User::REPUTATION_SCHEME[:receive_answer_downvote]
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
