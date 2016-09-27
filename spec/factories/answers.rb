# == Schema Information
#
# Table name: answers
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  question_id :integer          not null
#  content     :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  unread      :boolean          default(TRUE)
#

FactoryGirl.define do
  factory :answer do
    content { FFaker::BaconIpsum.sentences(rand(6) + 1).join(' ') }
    created_at { Time.now }
    updated_at { Time.now }
    association :user
    association :question
  end
end
