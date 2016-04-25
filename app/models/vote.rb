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
#

class Vote < ActiveRecord::Base
  validates :user, :votable, presence: true
  validates :user_id, uniqueness:
    { scope: [:votable_type, :votable_id], message: 'already voted on this!'}
  validates :value, inclusion: [-1, 1]
  belongs_to :user
  belongs_to :votable, polymorphic: true

  belongs_to :answer,
    -> { where(votes: {votable_type: 'Answer'}) },
    foreign_key: :votable_id

  belongs_to :question,
    -> { where(votes: {votable_type: 'Question'}) },
    foreign_key: :votable_id

  # def self.score_by_user_and_tag_id(user, tag_ids)
  #   votes = Vote.includes(answer: {question: :tags}, question: :tags)
  #     .where(answer: {user: user})
  #     .where(question: {user: user})
  #     .where('')
  #
  # end

end
