# == Schema Information
#
# Table name: tags
#
#  id          :integer          not null, primary key
#  name        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  description :text             not null
#

FactoryGirl.define do
  factory :tag do
    name "tag_name1"
    description { FFaker::DizzleIpsum.sentences(3 + rand(2)).join(' ') }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
