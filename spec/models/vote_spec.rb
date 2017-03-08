# == Schema Information
#
# Table name: votes
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  votable_type :string           not null
#  votable_id   :integer          not null
#  value        :integer          not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  unread       :boolean          default(TRUE)
#

require 'rails_helper'

RSpec.describe Vote, type: :model do
  it "has a valid factory" do
    expect(build(:vote)).to be_valid
  end

  let(:vote) { build(:vote) }

  describe "ActiveModel validations" do
    # Basic validations
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:votable) }
    it do
      should validate_inclusion_of(:votable_type).
        in_array(['Question', 'Answer', 'Comment'])
    end
    it { should validate_presence_of(:value) }
    it { should validate_inclusion_of(:value).in_array([1, -1]) }

    it "limits user_id to one vote per votable" do
      expect(vote).to validate_uniqueness_of(:user_id).
        scoped_to([:votable_type, :votable_id]).
        with_message('already voted on this!')
    end
  end

  describe "ActiveRecord associations" do
    # Associations
    it { should belong_to(:user) }
    it { should belong_to(:votable) }

    # Database columns/indexes
    it { should have_db_index([:user_id, :votable_id, :votable_type]) }
    it { should have_db_index([:votable_id, :votable_type]) }
  end
end
