class Api::VotesController < ApplicationController
  def create
    vote = Vote.new(vote_params)
    vote.user = current_user
    if vote.save!
      @question = vote.votable.question
    else
      debugger
    end
  end

  def destroy
    vote = Vote.find(params[:id])
    if vote.user == current_user
      @question = vote.votable.question
      vote.destroy!
    else
      render json: {}, status: :forbidden
    end
  end

  private

  def vote_params
    params.require(:vote).permit(:votable_type, :votable_id, :value)
  end
end
