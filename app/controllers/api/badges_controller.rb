class Api::BadgesController < ApplicationController
  def index
    @badges = Badge.includes(:badgings).all
  end
end
