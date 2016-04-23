class Api::UsersController < ApplicationController
  def current
    @user = User.current_user_find(current_user.id)
  end

  def index
    @users = User.basic_all
  end

  def show
    @user = User.show_find(params[:id])
  end
end
