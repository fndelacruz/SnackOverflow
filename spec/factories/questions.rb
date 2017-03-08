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
    title { FFaker::BaconIpsum.sentence }
    content { FFaker::BaconIpsum.sentences(rand(3) + 1).join(' ') }
    association :user
  end
end
