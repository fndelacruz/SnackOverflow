module Viewable
  extend ActiveSupport::Concern

  included do
    # NOTE: use dependent delete_all instead of destroy since view has no
    # dependent child associations
    has_many :views, as: :viewable, dependent: :delete_all
  end

  def view_count
    views.length
  end

  def create_view(user)
    views.create!(user: user)
  end
end
