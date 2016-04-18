class Api::FavoritesController < ApplicationController
  def create
    favorite = Favorite.new(favorite_params)
    favorite.user = current_user
    if favorite.save!
      # @question = favorite.question
      @question = Question.detailed_find(favorite.question.id)
    else
      debugger
    end
  end

  def destroy
    favorite = Favorite.find(params[:id])
    if favorite.user == current_user
      # @question = favorite.question
      favorite.destroy!
      @question = Question.detailed_find(favorite.question.id)
    else
      render json: {}, status: :forbidden
    end
  end

  private

  def favorite_params
    params.require(:favorite).permit(:question_id)
  end
end
