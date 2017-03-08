# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  email           :string           not null
#  display_name    :string           not null
#  password_digest :string           not null
#  bio             :text
#  location        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do
  factory :user do
    email { FFaker::Internet.email }
    display_name { FFaker::Internet.user_name }
    password_digest { BCrypt::Password.create("password") }
  end

end
