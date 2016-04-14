class Api::UsersController < ApplicationController
  def current
    @user = current_user
    # render json: current_user
  end
end
