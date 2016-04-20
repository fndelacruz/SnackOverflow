class Api::UsersController < ApplicationController
  def current
    @user = User.detailed_find(current_user.id)
  end

  def index
    @users = User.basic_all
  end

  def show
    @user = User.detailed_find(params[:id])
  end
end
