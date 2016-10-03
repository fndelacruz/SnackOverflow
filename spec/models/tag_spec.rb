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
    it { should have_many(:badges) }
  end

  describe "Lifecycle events" do
    let(:created_tag) { create(:tag) }
    let(:db_badges_ranks) do
      Set.new(Badge.where(category: 'Tag', subcategory: tag.name).pluck(:rank))
    end

    context "After create" do
      it "generates 3 corresponding badges (bronze, silver, gold)" do
        expect(Badge.count).to eq(0)
        created_tag
        expect(Badge.count).to eq(3)
        expect(db_badges_ranks).to eq(Set.new(%w(bronze silver gold)))
      end
    end

    context "After destroy" do
      let!(:tag_to_destroy) { create(:tag, name: 'destroy-me') }

      it "destroys the 3 corresponding badges" do
        created_tag
        tag_to_destroy
        expect(Badge.count).to eq(6)
        tag_to_destroy.destroy
        expect(Badge.count).to eq(3)
        expect(Badge.where(name: created_tag.name).count).to eq(3)
      end
    end
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
