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
  def self.basic_all
    User.includes({ questions: :votes }, { given_answers: :votes }, :votes,
        { comments: :votes })
      .all
  end

  def self.show_find(userId)
    User.includes({ questions: :votes }, { given_answers: :votes }, :votes,
        { comments: :votes })
      .find(userId)
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
