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
end
