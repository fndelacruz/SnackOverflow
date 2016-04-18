class Api::FavoritesController < ApplicationController
  def create
    favorite = Favorite.new(favorite_params)
    favorite.user = current_user
    if favorite.save!
      @question = favorite.question
    else
      debugger
    end
  end

  def destroy
    favorite = Favorite.find(params[:id])
    if favorite.user == current_user
      @question = favorite.question
      favorite.destroy!
    else
      render json: {}, status: :forbidden
    end
  end

  private

  def favorite_params
    params.require(:favorite).permit(:question_id)
  end
end
