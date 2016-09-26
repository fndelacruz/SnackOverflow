# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  user_id          :integer          not null
#  commentable_id   :integer          not null
#  commentable_type :string           not null
#  content          :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  unread           :boolean          default(TRUE)
#

FactoryGirl.define do
  # default comment is on Question id=1
  factory :comment do
    user_id 1
    commentable_id 1
    commentable_type "Question"
    content { FFaker::BaconIpsum.sentences(rand(2) + 1).join(' ') }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
