module Badgeable
  extend ActiveSupport::Concern

  included do
    has_many :badgings, as: :badgeable
  end
end
