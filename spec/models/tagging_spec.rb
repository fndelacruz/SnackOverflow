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

require 'rails_helper'

RSpec.describe Tagging, type: :model do
  it "has a valid factory" do
    expect(build(:tagging)).to be_valid
  end

  let(:tagging) { build(:tagging) }

  describe "ActiveModel validations" do
    # Basic validations
    it { should validate_presence_of(:question) }
    it { should validate_presence_of(:tag) }
    it "should forbid duplicate taggings on a question" do
      expect(tagging).to validate_uniqueness_of(:question_id).
        scoped_to(:tag_id).with_message('already has this Tag')
    end
  end

  describe "ActiveRecord associations" do
    # Associations
    it { should belong_to(:question) }
    it { should belong_to(:tag) }
  end
end
