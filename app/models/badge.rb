# == Schema Information
#
# Table name: badges
#
#  id          :integer          not null, primary key
#  name        :string           not null
#  rank        :string           not null
#  description :text             not null
#  created_at  :datetime
#  updated_at  :datetime
#  category    :string           not null
#  subcategory :string           not null
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
  },
  tags: {
    post_tag_reputation: {
      bronze: { criteria: 100 },
      silver: { criteria: 250 },
      gold: { criteria: 500 },
    }
  }
}

class Badge < ActiveRecord::Base
  validates :name, :description, :subcategory, presence: true
  validates :name, uniqueness: { scope: [:rank] }
  validates :rank, inclusion: ['bronze', 'silver', 'gold']
  validates :category, inclusion: ['Question', 'Answer', 'Tag']

  has_many :badgings
  has_many :users, through: :badgings, source: :user

  def self.show_find(badgeId)
    Badge.includes(badgings: :user)
  end

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

  def self.question_favorites
    SCHEMA[:questions][:favorites]
  end

  def self.tag_criteria(rank)
    Badge.SCHEMA[:tags][:post_tag_reputation][rank][:criteria]
  end

  def self.grouped_with_stats_by_user_id(user_id)
    Badge.select("badges.id, badges.name, badges.rank, badges.description, badges.category, " +
          "COUNT(badges.*) AS count, " +
          "MAX(badgings.created_at) AS created_at")
      .joins("JOIN badgings ON badges.id = badgings.badge_id")
      .where(badgings: { user_id: user_id })
      .group("badges.id")
      .order("created_at DESC")
  end

  def badgings_detailed
    case category
    when 'Question'
      Badging.select("badgings.*, questions.title, questions.id AS question_id, users.display_name AS user_display_name")
        .joins("JOIN questions ON badgings.badgeable_id = questions.id AND
            badgings.badgeable_type = 'Question'")
        .joins("JOIN users on badgings.user_id = users.id")
        .where(badge_id: id)
        .order(created_at: :desc)
    when 'Answer'
      Badging.select("badgings.*, questions.title, questions.id AS question_id, users.display_name AS user_display_name")
        .joins("JOIN answers ON badgings.badgeable_id = answers.id AND
            badgings.badgeable_type = 'Answer'")
        .joins("JOIN questions ON answers.question_id = questions.id")
        .joins("JOIN users on badgings.user_id = users.id")
        .where(badge_id: id)
        .order(created_at: :desc)
    when 'Tag'
      (
        Badging.select("badgings.*, questions.title, questions.id AS question_id, users.display_name AS user_display_name")
          .joins("JOIN questions ON badgings.badgeable_id = questions.id AND
              badgings.badgeable_type = 'Question'")
          .joins("JOIN users on badgings.user_id = users.id")
          .where(badge_id: id)
          .order(created_at: :desc)
        .union_all Badging.select("badgings.*, questions.title, questions.id AS question_id, users.display_name AS user_display_name")
          .joins("JOIN answers ON badgings.badgeable_id = answers.id AND
              badgings.badgeable_type = 'Answer'")
          .joins("JOIN questions ON answers.question_id = questions.id")
          .joins("JOIN users on badgings.user_id = users.id")
          .where(badge_id: id)
      ).order(created_at: :desc)
    end
  end

  def badgings_count
    badgings.length
  end
end
