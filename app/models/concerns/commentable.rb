module Commentable
  extend ActiveSupport::Concern

  included do
    # NOTE: used dependent destroy instead of dependent delete_all since
    # comments may have associated votes
    has_many :comments, as: :commentable, dependent: :destroy
  end
end
