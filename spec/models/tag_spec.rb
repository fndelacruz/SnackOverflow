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

require 'rails_helper'

RSpec.describe Tag, type: :model do
  it "has a valid factory" do
    expect(build(:tag)).to be_valid
  end

  let(:tag) { build(:tag) }

  describe "ActiveModel validations" do
    # Basic validations
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:description) }
    it { expect(tag).to validate_uniqueness_of(:name) }
  end

  describe "ActiveRecord associations" do
    # Associations
    it { should have_many(:taggings) }
    it { should have_many(:questions) }
  end

  describe "public instance methods" do
    context "responds to its methods" do
      it { expect(tag).to respond_to(:question_count) }
      it { expect(tag).to respond_to(:weekly_question_count) }
      it { expect(tag).to respond_to(:monthly_question_count) }
    end

    context "executes methods correctly" do
      let(:decoy_tag) { build(:tag, name: "decoy_tag") }

      describe "#question_count" do
        [0, 1, 3].each do |num|
          context "when #{num} questions tagged with this tag" do
            let(:questions) { create_list(:question, num) }
            before do
              num.times { |i| create(:tagging, tag: tag, question: questions[i]) }
            end
            it { expect(tag.question_count).to eq(num) }
          end
        end
      end

      describe "#weekly_question_count" do
        [0, 1, 3].each do |num|
          context "when #{num} questions in the past week with this tag" do
            let(:questions) { create_list(:question, num, created_at: 6.days.ago) }

            before(:each) do
              # create decoy questions
              4.times { create(:tagging, tag: decoy_tag, created_at: 8.days.ago) }

              # create satisfying questions
              num.times do |i|
                create(:tagging, tag: tag, question: questions[i])
              end
            end
            it { expect(tag.weekly_question_count).to eq(num) }
          end
        end
      end

      describe "#monthly_question_count" do
        [0, 1, 3].each do |num|
          context "when #{num} questions in the past month with this tag" do
            let(:questions) { create_list(:question, num, created_at: (1.month - 1.hour).ago) }

            before(:each) do
              # create decoy questions
              4.times { create(:tagging, tag: decoy_tag, created_at: (1.month + 1.day).ago) }

              # create satisfying questions
              num.times do |i|
                create(:tagging, tag: tag, question: questions[i])
              end
            end
            it { expect(tag.monthly_question_count).to eq(num) }
          end
        end
      end
    end
  end
end
