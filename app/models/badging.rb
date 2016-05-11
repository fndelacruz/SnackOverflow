# == Schema Information
#
# Table name: badgings
#
#  id             :integer          not null, primary key
#  user_id        :integer          not null
#  badge_id       :integer          not null
#  badgeable_type :string
#  badgeable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Badging < ActiveRecord::Base
  validates :user, :badge, presence: true

  belongs_to :user
  belongs_to :badge
  belongs_to :badgeable, polymorphic: true

  def self.handle_tag_badgings(given_tags, given_user, badgeable, vote_created_at)
    given_tag_names = given_tags.map(&:name)
    user = User.find_with_tags(given_user.id)

    user_tag_badges = user.badges.where(category: 'Tag')
    relevant_user_tags = user.tags.select do |tag|
      given_tag_names.include?(tag[:name])
    end

    given_tags.each do |tag|
      current_tag_badges = user_tag_badges.select { |badge| badge.name == tag.name }
      relevant_tag_reputation = user.tags.find { |user_tag| user_tag[:name] == tag.name }[:post_reputation]

      if current_tag_badges.length == 3
        next

      elsif current_tag_badges.length == 2 &&
          relevant_tag_reputation >= Badge.tag_criteria(:gold)
        handle_create_tag_badging!(given_user, tag.name, 'gold', badgeable,
          vote_created_at)

      elsif current_tag_badges.length == 1 &&
          relevant_tag_reputation >= Badge.tag_criteria(:silver)
        handle_create_tag_badging!(given_user, tag.name, 'silver', badgeable,
          vote_created_at)

      elsif current_tag_badges.length == 0 &&
          relevant_tag_reputation >= Badge.tag_criteria(:bronze)
        handle_create_tag_badging!(given_user, tag.name, 'bronze', badgeable,
          vote_created_at)
      end
    end
  end

  def self.handle_create_tag_badging!(user, tag_name, rank, badgeable, vote_created_at)

    Badging.create!(
      user: user,
      badge: Badge.find_by_category_and_name_and_rank('Tag', tag_name, rank),
      badgeable_type: badgeable.class.to_s,
      badgeable_id: badgeable.id,
      updated_at: vote_created_at,
      created_at: vote_created_at
    )
  end

  # NOTE: Users DO NOT lose badgings if another user action would cause a
  # prior badging's criteria to fail. ex: canceling a vote on a question with a
  # vote_count of 5 will not cause the question owner to lose the respective
  # bronze badge.
end
