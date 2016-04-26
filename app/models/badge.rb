# == Schema Information
#
# Table name: badges
#
#  id          :integer          not null, primary key
#  name        :string           not nullo
#  rank        :string           not null
#  description :text             not null
#  created_at  :datetime
#  updated_at  :datetime
#

SCHEMA = {
  questions: {
    views: {
      bronze: {
        criteria: 5,
        label: 'popular_question'
      },
      silver: {
        criteria: 10,
        label: 'notable_question'
      },
      gold: {
        criteria: 15,
        label: 'famous_question'
      }
    },
    votes: {
      bronze: {
        criteria: 5,
        label: 'nice_question'
      },
      silver: {
        criteria: 10,
        label: 'good_question'
      },
      gold: {
        criteria: 15,
        label: 'great_question'
      }
    },
    favorites: {
      bronze: {
        criteria: 5,
        label: 'favorite_question'
      },
      silver: {
        criteria: 10,
        label: 'stellar_question'
      },
      gold: {
        criteria: 15,
        label: 'ultimate_question'
      }
    },
  },
  answers: {
    votes: {
      bronze: {
        criteria: 5,
        label: 'nice_answer'
      },
      silver: {
        criteria: 10,
        label: 'good_answer'
      },
      gold: {
        criteria: 15,
        label: 'great_answer'
      }
    }
  }
}

class Badge < ActiveRecord::Base
  validates :name, :description, presence: true
  validates :name, uniqueness: { scope: [:rank] }
  validates :rank, inclusion: ['bronze', 'silver', 'gold']

  has_many :users, through: :badgings, source: :user

  def self.SCHEMA
    SCHEMA
  end

  def self.question_views
    SCHEMA[:questions][:views]
  end

  def self.question_votes
    SCHEMA[:questions][:votes]
  end

  def self.answer_votes
    SCHEMA[:answers][:votes]
  end
end
