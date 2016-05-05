module Viewable
  extend ActiveSupport::Concern

  included do
    # NOTE: use dependent delete_all instead of destroy since view has no
    # dependent child associations
    has_many :views, as: :viewable, dependent: :delete_all
  end

  # TODO: delete this after ensuring it is not used anymore
  def view_count
    views.length
  end

  # TODO: remove user argument after implementing current_user
  def create_view(user)
    views.create!(user: user)
  end
end
