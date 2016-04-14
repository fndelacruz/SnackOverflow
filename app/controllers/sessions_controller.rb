class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    user = User.find_by_credentials(
      params[:user][:email], params[:user][:password]
    )
    if user
      login!(user)
      redirect_to '/'
    else
      @user = User.new(
        email: params[:user][:email], display_name: params[:user][:display_name]
      )
      flash.now[:notices] ||= []
      flash.now[:notices] << 'user not found with these credentials'
      render :new
    end

  end

  def destroy
    logout!
    redirect_to '/'
  end
end
