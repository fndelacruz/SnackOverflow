# == Schema Information
#
# Table name: taggings
#
#  id          :integer          not null, primary key
#  question_id :integer          not null
#  tag_id      :integer          not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryGirl.define do
  factory :tagging do
    created_at { Time.now }
    updated_at { Time.now }
    association :question
    association :tag
  end
end
