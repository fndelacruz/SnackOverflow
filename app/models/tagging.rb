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

class Tagging < ActiveRecord::Base
  validates :question, :tag, presence: true
  validates :question,
    uniqueness: { scope: :tag, message: "already has this Tag" }
  belongs_to :question
  belongs_to :tag

end
