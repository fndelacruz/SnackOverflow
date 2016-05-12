class Api::BadgesController < ApplicationController
  def index
    @badges = Badge.includes(:badgings).all
  end

  def show
    @badge = Badge.find(params[:id])
    @badgings = @badge.badgings_detailed
  end
end
