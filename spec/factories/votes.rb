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

FactoryGirl.define do
  # default vote is on a question and is an upvote (value = 1)
  factory :vote do
    value 1
    created_at { Time.now }
    updated_at { Time.now }
    association :user
    association :votable, factory: :question
  end
end
