# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  user_id          :integer          not null
#  commentable_id   :integer          not null
#  commentable_type :string           not null
#  content          :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  unread           :boolean          default(TRUE)
#

require 'rails_helper'

RSpec.describe Comment, type: :model do
  it "has a valid factory" do
    expect(build(:comment)).to be_valid
  end

  let(:comment) { build(:comment) }

  describe "ActiveModel validations" do
    # Basic validations
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:commentable_id) }
    it { should validate_presence_of(:commentable_type) }
    it { should validate_presence_of(:content) }
    it do
      should validate_inclusion_of(:commentable_type).
        in_array(['Question', 'Answer'])
    end
  end

  describe "ActiveRecord associations" do
    # Associations
    it { should belong_to(:user) }
    it { should belong_to(:commentable) }
    it { should have_many(:votes) }

    # Database columns/indexes
    it { should have_db_index(:user_id) }
    it { should have_db_index([:commentable_id, :commentable_type]) }
  end
end
