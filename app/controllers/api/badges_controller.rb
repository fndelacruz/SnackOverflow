class Api::BadgesController < ApplicationController
  def index
    @badges = Badge.includes(:badgings).all
  end

  def show
    @badge = Badge.find(params[:id])
    @badgings = @badge.badgings_detailed
    @users_reputation = User.find_with_reputation_hash(@badgings.map(&:user_id).uniq)
  end
end
