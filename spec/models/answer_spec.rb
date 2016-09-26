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

require 'rails_helper'

RSpec.describe Answer, type: :model do
  it "has a valid factory" do
    expect(build(:answer)).to be_valid
  end

  let(:answer) { build(:answer) }

  describe "ActiveModel validations" do
    # Basic validations
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:question_id) }
    it { should validate_presence_of(:content) }
  end

  describe "ActiveRecord associations" do
    # Associations
    it { should belong_to(:user) }
    it { should belong_to(:question) }
    it { should have_many(:tags) }
    it { should have_many(:comments) }
    it { should have_many(:votes) }

    # Database columns/indexes
    it { should have_db_index(:user_id) }
    it { should have_db_index(:question_id) }
  end
end
