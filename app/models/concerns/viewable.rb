module Viewable
  extend ActiveSupport::Concern

  included do
    has_many :views, as: :viewable
  end

  def view_count
    views.length
  end

  # TODO: remove user argument after implementing current_user
  def create_view(user)
    views.create!(user: user)
  end
end
