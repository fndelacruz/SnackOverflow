# == Schema Information
#
# Table name: votes
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  votable_type :string           not null
#  votable_id   :integer          not null
#  value        :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  unread       :boolean          default(TRUE)
#

class Vote < ActiveRecord::Base
  validates :user, :votable, :value, presence: true
  validates :user_id, uniqueness:
    { scope: [:votable_type, :votable_id], message: 'already voted on this!'}
  validates :votable_type, inclusion: ['Question', 'Answer', 'Comment']
  validates :value, inclusion: [-1, 1]
  belongs_to :user
  belongs_to :votable, polymorphic: true

  after_create :handle_badges

  def self.stats_for_user_id(user_id)
    {
      total: Vote.where(user_id: user_id).count,
      up: Vote.where(user_id: user_id, value: 1).count,
      down: Vote.where(user_id: user_id, value: -1).count,
      question: Vote.where(user_id: user_id, votable_type: 'Question').count,
      answer: Vote.where(user_id: user_id, votable_type: 'Answer').count,
      comment: Vote.where(user_id: user_id, votable_type: 'Comment').count,
      day: Vote.where('user_id = ? AND created_at > ?', user_id, 1.day.ago).count,
      week: Vote.where('user_id = ? AND created_at > ?', user_id, 1.week.ago).count,
      month: Vote.where('user_id = ? AND created_at > ?', user_id, 1.month.ago).count,
    }
  end

  def self.reputations_for_user_id(user_id)
    votes = (
      Vote.select("
          votes.*,
          questions.title,
          questions.id AS question_id,
          (
            CASE votes.value
              WHEN 1 THEN #{User::REPUTATION_SCHEME[:receive_question_upvote]}
              WHEN -1 THEN #{User::REPUTATION_SCHEME[:receive_question_downvote]}
            END
          ) AS reputation")
        .joins("JOIN questions ON
            votes.votable_id = questions.id AND votes.votable_type = 'Question'")
        .where(questions: { user_id: user_id})
      .union_all Vote.select("
          votes.*,
          questions.title,
          questions.id AS question_id,
          (
            CASE votes.value
              WHEN 1 THEN #{User::REPUTATION_SCHEME[:receive_answer_upvote]}
              WHEN -1 THEN #{User::REPUTATION_SCHEME[:receive_answer_downvote]}
            END
          ) AS reputation")
        .joins("JOIN answers ON
            votes.votable_id = answers.id AND votes.votable_type = 'Answer'")
        .joins("JOIN questions ON answers.question_id = questions.id")
        .where(answers: { user_id: user_id })
      .union_all Vote.select("
          votes.*,
          COALESCE(q1.title, q2.title) AS title,
          COALESCE(q1.id, q2.id) AS question_id,
          (
            CASE votes.value
              WHEN 1 THEN #{User::REPUTATION_SCHEME[:receive_comment_upvote]}
              WHEN -1 THEN #{User::REPUTATION_SCHEME[:receive_comment_downvote]}
            END
          ) AS reputation")
        .joins("JOIN comments ON
            votes.votable_id = comments.id AND votes.votable_type = 'Comment'")
        .joins("LEFT JOIN questions AS q1 ON comments.commentable_id = q1.id AND
            comments.commentable_type = 'Question'")
        .joins("LEFT JOIN answers ON comments.commentable_id = answers.id AND
            comments.commentable_type = 'Answer'")
        .joins("LEFT JOIN questions AS q2 ON answers.question_id = q2.id")
        .where(comments: { user_id: user_id })
      .union_all Vote.select("
          votes.*,
          questions.title,
          questions.id AS question_id,
          #{User::REPUTATION_SCHEME[:give_answer_downvote]} AS reputation")
        .joins("JOIN answers ON
            votes.votable_id = answers.id AND votes.votable_type = 'Answer'")
        .joins("JOIN questions ON answers.question_ID = questions.id")
        .where(user_id: user_id, votable_type: 'Answer', value: -1)
    ).order(:created_at).reverse_order
  end

  private

  def handle_badges
    if votable_type == 'Question'
      item_votes = Badge.question_votes
      badging = Badging.joins(:badge)
        .where(badgeable_type: votable_type, badgeable_id: votable_id,
          badges: { name: [
            Badge.SCHEMA[:questions][:votes][:bronze][:label],
            Badge.SCHEMA[:questions][:votes][:silver][:label],
            Badge.SCHEMA[:questions][:votes][:gold][:label]
          ]}
        ).first

      Badging.handle_tag_badgings(votable.tags, votable.user, votable, created_at)
      handle_question_and_answer_vote_badges(badging, item_votes)
    elsif votable_type == 'Answer'
      item_votes = Badge.answer_votes
      badging = Badging.joins(:badge)
        .where(badgeable_type: votable_type, badgeable_id: votable_id,
          badges: { name: [
            Badge.SCHEMA[:answers][:votes][:bronze][:label],
            Badge.SCHEMA[:answers][:votes][:silver][:label],
            Badge.SCHEMA[:answers][:votes][:gold][:label]
          ]}
        ).first

      Badging.handle_tag_badgings(votable.associated_tags, votable.user, votable, created_at)
      handle_question_and_answer_vote_badges(badging, item_votes)
    end
  end

  def handle_question_and_answer_vote_badges(badging, item_votes)
    votable.reload
    if badging
      if badging.badge.rank == 'silver' && votable.vote_count ==
          item_votes[:gold][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          create_badging!(Badge.find_by_name(item_votes[:gold][:label]))
        end
      elsif badging.badge.rank == 'bronze' && votable.vote_count ==
          item_votes[:silver][:criteria]
        ActiveRecord::Base.transaction do
          badging.destroy!
          create_badging!(Badge.find_by_name(item_votes[:silver][:label]))
        end
      end
    elsif votable.vote_count == item_votes[:bronze][:criteria]
      create_badging!(Badge.find_by_name(item_votes[:bronze][:label]))
    end
  end

  def create_badging!(badge)
    Badging.create!(
      user: votable.user,
      badgeable_id: votable_id,
      badgeable_type: votable_type,
      badge: badge,
      created_at: created_at,
      updated_at: updated_at
    )
  end
end
