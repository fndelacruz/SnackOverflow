class Api::UsersController < ApplicationController
  def current
    @current_user = User.find_with_reputation(current_user.id)
  end

  def index
    @users = User.index_all
  end

  def show
    @user = User.show_find(params[:id])
    if @user
      @questions = Question.includes(:votes).where(user_id: params[:id])
      @given_answers = Answer.includes(:votes, :question).where(user_id: params[:id])
      @badges = Badge.grouped_with_stats_by_user_id(params[:id])
      @reputations = Vote.reputations_for_user_id(params[:id])
      @vote_stats = Vote.stats_for_user_id(params[:id])
      View.create!(user: current_user, viewable: @user)
    else
      render json: {}, error: :not_found
    end
  end
end
