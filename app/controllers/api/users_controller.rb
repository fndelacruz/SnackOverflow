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
      View.create!(user: current_user, viewable: @user)
      @user
    else
      render json: {}, error: :not_found
    end
  end
end
