class Api::VotesController < ApplicationController
  def create
    vote = Vote.new(vote_params)
    vote.user = current_user
    if vote.save!
      @question = Question.detailed_find(vote.votable.question.id)
    else
      debugger
    end
  end

  def destroy
    vote = Vote.find(params[:id])
    if vote.user == current_user
      vote.destroy!
      @question = Question.detailed_find(vote.votable.question.id)
    else
      render json: {}, status: :forbidden
    end
  end

  private

  def vote_params
    params.require(:vote).permit(:votable_type, :votable_id, :value)
  end
end
