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

require 'rails_helper'

RSpec.describe Question, type: :model do
  it "has a valid factory" do
    expect(build(:question)).to be_valid
  end

  let(:question) { build(:question) }

  describe "ActiveModel validations" do
    # Basic validations
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
  end

  describe "ActiveRecord associations" do
    # Associations
    it { should belong_to(:user) }
    it { should have_many(:taggings) }
    it { should have_many(:tags) }
    it { should have_many(:favorites) }
    it { should have_many(:votes) }
    it { should have_many(:comments) }
    it { should have_many(:views) }

    # Database columns/indexes
    it { should have_db_index(:user_id) }
  end

end
