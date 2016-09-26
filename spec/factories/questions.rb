# == Schema Information
#
# Table name: questions
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  title      :string           not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :question do
    user_id 1
    title { FFaker::BaconIpsum.sentence }
    content { FFaker::BaconIpsum.sentences(rand(3) + 1).join(' ') }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
