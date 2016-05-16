class Api::UsersController < ApplicationController
  def current
    if current_user
      @current_user = User.find_with_reputation(current_user.id)
      answers = Answer.notifications_for_user_id(current_user.id)
      comments = Comment.notifications_for_user_id(current_user.id)
      @notifications = (answers + comments).sort_by(&:created_at).reverse
    else
      render json: { id: nil }
    end
  end

  def create
    user = User.new(user_params)
      if user.save
        login!(user)
        @current_user = User.find_with_reputation(user.id)
        @notifications = []
        render 'api/users/current'
      else
        user_object = {
          id: nil,
          errors: user.errors.full_messages
        }
        render json: user_object, status: :unprocessable_entity
      end
  end

  def index
    @users = User.index_all
  end

  def show
    @user = User.show_find(params[:id])
    if @user
      @questions = Question.with_stats_and_tags_by_user_id(params[:id])
      @given_answers = Answer.includes(:votes, :question).where(user_id: params[:id])
      @badges = Badge.grouped_with_stats_by_user_id(params[:id])
      @reputations = Vote.reputations_for_user_id(params[:id])
      @vote_stats = Vote.stats_for_user_id(params[:id])
      @favorites = Favorite.questions_with_stats_and_tags_by_user_id(params[:id])
      View.create!(user: current_user, viewable: @user) if current_user
    else
      render json: {}, error: :not_found
    end
  end

  def update
    @user = User.find_with_reputation(params[:id])
    if @user == current_user
      if @user.is_password?(user_params[:password])
        if @user.update(user_params)
          render_current_user
        else
          render json: @user.errors.full_messages, status: :unprocessable_entity
        end
      else
        render json: ['Invalid password. Please try again.'], status: :forbidden
      end
    else
      render json: {}, status: :forbidden
    end
  end

  private

  def user_params
    params.require(:user).permit(:display_name, :bio, :location, :email, :password)
  end
end
